const constant = {
  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },
  MEMBER_LEVEL: {
    NORMAL: 'normal',
    SILVER: 'silver',
    GOLD: 'gold',
    PLATINUM: 'platinum'
  },
  MEMBER_THRESHOLD: {
    SILVER: 50000,
    GOLD: 200000,
    PLATINUM: 500000
  },
  MEMBER_DISCOUNT: {
    NORMAL: 0,
    SILVER: 0.05,
    GOLD: 0.1,
    PLATINUM: 0.15
  },
  CANCEL_HOUR_LIMIT: 2
}

module.exports = constant
