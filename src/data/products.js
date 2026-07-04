/**
 * CPS 电商推广商品数据
 *
 * 使用方式：
 * 1. 注册淘宝客/多多进宝/京东联盟
 * 2. 搜索异宠相关商品
 * 3. 获取推广链接，替换下方 link 字段
 *
 * 这些商品会在广告页展示，用户点击购买你赚佣金
 * 不需要ICP备案
 */
const products = [
  {
    id: 1,
    title: '爬虫饲养箱 守宫角蛙通用',
    image: 'https://image.pollinations.ai/prompt/glass%20terrarium%20for%20reptiles%20white%20background%20product%20photo?width=400&height=400&nologo=true',
    price: '¥88起',
    tag: '🔥 热销',
    link: 'https://s.click.taobao.com/your-affiliate-link',
    shop: '淘宝'
  },
  {
    id: 2,
    title: 'UVA/UVB 加热灯 爬虫保温',
    image: 'https://image.pollinations.ai/prompt/reptile%20heat%20lamp%20UVA%20UVB%20white%20background%20product%20photo?width=400&height=400&nologo=true',
    price: '¥39起',
    tag: '⚡ 必备',
    link: 'https://s.click.taobao.com/your-affiliate-link',
    shop: '淘宝'
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
