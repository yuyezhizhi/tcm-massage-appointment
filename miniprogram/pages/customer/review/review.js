const { formatDate } = require('../../../utils/util')

Page({
  data: {
    orderId: '',
    orderNo: '',
    serviceName: '',
    appointmentTime: '',
    rating: 0,
    content: ''
  },

  onLoad: function (options) {
    if (options.id) {
      this.setData({ orderId: options.id })
    }
    if (options.orderNo) {
      this.setData({ orderNo: options.orderNo })
    }
    this.loadOrderDetail()
  },

  loadOrderDetail: function () {
    wx.cloud.callFunction({
      name: 'orders',
      data: {
        action: 'detail',
        data: {
          orderId: this.data.orderId
        }
      }
    })
    .then(res => {
      if (res.result.success) {
        const order = res.result.data
        this.setData({
          serviceName: order.serviceName,
          appointmentTime: formatDate(new Date(order.appointmentTime))
        })
      }
    })
    .catch(err => {
      console.error('加载订单详情失败', err)
    })
  },

  onRatingChange: function (e) {
    this.setData({
      rating: e.detail.value,
      content: e.detail.content
    })
  },

  submitReview: function () {
    if (this.data.rating === 0) {
      wx.showToast({
        title: '请选择评分',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '提交中...'
    })

    wx.cloud.callFunction({
      name: 'orders',
      data: {
        action: 'update',
        data: {
          orderId: this.data.orderId,
          review: {
            rating: this.data.rating,
            content: this.data.content,
            createdAt: new Date()
          }
        }
      }
    })
    .then(() => {
      wx.hideLoading()
      wx.showToast({
        title: '评价成功',
        icon: 'success'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    })
    .catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '提交失败',
        icon: 'none'
      })
    })
  }
})
