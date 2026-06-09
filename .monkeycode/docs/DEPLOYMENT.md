# 部署与使用指南

## 快速开始

### 1. 准备工作

- 注册微信小程序账号（https://mp.weixin.qq.com）
- 下载并安装微信开发者工具（https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html）
- 开通微信云开发权限

### 2. 导入项目

1. 打开微信开发者工具
2. 点击「导入项目」
3. 选择项目目录：`/workspace/miniprogram`
4. 填入小程序 AppID
5. 点击「导入」

### 3. 配置云开发

1. 点击顶部工具栏的「云开发」按钮
2. 首次使用会提示开通，点击「开通」
3. 创建环境（建议名称：tcm-massage）
4. 记录环境 ID（如：tcm-massage-1-xxx）
5. 修改 `app.js` 中的 `env` 配置：
   ```javascript
   wx.cloud.init({
     env: 'your-env-id',  // 替换为实际环境 ID
     traceUser: true
   })
   ```

### 4. 上传云函数

按顺序上传以下云函数（右键文件夹 → 上传并部署：云端安装依赖）：

1. `cloud/login` ✅
2. `cloud/services` ✅
3. `cloud/appointments` ✅
4. `cloud/orders` ✅
5. `cloud/members` ✅
6. `cloud/statistics` ✅

### 5. 创建数据库集合

在云控制台手动创建以下 6 个集合：

- users
- services
- schedules
- orders
- members
- reviews

### 6. 配置数据库权限

每个集合创建后，点击「权限设置」，选择「自定义安全规则」，粘贴以下规则：

**users 集合:**
```json
{
  "read": "auth.openid == doc._id",
  "create": true,
  "update": "auth.openid == doc._id",
  "delete": "auth.openid == doc._id"
}
```

**services 集合:**
```json
{
  "read": true,
  "create": "get('database.users.openid') == 'admin'",
  "update": "get('database.users.openid') == 'admin'",
  "delete": "get('database.users.openid') == 'admin'"
}
```

**schedules 集合:**
```json
{
  "read": true,
  "create": "get('database.users.openid') == 'admin'",
  "update": "get('database.users.openid') == 'admin'",
  "delete": "get('database.users.openid') == 'admin'"
}
```

**orders 集合:**
```json
{
  "read": "auth.openid == doc.userId",
  "create": true,
  "update": "auth.openid == doc.userId",
  "delete": "auth.openid == doc.userId"
}
```

**members 集合:**
```json
{
  "read": "auth.openid == doc.userId",
  "create": "auth.openid == doc.userId",
  "update": "auth.openid == doc.userId",
  "delete": "auth.openid == doc.userId"
}
```

**reviews 集合:**
```json
{
  "read": true,
  "create": true,
  "update": "auth.openid == doc.userId",
  "delete": "auth.openid == doc.userId"
}
```

### 7. 创建老板账号

在 `users` 集合中添加一条记录：

```json
{
  "_id": "admin-openid-xxx",
  "openid": "admin-openid-xxx",  // 替换为实际openid
  "nickname": "管理员",
  "avatar": "",
  "role": "boss",
  "createdAt": "2026-06-09T00:00:00.000Z",
  "updatedAt": "2026-06-09T00:00:00.000Z"
}
```

### 8. 生成排班数据

使用云开发控制台 → 云函数 → `appointments` → 测试：

```json
{
  "action": "generateSchedule",
  "data": {
    "date": "2026-06-09",
    "startTime": 9,
    "endTime": 21,
    "maxBookings": 1
  }
}
```

### 9. 添加服务数据

使用云开发控制台 → 云函数 → `services` → 测试：

```json
{
  "action": "create",
  "data": {
    "name": "中式推拿",
    "description": "传统中式推拿按摩，舒缓肌肉疲劳",
    "price": 19800,
    "duration": 60,
    "category": "推拿"
  }
}
```

### 10. 测试小程序

1. 点击微信开发者工具的「编译」按钮
2. 测试顾客端功能：
   - 浏览服务
   - 预约服务
   - 查看订单
   - 会员中心
3. 测试老板端功能：
   - 数据看板
   - 服务管理
   - 订单管理
   - 统计分析

### 11. 上传代码

1. 点击右上角的「上传」按钮
2. 填写版本号和项目备注
3. 上传成功后，登录小程序后台提交审核

## 常见问题

### 云函数调用失败
- 检查环境 ID 是否正确
- 确认云函数已上传（显示绿色对勾）
- 查看云函数日志排查错误

### 数据库操作失败
- 确认集合已创建
- 检查权限配置是否正确
- 验证数据结构是否符合定义

### 预约功能不可用
- 确认已生成排班数据
- 检查 schedules 集合权限
- 验证日期格式是否正确

### 老板端无法访问
- 确认 users 集合中 role 字段为 "boss"
- 检查 openid 是否匹配
- 尝试退出重新登录

## 运维建议

### 数据备份
定期在云控制台导出数据库备份。

### 日志监控
定期检查云函数日志，及时发现异常。

### 版本迭代
- 每次修改后及时更新 tasklist.md
- 使用版本号管理迭代
- 保留历史版本备份

## 相关文档

- [云开发配置指南](./CLOUD_SETUP.md)
- [接口文档](./INTERFACES.md)
- [开发者指南](./DEVELOPER_GUIDE.md)
- [项目架构](./ARCHITECTURE.md)
