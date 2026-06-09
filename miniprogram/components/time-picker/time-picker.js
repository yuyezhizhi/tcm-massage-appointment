const { formatDate } = require('../../utils/util')

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },

  data: {
    dates: [],
    selectedDate: '',
    timeSlots: [],
    selectedSlot: ''
  },

  observers: {
    visible: function (val) {
      if (val) {
        this.generateDates()
      }
    }
  },

  lifetimes: {
    attached: function () {
      this.generateDates()
    }
  },

  methods: {
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
      })
    },

    selectDate: function (e) {
      const date = e.currentTarget.dataset.date
      this.setData({ 
        selectedDate: date
      })
    },

    selectSlot: function (e) {
      const slot = e.currentTarget.dataset.slot
      if (slot.status === 'full') return
      
      this.setData({ 
        selectedSlot: slot.timeSlot
      })
    },

    onConfirm: function () {
      if (!this.data.selectedDate || !this.data.selectedSlot) return

      this.triggerEvent('confirm', {
        date: this.data.selectedDate,
        timeSlot: this.data.selectedSlot
      })
    },

    onClose: function () {
      this.triggerEvent('close')
    }
  }
})
