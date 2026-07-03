import pets from '../data/pets.js'
import questions from '../data/questions.js'

const DIMENSIONS = ['space', 'interaction', 'cost', 'time', 'experience', 'feeding', 'activity', 'uniqueness', 'patience']

// 基础权重（越重要的维度权重越高）
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
 * 预计算每个维度涉及多少道题（用于置信度加权）
 */
function buildDimensionIndex() {
  const idx = {}
  DIMENSIONS.forEach(d => {
    idx[d] = { questionCount: 0, maxSum: 0 }
  })

  questions.forEach(q => {
    const touched = {}
    DIMENSIONS.forEach(d => { touched[d] = false })

    q.options.forEach(opt => {
      DIMENSIONS.forEach(d => {
        if (opt.scores && opt.scores[d] && opt.scores[d] > 0) {
          touched[d] = true
        }
      })
    })

    DIMENSIONS.forEach(d => {
      if (touched[d]) {
        idx[d].questionCount++
        // 记录本题在该维度上的最大得分
        let maxScore = 0
        q.options.forEach(opt => {
          if (opt.scores && opt.scores[d] && opt.scores[d] > maxScore) {
            maxScore = opt.scores[d]
          }
        })
        idx[d].maxSum += maxScore
      }
    })
  })

  return idx
}

const dimIndex = buildDimensionIndex()

/**
 * 计算维度置信度系数
 * 问题数越多的维度置信度越高
 */
function getReliability(dim) {
  const count = dimIndex[dim].questionCount
  if (count >= 6) return 1.0
  if (count >= 4) return 0.9
  if (count >= 3) return 0.8
  if (count >= 2) return 0.7
  return 0.6
}

/**
 * 根据用户答案计算匹配的异宠
 */
export function matchPets(answers) {
  // 1. 计算用户各维度平均分 (1-5)
  const userAvg = {}
  DIMENSIONS.forEach(d => {
    let sum = 0
    let count = 0
    answers.forEach(answer => {
      if (answer.scores && answer.scores[d] && answer.scores[d] > 0) {
        sum += answer.scores[d]
        count++
      }
    })
    userAvg[d] = count > 0 ? +(sum / count).toFixed(1) : 3
  })

  // 2. 为每个宠物打分
  const scored = pets.map(pet => {
    // ---- 否决惩罚：维度极端不匹配时降分 ----
    let vetoPenalty = 0

    DIMENSIONS.forEach(d => {
      const diff = userAvg[d] - pet[d]
      // 用户需求远低于宠物要求 → 惩罚
      if (diff < -2.0) {
        const severity = Math.abs(diff) - 2.0 // 超出2分以上的部分
        let dimWeight = 1.5
        if (d === 'feeding' || d === 'experience') dimWeight = 2.5
        if (d === 'cost' || d === 'time') dimWeight = 2.0
        vetoPenalty += severity * dimWeight * 3
      }
      // 用户经验太低但宠物难度高 → 额外惩罚
      if (d === 'experience' && diff < -1.5) {
        vetoPenalty += Math.abs(diff) * 4
      }
      // 用户接受不了活食但宠物需要 → 额外惩罚
      if (d === 'feeding' && diff < -1.5) {
        vetoPenalty += Math.abs(diff) * 5
      }
    })

    // ---- 加权欧氏距离 ----
    let sumSquared = 0
    let weightSum = 0

    DIMENSIONS.forEach(d => {
      const diff = userAvg[d] - pet[d]
      // 权重 = 基础权重 × 置信度系数
      const reliability = getReliability(d)
      const weight = BASE_WEIGHTS[d] * reliability
      sumSquared += weight * diff * diff
      weightSum += weight
    })

    // 均方根距离（考虑了权重）
    const weightedRms = Math.sqrt(sumSquared / weightSum)

    // 相似度 = 100 - 距离 × 缩放因子 + 修正
    // 距离每多 0.5 分，相似度降 ~12 分，产生足够区分度
    let similarity = Math.round(100 - weightedRms * 24)

    // 应用否决惩罚
    similarity = similarity - Math.round(vetoPenalty)

    // 归一化到 1-99 区间
    similarity = Math.max(1, Math.min(99, similarity))

    return {
      ...pet,
      similarity,
      vetoed: vetoPenalty > 15,
      vetoReason: vetoPenalty > 15 ? '部分条件不太匹配' : '',
      _rawDistance: weightedRms,
      _vetoPenalty: vetoPenalty
    }
  })

  // 3. 按相似度降序排列
  scored.sort((a, b) => b.similarity - a.similarity)

  // 4. 小幅平滑：如果前两名差距小于 3 分，视为并列
  for (let i = 1; i < scored.length; i++) {
    if (scored[0].similarity - scored[i].similarity < 3) {
      // 给予微小缓冲，不做大调整
    }
  }

  return scored
}

/**
 * 获取用户画像标签（基于30题维度总分判断）
 */
export function getUserProfile(answers) {
  const traits = []
  const sums = {}
  DIMENSIONS.forEach(d => { sums[d] = 0 })

  answers.forEach(answer => {
    DIMENSIONS.forEach(d => {
      if (answer.scores && answer.scores[d]) {
        sums[d] += answer.scores[d]
      }
    })
  })

  // 基于各维度累计总分判断标签
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

  // 最多返回 4 个标签
  return traits.length > 0 ? traits.slice(0, 4) : ['全能选手']
}
