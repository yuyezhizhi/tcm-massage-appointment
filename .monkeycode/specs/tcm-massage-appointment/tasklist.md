# 实施任务清单

Feature Name: tcm-massage-appointment
Created: 2026-06-09
Updated: 2026-06-09

## 项目初始化

- [x] 1.1 创建小程序目录结构
- [x] 1.2 初始化 package.json 和配置文件
- [x] 1.3 配置微信云开发环境
- [x] 1.4 创建云函数目录和基础配置

## 云函数开发

- [x] 2.1 实现登录云函数 (login)
- [x] 2.2 实现服务管理云函数 (services)
- [x] 2.3 实现预约管理云函数 (appointments)
- [x] 2.4 实现订单管理云函数 (orders)
- [x] 2.5 实现会员管理云函数 (members)
- [x] 2.6 实现数据统计云函数 (statistics)

## 数据库权限规则

- [ ] 3.1 配置 users 集合权限
- [ ] 3.2 配置 services 集合权限
- [ ] 3.3 配置 schedules 集合权限
- [ ] 3.4 配置 orders 集合权限
- [ ] 3.5 配置 members 集合权限
- [ ] 3.6 配置 reviews 集合权限

## 顾客端页面开发

- [x] 4.1 实现首页 (index)
- [x] 4.2 实现服务列表页 (services)
- [x] 4.3 实现服务详情页 (service-detail) 含预约功能
- [x] 4.4 实现订单列表页 (orders)
- [x] 4.5 实现个人中心页 (profile) 含会员中心

## 老板端页面开发

- [x] 5.1 实现数据看板 (dashboard)
- [x] 5.2 实现服务管理页 (services-mgr)
- [x] 5.3 实现订单管理页 (orders-mgr)
- [x] 5.4 实现统计分析页 (stats)

## 公共组件开发

- [x] 6.1 实现服务项目卡片组件 (service-card)
- [x] 6.2 实现时间选择器组件 (time-picker)
- [x] 6.3 实现评价组件 (rating)

## 工具函数

- [x] 7.1 实现时间格式化工具
- [x] 7.2 实现会员等级计算工具
- [x] 7.3 实现订单号生成工具

## 测试与优化

- [ ] 8.1 云函数单元测试
- [ ] 8.2 页面功能测试
- [ ] 8.3 性能优化
- [ ] 8.4 真机兼容性测试
