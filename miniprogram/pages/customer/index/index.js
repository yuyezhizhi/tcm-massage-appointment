const app = getApp()

Page({
  data: {
    userInfo: null,
    banners: [
      {
        id: 1,
        image: '/images/banner1.png'
      },
      {
        id: 2,
        image: '/images/banner2.png'
      }
    ],
    services: []
  },

  onLoad: function () {
    this.loadUserInfo()
    this.loadServices()
  },

  onShow: function () {
    this.refreshData()
  },

  onPullDownRefresh: function () {
    this.refreshData()
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

  loadServices: function () {
    wx.cloud.callFunction({
      name: 'services',
      data: {
        action: 'list',
        data: {
          status: 'active',
          limit: 4
        }
      }
    })
    .then(res => {
      const services = res.result.data.map(item => ({
        ...item,
        price: (item.price / 100).toFixed(2)
      }))
      this.setData({ services })
    })
    .catch(err => {
      console.error('加载服务失败', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    })
  },

  refreshData: function () {
    this.loadUserInfo()
    this.loadServices()
    wx.stopPullDownRefresh()
  },

  goToServices: function () {
    wx.navigateTo({
      url: '/pages/customer/services/services'
    })
  },

  goToServiceDetail: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/customer/service-detail/service-detail?id=${id}`
    })
  },

  goToOrders: function () {
    wx.switchTab({
      url: '/pages/customer/orders/orders'
    })
  },

  goToProfile: function () {
    wx.switchTab({
      url: '/pages/customer/profile/profile'
    })
  }
})
