/**
 * 题目数据库
 * 每题映射到多个维度的分值
 * 维度: space, interaction, cost, time, experience, feeding, activity, uniqueness, patience
 */
const questions = [
  {
    id: 1,
    title: '周末你最喜欢怎么过？',
    icon: '🌤️',
    options: [
      { label: '宅家追剧打游戏', scores: { activity: 1, time: 3 } },
      { label: '出去浪/社交', scores: { activity: 5, time: 1 } },
      { label: '随缘，看心情', scores: { activity: 3, time: 2 } }
    ]
  },
  {
    id: 2,
    title: '你平时的性格更偏向？',
    icon: '🧘',
    options: [
      { label: '内向独处派', scores: { interaction: 1, patience: 4 } },
      { label: '外向活跃派', scores: { interaction: 5, patience: 2 } },
      { label: '动静皆宜', scores: { interaction: 3, patience: 3 } }
    ]
  },
  {
    id: 3,
    title: '你希望宠物跟你有多亲密？',
    icon: '💕',
    options: [
      { label: '天天抱在手里揉', scores: { interaction: 5 } },
      { label: '偶尔互动一下就好', scores: { interaction: 2 } },
      { label: '看着它就满足了', scores: { interaction: 1 } }
    ]
  },
  {
    id: 4,
    title: '你的居住环境是？',
    icon: '🏠',
    options: [
      { label: '单身公寓/小房间', scores: { space: 1 } },
      { label: '合租房', scores: { space: 2 } },
      { label: '自有住宅/大房子', scores: { space: 4 } },
      { label: '宿舍', scores: { space: 1 } }
    ]
  },
  {
    id: 5,
    title: '家里能放下多大的饲养箱？',
    icon: '📦',
    options: [
      { label: '空间充裕，随便放', scores: { space: 5 } },
      { label: '能放一个小箱子(60cm)', scores: { space: 2 } },
      { label: '只能放迷你盒(30cm)', scores: { space: 1 } }
    ]
  },
  {
    id: 6,
    title: '你能接受给宠物喂活体昆虫吗？（蟋蟀/面包虫等）',
    icon: '🦗',
    options: [
      { label: '完全可以，很刺激', scores: { feeding: 5 } },
      { label: '戴手套可以接受', scores: { feeding: 3 } },
      { label: '完全不行，我害怕', scores: { feeding: 1 } }
    ]
  },
  {
    id: 7,
    title: '你能接受喂食冻鼠/生肉吗？',
    icon: '🥩',
    options: [
      { label: '可以，自然法则', scores: { feeding: 5 } },
      { label: '有点接受不了', scores: { feeding: 1 } },
      { label: '没想好，看情况', scores: { feeding: 3 } }
    ]
  },
  {
    id: 8,
    title: '每个月愿意在宠物上花多少钱？',
    icon: '💰',
    options: [
      { label: '100元以内', scores: { cost: 1 } },
      { label: '100-300元', scores: { cost: 2 } },
      { label: '300-500元', scores: { cost: 3 } },
      { label: '500元以上', scores: { cost: 5 } }
    ]
  },
  {
    id: 9,
    title: '首次投入（设备+宠物）预算大概多少？',
    icon: '💳',
    options: [
      { label: '500元以内', scores: { cost: 1 } },
      { label: '500-2000元', scores: { cost: 3 } },
      { label: '2000元以上', scores: { cost: 5 } }
    ]
  },
  {
    id: 10,
    title: '每天能花多少时间照顾宠物？',
    icon: '⏰',
    options: [
      { label: '15分钟以内', scores: { time: 1 } },
      { label: '15-30分钟', scores: { time: 3 } },
      { label: '30分钟以上', scores: { time: 5 } }
    ]
  },
  {
    id: 11,
    title: '你经常出差或旅行吗？',
    icon: '✈️',
    options: [
      { label: '经常出差', scores: { time: 1 } },
      { label: '偶尔出去', scores: { time: 3 } },
      { label: '几乎不出门', scores: { time: 5 } }
    ]
  },
  {
    id: 12,
    title: '你之前养过宠物吗？',
    icon: '🐾',
    options: [
      { label: '没养过', scores: { experience: 1 } },
      { label: '养过猫狗', scores: { experience: 2 } },
      { label: '养过异宠/鱼/龟', scores: { experience: 5 } }
    ]
  },
  {
    id: 13,
    title: '养异宠你最看重什么？',
    icon: '🎯',
    options: [
      { label: '与众不同，发圈炸裂', scores: { uniqueness: 5 } },
      { label: '皮实好养活', scores: { experience: 1, time: 3 } },
      { label: '能互动有感情', scores: { interaction: 5 } },
      { label: '纯观赏，好看就完事', scores: { interaction: 1, uniqueness: 2 } }
    ]
  },
  {
    id: 14,
    title: '你对宠物的活跃度期待？',
    icon: '⚡',
    options: [
      { label: '活泼好动，天天有戏看', scores: { activity: 5 } },
      { label: '安静稳重，当个摆件也行', scores: { activity: 1 } },
      { label: '适中就好', scores: { activity: 3 } }
    ]
  },
  {
    id: 15,
    title: '你对饲养难度的态度是？',
    icon: '📚',
    options: [
      { label: '愿意花时间研究学习', scores: { experience: 5, patience: 5 } },
      { label: '越简单越好', scores: { experience: 1, patience: 1 } },
      { label: '适中就好', scores: { experience: 3, patience: 3 } }
    ]
  }
]

export default questions
