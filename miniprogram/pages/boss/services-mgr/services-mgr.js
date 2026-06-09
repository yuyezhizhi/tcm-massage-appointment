Page({
  data: {
    services: []
  },

  onLoad: function () {
    this.loadServices()
  },

  onShow: function () {
    this.loadServices()
  },

  loadServices: function () {
    wx.cloud.callFunction({
      name: 'services',
      data: {
        action: 'list',
        data: {
          status: null
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

  addService: function () {
    wx.navigateTo({
      url: '/pages/boss/service-edit/service-edit'
    })
  },

  editService: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/boss/service-edit/service-edit?id=${id}`
    })
  },

  deleteService: function (e) {
    const id = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该服务吗？删除后无法恢复',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'services',
            data: {
              action: 'delete',
              data: { id }
            }
          })
          .then(() => {
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
            this.loadServices()
          })
          .catch(err => {
            wx.showToast({
              title: err.message || '删除失败',
              icon: 'none'
            })
          })
        }
      }
    })
  }
})
