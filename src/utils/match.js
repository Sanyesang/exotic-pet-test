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
