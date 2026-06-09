const app = getApp()
const { formatDate } = require('../../../utils/util')

Page({
  data: {
    serviceId: '',
    service: null,
    dates: [],
    selectedDate: '',
    timeSlots: [],
    selectedTimeSlot: '',
    remark: '',
    memberInfo: null
  },

  onLoad: function (options) {
    if (options.id) {
      this.setData({ serviceId: options.id })
      this.loadServiceDetail()
      this.loadMemberInfo()
    }
  },

  loadServiceDetail: function () {
    wx.cloud.callFunction({
      name: 'services',
      data: {
        action: 'detail',
        data: {
          id: this.data.serviceId
        }
      }
    })
    .then(res => {
      const service = res.result.data
      this.setData({
        service: {
          ...service,
          price: (service.price / 100).toFixed(2)
        }
      })
      this.generateDates()
    })
    .catch(err => {
      console.error('加载服务详情失败', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
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

  generateDates: function () {
    const dates = []
    const today = new Date()
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      dates.push({
        date: formatDate(date),
        month: date.getMonth() + 1,
        day: date.getDate(),
        weekDay: weekDays[date.getDay()],
        fullDate: date
      })
    }

    this.setData({ 
      dates,
      selectedDate: dates[0].date
    }, () => {
      this.loadTimeSlots()
    })
  },

  loadTimeSlots: function () {
    if (!this.data.selectedDate) return

    wx.cloud.callFunction({
      name: 'appointments',
      data: {
        action: 'getSchedule',
        data: {
          date: this.data.selectedDate
        }
      }
    })
    .then(res => {
      const timeSlots = (res.result.data || []).map(item => ({
        timeSlot: item.timeSlot,
        status: item.currentBookings >= item.maxBookings ? 'full' : 'available'
      }))
      this.setData({ timeSlots })
    })
    .catch(err => {
      console.error('加载时间段失败', err)
    })
  },

  selectDate: function (e) {
    const date = e.currentTarget.dataset.date
    this.setData({ 
      selectedDate: date,
      selectedTimeSlot: ''
    }, () => {
      this.loadTimeSlots()
    })
  },

  selectTimeSlot: function (e) {
    const slot = e.currentTarget.dataset.slot
    if (slot.status === 'full') return
    
    this.setData({ 
      selectedTimeSlot: slot.timeSlot
    })
  },

  onRemarkInput: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },

  submitAppointment: function () {
    if (!this.data.selectedDate || !this.data.selectedTimeSlot) {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none'
      })
      return
    }

    const appointmentTime = `${this.data.selectedDate}T${this.data.selectedTimeSlot.split('-')[0]}`

    wx.showLoading({
      title: '提交中...'
    })

    wx.cloud.callFunction({
      name: 'orders',
      data: {
        action: 'create',
        data: {
          serviceId: this.data.serviceId,
          appointmentTime,
          remark: this.data.remark
        }
      }
    })
    .then(res => {
      wx.hideLoading()
      if (res.result.success) {
        wx.showModal({
          title: '预约成功',
          content: '预约提交成功，请等待店家确认',
          showCancel: false,
          success: () => {
            wx.switchTab({
              url: '/pages/customer/orders/orders'
            })
          }
        })
      }
    })
    .catch(err => {
      wx.hideLoading()
      console.error('创建订单失败', err)
      wx.showToast({
        title: err.message || '预约失败',
        icon: 'none'
      })
    })
  }
})
