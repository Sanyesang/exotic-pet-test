<template>
  <div class="result-page">
    <!-- 如果没有结果，显示空白 -->
    <div v-if="!hasResult" class="empty-state">
      <p>还没有测试数据，去做个测试吧！</p>
      <button class="retry-btn" @click="goHome">开始测试</button>
    </div>

    <template v-else>
      <!-- 头部：用户画像标签 -->
      <div class="result-header">
        <div class="profile-section">
          <div class="profile-icon">🧬</div>
          <h1 class="profile-title">你的异宠人格</h1>
          <div class="tags">
            <span v-for="tag in userTags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- #1 推荐 -->
      <div class="top-pick" @click="showDetail(topPick)">
        <div class="top-badge">🏆 最佳匹配</div>
        <div class="top-card">
          <div class="top-emoji">{{ topPick.emoji }}</div>
          <h2 class="top-name">{{ topPick.name }}</h2>
          <div class="top-title">{{ topPick.title }}</div>
          <div class="top-match">
            <div class="match-ring">
              <svg viewBox="0 0 100 100">
                <circle class="ring-bg" cx="50" cy="50" r="42" />
                <circle
                  class="ring-fill"
                  cx="50" cy="50" r="42"
                  :style="{
                    strokeDasharray: circumference,
                    strokeDashoffset: circumference * (1 - topPick.similarity / 100)
                  }"
                />
              </svg>
              <div class="ring-text">
                <span class="ring-num">{{ topPick.similarity }}%</span>
                <span class="ring-label">匹配度</span>
              </div>
            </div>
          </div>
          <p class="top-desc">{{ topPick.description }}</p>
          <div class="top-meta">
            <span class="meta-item">📅 寿命 {{ topPick.lifespan }}</span>
            <span class="meta-item">💰 {{ topPick.price }}</span>
            <span class="meta-item">{{ topPick.difficulty }}</span>
          </div>
          <div class="top-tags">
            <span v-for="tag in topPick.tags" :key="tag" class="top-tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- 更多推荐 -->
      <div class="more-section">
        <h3 class="section-title">更多适合你的异宠</h3>
        <div class="pet-list">
          <div
            v-for="(pet, idx) in otherPets"
            :key="pet.id"
            class="pet-row"
            @click="showDetail(pet)"
          >
            <div class="pet-rank">#{{ idx + 2 }}</div>
            <div class="pet-emoji">{{ pet.emoji }}</div>
            <div class="pet-info">
              <div class="pet-name">{{ pet.name }}</div>
              <div class="pet-brief">{{ pet.title }}</div>
            </div>
            <div class="pet-match">
              <span class="match-num">{{ pet.similarity }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 完整排行 -->
      <div class="full-rank-section">
        <h3 class="section-title" @click="showFullRank = !showFullRank">
          完整匹配排行
          <span class="toggle-icon">{{ showFullRank ? '▲' : '▼' }}</span>
        </h3>
        <div v-if="showFullRank" class="full-rank-list">
          <div
            v-for="(pet, idx) in allRanked"
            :key="pet.id"
            class="rank-item"
            :class="{ highlight: idx === 0 && !sameAsTop }"
            @click="showDetail(pet)"
          >
            <span class="rank-num">{{ idx + 1 }}</span>
            <span class="rank-emoji">{{ pet.emoji }}</span>
            <span class="rank-name">{{ pet.name }}</span>
            <span class="rank-score">{{ pet.similarity }}%</span>
            <div class="rank-bar">
              <div class="rank-bar-fill" :style="{ width: pet.similarity + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="bottom-actions">
        <button class="share-btn" @click="shareResult">
          📤 分享结果
        </button>
        <button class="retest-btn" @click="goHome">
          🔄 重新测试
        </button>
      </div>

      <!-- 详情弹窗 -->
      <van-action-sheet v-model:show="detailSheet" :round="true">
        <div v-if="detailPet" class="detail-sheet">
          <div class="detail-emoji">{{ detailPet.emoji }}</div>
          <h2 class="detail-name">{{ detailPet.name }}</h2>
          <div class="detail-title">{{ detailPet.title }}</div>
          <div class="detail-match-badge">
            匹配度 <strong>{{ detailPet.similarity }}%</strong>
          </div>

          <div class="detail-section">
            <h4>📝 简介</h4>
            <p>{{ detailPet.description }}</p>
          </div>

          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">⏳ 寿命</span>
              <span class="detail-val">{{ detailPet.lifespan }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">💰 参考价格</span>
              <span class="detail-val">{{ detailPet.price }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">📊 饲养难度</span>
              <span class="detail-val">{{ detailPet.difficulty }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h4>🏷️ 标签</h4>
            <div class="detail-tags">
              <span v-for="tag in detailPet.tags" :key="tag" class="detail-tag">{{ tag }}</span>
            </div>
          </div>

          <!-- 维度雷达 -->
          <div class="detail-section">
            <h4>📈 各维度需求</h4>
            <div class="dimension-bars">
              <div v-for="dim in dimensions" :key="dim.key" class="dim-row">
                <span class="dim-label">{{ dim.label }}</span>
                <div class="dim-bar">
                  <div
                    class="dim-fill"
                    :style="{ width: (detailPet[dim.key] / 5) * 100 + '%' }"
                  ></div>
                </div>
                <span class="dim-val">{{ detailPet[dim.key] }}/5</span>
              </div>
            </div>
          </div>
        </div>
      </van-action-sheet>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { matchPets, getUserProfile } from '../utils/match.js'
import { showToast } from 'vant'

const router = useRouter()
const hasResult = ref(false)
const allRanked = ref([])
const userTags = ref([])
const detailSheet = ref(false)
const detailPet = ref(null)
const showFullRank = ref(false)

const circumference = computed(() => 2 * Math.PI * 42)

const dimensions = [
  { key: 'space', label: '空间需求' },
  { key: 'interaction', label: '互动需求' },
  { key: 'cost', label: '消费水平' },
  { key: 'time', label: '时间投入' },
  { key: 'experience', label: '经验要求' },
  { key: 'feeding', label: '活食接受度' },
  { key: 'activity', label: '活跃度' },
  { key: 'uniqueness', label: '独特性' },
  { key: 'patience', label: '耐心需求' }
]

const topPick = computed(() => allRanked.value[0] || {})
const otherPets = computed(() => allRanked.value.slice(1, 6))
const sameAsTop = computed(() => false)

function showDetail(pet) {
  detailPet.value = pet
  detailSheet.value = true
}

function goHome() {
  router.push('/')
}

function shareResult() {
  const pet = topPick.value
  const text = `🦎 我的异宠人格测试结果：最适合我的是「${pet.name}」🐾 匹配度 ${pet.similarity}%！快来测测你的天选异宠吧！`

  if (navigator.share) {
    navigator.share({
      title: '异宠人格测试',
      text: text,
      url: window.location.origin
    }).catch(() => {})
  } else {
    // 复制链接
    navigator.clipboard.writeText(text + ' ' + window.location.origin).then(() => {
      showToast('已复制到剪贴板，快去分享给朋友吧！')
    }).catch(() => {
      showToast('分享失败，请手动复制')
    })
  }
}

onMounted(() => {
  const stored = sessionStorage.getItem('quiz_answers')
  if (stored) {
    try {
      const answers = JSON.parse(stored)
      const results = matchPets(answers)
      allRanked.value = results
      userTags.value = getUserProfile(answers)
      hasResult.value = true
    } catch (e) {
      console.error('解析答案失败', e)
    }
  }
})
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%);
  padding-bottom: 40px;
}

.empty-state {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  gap: 20px;
}
.retry-btn {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 36px;
  font-size: 16px;
  cursor: pointer;
}

/* 头部 */
.result-header {
  padding: 40px 20px 0;
  text-align: center;
}
.profile-section {
  margin-bottom: 24px;
}
.profile-icon {
  font-size: 48px;
  margin-bottom: 8px;
}
.profile-title {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #7c6cf0, #f0a86c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}
.tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}
.tag {
  background: rgba(124, 108, 240, 0.12);
  border: 1px solid rgba(124, 108, 240, 0.2);
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 13px;
  color: #9b8ff5;
}

/* #1 推荐卡片 */
.top-pick {
  padding: 0 20px 24px;
  cursor: pointer;
}
.top-badge {
  display: inline-block;
  background: linear-gradient(135deg, #7c6cf0, #f0a86c);
  border-radius: 20px;
  padding: 4px 14px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
}
.top-card {
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.top-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #7c6cf0, #f0a86c);
}

.top-emoji {
  font-size: 72px;
  margin-bottom: 12px;
  filter: drop-shadow(0 8px 20px rgba(0,0,0,0.3));
}
.top-name {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.top-title {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.top-match {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.match-ring {
  position: relative;
  width: 80px;
  height: 80px;
}
.match-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 6;
}
.ring-fill {
  fill: none;
  stroke: var(--primary);
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease;
}
.ring-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.ring-num {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
}
.ring-label {
  font-size: 10px;
  color: var(--text-muted);
}

.top-desc {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
  text-align: left;
  margin-bottom: 20px;
}

.top-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 16px;
}
.meta-item {
  font-size: 13px;
  color: var(--text-muted);
}

.top-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}
.top-tag {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 4px 12px;
  font-size: 12px;
  color: var(--text-muted);
}

/* 更多推荐 */
.more-section, .full-rank-section {
  padding: 0 20px 24px;
}
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}
.toggle-icon {
  font-size: 12px;
  color: var(--text-muted);
}

.pet-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pet-row {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 14px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.pet-row:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.04);
}

.pet-rank {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-muted);
  min-width: 24px;
}
.pet-emoji {
  font-size: 32px;
}
.pet-info {
  flex: 1;
  min-width: 0;
}
.pet-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}
.pet-brief {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}
.pet-match {
  text-align: right;
}
.match-num {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
}

