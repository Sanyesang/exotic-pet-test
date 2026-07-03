/**
 * 题目数据库（30题）
 * 每题4个选项，映射到9个维度
 * 维度: space, interaction, cost, time, experience, feeding, activity, uniqueness, patience
 * 所有分数范围 1-5
 */
const questions = [
  // ========= Q1-Q15: 原有题目扩充为4选项 =========
  {
    id: 1,
    title: '周末你最喜欢怎么过？',
    icon: '🌤️',
    options: [
      { label: '宅家追剧打游戏', scores: { activity: 1, time: 3 } },
      { label: '出去浪 / 社交局', scores: { activity: 5, time: 1 } },
      { label: '随缘看心情', scores: { activity: 3, time: 2 } },
      { label: '户外运动 / 大自然', scores: { activity: 4, time: 2 } }
    ]
  },
  {
    id: 2,
    title: '你平时的性格更偏向？',
    icon: '🧘',
    options: [
      { label: '内向独处派', scores: { interaction: 1, patience: 4 } },
      { label: '外向活跃派', scores: { interaction: 5, patience: 2 } },
      { label: '动静皆宜', scores: { interaction: 3, patience: 3 } },
      { label: '社牛但需要独处时间', scores: { interaction: 4, patience: 2 } }
    ]
  },
  {
    id: 3,
    title: '你希望宠物跟你有多亲密？',
    icon: '💕',
    options: [
      { label: '天天抱在手里揉', scores: { interaction: 5 } },
      { label: '偶尔互动一下就好', scores: { interaction: 2 } },
      { label: '看着它就满足了', scores: { interaction: 1 } },
      { label: '最好能跟我互动玩耍', scores: { interaction: 4 } }
    ]
  },
  {
    id: 4,
    title: '你的居住环境是？',
    icon: '🏠',
    options: [
      { label: '单身公寓 / 小房间', scores: { space: 1 } },
      { label: '合租房', scores: { space: 2 } },
      { label: '自有住宅 / 大房子', scores: { space: 4 } },
      { label: '宿舍', scores: { space: 1 } }
    ]
  },
  {
    id: 5,
    title: '家里能放下多大的饲养箱？',
    icon: '📦',
    options: [
      { label: '空间充裕随便放', scores: { space: 5 } },
      { label: '能放一个中型箱', scores: { space: 3 } },
      { label: '只能放迷你盒', scores: { space: 1 } },
      { label: '可以定制专门的饲养架', scores: { space: 4 } }
    ]
  },
  {
    id: 6,
    title: '你能接受给宠物喂活体昆虫吗？',
    icon: '🦗',
    options: [
      { label: '完全可以，很刺激', scores: { feeding: 5 } },
      { label: '戴手套可以接受', scores: { feeding: 3 } },
      { label: '完全不行，我害怕', scores: { feeding: 1 } },
      { label: '看是什么虫，小虫可以', scores: { feeding: 3 } }
    ]
  },
  {
    id: 7,
    title: '你能接受喂食冻鼠 / 生肉吗？',
    icon: '🥩',
    options: [
      { label: '可以，自然法则', scores: { feeding: 5 } },
      { label: '有点接受不了', scores: { feeding: 1 } },
      { label: '没想好，看情况', scores: { feeding: 3 } },
      { label: '只能接受处理好的', scores: { feeding: 3 } }
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
      { label: '500元以上不封顶', scores: { cost: 5 } }
    ]
  },
  {
    id: 9,
    title: '首次投入（设备 + 宠物）预算？',
    icon: '💳',
    options: [
      { label: '500元以内', scores: { cost: 1 } },
      { label: '500-2000元', scores: { cost: 3 } },
      { label: '2000元以上', scores: { cost: 5 } },
      { label: '分期也行，一步到位', scores: { cost: 4 } }
    ]
  },
  {
    id: 10,
    title: '每天能花多少时间照顾宠物？',
    icon: '⏰',
    options: [
      { label: '15分钟以内', scores: { time: 1 } },
      { label: '15-30分钟', scores: { time: 3 } },
      { label: '30分钟以上', scores: { time: 5 } },
      { label: '随缘，有空就弄', scores: { time: 2 } }
    ]
  },
  {
    id: 11,
    title: '你经常出差或旅行吗？',
    icon: '✈️',
    options: [
      { label: '经常出差 / 旅行', scores: { time: 1 } },
      { label: '偶尔出去', scores: { time: 3 } },
      { label: '几乎不出门', scores: { time: 5 } },
      { label: '出门但不超过3天', scores: { time: 3 } }
    ]
  },
  {
    id: 12,
    title: '你之前养过宠物吗？',
    icon: '🐾',
    options: [
      { label: '没养过', scores: { experience: 1 } },
      { label: '养过猫狗', scores: { experience: 2 } },
      { label: '养过异宠 / 鱼 / 龟', scores: { experience: 5 } },
      { label: '养过植物算吗……好吧养过仓鼠', scores: { experience: 2 } }
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
      { label: '纯观赏好看就完事', scores: { interaction: 1, uniqueness: 2 } }
    ]
  },
  {
    id: 14,
    title: '你对宠物的活跃度期待？',
    icon: '⚡',
    options: [
      { label: '活泼好动天天有戏看', scores: { activity: 5 } },
      { label: '安静稳重当个摆件也行', scores: { activity: 1 } },
      { label: '适中就好', scores: { activity: 3 } },
      { label: '白天不动晚上嗨', scores: { activity: 2 } }
    ]
  },
  {
    id: 15,
    title: '你对饲养难度的态度是？',
    icon: '📚',
    options: [
      { label: '愿意花时间研究学习', scores: { experience: 5, patience: 5 } },
      { label: '越简单越好', scores: { experience: 1, patience: 1 } },
      { label: '适中就好', scores: { experience: 3, patience: 3 } },
      { label: '有挑战才有趣', scores: { experience: 4, patience: 4 } }
    ]
  },

  // ========= Q16-Q30: 新增题目 =========
  {
    id: 16,
    title: '你希望和宠物之间是怎样的关系？',
    icon: '🤝',
    options: [
      { label: '像狗一样亲密无间', scores: { interaction: 5 } },
      { label: '像猫一样若即若离', scores: { interaction: 3 } },
      { label: '像鱼一样观赏即可', scores: { interaction: 1 } },
      { label: '像室友一样各过各的', scores: { interaction: 2 } }
    ]
  },
  {
    id: 17,
    title: '你是"晨型人"还是"夜猫子"？',
    icon: '🌙',
    options: [
      { label: '早睡早起好青年', scores: { activity: 3, time: 2 } },
      { label: '熬夜冠军越夜越精神', scores: { activity: 2, time: 4 } },
      { label: '规律作息到点就困', scores: { activity: 3, time: 3 } },
      { label: '随心所欲没有规律', scores: { activity: 3, time: 2 } }
    ]
  },
  {
    id: 18,
    title: '你对"花钱在宠物身上"的态度？',
    icon: '💎',
    options: [
      { label: '给它最好的不计成本', scores: { cost: 5 } },
      { label: '合理预算内尽量好', scores: { cost: 3 } },
      { label: '能省则省不花冤枉钱', scores: { cost: 1 } },
      { label: '前期投入舍得后续节约', scores: { cost: 3 } }
    ]
  },
  {
    id: 19,
    title: '你觉得自己是个有耐心的人吗？',
    icon: '🧘',
    options: [
      { label: '非常有耐心，不急不躁', scores: { patience: 1, experience: 4 } },
      { label: '一般般，看情况', scores: { patience: 3, experience: 2 } },
      { label: '没什么耐心容易暴躁', scores: { patience: 5, experience: 1 } },
      { label: '对喜欢的事有耐心', scores: { patience: 2, experience: 3 } }
    ]
  },
  {
    id: 20,
    title: '你愿意花多少时间研究养宠知识？',
    icon: '📖',
    options: [
      { label: '愿意系统深入学习', scores: { experience: 5, time: 4 } },
      { label: '遇到问题再查资料', scores: { experience: 2, time: 2 } },
      { label: '最好不用学直接上手', scores: { experience: 1, time: 1 } },
      { label: '先学再养，做好准备', scores: { experience: 4, time: 3 } }
    ]
  },
  {
    id: 21,
    title: '你对家里"有点异味"的接受度？',
    icon: '👃',
    options: [
      { label: '完全不能有异味', scores: { patience: 5, space: 3 } },
      { label: '轻微味道可以接受', scores: { patience: 3, space: 2 } },
      { label: '习惯了就不觉得臭', scores: { patience: 1, space: 1 } },
      { label: '勤打扫通风就没问题', scores: { patience: 2, space: 3 } }
    ]
  },
  {
    id: 22,
    title: '你对宠物"越狱 / 逃跑"风险怎么看？',
    icon: '🏃',
    options: [
      { label: '必须万无一失绝对防逃', scores: { space: 3, experience: 4 } },
      { label: '做好基本防护就好', scores: { space: 2, experience: 3 } },
      { label: '跑了再说抓回来就行', scores: { space: 1, experience: 1 } },
      { label: '选根本跑不掉的养', scores: { space: 1, experience: 2 } }
    ]
  },
  {
    id: 23,
    title: '你希望宠物的"寿命"是？',
    icon: '⏳',
    options: [
      { label: '越久越好当传家宝', scores: { patience: 5, experience: 3 } },
      { label: '10年以上', scores: { patience: 3, experience: 2 } },
      { label: '5-10年', scores: { patience: 2, experience: 1 } },
      { label: '无所谓珍惜当下', scores: { patience: 1, experience: 1 } }
    ]
  },
  {
    id: 24,
    title: '你对"冷血 / 变温动物"的感觉？',
    icon: '🦎',
    options: [
      { label: '觉得很酷很喜欢', scores: { feeding: 4 } },
      { label: '不排斥可以接受', scores: { feeding: 3 } },
      { label: '有点怕但可以尝试', scores: { feeding: 2 } },
      { label: '完全接受不了', scores: { feeding: 1 } }
    ]
  },
  {
    id: 25,
    title: '你希望宠物养在哪个区域？',
    icon: '📍',
    options: [
      { label: '客厅 / 公共区域', scores: { space: 3 } },
      { label: '自己卧室', scores: { space: 2 } },
      { label: '阳台 / 窗边', scores: { space: 4 } },
      { label: '有专门一个房间', scores: { space: 5 } }
    ]
  },
  {
    id: 26,
    title: '你对宠物"颜值"的看重程度？',
    icon: '✨',
    options: [
      { label: '颜值即正义必须好看', scores: { uniqueness: 3 } },
      { label: '看对眼就行', scores: { uniqueness: 2 } },
      { label: '性格好比什么都重要', scores: { uniqueness: 1, interaction: 3 } },
      { label: '越特别越好看', scores: { uniqueness: 4 } }
    ]
  },
  {
    id: 27,
    title: '除了你之外，家里其他人也支持养宠吗？',
    icon: '👨‍👩‍👧‍👧',
    options: [
      { label: '全家人一起养', scores: { space: 3, time: 3 } },
      { label: '家人不反对但不管', scores: { space: 2, time: 2 } },
      { label: '自己住想养就养', scores: { space: 2, time: 3 } },
      { label: '有家人怕/反对', scores: { space: 1, experience: 2 } }
    ]
  },
  {
    id: 28,
    title: '你对宠物"互动反馈"的期待有多高？',
    icon: '💬',
    options: [
      { label: '必须要跟我互动回应', scores: { interaction: 5 } },
      { label: '有点互动就行不强求', scores: { interaction: 3 } },
      { label: '不需要互动观赏足矣', scores: { interaction: 1 } },
      { label: '希望它认得我就好', scores: { interaction: 3 } }
    ]
  },
  {
    id: 29,
    title: '你每周能花多少时间做"清洁打理"？',
    icon: '🧹',
    options: [
      { label: '每天打扫不嫌麻烦', scores: { patience: 2, time: 4 } },
      { label: '每周集中清理一次', scores: { patience: 2, time: 2 } },
      { label: '越少打理越好', scores: { patience: 4, time: 1 } },
      { label: '可以请人帮忙打理', scores: { patience: 2, time: 2 } }
    ]
  },
  {
    id: 30,
    title: '你对"稀有 / 小众"程度的追求？',
    icon: '🌟',
    options: [
      { label: '越冷门越小众越好', scores: { uniqueness: 5 } },
      { label: '稍微小众一点就行', scores: { uniqueness: 3 } },
      { label: '不在乎热门冷门', scores: { uniqueness: 1 } },
      { label: '热门的好方便交流', scores: { uniqueness: 2 } }
    ]
  }
]

export default questions
