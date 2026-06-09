const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${[year, month, day].map(formatNumber).join('-')}`
}

const formatTimeSlot = date => {
  const hour = date.getHours()
  const nextHour = hour + 1
  return `${formatNumber(hour)}:00-${formatNumber(nextHour)}:00`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const formatPrice = price => {
  return (price / 100).toFixed(2)
}

const getDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = formatNumber(now.getMonth() + 1)
  const day = formatNumber(now.getDate())
  const hour = formatNumber(now.getHours())
  const minute = formatNumber(now.getMinutes())
  const second = formatNumber(now.getSeconds())
  return `${year}${month}${day}${hour}${minute}${second}`
}

const getDateNo = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = formatNumber(now.getMonth() + 1)
  const day = formatNumber(now.getDate())
  return `${year}${month}${day}`
}

module.exports = {
  formatTime,
  formatDate,
  formatTimeSlot,
  formatNumber,
  formatPrice,
  getDateTime,
  getDateNo
}
