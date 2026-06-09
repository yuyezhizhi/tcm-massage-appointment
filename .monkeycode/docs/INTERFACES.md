# 接口文档

## 云函数接口

### login ✅
登录云函数，获取用户信息。

**输入参数**: 无

**返回结果**:
```javascript
{
  userInfo: {
    openid: string,
    nickname: string,
    avatar: string,
    role: 'customer' | 'boss'
  }
}
```

### services ✅
服务管理云函数。

**输入参数**:
```javascript
{
  action: 'list' | 'create' | 'update' | 'delete' | 'detail',
  data?: object
}
```

**支持的操作**:
- `list`: 获取服务列表，支持 `category`、`status`、`limit`、`skip` 参数
- `create`: 创建新服务，需要 `name`、`price` 等字段
- `update`: 更新服务，需要 `id` 和更新字段
- `delete`: 删除服务，需要 `id`
- `detail`: 获取服务详情，需要 `id`

### appointments ✅
预约管理云函数。

**输入参数**:
```javascript
{
  action: 'create' | 'cancel' | 'list' | 'getSchedule' | 'generateSchedule',
  data?: object
}
```

**支持的操作**:
- `create`: 创建预约，需要 `serviceId`、`date`、`timeSlot`
- `cancel`: 取消预约，需要 `orderId`
- `list`: 获取订单列表，支持 `userId`、`status`、`date` 筛选
- `getSchedule`: 获取排班，需要 `date`
- `generateSchedule`: 生成排班，需要 `date`、`startTime`、`endTime`

### orders ✅
订单管理云函数。

**输入参数**:
```javascript
{
  action: 'list' | 'detail' | 'update' | 'create',
  data?: object
}
```

**支持的操作**:
- `list`: 获取订单列表，支持 `userId`、`status`、`startDate`、`endDate`、`admin` 筛选
- `detail`: 获取订单详情，需要 `orderId`
- `update`: 更新订单状态，需要 `orderId`、`status`
- `create`: 创建订单，需要 `serviceId`、`appointmentTime`

### members ✅
会员管理云函数。

**输入参数**:
```javascript
{
  action: 'getInfo' | 'getPointsHistory' | 'updateLevel' | 'adjustPoints',
  data?: object
}
```

**支持的操作**:
- `getInfo`: 获取会员信息，可选 `userId`
- `getPointsHistory`: 获取积分历史，支持 `limit`、`skip`
- `updateLevel`: 更新会员等级（管理员），需要 `userId`、`level`
- `adjustPoints`: 调整积分（管理员），需要 `userId`、`points`、`reason`

### statistics ✅
统计管理云函数。

**输入参数**:
```javascript
{
  dateRange: 'day' | 'week' | 'month',
  type: 'overview' | 'detail' | 'services' | 'trend'
}
```

**支持的类型**:
- `overview`: 获取概览统计（订单数、营业额、客流量等）
- `detail`: 获取订单明细
- `services`: 获取服务统计（热门服务排行）
- `trend`: 获取 7 日趋势数据

## 工具函数

### util.js

| 函数名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| formatTime | 格式化时间为字符串 | Date | string |
| formatDate | 格式化日期为 YYYY-MM-DD | Date | string |
| formatTimeSlot | 格式化时间段 (如 10:00-11:00) | Date | string |
| formatPrice | 格式化价格 (分转元) | number | string |
| getDateTime | 获取完整时间戳 | - | string |
| getDateNo | 获取日期编号 (YYYYMMDD) | - | string |

### constant.js

| 常量名 | 说明 |
|--------|------|
| ORDER_STATUS | 订单状态枚举 |
| MEMBER_LEVEL | 会员等级枚举 |
| MEMBER_THRESHOLD | 会员等级积分阈值 |
| MEMBER_DISCOUNT | 会员等级折扣比例 |
| CANCEL_HOUR_LIMIT | 取消订单时间限制 (小时) |

## 数据库集合接口

### users
```typescript
interface User {
  _id: string
  openid: string
  nickname: string
  avatar: string
  phone?: string
  role: 'customer' | 'boss'
  createdAt: Date
  updatedAt: Date
}
```

### services
```typescript
interface Service {
  _id: string
  name: string
  description: string
  price: number  // 分
  duration: number  // 分钟
  image: string
  category: string
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}
```

### schedules
```typescript
interface Schedule {
  _id: string
  date: string  // YYYY-MM-DD
  timeSlot: string  // HH:MM-HH:MM
  maxBookings: number
  currentBookings: number
  status: 'available' | 'full' | 'unavailable'
  createdAt: Date
}
```

### orders
```typescript
interface Order {
  _id: string
  orderNo: string
  userId: string
  serviceId: string
  appointmentTime: Date
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  remark?: string
  amount: number
  memberDiscount: number
  finalAmount: number
  review?: {
    rating: number
    content: string
    createdAt: Date
  }
  createdAt: Date
  updatedAt: Date
}
```

### members
```typescript
interface Member {
  _id: string
  userId: string
  level: 'normal' | 'silver' | 'gold' | 'platinum'
  points: number
  totalConsumption: number
  levelHistory: Array<{
    level: string
    achievedAt: Date
  }>
  pointsHistory: Array<{
    type: 'earn' | 'spend'
    points: number
    orderId?: string
    createdAt: Date
  }>
  createdAt: Date
  updatedAt: Date
}
```

### reviews
```typescript
interface Review {
  _id: string
  orderId: string
  userId: string
  rating: number
  content: string
  createdAt: Date
}
```
