const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const { MEMBER_LEVEL, MEMBER_THRESHOLD, MEMBER_DISCOUNT } = require('../utils/constant')

exports.main = async (event, context) => {
  const { action, data } = event
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext

  try {
    switch (action) {
      case 'getInfo': {
        const userId = data?.userId || OPENID
        const member = await db.collection('members')
          .where({ userId })
          .get()
          .then(res => res.data[0])

        if (!member) {
          return {
            success: true,
            data: {
              userId,
              level: MEMBER_LEVEL.NORMAL,
              points: 0,
              totalConsumption: 0,
              nextLevel: MEMBER_LEVEL.SILVER,
              nextLevelPoints: MEMBER_THRESHOLD.SILVER,
              discount: 0
            }
          }
        }

        const nextLevel = getNextLevel(member.level)
        const nextThreshold = nextLevel ? MEMBER_THRESHOLD[nextLevel.toUpperCase()] : null

        return {
          success: true,
          data: {
            ...member,
            nextLevel,
            nextLevelPoints: nextThreshold,
            discount: MEMBER_DISCOUNT[member.level.toUpperCase()] || 0
          }
        }
      }

      case 'getPointsHistory': {
        const userId = data?.userId || OPENID
        const { limit = 50, skip = 0 } = data || {}

        const member = await db.collection('members')
          .where({ userId })
          .get()
          .then(res => res.data[0])

        if (!member) {
          return { success: true, data: [] }
        }

        const history = member.pointsHistory || []
        const paginatedHistory = history.slice(skip, skip + limit)

        return {
          success: true,
          data: paginatedHistory.reverse()
        }
      }

      case 'updateLevel': {
        if (!isAdmin()) {
          throw new Error('无权操作')
        }

        const { userId, level } = data
        if (!MEMBER_LEVEL[level.toUpperCase()]) {
          throw new Error('无效的会员等级')
        }

        const member = await db.collection('members')
          .where({ userId })
          .get()
          .then(res => res.data[0])

        if (!member) {
          throw new Error('会员不存在')
        }

        const levelHistory = member.levelHistory || []
        levelHistory.push({
          level: level.toUpperCase(),
          achievedAt: db.serverDate()
        })

        await db.collection('members').doc(member._id).update({
          data: {
            level: level.toUpperCase(),
            levelHistory,
            updatedAt: db.serverDate()
          }
        })

        return { success: true }
      }

      case 'adjustPoints': {
        if (!isAdmin()) {
          throw new Error('无权操作')
        }

        const { userId, points, reason } = data
        const member = await db.collection('members')
          .where({ userId })
          .get()
          .then(res => res.data[0])

        if (!member) {
          throw new Error('会员不存在')
        }

        const newPoints = member.points + points
        if (newPoints < 0) {
          throw new Error('积分不能为负数')
        }

        const pointsHistory = member.pointsHistory || []
        pointsHistory.push({
          type: points > 0 ? 'earn' : 'spend',
          points: Math.abs(points),
          reason: reason || '',
          createdAt: db.serverDate()
        })

        await db.collection('members').doc(member._id).update({
          data: {
            points: newPoints,
            pointsHistory,
            updatedAt: db.serverDate()
          }
        })

        return { success: true, newPoints }
      }

      default:
        throw new Error('未知的操作类型')
    }
  } catch (err) {
    console.error('会员管理失败', err)
    return {
      success: false,
      error: err.message
    }
  }
}

function getNextLevel(currentLevel) {
  switch (currentLevel) {
    case MEMBER_LEVEL.NORMAL:
      return MEMBER_LEVEL.SILVER
    case MEMBER_LEVEL.SILVER:
      return MEMBER_LEVEL.GOLD
    case MEMBER_LEVEL.GOLD:
      return MEMBER_LEVEL.PLATINUM
    default:
      return null
  }
}

function isAdmin() {
  const userinfo = wxContext.USERINFO
  return userinfo?.role === 'boss'
}
