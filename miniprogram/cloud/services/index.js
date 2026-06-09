const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data } = event

  try {
    switch (action) {
      case 'list': {
        const { category, status = 'active', limit = 100, skip = 0 } = data || {}
        const query = {}
        if (status) query.status = status
        if (category) query.category = category

        return await db.collection('services')
          .where(query)
          .orderBy('createdAt', 'desc')
          .skip(skip)
          .limit(limit)
          .get()
      }

      case 'create': {
        return await db.collection('services').add({
          data: {
            name: data.name,
            description: data.description || '',
            price: data.price,
            duration: data.duration || 60,
            image: data.image || '',
            category: data.category || '',
            status: 'active',
            createdAt: db.serverDate(),
            updatedAt: db.serverDate()
          }
        })
      }

      case 'update': {
        return await db.collection('services').doc(data.id).update({
          data: {
            ...data,
            updatedAt: db.serverDate()
          }
        })
      }

      case 'delete': {
        return await db.collection('services').doc(data.id).remove()
      }

      case 'detail': {
        return await db.collection('services').doc(data.id).get()
      }

      default:
        throw new Error('未知的操作类型')
    }
  } catch (err) {
    console.error('服务管理失败', err)
    return {
      success: false,
      error: err.message
    }
  }
}
