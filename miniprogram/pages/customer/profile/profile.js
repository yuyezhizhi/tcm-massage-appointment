const app = getApp()
const { MEMBER_LEVEL } = require('../../../utils/constant')

Page({
  data: {
    userInfo: null,
    memberInfo: null
  },

  onLoad: function () {
    this.loadUserInfo()
  },

  onShow: function () {
    this.loadMemberInfo()
  },

  loadUserInfo: function () {
    app.getCurrentUser()
      .then(userInfo => {
        this.setData({ userInfo })
      })
      .catch(err => {
        console.error('获取用户信息失败', err)
      })
  },

  loadMemberInfo: function () {
    wx.cloud.callFunction({
      name: 'members',
      data: {
        action: 'getInfo'
      }
    })
    .then(res => {
      if (res.result.success) {
        this.setData({ memberInfo: res.result.data })
      }
    })
    .catch(err => {
      console.error('获取会员信息失败', err)
    })
  },

  getMemberLevelText: function (level) {
    const levelMap = {
      normal: '普通会员',
      silver: '银卡会员',
      gold: '金卡会员',
      platinum: '铂金会员'
    }
    return levelMap[level] || level
  },

  getProgressPercent: function (consumption, threshold) {
    if (!threshold) return 0
    return Math.min((consumption / threshold) * 100, 100).toFixed(0)
  },

  goToOrders: function () {
    wx.switchTab({
      url: '/pages/customer/orders/orders'
    })
  },

  goToPointsHistory: function () {
    wx.navigateTo({
      url: '/pages/customer/points-history/points-history'
    })
  },

  goToReviews: function () {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  copyToCustomerService: function () {
    wx.setClipboardData({
      data: '13800138000',
      success: () => {
        wx.showModal({
          title: '客服电话',
          content: '已复制客服微信号，请添加咨询',
          showCancel: false
        })
      }
    })
  },

  goToBossDashboard: function () {
    wx.navigateTo({
      url: '/pages/boss/dashboard/dashboard'
    })
  },

  logout: function () {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.userInfo = null
          app.globalData.userRole = 'customer'
          this.setData({
            userInfo: null,
            memberInfo: null
          })
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  }
})
