import pets from '../data/pets.js'

const DIMENSIONS = ['space', 'interaction', 'cost', 'time', 'experience', 'feeding', 'activity', 'uniqueness', 'patience']
const MAX_SCORE = 5

/**
 * 根据用户答案计算匹配的异宠
 * @param {Array} answers - 用户答案数组 [{ questionId, scores }]
 * @returns {Array} 按匹配度排序的异宠列表（前3个为主推荐）
 */
export function matchPets(answers) {
  // 1. 累加用户各维度总分
  const userScores = {}
  DIMENSIONS.forEach(d => { userScores[d] = 0 })

  answers.forEach(answer => {
    DIMENSIONS.forEach(d => {
      if (answer.scores[d]) {
        userScores[d] += answer.scores[d]
      }
    })
  })

  // 2. 计算每个维度的理论最大值并归一化
  const maxPossible = {}
  DIMENSIONS.forEach(d => {
    let max = 0
    answers.forEach(answer => {
      if (answer.scores[d]) {
        max = Math.max(max, answer.scores[d])
      }
    })
    // 如果某个维度从未被选择，用默认值
    maxPossible[d] = max || 1
  })

  // 归一化用户分数到 1-5
  DIMENSIONS.forEach(d => {
    const raw = userScores[d]
    const max = maxPossible[d]
    userScores[d] = max > 0 ? Math.round((raw / max) * 5) : 1
    userScores[d] = Math.max(1, Math.min(5, userScores[d]))
  })

  // 3. 为每个宠物计算加权欧氏距离
  const scored = pets.map(pet => {
    let sumSquared = 0
    let weightSum = 0

    // 用户有数据的维度才参与计算
    DIMENSIONS.forEach(d => {
      if (userScores[d] > 0) {
        const diff = userScores[d] - pet[d]
        // 关键维度加权
        let weight = 1
        if (d === 'experience' || d === 'feeding' || d === 'cost') {
          weight = 1.5  // 这些维度更重要
        }
        sumSquared += weight * diff * diff
        weightSum += weight
      }
    })

    const distance = Math.sqrt(sumSquared / weightSum)
    // 转换为相似度分数（0-100）
    const maxDistance = Math.sqrt(4 * 4 * 2) // 最大可能距离
    const similarity = Math.round((1 - distance / maxDistance) * 100)

    return {
      ...pet,
      similarity: Math.max(0, Math.min(100, similarity))
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

  // 简单分析几个维度
  const userScores = {}
  DIMENSIONS.forEach(d => { userScores[d] = 0 })

  answers.forEach(answer => {
    DIMENSIONS.forEach(d => {
      if (answer.scores[d]) {
        userScores[d] += answer.scores[d]
      }
    })
  })

  if (userScores.time <= 2) traits.push('大忙人')
  else if (userScores.time >= 4) traits.push('时间充裕')

  if (userScores.interaction >= 4) traits.push('粘人精')
  else if (userScores.interaction <= 2) traits.push('独来独往')

  if (userScores.experience <= 2) traits.push('新手小白')
  else if (userScores.experience >= 4) traits.push('资深玩家')

  if (userScores.feeding >= 4) traits.push('铁胃饲主')
  else if (userScores.feeding <= 2) traits.push('素食主义者')

  if (userScores.uniqueness >= 4) traits.push('潮流达人')

  return traits.length > 0 ? traits : ['全能选手']
}
