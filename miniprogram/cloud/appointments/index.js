const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const { getDateNo } = require('../utils/util')

exports.main = async (event, context) => {
  const { action, data } = event
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext

  try {
    switch (action) {
      case 'create': {
        const { serviceId, date, timeSlot } = data
        
        const schedule = await db.collection('schedules')
          .where({ date, timeSlot })
          .get()
          .then(res => res.data[0])

        if (!schedule || schedule.status === 'unavailable') {
          throw new Error('该时段不可预约')
        }

        if (schedule.currentBookings >= schedule.maxBookings) {
          throw new Error('该时段已满')
        }

        const service = await db.collection('services').doc(serviceId).get()
        const orderNo = `${getDateNo()}${String(Date.now()).slice(-4)}`

        const order = await db.collection('orders').add({
          data: {
            orderNo,
            userId: OPENID,
            serviceId,
            appointmentTime: new Date(`${date}T${timeSlot.split('-')[0]}`),
            status: 'pending',
            remark: data.remark || '',
            amount: service.data.price,
            memberDiscount: 0,
            finalAmount: service.data.price,
            createdAt: db.serverDate(),
            updatedAt: db.serverDate()
          }
        })

        await db.collection('schedules').doc(schedule._id).update({
          data: {
            currentBookings: _.inc(1),
            updatedAt: db.serverDate()
          }
        })

        return { success: true, orderId: order._id, orderNo }
      }

      case 'cancel': {
        const { orderId } = data
        const order = await db.collection('orders').doc(orderId).get()

        if (!order.data) {
          throw new Error('订单不存在')
        }

        if (order.data.userId !== OPENID) {
          throw new Error('无权操作该订单')
        }

        const now = new Date()
        const appointmentTime = new Date(order.data.appointmentTime)
        const hoursDiff = (appointmentTime - now) / (1000 * 60 * 60)

        if (hoursDiff < 2) {
          throw new Error('距离预约时间不足 2 小时，无法取消')
        }

        await db.collection('orders').doc(orderId).update({
          data: {
            status: 'cancelled',
            updatedAt: db.serverDate()
          }
        })

        const schedule = await db.collection('schedules')
          .where({
            date: order.data.appointmentTime.toISOString().split('T')[0],
            timeSlot: getOrderTimeSlot(order.data.appointmentTime)
          })
          .get()
          .then(res => res.data[0])

        if (schedule) {
          await db.collection('schedules').doc(schedule._id).update({
            data: {
              currentBookings: _.inc(-1),
              updatedAt: db.serverDate()
            }
          })
        }

        return { success: true }
      }

      case 'list': {
        const { userId = OPENID, status, date } = data || {}
        const query = { userId }
        if (status) query.status = status
        if (date) {
          const startOfDay = new Date(date)
          const endOfDay = new Date(date)
          endOfDay.setHours(23, 59, 59, 999)
          query.appointmentTime = _.gte(startOfDay).and(_.lte(endOfDay))
        }

        return await db.collection('orders')
          .where(query)
          .orderBy('appointmentTime', 'desc')
          .get()
      }

      case 'getSchedule': {
        const { date } = data
        return await db.collection('schedules')
          .where({ date })
          .orderBy('timeSlot', 'asc')
          .get()
      }

      case 'generateSchedule': {
        const { date, startTime = 9, endTime = 21, maxBookings = 1 } = data
        const schedules = []

        for (let hour = startTime; hour < endTime; hour++) {
          const timeSlot = `${String(hour).padStart(2, '0')}:00-${String(hour + 1).padStart(2, '0')}:00`
          schedules.push({
            date,
            timeSlot,
            maxBookings,
            currentBookings: 0,
            status: 'available',
            createdAt: db.serverDate()
          })
        }

        for (const schedule of schedules) {
          const existing = await db.collection('schedules')
            .where({ date, timeSlot: schedule.timeSlot })
            .count()

          if (existing.total === 0) {
            await db.collection('schedules').add({ data: schedule })
          }
        }

        return { success: true, count: schedules.length }
      }

      default:
        throw new Error('未知的操作类型')
    }
  } catch (err) {
    console.error('预约管理失败', err)
    return {
      success: false,
      error: err.message
    }
  }
}

function getOrderTimeSlot(date) {
  const hour = date.getHours()
  const nextHour = hour + 1
  return `${String(hour).padStart(2, '0')}:00-${String(nextHour).padStart(2, '0')}:00`
}
