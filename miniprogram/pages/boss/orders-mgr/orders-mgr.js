const { formatDate } = require('../../../utils/util')
const { ORDER_STATUS } = require('../../../utils/constant')

Page({
  data: {
    orders: [],
    currentTab: 'all',
    startDate: '',
    endDate: '',
    loading: false
  },

  onLoad: function () {
    this.loadOrders()
  },

  onShow: function () {
    this.loadOrders()
  },

  loadOrders: function () {
    this.setData({ loading: true })

    const params = {
      action: 'list',
      data: {
        admin: true
      }
    }

    if (this.data.currentTab !== 'all') {
      params.data.status = this.data.currentTab
    }

    if (this.data.startDate) {
      params.data.startDate = this.data.startDate
    }

    if (this.data.endDate) {
      params.data.endDate = this.data.endDate + ' 23:59:59'
    }

    wx.cloud.callFunction({
      name: 'orders',
      data: params
    })
    .then(res => {
      const orders = res.result.data.map(item => ({
        ...item,
        finalAmount: (item.finalAmount / 100).toFixed(2)
      }))
      this.setData({ 
        orders,
        loading: false
      })
    })
    .catch(err => {
      console.error('加载订单失败', err)
      this.setData({ loading: false })
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    })
  },

  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ 
      currentTab: tab,
      orders: []
    }, () => {
      this.loadOrders()
    })
  },

  onStartDateChange: function (e) {
    this.setData({
      startDate: e.detail.value
    }, () => {
      this.loadOrders()
    })
  },

  onEndDateChange: function (e) {
    this.setData({
      endDate: e.detail.value
    }, () => {
      this.loadOrders()
    })
  },

  getStatusText: function (status) {
    const statusMap = {
      pending: '待确认',
      confirmed: '已确认',
      completed: '已完成',
      cancelled: '已取消'
    }
    return statusMap[status] || status
  },

  formatDateTime: function (date) {
    if (!date) return ''
    const d = new Date(date)
    return `${formatDate(d)} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
  },

  confirmOrder: function (e) {
    const orderId = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '确认接单',
      content: '确认要接受这个订单吗？',
      success: (res) => {
        if (res.confirm) {
          this.updateOrderStatus(orderId, ORDER_STATUS.CONFIRMED)
        }
      }
    })
  },

  completeOrder: function (e) {
    const orderId = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '完成服务',
      content: '确认服务已完成吗？确认后将自动为客户累计积分。',
      success: (res) => {
        if (res.confirm) {
          this.updateOrderStatus(orderId, ORDER_STATUS.COMPLETED)
        }
      }
    })
  },

  cancelOrder: function (e) {
    const orderId = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          this.updateOrderStatus(orderId, ORDER_STATUS.CANCELLED)
        }
      }
    })
  },

  updateOrderStatus: function (orderId, status) {
    wx.showLoading({ title: '处理中...' })
    
    wx.cloud.callFunction({
      name: 'orders',
      data: {
        action: 'update',
        data: {
          orderId,
          status
        }
      }
    })
    .then(() => {
      wx.hideLoading()
      wx.showToast({
        title: '操作成功',
        icon: 'success'
      })
      this.loadOrders()
    })
    .catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '操作失败',
        icon: 'none'
      })
    })
  }
})
