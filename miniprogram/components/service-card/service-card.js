Component({
  properties: {
    image: {
      type: String,
      value: ''
    },
    name: {
      type: String,
      value: ''
    },
    description: {
      type: String,
      value: ''
    },
    price: {
      type: String,
      value: ''
    },
    duration: {
      type: Number,
      value: 60
    },
    bookText: {
      type: String,
      value: '立即预约'
    }
  },

  methods: {
    onCardTap: function () {
      this.triggerEvent('tap')
    }
  }
})
