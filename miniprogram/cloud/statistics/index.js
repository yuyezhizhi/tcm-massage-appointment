const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const { ORDER_STATUS } = require('../utils/constant')

exports.main = async (event, context) => {
  const { dateRange = 'day', type = 'overview' } = event
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext

  try {
    const dateRangeConfig = getDateRange(dateRange)
    const startDate = dateRangeConfig.start
    const endDate = dateRangeConfig.end

    if (type === 'overview') {
      const stats = await getOverviewStats(startDate, endDate)
      return { success: true, data: stats }
    } else if (type === 'detail') {
      const detail = await getDetailStats(startDate, endDate)
      return { success: true, data: detail }
    } else if (type === 'services') {
      const services = await getServicesStats(startDate, endDate)
      return { success: true, data: services }
    } else if (type === 'trend') {
      const trend = await getTrendStats(dateRange)
      return { success: true, data: trend }
    }

    throw new Error('未知的统计类型')
  } catch (err) {
    console.error('统计管理失败', err)
    return {
      success: false,
      error: err.message
    }
  }
}

async function getOverviewStats(startDate, endDate) {
  const orders = await db.collection('orders')
    .where({
      appointmentTime: _.gte(startDate).and(_.lte(endDate))
    })
    .get()

  const totalOrders = orders.data.length
  const completedOrders = orders.data.filter(o => o.status === ORDER_STATUS.COMPLETED).length
  const cancelledOrders = orders.data.filter(o => o.status === ORDER_STATUS.CANCELLED).length
  const pendingOrders = orders.data.filter(o => o.status === ORDER_STATUS.PENDING).length

  const totalRevenue = orders.data
    .filter(o => o.status === ORDER_STATUS.COMPLETED)
    .reduce((sum, o) => sum + o.finalAmount, 0)

  const uniqueCustomers = new Set(orders.data.map(o => o.userId)).size

  return {
    totalOrders,
    completedOrders,
    cancelledOrders,
    pendingOrders,
    totalRevenue: totalRevenue / 100,
    uniqueCustomers,
    averageOrderValue: completedOrders > 0 ? (totalRevenue / 100 / completedOrders).toFixed(2) : 0
  }
}

async function getDetailStats(startDate, endDate) {
  const orders = await db.collection('orders')
    .where({
      appointmentTime: _.gte(startDate).and(_.lte(endDate))
    })
    .orderBy('appointmentTime', 'desc')
    .get()

  return orders.data.map(order => ({
    orderNo: order.orderNo,
    appointmentTime: order.appointmentTime,
    status: order.status,
    finalAmount: order.finalAmount / 100,
    userId: order.userId
  }))
}

async function getServicesStats(startDate, endDate) {
  const orders = await db.collection('orders')
    .where({
      appointmentTime: _.gte(startDate).and(_.lte(endDate)),
      status: ORDER_STATUS.COMPLETED
    })
    .get()

  const serviceStats = {}

  for (const order of orders.data) {
    const serviceId = order.serviceId
    if (!serviceStats[serviceId]) {
      serviceStats[serviceId] = {
        serviceId,
        count: 0,
        revenue: 0
      }
    }
    serviceStats[serviceId].count += 1
    serviceStats[serviceId].revenue += order.finalAmount
  }

  const serviceIds = Object.keys(serviceStats)
  const services = await db.collection('services')
    .where({
      _id: _.in(serviceIds)
    })
    .get()

  const serviceMap = {}
  services.data.forEach(s => {
    serviceMap[s._id] = s.name
  })

  return Object.values(serviceStats)
    .map(item => ({
      ...item,
      serviceName: serviceMap[item.serviceId] || '未知服务',
      revenue: item.revenue / 100
    }))
    .sort((a, b) => b.count - a.count)
}

async function getTrendStats(dateRange) {
  const days = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    days.push({
      date: formatDate(date),
      orders: 0,
      revenue: 0
    })
  }

  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - 6)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(now)
  endDate.setHours(23, 59, 59, 999)

  const orders = await db.collection('orders')
    .where({
      appointmentTime: _.gte(startDate).and(_.lte(endDate)),
      status: ORDER_STATUS.COMPLETED
    })
    .get()

  orders.data.forEach(order => {
    const orderDate = formatDate(new Date(order.appointmentTime))
    const dayData = days.find(d => d.date === orderDate)
    if (dayData) {
      dayData.orders += 1
      dayData.revenue += order.finalAmount / 100
    }
  })

  return days
}

function getDateRange(range) {
  const now = new Date()
  let start, end

  switch (range) {
    case 'day':
      start = new Date(now)
      start.setHours(0, 0, 0, 0)
      end = new Date(now)
      end.setHours(23, 59, 59, 999)
      break

    case 'week':
      const dayOfWeek = now.getDay()
      start = new Date(now)
      start.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))
      start.setHours(0, 0, 0, 0)
      end = new Date(start)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)
      break

    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      start.setHours(0, 0, 0, 0)
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      end.setHours(23, 59, 59, 999)
      break

    default:
      start = new Date(now)
      start.setHours(0, 0, 0, 0)
      end = new Date(now)
      end.setHours(23, 59, 59, 999)
  }

  return { start, end }
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
