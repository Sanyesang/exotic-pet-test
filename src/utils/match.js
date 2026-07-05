import pets from '../data/pets.js'
import questions from '../data/questions.js'

const DIMENSIONS = ['space', 'interaction', 'cost', 'time', 'experience', 'feeding', 'activity', 'uniqueness', 'patience']

const BASE_WEIGHTS = {
  space: 1.0,
  interaction: 1.3,
  cost: 1.5,
  time: 1.3,
  experience: 1.8,
  feeding: 1.8,
  activity: 0.8,
  uniqueness: 0.7,
  patience: 1.0
}

/**
 * 将一组分数转换为 Z-Score（标准化到均值为0，标准差为1）
 * 解决了"中庸宠物总是赢"的问题
 */
function toZScore(scores) {
  const vals = DIMENSIONS.map(d => scores[d])
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length
  const variance = vals.reduce((sum, v) => sum + (v - mean) ** 2, 0) / vals.length
  const std = Math.sqrt(Math.max(variance, 0.01))
  const z = {}
  DIMENSIONS.forEach(d => { z[d] = (scores[d] - mean) / std })
  return z
}

/**
 * 维度置信度系数
 */
function buildDimensionIndex() {
  const idx = {}
  DIMENSIONS.forEach(d => { idx[d] = { count: 0 } })
  questions.forEach(q => {
    const touched = {}
    DIMENSIONS.forEach(d => { touched[d] = false })
    q.options.forEach(opt => {
      DIMENSIONS.forEach(d => {
        if (opt.scores && opt.scores[d] && opt.scores[d] > 0) touched[d] = true
      })
    })
    DIMENSIONS.forEach(d => { if (touched[d]) idx[d].count++ })
  })
  return idx
}
const dimIndex = buildDimensionIndex()

function getReliability(dim) {
  const c = dimIndex[dim].count
  if (c >= 6) return 1.0
  if (c >= 4) return 0.9
  if (c >= 3) return 0.8
  if (c >= 2) return 0.7
  return 0.6
}

/**
 * 根据用户答案计算匹配的异宠
 * 核心思路：
 * 1. 用户各维度原始平均分 → Z-Score
 * 2. 宠物各维度原始值 → Z-Score
 * 3. Z-Score 欧氏距离匹配（看相对偏好，不看绝对分）
 * 4. 否决惩罚基于原始分（硬约束）
 */
export function matchPets(answers) {
  // 1. 计算用户各维度的原始平均分
  const userRaw = {}
  DIMENSIONS.forEach(d => {
    let sum = 0, count = 0
    answers.forEach(a => {
      if (a.scores && a.scores[d] && a.scores[d] > 0) { sum += a.scores[d]; count++ }
    })
    userRaw[d] = count > 0 ? +(sum / count).toFixed(1) : 3
  })

  // 2. 用户 Z-Score 画像
  const userZ = toZScore(userRaw)

  // 3. 为每个宠物打分
  const scored = pets.map(pet => {
    // ---- 否决系统（基于原始分） ----
    let vetoPenalty = 0

    // 喂食否决：用户完全不能接受活食但宠物需要
    if (userRaw.feeding <= 1.8 && pet.feeding >= 4) {
      vetoPenalty += (pet.feeding - userRaw.feeding) * 6
    }
    // 经验否决：新手养高难度
    if (userRaw.experience <= 1.8 && pet.experience >= 4) {
      vetoPenalty += (pet.experience - userRaw.experience) * 5
    }
    // 空间否决：小空间养大空间宠物
    if (userRaw.space <= 1.8 && pet.space >= 4) {
      vetoPenalty += (pet.space - userRaw.space) * 4
    }
    // 预算否决：低预算养高消费宠物
    if (userRaw.cost <= 1.8 && pet.cost >= 4) {
      vetoPenalty += (pet.cost - userRaw.cost) * 4
    }
    // 时间否决：没时间养高需求宠物
    if (userRaw.time <= 1.5 && pet.time >= 4) {
      vetoPenalty += (pet.time - userRaw.time) * 5
    }

    // ---- Z-Score 匹配度计算 ----
    // 把宠物原始分也转成 Z-Score，看"相对偏好"是否一致
    const petRaw = {}
    DIMENSIONS.forEach(d => { petRaw[d] = pet[d] })
    const petZ = toZScore(petRaw)

    let totalScore = 0
    let totalWeight = 0

    DIMENSIONS.forEach(d => {
      const zDiff = Math.abs(userZ[d] - petZ[d])
      // diff=0 → 完美匹配得1分，diff=4 → 完全不匹配得0分
      // 在Z-Score空间里，diff>4 意味着两人差了4个标准差，极不可能
      const dimScore = Math.max(0, 1 - zDiff / 4.5)
      const reliability = getReliability(d)
      const weight = BASE_WEIGHTS[d] * reliability
      totalScore += weight * dimScore
      totalWeight += weight
    })

    // 转换为 0-100 分
    let similarity = Math.round((totalScore / totalWeight) * 100)

    // 应用否决惩罚
    similarity -= Math.round(vetoPenalty)

    // 确保在有效范围
    similarity = Math.max(1, Math.min(99, similarity))

    return {
      ...pet,
      similarity,
      reason: generateMatchDescription(userRaw, pet),
      vetoed: vetoPenalty > 20,
      vetoReason: vetoPenalty > 20 ? '部分条件不太匹配' : '',
      _zDistance: Math.sqrt(DIMENSIONS.reduce((sum, d) => sum + (userZ[d] - petZ[d]) ** 2, 0)),
      _vetoPenalty: vetoPenalty
    }
  })

  // 4. 按相似度降序排列
  scored.sort((a, b) => b.similarity - a.similarity)

  return scored
}

