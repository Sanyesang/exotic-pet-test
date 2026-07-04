/**
 * 广告配置模块
 *
 * 支持的广告模式：
 * - 'simulated': 模拟广告（默认，无ICP备案时可用）
 * - 'union': 接入第三方广告联盟（需自行接入JS）
 *
 * 无ICP备案可选方案：
 * 1. 淘宝客/多多进宝 CPS —— 推荐异宠商品链接，按成交付佣金
 * 2. 一些小型广告联盟（对ICP要求较宽松）
 * 3. 直接联系异宠商家投放广告（私接）
 */

// ========== 广告配置 ==========
const adConfig = {
  // 当前广告模式：'simulated' | 'union'
  mode: 'simulated',

  // 广告时长（秒）
  duration: 30,

  // 第三方广告联盟配置（mode = 'union' 时生效）
  union: {
    // 广告联盟提供的 JavaScript 代码
    // 将代码粘贴到下方，会在广告页面动态加载
    scriptCode: '',

    // 或通过 iframe 嵌入广告
    iframeUrl: '',

    // 广告位ID（部分联盟需要）
    slotId: ''
  },

  // CPS 电商佣金配置
  cps: {
    // 是否启用电商 CPS 推荐
    enabled: false,
    // 推广位 PID（淘宝客/多多进宝）
    pid: '',
    // 在结果页推荐相关商品
    showOnResult: false
  }
}

/**
 * 获取当前广告配置
 */
export function getAdConfig() {
  return { ...adConfig }
}

/**
 * 切换广告模式
 * @param {'simulated'|'union'} mode
 * @param {Object} customConfig - 自定义配置
 */
export function setAdMode(mode, customConfig = {}) {
  adConfig.mode = mode
  if (mode === 'union' && customConfig.scriptCode) {
    adConfig.union.scriptCode = customConfig.scriptCode
  }
  if (customConfig.duration) {
    adConfig.duration = customConfig.duration
  }
}

/**
 * 获取需要展示的广告文案（模拟模式用）
 */
export function getAdCopy() {
  return {
    title: '异宠饲养小课堂',
    subtitle: '了解异宠的日常护理知识',
    note: '观看完整广告后即可免费查看结果'
  }
}
