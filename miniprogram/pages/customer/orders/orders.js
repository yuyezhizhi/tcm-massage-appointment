const { formatTime, formatDate } = require('../../../utils/util')

Page({
  data: {
    orders: [],
    currentTab: 'all',
    loading: false
  },

  onLoad: function () {
    this.loadOrders()
  },

  onShow: function () {
    this.loadOrders()
  },

  onPullDownRefresh: function () {
    this.loadOrders()
  },

  loadOrders: function () {
    this.setData({ loading: true })

    const params = {
      action: 'list',
      data: {}
    }

    if (this.data.currentTab !== 'all') {
      params.data.status = this.data.currentTab
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
      wx.stopPullDownRefresh()
    })
    .catch(err => {
      console.error('加载订单失败', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
      this.setData({ loading: false })
      wx.stopPullDownRefresh()
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

  goToDetail: function (e) {
    const order = e.currentTarget.dataset.order
    wx.navigateTo({
      url: `/pages/customer/order-detail/order-detail?id=${order._id}`
    })
  },

  cancelOrder: function (e) {
    const orderId = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '确认取消',
      content: '确定要取消该预约吗？',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'appointments',
            data: {
              action: 'cancel',
              data: {
                orderId
              }
            }
          })
          .then(() => {
            wx.showToast({
              title: '取消成功',
              icon: 'success'
            })
            this.loadOrders()
          })
          .catch(err => {
            wx.showToast({
              title: err.message || '取消失败',
              icon: 'none'
            })
          })
        }
      }
    })
  },

  submitReview: function (e) {
    const order = e.currentTarget.dataset.order
    wx.navigateTo({
      url: `/pages/customer/review/review?id=${order._id}&orderNo=${order.orderNo}`
    })
  },

  goToServices: function () {
    wx.switchTab({
      url: '/pages/customer/services/services'
    })
  }
})