/**
 * 获取用户画像标签
 */
export function getUserProfile(answers) {
  const traits = []
  const sums = {}
  DIMENSIONS.forEach(d => { sums[d] = 0 })
  answers.forEach(a => {
    DIMENSIONS.forEach(d => {
      if (a.scores && a.scores[d]) sums[d] += a.scores[d]
    })
  })

  if (sums.interaction >= 12) traits.push('粘人精')
  else if (sums.interaction <= 4) traits.push('独来独往')
  if (sums.time <= 5) traits.push('大忙人')
  else if (sums.time >= 12) traits.push('时间充裕')
  if (sums.experience <= 4) traits.push('新手小白')
  else if (sums.experience >= 12) traits.push('资深老炮')
  if (sums.feeding <= 4) traits.push('素食主义者')
  else if (sums.feeding >= 9) traits.push('铁胃饲主')
  if (sums.uniqueness >= 8) traits.push('潮流达人')
  else if (sums.uniqueness <= 3) traits.push('佛系随缘')
  if (sums.patience >= 12) traits.push('耐心满分')
  else if (sums.patience <= 5) traits.push('急急国王')
  if (sums.activity >= 8) traits.push('活力无限')
  else if (sums.activity <= 3) traits.push('安安静静')
  if (sums.space >= 10) traits.push('空间大户')
  else if (sums.space <= 4) traits.push('蜗居达人')
  if (sums.cost >= 8) traits.push('氪金玩家')
  else if (sums.cost <= 3) traits.push('精打细算')

  return traits.length > 0 ? traits.slice(0, 4) : ['全能选手']
}

/**
 * 维度词典：用于生成匹配理由
 */
