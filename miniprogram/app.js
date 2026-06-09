App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上版本的基础库以支持云开发')
    } else {
      wx.cloud.init({
        env: 'your-env-id',
        traceUser: true
      })
    }

    this.globalData = {
      userInfo: null,
      userRole: 'customer'
    }
  },

  getCurrentUser: function () {
    return new Promise((resolve, reject) => {
      if (this.globalData.userInfo) {
        resolve(this.globalData.userInfo)
        return
      }

      wx.cloud.callFunction({
        name: 'login',
        data: {}
      })
      .then(res => {
        const userInfo = res.result.userInfo
        this.globalData.userInfo = userInfo
        this.globalData.userRole = userInfo.role || 'customer'
        resolve(userInfo)
      })
      .catch(reject)
    })
  }
})
