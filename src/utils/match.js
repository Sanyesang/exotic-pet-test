import pets from '../data/pets.js'
import questions from '../data/questions.js'

const DIMENSIONS = ['space', 'interaction', 'cost', 'time', 'experience', 'feeding', 'activity', 'uniqueness', 'patience']

/**
 * 预计算每个维度涉及哪些题目
 * 用于后续归一化
 */
function buildDimensionIndex() {
  const idx = {}
  DIMENSIONS.forEach(d => { idx[d] = [] })

  questions.forEach((q, qi) => {
    DIMENSIONS.forEach(d => {
      let hasDim = false
      q.options.forEach(opt => {
        if (opt.scores && opt.scores[d] && opt.scores[d] > 0) {
          hasDim = true
        }
      })
      if (hasDim) {
        idx[d].push(qi)
      }
    })
  })
  return idx
}

const dimIndex = buildDimensionIndex()

/**
 * 根据用户答案计算匹配的异宠
 * 使用平均分归一化 + 加权欧氏距离 + 一票否决
 */
export function matchPets(answers) {
  // 1. 计算用户各维度的平均分 (1-5)
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
    userAvg[d] = count > 0 ? sum / count : 3 // 没数据的维度默认 3
  })

  // 2. 为每个宠物打分
  const scored = pets.map(pet => {
    // ---- 一票否决检查 ----
    let vetoed = false
    let vetoReason = ''

    // 喂食否决：用户完全不能接受活食(feeding<=1.5)但宠物需要(feeding>=4)
    if (userAvg.feeding <= 1.8 && pet.feeding >= 4) {
      vetoed = true
      vetoReason = '需要喂食活体昆虫或冻鼠'
    }

    // 空间否决：用户空间极小(space<=1.5)但宠物需要大空间(space>=4)
    if (userAvg.space <= 1.8 && pet.space >= 4) {
      vetoed = true
      vetoReason = '需要较大的饲养空间'
    }

    // 预算否决：用户预算低(cost<=1.5)但宠物花费高(cost>=4)
    if (userAvg.cost <= 1.8 && pet.cost >= 4) {
      vetoed = true
      vetoReason = '饲养成本较高'
    }

    // 时间否决：用户没时间(time<=1.5)但宠物需要多时间(time>=4)
    if (userAvg.time <= 1.8 && pet.time >= 4) {
      vetoed = true
      vetoReason = '需要较多时间照料'
    }

    // 经验否决：新手(experience<=1.5)但宠物难度高(experience>=4)
    if (userAvg.experience <= 1.8 && pet.experience >= 4) {
      vetoed = true
      vetoReason = '饲养难度较高，需要一定经验'
    }

    // ---- 加权欧氏距离 ----
    let sumSquared = 0
    let weightSum = 0

    DIMENSIONS.forEach(d => {
      const diff = userAvg[d] - pet[d]

      // 关键维度加权: cost, experience, feeding 权重 2x
      let weight = 1
      if (d === 'cost' || d === 'experience' || d === 'feeding') {
        weight = 2
      }
      // interaction 和 time 权重 1.5x
      if (d === 'interaction' || d === 'time') {
        weight = 1.5
      }

      sumSquared += weight * diff * diff
      weightSum += weight
    })

    const distance = Math.sqrt(sumSquared / weightSum)

    // 转换相似度 0-100
    // 最大可能距离: 两个维度差 4, 加权
    const maxDist = Math.sqrt(
      (4 * 4 * 2 * DIMENSIONS.length) / DIMENSIONS.length
    ) // ~4
    let similarity = Math.round((1 - distance / 4) * 100)
    similarity = Math.max(5, Math.min(98, similarity))

    // 被否决的宠物降 30 分
    if (vetoed) {
      return {
        ...pet,
        similarity: Math.max(5, similarity - 35),
        vetoed: true,
        vetoReason
      }
    }

    return {
      ...pet,
      similarity,
      vetoed: false,
      vetoReason: ''
    }
  })

  // 3. 按相似度降序
  scored.sort((a, b) => b.similarity - a.similarity)

  return scored
}

/**
 * 获取用户画像标签（基于原始总分判断阈值）
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

  if (sums.time <= 3) traits.push('大忙人')
  else if (sums.time >= 6) traits.push('时间充裕')

  if (sums.interaction <= 3) traits.push('独来独往')
  else if (sums.interaction >= 7) traits.push('粘人精')

  if (sums.experience <= 2) traits.push('新手小白')
  else if (sums.experience >= 7) traits.push('资深老炮')

  if (sums.feeding <= 3) traits.push('素食主义者')
  else if (sums.feeding >= 7) traits.push('铁胃饲主')

  if (sums.uniqueness >= 4) traits.push('潮流达人')

  return traits.length > 0 ? traits : ['全能选手']
}
