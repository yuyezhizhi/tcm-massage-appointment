const fs = require('fs')
const path = require('path')

console.log('=================================')
console.log('   项目功能检查报告')
console.log('=================================\n')

// 检查文件列表
const checks = [
  { name: '云函数', dir: '/workspace/miniprogram/cloud', expected: ['login', 'services', 'appointments', 'orders', 'members', 'statistics'] },
  { name: '顾客端页面', dir: '/workspace/miniprogram/pages/customer', expected: ['index', 'services', 'service-detail', 'orders', 'profile', 'review'] },
  { name: '老板端页面', dir: '/workspace/miniprogram/pages/boss', expected: ['dashboard', 'services-mgr', 'orders-mgr', 'stats'] },
  { name: '公共组件', dir: '/workspace/miniprogram/components', expected: ['service-card', 'time-picker', 'rating'] }
]

let allPassed = true

checks.forEach(check => {
  console.log(`\n=== ${check.name} ===`)
  
  check.expected.forEach(item => {
    const itemPath = path.join(check.dir, item)
    
    if (fs.existsSync(itemPath)) {
      const files = fs.readdirSync(itemPath)
      const hasJs = files.some(f => f.endsWith('.js'))
      const hasWxml = files.some(f => f.endsWith('.wxml'))
      const hasWxss = files.some(f => f.endsWith('.wxss'))
      const hasJson = files.some(f => f.endsWith('.json'))
      
      if (hasJs && hasWxml && hasWxss && hasJson) {
        console.log(`✓ ${item} - 文件完整`)
      } else {
        console.log(`⚠ ${item} - 文件不全 (${files.join(', ')})`)
      }
    } else {
      console.log(`✗ ${item} - 目录不存在`)
      allPassed = false
    }
  })
})

// 检查关键配置
console.log('\n=== 配置文件 ===')
const appJs = fs.readFileSync('/workspace/miniprogram/app.js', 'utf8')
if (appJs.includes('wx.cloud.init')) {
  console.log('✓ 云开发已配置')
} else {
  console.log('✗ 缺少云开发配置')
}

if (appJs.includes('your-env-id')) {
  console.log('⚠ 需要替换环境 ID: your-env-id')
}

// 检查云函数配置
console.log('\n=== 云函数完整性 ===')
const cloudFunctions = ['login', 'services', 'appointments', 'orders', 'members', 'statistics']
cloudFunctions.forEach(func => {
  const indexPath = path.join('/workspace/miniprogram/cloud', func, 'index.js')
  const configPath = path.join('/workspace/miniprogram/cloud', func, 'config.json')
  const packagePath = path.join('/workspace/miniprogram/cloud', func, 'package.json')
  
  const hasIndex = fs.existsSync(indexPath)
  const hasConfig = fs.existsSync(configPath)
  const hasPackage = fs.existsSync(packagePath)
  
  if (hasIndex) {
    const content = fs.readFileSync(indexPath, 'utf8')
    const hasMainExport = content.includes('exports.main')
    
    if (hasMainExport) {
      console.log(`✓ ${func} - 正常`)
    } else {
      console.log(`⚠ ${func} - 缺少 main 导出`)
    }
  } else {
    console.log(`✗ ${func} - index.js 不存在`)
    allPassed = false
  }
})

console.log('\n=================================')
if (allPassed) {
  console.log('✓ 项目结构检查完成，核心文件完整')
} else {
  console.log('⚠ 发现部分问题，请检查上述警告')
}
console.log('=================================\n')
