Page({
  data: {
    categories: ['推拿', '艾灸', '拔罐', '刮痧', '理疗'],
    currentCategory: '',
    services: [],
    loading: false
  },

  onLoad: function () {
    this.loadServices()
  },

  onPullDownRefresh: function () {
    this.loadServices()
  },

  loadServices: function () {
    this.setData({ loading: true })

    const data = {
      action: 'list',
      data: {
        status: 'active'
      }
    }

    if (this.data.currentCategory) {
      data.data.category = this.data.currentCategory
    }

    wx.cloud.callFunction({
      name: 'services',
      data
    })
    .then(res => {
      const services = res.result.data.map(item => ({
        ...item,
        price: (item.price / 100).toFixed(2)
      }))
      this.setData({ 
        services,
        loading: false
      })
      wx.stopPullDownRefresh()
    })
    .catch(err => {
      console.error('加载服务失败', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
      this.setData({ loading: false })
      wx.stopPullDownRefresh()
    })
  },

  selectCategory: function (e) {
    const category = e.currentTarget.dataset.category
    this.setData({ 
      currentCategory: category === this.data.currentCategory ? '' : category
    }, () => {
      this.loadServices()
    })
  },

  goToDetail: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/customer/service-detail/service-detail?id=${id}`
    })
  }
})
