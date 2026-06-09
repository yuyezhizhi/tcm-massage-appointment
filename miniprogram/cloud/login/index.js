const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext

  try {
    let user = await db.collection('users').where({ openid: OPENID }).get().then(res => res.data[0])

    if (!user) {
      await db.collection('users').add({
        data: {
          openid: OPENID,
          nickname: event.userInfo?.nickName || '用户',
          avatar: event.userInfo?.avatarUrl || '',
          phone: event.userInfo?.phone || '',
          role: event.userInfo?.role || 'customer',
          createdAt: db.serverDate(),
          updatedAt: db.serverDate()
        }
      })
      user = await db.collection('users').where({ openid: OPENID }).get().then(res => res.data[0])
    }

    return {
      success: true,
      userInfo: user
    }
  } catch (err) {
    console.error('登录失败', err)
    return {
      success: false,
      error: err.message
    }
  }
}
