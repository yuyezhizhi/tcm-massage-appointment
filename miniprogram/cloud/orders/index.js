const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const { formatDate } = require('../utils/util')
const { ORDER_STATUS, MEMBER_LEVEL, MEMBER_THRESHOLD, MEMBER_DISCOUNT } = require('../utils/constant')

exports.main = async (event, context) => {
  const { action, data } = event
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext

  try {
    switch (action) {
      case 'list': {
        const { userId = OPENID, status, startDate, endDate, admin = false } = data || {}
        const query = {}
        
        if (!admin) {
          query.userId = userId
        } else if (userId && userId !== 'all') {
          query.userId = userId
        }
        
        if (status) query.status = status
        if (startDate || endDate) {
          query.appointmentTime = {}
          if (startDate) query.appointmentTime = _.gte(new Date(startDate))
          if (endDate) query.appointmentTime = _.lte(new Date(endDate + ' 23:59:59'))
        }

        const result = await db.collection('orders')
          .where(query)
          .orderBy('appointmentTime', 'desc')
          .get()

        return {
          success: true,
          data: result.data.map(order => ({
            ...order,
            amount: order.amount / 100,
            finalAmount: order.finalAmount / 100
          }))
        }
      }

      case 'detail': {
        const { orderId } = data
        const order = await db.collection('orders').doc(orderId).get()
        
        if (!order.data) {
          throw new Error('订单不存在')
        }

        if (order.data.userId !== OPENID && !isAdmin()) {
          throw new Error('无权查看该订单')
        }

        const service = await db.collection('services').doc(order.data.serviceId).get()

        return {
          success: true,
          data: {
            ...order.data,
            serviceName: service.data.name,
            serviceDuration: service.data.duration,
            amount: order.data.amount / 100,
            finalAmount: order.data.finalAmount / 100
          }
        }
      }

      case 'update': {
        const { orderId, status, remark } = data
        
        const order = await db.collection('orders').doc(orderId).get()
        if (!order.data) {
          throw new Error('订单不存在')
        }

        if (!isAdmin() && order.data.userId !== OPENID) {
          throw new Error('无权操作该订单')
        }

        const updateData = {
          updatedAt: db.serverDate()
        }

        if (status) updateData.status = status
        if (remark !== undefined) updateData.remark = remark

        if (status === ORDER_STATUS.COMPLETED) {
          await handleOrderComplete(orderId, order.data)
        }

        await db.collection('orders').doc(orderId).update({
          data: updateData
        })

        return { success: true }
      }

      case 'create': {
        const { serviceId, appointmentTime, remark } = data
        
        const service = await db.collection('services').doc(serviceId).get()
        if (!service.data) {
          throw new Error('服务不存在')
        }

        const memberInfo = await db.collection('members')
          .where({ userId: OPENID })
          .get()
          .then(res => res.data[0])

        let memberDiscount = 0
        let finalAmount = service.data.price

        if (memberInfo) {
          memberDiscount = MEMBER_DISCOUNT[memberInfo.level.toUpperCase()] || 0
          finalAmount = service.data.price * (1 - memberDiscount)
        }

        const orderNo = `${getDateNo()}${String(Date.now()).slice(-4)}`

        const order = await db.collection('orders').add({
          data: {
            orderNo,
            userId: OPENID,
            serviceId,
            appointmentTime: new Date(appointmentTime),
            status: ORDER_STATUS.PENDING,
            remark: remark || '',
            amount: service.data.price,
            memberDiscount,
            finalAmount,
            createdAt: db.serverDate(),
            updatedAt: db.serverDate()
          }
        })

        return {
          success: true,
          orderId: order._id,
          orderNo
        }
      }

      default:
        throw new Error('未知的操作类型')
    }
  } catch (err) {
    console.error('订单管理失败', err)
    return {
      success: false,
      error: err.message
    }
  }
}

async function handleOrderComplete(orderId, order) {
  const amount = order.finalAmount
  const points = Math.floor(amount / 100)
  const userId = order.userId

  let member = await db.collection('members')
    .where({ userId })
    .get()
    .then(res => res.data[0])

  if (!member) {
    await db.collection('members').add({
      data: {
        userId,
        level: MEMBER_LEVEL.NORMAL,
        points,
        totalConsumption: amount,
        levelHistory: [],
        pointsHistory: [{
          type: 'earn',
          points,
          orderId,
          createdAt: db.serverDate()
        }],
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })
  } else {
    const newTotalConsumption = member.totalConsumption + amount
    const newPoints = member.points + points
    let newLevel = member.level

    if (newTotalConsumption >= MEMBER_THRESHOLD.PLATINUM) {
      newLevel = MEMBER_LEVEL.PLATINUM
    } else if (newTotalConsumption >= MEMBER_THRESHOLD.GOLD) {
      newLevel = MEMBER_LEVEL.GOLD
    } else if (newTotalConsumption >= MEMBER_THRESHOLD.SILVER) {
      newLevel = MEMBER_LEVEL.SILVER
    }

    const levelHistory = member.levelHistory || []
    if (newLevel !== member.level) {
      levelHistory.push({
        level: newLevel,
        achievedAt: db.serverDate()
      })
    }

    const pointsHistory = member.pointsHistory || []
    pointsHistory.push({
      type: 'earn',
      points,
      orderId,
      createdAt: db.serverDate()
    })

    await db.collection('members').doc(member._id).update({
      data: {
        level: newLevel,
        points: newPoints,
        totalConsumption: newTotalConsumption,
        levelHistory,
        pointsHistory,
        updatedAt: db.serverDate()
      }
    })
  }
}

function isAdmin() {
  return wx.cloud.getWXContext().USERINFO?.role === 'boss'
}

function getDateNo() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}
