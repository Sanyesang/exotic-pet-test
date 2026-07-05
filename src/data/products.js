/**
 * CPS 电商推广商品数据
 *
 * 使用方式：
 * 从多多进宝/京东联盟获取推广链接，替换下方 link 字段
 *
 * 这些商品会在广告页展示，用户点击购买你赚佣金
 * 不需要ICP备案
 */
const products = [
  {
    id: 1,
    title: '豹纹守宫/鬃狮蜥 活体 新手入门',
    image: '/images/product-leo.jpg',
    price: '¥22.40起',
    tag: '🔥 热销',
    link: 'https://mobile.yangkeduo.com/duo_coupon_landing.html?goods_id=930726753134&pid=44554960_316791390&goods_sign=E9P2etntzfpt8cPhwvbA0GdzxyE-wk86_JGVpx2jv5&cpsSign=CC_260705_44554960_316791390_f22115ecc1dff21df4cb35ee5001409c&_x_ddjb_act=%7B%22st%22%3A%221%22%7D&duoduo_type=2',
    shop: '拼多多'
  },
  {
    id: 2,
    title: '超小爬宠守宫精准温控宠物温湿度计',
    image: '/images/product-thermo.jpg',
    price: '¥4.79起',
    tag: '🎯 必备',
    link: 'https://mobile.yangkeduo.com/duo_coupon_landing.html?goods_id=952270508898&pid=44554960_316791390&goods_sign=E9r2f93wLfZt8cPhwvbA0KhYk21nPamZ_JQEbPdgkwi&cpsSign=CC_260705_44554960_316791390_4ec0c04874583d542395d89bb15acdda&_x_ddjb_act=%7B%22st%22%3A%221%7D&duoduo_type=2',
    shop: '拼多多'
  },
  {
    id: 3,
    title: '椰土/爬虫垫材 5L装',
    image: 'https://image.pollinations.ai/prompt/coconut%20fiber%20substrate%20for%20reptiles%20white%20background%20product%20photo?width=400&height=400&nologo=true',
    price: '¥15起',
    tag: '💎 低价',
    link: 'https://s.click.taobao.com/your-affiliate-link',
    shop: '淘宝'
  },
  {
    id: 4,
    title: '自动喷淋系统 定时加湿',
    image: 'https://image.pollinations.ai/prompt/automatic%20mist%20sprayer%20for%20reptile%20terrarium%20white%20background?width=400&height=400&nologo=true',
    price: '¥128起',
    tag: '🛒 推荐',
    link: 'https://s.click.taobao.com/your-affiliate-link',
    shop: '淘宝'
  },
  {
    id: 5,
    title: '温湿度计 电子精准数显',
    image: 'https://image.pollinations.ai/prompt/digital%20thermometer%20hygrometer%20white%20background%20product%20photo?width=400&height=400&nologo=true',
    price: '¥25起',
    tag: '🎯 精准',
    link: 'https://s.click.taobao.com/your-affiliate-link',
    shop: '淘宝'
  },
  {
    id: 6,
    title: '活体面包虫 500g装',
    image: 'https://image.pollinations.ai/prompt/mealworms%20in%20a%20container%20white%20background%20product%20photo?width=400&height=400&nologo=true',
    price: '¥12起',
    tag: '🐛 饲料',
    link: 'https://s.click.taobao.com/your-affiliate-link',
    shop: '淘宝'
  }
]

/**
 * 按分类获取推荐商品
 */
export function getProducts() {
  return products
}

/**
 * 随机获取一个商品（用于广告页展示）
 */
export function getRandomProduct() {
  const idx = Math.floor(Math.random() * products.length)
  return products[idx]
}

/**
 * 获取当前广告要展示的商品列表（用于轮播）
 */
export function getAdProducts(count = 3) {
  const shuffled = [...products].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
