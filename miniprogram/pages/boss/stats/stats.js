Page({
  data: {
    type: 'services',
    dateRanges: [
      { value: 'day', text: '今日' },
      { value: 'week', text: '本周' },
      { value: 'month', text: '本月' }
    ],
    dateRangeIndex: 1,
    servicesStats: [],
    revenueDetail: []
  },

  onLoad: function (options) {
    if (options.type) {
      this.setData({ type: options.type })
    }
    this.loadStats()
  },

  loadStats: function () {
    const dateRange = this.data.dateRanges[this.data.dateRangeIndex].value

    if (this.data.type === 'services') {
      this.loadServicesStats(dateRange)
    } else if (this.data.type === 'revenue') {
      this.loadRevenueDetail(dateRange)
    }
  },

  loadServicesStats: function (dateRange) {
    wx.cloud.callFunction({
      name: 'statistics',
      data: {
        dateRange,
        type: 'services'
      }
    })
    .then(res => {
      if (res.result.success) {
        this.setData({ servicesStats: res.result.data })
      }
    })
    .catch(err => {
      console.error('获取服务统计失败', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    })
  },

  loadRevenueDetail: function (dateRange) {
    wx.cloud.callFunction({
      name: 'statistics',
      data: {
        dateRange,
        type: 'detail'
      }
    })
    .then(res => {
      if (res.result.success) {
        const dailyRevenue = this.groupByDate(res.result.data)
        this.setData({ revenueDetail: dailyRevenue })
      }
    })
    .catch(err => {
      console.error('获取收入明细失败', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    })
  },

  groupByDate: function (orders) {
    const revenueMap = {}
    
    orders.forEach(order => {
      const date = order.appointmentTime.split('T')[0]
      if (!revenueMap[date]) {
        revenueMap[date] = {
          date,
          revenue: 0
        }
      }
      revenueMap[date].revenue += order.finalAmount
    })

    return Object.values(revenueMap)
      .map(item => ({
        ...item,
        revenue: (item.revenue / 100).toFixed(2)
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  },

  onDateRangeChange: function (e) {
    this.setData({
      dateRangeIndex: e.detail.value
    }, () => {
      this.loadStats()
    })
  }
})