const DIM_DICT = {
  space: {
    high: { user: '你有充足的饲养空间', pet: '需要较大的活动空间' },
    mid: { user: '你的居住空间适中', pet: '对空间要求适中' },
    low: { user: '你的居住空间比较紧凑', pet: '不需要太大空间，小环境就能满足' }
  },
  interaction: {
    high: { user: '你渴望和宠物有亲密互动', pet: '互动性很好，会回应你的陪伴' },
    mid: { user: '你对互动有一定期待', pet: '适当的互动就能满足' },
    low: { user: '你更享受安静的陪伴', pet: '不粘人，各自安好就很舒服' }
  },
  cost: {
    high: { user: '你愿意为宠物投入预算', pet: '虽然成本不低但物有所值' },
    mid: { user: '你的宠物预算适中', pet: '饲养成本在合理范围内' },
    low: { user: '你追求高性价比', pet: '饲养成本很低，不会造成经济负担' }
  },
  time: {
    high: { user: '你愿意花时间照顾宠物', pet: '需要充足的日常照料时间' },
    mid: { user: '你能抽出固定时间照顾', pet: '日常维护时间要求适中' },
    low: { user: '你的生活节奏较快', pet: '不需要每天花大量时间打理' }
  },
  experience: {
    high: { user: '你是有经验的饲主', pet: '对饲养技巧有一定要求' },
    mid: { user: '你有基本的养宠常识', pet: '上手难度适中' },
    low: { user: '你是养宠新手', pet: '对新手非常友好，容错率高' }
  },
  feeding: {
    high: { user: '你对活体饲料接受度高', pet: '以活体饲料为主食' },
    mid: { user: '你对宠物饮食不挑剔', pet: '饮食多样，接受度灵活' },
    low: { user: '你对活体饲料有些抗拒', pet: '饮食简单，不需要接触活体饲料' }
  },
  activity: {
    high: { user: '你希望宠物活泼好动', pet: '精力充沛，充满活力' },
    mid: { user: '你对活跃度要求适中', pet: '动静皆宜' },
    low: { user: '你更喜欢安静的环境', pet: '安静稳重，不吵不闹' }
  },
  uniqueness: {
    high: { user: '你追求与众不同的宠物', pet: '足够特别，能让朋友们眼前一亮' },
    mid: { user: '你对宠物品种没有执念', pet: '有特点但不猎奇' },
    low: { user: '你不在乎宠物是否稀有', pet: '经典品种，稳定可靠' }
  },
  patience: {
    high: { user: '你非常有耐心', pet: '需要慢慢培养信任' },
    mid: { user: '你有基本的耐心', pet: '相处起来不费劲' },
    low: { user: '你希望宠物尽快上手', pet: '性格温顺，不需要特别驯化' }
  }
}

function describeLevel(val) {
  if (val >= 4) return 'high'
  if (val >= 2.5) return 'mid'
  return 'low'
}

/**
 * 生成匹配理由描述
 * @param {Object} userRaw - 用户各维度原始平均分
 * @param {Object} pet - 匹配到的宠物数据
 * @returns {string}
 */
function generateMatchDescription(userRaw, pet) {
  // 找出用户和宠物最匹配的 3 个维度（z-score 同方向且差异小）
  const userZ = toZScore(userRaw)
  const petZ = toZScore({ space: pet.space, interaction: pet.interaction, cost: pet.cost, time: pet.time, experience: pet.experience, feeding: pet.feeding, activity: pet.activity, uniqueness: pet.uniqueness, patience: pet.patience })

  // 计算每个维度的对齐度：同方向且绝对值越大越好
  const alignments = DIMENSIONS.map(d => ({
    dim: d,
    score: (userZ[d] * petZ[d]) * Math.min(Math.abs(userZ[d]), Math.abs(petZ[d]))
  }))
  alignments.sort((a, b) => b.score - a.score)

  // 取top 3 维度
  const topDims = alignments.slice(0, 3).map(a => a.dim)

  const sentences = []
  topDims.forEach(d => {
    const dict = DIM_DICT[d]
    const userDesc = dict[describeLevel(userRaw[d])]
    const petDesc = dict[describeLevel(pet[d])]

    // 拼成一句人话
    if (describeLevel(userRaw[d]) === describeLevel(pet[d])) {
      sentences.push(`${userDesc.user}，而${pet.name}${petDesc.pet}，在这方面你们很合拍。`)
    } else if (describeLevel(userRaw[d]) === 'high' || describeLevel(userRaw[d]) === 'low') {
      sentences.push(`虽然${userDesc.user}，但${pet.name}${petDesc.pet}，刚好能满足你的需求。`)
    }
  })

  if (sentences.length === 0) {
    return `${pet.name}的整体条件与你的生活方式非常匹配，是最适合你的异宠伴侣。`
  }

  return sentences.join(' ')
}

export { generateMatchDescription }
