const { ORDER_STATUS } = require('../../../utils/constant')

Page({
  data: {
    dateRange: 'day',
    dateRangeText: '今日',
    stats: {
      totalOrders: 0,
      totalRevenue: 0,
      uniqueCustomers: 0,
      averageOrderValue: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0
    },
    trend: [],
    maxOrders: 1
  },

  onLoad: function () {
    this.loadStats()
    this.loadTrend()
  },

  onShow: function () {
    this.refreshData()
  },

  onPullDownRefresh: function () {
    this.refreshData()
  },

  refreshData: function () {
    this.loadStats()
    this.loadTrend()
    wx.stopPullDownRefresh()
  },

  loadStats: function () {
    wx.cloud.callFunction({
      name: 'statistics',
      data: {
        dateRange: this.data.dateRange,
        type: 'overview'
      }
    })
    .then(res => {
      if (res.result.success) {
        const stats = res.result.data
        this.setData({ 
          stats: {
            ...stats,
            confirmedOrders: stats.totalOrders - stats.pendingOrders - stats.completedOrders - stats.cancelledOrders
          }
        })
      }
    })
    .catch(err => {
      console.error('获取统计数据失败', err)
    })
  },

  loadTrend: function () {
    wx.cloud.callFunction({
      name: 'statistics',
      data: {
        dateRange: 'day',
        type: 'trend'
      }
    })
    .then(res => {
      if (res.result.success) {
        const trend = res.result.data
        const maxOrders = Math.max(...trend.map(item => item.orders), 1)
        this.setData({ trend, maxOrders })
      }
    })
    .catch(err => {
      console.error('获取趋势数据失败', err)
    })
  },

  selectDateRange: function () {
    const ranges = [
      { value: 'day', text: '今日' },
      { value: 'week', text: '本周' },
      { value: 'month', text: '本月' }
    ]

    wx.showActionSheet({
      itemList: ranges.map(r => r.text),
      success: (res) => {
        const range = ranges[res.tapIndex]
        this.setData({
          dateRange: range.value,
          dateRangeText: range.text
        }, () => {
          this.loadStats()
        })
      }
    })
  },

  getBarHeight: function (orders) {
    if (orders === 0) return 5
    return (orders / this.data.maxOrders) * 100
  },

  goToOrders: function () {
    wx.navigateTo({
      url: '/pages/boss/orders-mgr/orders-mgr'
    })
  },

  goToServices: function () {
    wx.navigateTo({
      url: '/pages/boss/services-mgr/services-mgr'
    })
  },

  generateSchedule: function () {
    const today = new Date()
    const dates = []
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      dates.push(`${year}-${month}-${day}`)
    }

    wx.showActionSheet({
      itemList: dates,
      title: '选择生成排班的日期',
      success: (res) => {
        const selectedDate = dates[res.tapIndex]
        wx.showLoading({ title: '生成中...' })
        
        wx.cloud.callFunction({
          name: 'appointments',
          data: {
            action: 'generateSchedule',
            data: {
              date: selectedDate
            }
          }
        })
        .then(res => {
          wx.hideLoading()
          if (res.result.success) {
            wx.showToast({
              title: `已生成${res.result.count}个时段`,
              icon: 'success'
            })
          }
        })
        .catch(err => {
          wx.hideLoading()
          wx.showToast({
            title: err.message || '生成失败',
            icon: 'none'
          })
        })
      }
    })
  },

  viewServicesStats: function () {
    wx.navigateTo({
      url: '/pages/boss/stats/stats?type=services'
    })
  }
})