/* 完整排行 */
.full-rank-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
}
.rank-item.highlight {
  background: rgba(124, 108, 240, 0.06);
  border: 1px solid rgba(124, 108, 240, 0.1);
}
.rank-num {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  min-width: 20px;
}
.rank-emoji {
  font-size: 22px;
}
.rank-name {
  font-size: 14px;
  color: var(--text-primary);
  min-width: 70px;
}
.rank-score {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  min-width: 40px;
  text-align: right;
}
.rank-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  overflow: hidden;
}
.rank-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* 底部操作 */
.bottom-actions {
  padding: 0 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.share-btn {
  background: linear-gradient(135deg, #7c6cf0, #5a4ad8);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 1px;
  box-shadow: 0 8px 32px rgba(124, 108, 240, 0.3);
}
.share-btn:active {
  transform: scale(0.97);
}
.retest-btn {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 14px;
  font-size: 15px;
  cursor: pointer;
}
.retest-btn:active {
  transform: scale(0.97);
}

/* 详情弹窗 */
.detail-sheet {
  padding: 32px 24px 40px;
  text-align: center;
  background: #1a1a2e;
  color: var(--text-primary);
  max-height: 80vh;
  overflow-y: auto;
}

.detail-emoji {
  font-size: 64px;
  margin-bottom: 12px;
}
.detail-name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}
.detail-title {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}
.detail-match-badge {
  display: inline-block;
  background: rgba(124, 108, 240, 0.12);
  border: 1px solid rgba(124, 108, 240, 0.2);
  border-radius: 20px;
  padding: 6px 18px;
  font-size: 14px;
  color: #9b8ff5;
  margin-bottom: 24px;
}
.detail-match-badge strong {
  color: var(--primary);
  font-size: 18px;
}

.detail-section {
  text-align: left;
  margin-bottom: 20px;
}
.detail-section h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text-primary);
}
.detail-section p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}
.detail-item {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 12px;
  text-align: center;
}
.detail-label {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.detail-val {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.detail-tag {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 4px 14px;
  font-size: 13px;
  color: var(--text-secondary);
}

.dimension-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dim-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dim-label {
  font-size: 13px;
  color: var(--text-secondary);
  min-width: 70px;
}
.dim-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  overflow: hidden;
}
.dim-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: 6px;
  transition: width 1s ease;
}
.dim-val {
  font-size: 12px;
  color: var(--text-muted);
  min-width: 30px;
  text-align: right;
}
</style>
