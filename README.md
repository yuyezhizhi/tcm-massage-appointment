# 中医按摩推拿店预约小程序

基于微信小程序原生开发 + 微信云开发的中医按摩推拿预约系统，支持顾客端在线预约和老板端经营管理。

![开发进度](https://img.shields.io/badge/进度-91%25-brightgreen)
![微信小程序](https://img.shields.io/badge/平台-微信小程序-07c160)
![云开发](https://img.shields.io/badge/后端-微信云开发-07c160)

## 功能特性

### 顾客端
- 🏠 **首页** - 热门服务展示、快捷入口
- 📋 **服务列表** - 分类筛选、服务详情
- 📅 **在线预约** - 日期时间选择、实时排班
- 📝 **订单管理** - 订单状态跟踪、取消预约
- 👤 **会员中心** - 积分累计、等级折扣

### 老板端
- 📊 **数据看板** - 经营概览、七日趋势
- 🛠️ **服务管理** - 服务增删改查
- 📋 **订单管理** - 订单处理、状态流转
- 📈 **统计分析** - 服务排行、收入明细

### 后台功能
- 🔐 **微信登录** - 自动创建用户记录
- 💳 **会员系统** - 四级等级、积分自动累计
- 📅 **排班系统** - 时段生成、冲突检测
- 📊 **数据统计** - 多维度经营分析

## 技术栈

- **前端**: 微信小程序原生开发
- **后端**: 微信云开发 (Serverless)
  - 云函数：业务逻辑处理
  - 云数据库：数据存储
  - 云存储：图片资源
- **开发语言**: JavaScript
- **版本控制**: Git

## 项目结构

```
tcm-massage-appointment/
├── miniprogram/                    # 小程序主目录
│   ├── app.js                      # 应用入口
│   ├── app.json                    # 应用配置
│   ├── pages/
│   │   ├── customer/               # 顾客端（5 个页面）
│   │   │   ├── index/              # 首页
│   │   │   ├── services/           # 服务列表
│   │   │   ├── service-detail/     # 服务详情
│   │   │   ├── orders/             # 订单列表
│   │   │   └── profile/            # 个人中心
│   │   └── boss/                   # 老板端（4 个页面）
│   │       ├── dashboard/          # 数据看板
│   │       ├── services-mgr/       # 服务管理
│   │       ├── orders-mgr/         # 订单管理
│   │       └── stats/              # 统计分析
│   ├── components/                 # 公共组件
│   │   ├── service-card/           # 服务卡片
│   │   ├── time-picker/            # 时间选择器
│   │   └── rating/                 # 评价组件
│   ├── cloud/                      # 云函数
│   │   ├── login/                  # 登录
│   │   ├── services/               # 服务管理
│   │   ├── appointments/           # 预约管理
│   │   ├── orders/                 # 订单管理
│   │   ├── members/                # 会员管理
│   │   └── statistics/             # 数据统计
│   └── utils/                      # 工具函数
└── .monkeycode/
    ├── docs/                       # 项目文档
    └── specs/                      # 需求设计文档
```

## 快速开始

### 环境要求

- 微信开发者工具（最新稳定版）
- 小程序基础库 >= 2.30.0
- Node.js >= 14.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/yuyezhizhi/tcm-massage-appointment.git
cd tcm-massage-appointment
```

2. **导入项目**
   - 打开微信开发者工具
   - 导入项目，选择 `miniprogram/` 目录
   - 填入小程序 AppID

3. **配置云开发**
   - 点击「云开发」按钮
   - 开通云开发环境
   - 修改 `app.js` 中的环境 ID

4. **上传云函数**
   - 右键 `cloud/` 下每个文件夹
   - 选择「上传并部署：云端安装依赖」

5. **初始化数据库**
   - 创建 6 个集合：users, services, schedules, orders, members, reviews
   - 配置权限规则（详见 [DEPLOYMENT.md](.monkeycode/docs/DEPLOYMENT.md)）

### 配置说明

**数据库权限配置**

详见 `.monkeycode/docs/CLOUD_SETUP.md`

**环境变量**

在 `miniprogram/app.js` 中配置：
```javascript
wx.cloud.init({
  env: 'your-env-id',  // 替换为云开发环境 ID
  traceUser: true
})
```

## 开发进度

- ✅ 项目初始化（4/4）
- ✅ 云函数开发（6/6）
- ✅ 顾客端页面（5/5）
- ✅ 老板端页面（4/4）
- ✅ 公共组件（3/3）
- ✅ 工具函数（3/3）
- ⏳ 数据库权限配置（需手动）
- ⏳ 测试与优化

**总进度：32/35 任务完成 (91%)**

## 使用手册

### 顾客端使用

1. 浏览服务 → 选择服务项目
2. 选择预约时间 → 填写备注
3. 提交预约 → 等待店家确认
4. 查看订单 → 完成评价

### 老板端使用

1. **数据看板** - 查看经营数据
2. **服务管理** - 添加/编辑服务
3. **订单管理** - 确认接单/完成服务
4. **排班管理** - 生成可预约时段

详细使用说明见 [.monkeycode/docs/DEPLOYMENT.md](.monkeycode/docs/DEPLOYMENT.md)

## API 文档

### 云函数接口

| 云函数 | 功能 | 主要操作 |
|--------|------|---------|
| login | 用户登录 | 获取用户信息 |
| services | 服务管理 | list, create, update, delete |
| appointments | 预约管理 | create, cancel, getSchedule, generateSchedule |
| orders | 订单管理 | create, list, update, detail |
| members | 会员管理 | getInfo, getPointsHistory |
| statistics | 数据统计 | overview, trend, services |

详细接口文档见 [.monkeycode/docs/INTERFACES.md](.monkeycode/docs/INTERFACES.md)

### 数据模型

**订单 (orders)**
```javascript
{
  orderNo: "202606090001",
  userId: "openid",
  serviceId: "service_id",
  appointmentTime: Date,
  status: "pending | confirmed | completed | cancelled",
  amount: 19800,  // 分
  finalAmount: 19800,
  review: { rating: 5, content: "..." }
}
```

**会员 (members)**
```javascript
{
  userId: "openid",
  level: "normal | silver | gold | platinum",
  points: 1200,
  totalConsumption: 500000
}
```

## 常见问题

### 云函数调用失败
- 检查环境 ID 是否正确
- 确认云函数已上传
- 查看云函数日志

### 预约功能不可用
- 确认已生成排班数据
- 检查 schedules 集合权限

### 老板端无法访问
- 确认 users 集合中 role 字段为 "boss"

更多问题见 [.monkeycode/docs/DEPLOYMENT.md](.monkeycode/docs/DEPLOYMENT.md)

## 开发者

- 项目创建：yuyezhizhi
- 开发框架：微信小程序原生 + 微信云开发

## 开源协议

MIT License

## 项目链接

- GitHub: https://github.com/yuyezhizhi/tcm-massage-appointment
- 问题反馈：https://github.com/yuyezhizhi/tcm-massage-appointment/issues
