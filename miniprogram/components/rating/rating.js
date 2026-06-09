Component({
  properties: {
    label: {
      type: String,
      value: '评分'
    },
    required: {
      type: Boolean,
      value: false
    },
    placeholder: {
      type: String,
      value: '请输入评价内容'
    },
    value: {
      type: Number,
      value: 0
    },
    content: {
      type: String,
      value: ''
    }
  },

  data: {
    contentLength: 0
  },

  lifetimes: {
    attached: function () {
      this.setData({
        contentLength: this.data.content.length
      })
    }
  },

  methods: {
    selectRating: function (e) {
      const value = e.currentTarget.dataset.value
      this.setData({ value })
      this.triggerEvent('change', {
        value,
        content: this.data.content
      })
    },

    onContentInput: function (e) {
      const content = e.detail.value
      this.setData({ 
        content,
        contentLength: content.length
      })
      this.triggerEvent('change', {
        value: this.data.value,
        content
      })
    },

    reset: function () {
      this.setData({
        value: 0,
        content: '',
        contentLength: 0
      })
    }
  }
})
