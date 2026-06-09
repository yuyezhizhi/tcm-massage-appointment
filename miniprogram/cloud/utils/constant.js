const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

const MEMBER_LEVEL = {
  NORMAL: 'normal',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum'
}

const MEMBER_THRESHOLD = {
  SILVER: 50000,
  GOLD: 200000,
  PLATINUM: 500000
}

const MEMBER_DISCOUNT = {
  NORMAL: 0,
  SILVER: 0.05,
  GOLD: 0.1,
  PLATINUM: 0.15
}

const CANCEL_HOUR_LIMIT = 2

module.exports = {
  ORDER_STATUS,
  MEMBER_LEVEL,
  MEMBER_THRESHOLD,
  MEMBER_DISCOUNT,
  CANCEL_HOUR_LIMIT
}
