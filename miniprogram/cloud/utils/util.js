const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const getDateNo = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = formatNumber(now.getMonth() + 1)
  const day = formatNumber(now.getDate())
  return `${year}${month}${day}`
}

module.exports = {
  formatNumber,
  getDateNo
}
