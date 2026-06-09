# 开发者指南

## 开发环境要求

- 微信开发者工具 (最新稳定版)
- Node.js >= 14.0.0
- 小程序基础库 >= 2.30.0

## 项目初始化

1. **配置云开发环境**
   - 在微信开发者工具中打开项目
   - 点击"云开发"按钮
   - 开通云开发环境，记录环境 ID
   - 修改 `app.js` 中的 `env` 为实际环境 ID

2. **创建云函数**
   - 在云控制台创建同名云函数
   - 安装依赖：`npm install`
   - 上传云函数

3. **初始化数据库集合**
   - 在云控制台创建以下集合：
     - users
     - services
     - schedules
     - orders
     - members
     - reviews
   - 配置权限规则（见数据库权限配置）

## 开发规范

### 代码风格

- 使用 ES6+ 语法
- 函数使用箭头函数
- 常量使用大写命名
- 变量使用驼峰命名
- 文件使用小写命名，单词间用 `-` 分隔

### 目录约定

- 页面文件放在 `pages/` 目录
- 组件文件放在 `components/` 目录
- 云函数放在 `cloud/` 目录
- 工具函数放在 `utils/` 目录

### 提交规范

提交信息格式：`<type>: <subject>`

类型包括：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具链相关

示例：
```
feat: 实现服务列表页
fix: 修复预约时间冲突检测
docs: 更新接口文档
```

## 调试指南

### 本地调试

1. 使用微信开发者工具的编译功能
2.开启了云开发本地模拟功能
3. 使用真机预览测试完整流程

### 云函数调试

1. 在云控制台查看日志
2. 使用 `console.log` 输出调试信息
3. 本地模拟测试后再上传

## 常见问题

### 云函数调用失败

检查：
- 云函数是否已上传
- 环境 ID 是否正确
- 权限配置是否正确

### 数据库操作失败

检查：
- 集合是否存在
- 权限规则是否允许
- 数据结构是否符合

## 部署流程

1. 完成本地开发和测试
2. 上传云函数
3. 配置数据库权限
4. 上传小程序代码
5. 提交审核

## 相关链接

- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [项目需求文档](../specs/tcm-massage-appointment/requirements.md)
- [项目设计文档](../specs/tcm-massage-appointment/design.md)
