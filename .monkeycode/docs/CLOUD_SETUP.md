# 云开发配置指南

## 1. 开通云开发

1. 在微信开发者工具中打开项目
2. 点击顶部工具栏的「云开发」按钮
3. 首次使用会提示开通，点击「开通」
4. 创建环境（如：tcm-massage-1）
5. 记录环境 ID（如：tcm-massage-1-xxx）

## 2. 配置环境 ID

修改 `app.js` 中的环境 ID：

```javascript
wx.cloud.init({
  env: 'your-env-id',  // 替换为实际的环境 ID
  traceUser: true
})
```

## 3. 上传云函数

在微信开发者工具中：

1. 展开 `cloud/` 目录
2. 右键点击每个云函数文件夹
3. 选择「上传并部署：云端安装依赖」
4. 依次上传：
   - cloud/login ✅
   - cloud/services ✅
   - cloud/appointments ✅
   - cloud/orders (待创建)
   - cloud/members (待创建)
   - cloud/statistics (待创建)

## 4. 创建数据库集合

在云控制台 - 数据库界面，手动创建以下集合：

- users
- services
- schedules
- orders
- members
- reviews

## 5. 配置数据库权限

创建每个集合后，点击「权限设置」，设置为：

**users:**
```json
{
  "read": "auth.openid == doc._id",
  "create": true,
  "update": "auth.openid == doc._id",
  "delete": "auth.openid == doc._id"
}
```

**services:**
```json
{
  "read": true,
  "create": "get('database.users.openid') == 'admin'",
  "update": "get('database.users.openid') == 'admin'",
  "delete": "get('database.users.openid') == 'admin'"
}
```

**schedules:**
```json
{
  "read": true,
  "create": "get('database.users.openid') == 'admin'",
  "update": "get('database.users.openid') == 'admin'",
  "delete": "get('database.users.openid') == 'admin'"
}
```

**orders:**
```json
{
  "read": "auth.openid == doc.userId",
  "create": true,
  "update": "auth.openid == doc.userId",
  "delete": false
}
```

**members:**
```json
{
  "read": "auth.openid == doc.userId",
  "create": "auth.openid == doc.userId",
  "update": "auth.openid == doc.userId",
  "delete": "auth.openid == doc.userId"
}
```

**reviews:**
```json
{
  "read": true,
  "create": true,
  "update": "auth.openid == doc.userId",
  "delete": "auth.openid == doc.userId"
}
```

## 6. 配置老板角色

在 users 集合中添加一个老板用户：

```json
{
  "_id": "admin-openid-xxx",
  "openid": "admin-openid-xxx",
  "nickname": "管理员",
  "avatar": "",
  "role": "boss",
  "createdAt": "date",
  "updatedAt": "date"
}
```

## 7. 云存储配置

在云控制台 - 云存储界面：

1. 创建文件夹：
   - services/
   - avatars/

2. 设置权限：
   - 所有上传的文件需要配置为「公共读」

## 8. 测试配置

使用云开发控制台进行测试：

1. **测试登录函数**：
   - 进入「云函数」→「login」
   - 点击「测试」
   - 输入测试参数，验证是否返回用户信息

2. **测试数据库**：
   - 进入「数据库」
   - 添加测试数据
   - 验证读写是否正常

## 9. 常见问题

### 云函数调用失败
- 检查环境 ID 是否正确
- 确认云函数已上传
- 查看云函数日志

### 数据库操作失败
- 检查集合是否创建
- 验证权限配置
- 确认数据结构

### 文件上传失败
- 检查云存储空间是否充足
- 验证文件路径格式
- 确认权限设置

## 10. 相关文档

- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [云函数开发指南](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions.html)
- [数据库操作文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html)
