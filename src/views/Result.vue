<template>
  <div class="result-page">
    <!-- 如果没有结果，显示空白 -->
    <div v-if="!hasResult" class="empty-state">
      <p>还没有测试数据，去做个测试吧！</p>
      <button class="retry-btn" @click="goHome">开始测试</button>
    </div>

    <template v-else>
      <!-- 头部：用户画像标签 -->
      <div class="result-header anim-up a-delay-1">
        <div class="profile-section">
          <div class="profile-icon">🧬</div>
          <h1 class="profile-title">你的异宠人格</h1>
          <div class="tags">
            <span v-for="tag in userTags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- #1 推荐 -->
      <div class="top-pick anim-up a-delay-2" @click="showDetail(topPick)">
        <div class="top-badge">🏆 最佳匹配</div>
        <div class="top-card">
          <div class="top-image"><img :src="topPick.image" :alt="topPick.name" @error="imgErr" /></div>
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
      <div class="more-section anim-up a-delay-3">
        <h3 class="section-title">更多适合你的异宠</h3>
        <div class="pet-list">
          <div
            v-for="(pet, idx) in otherPets"
            :key="pet.id"
            class="pet-row"
            @click="showDetail(pet)"
          >
            <div class="pet-rank">#{{ idx + 2 }}</div>
            <div class="pet-thumb"><img :src="pet.image" :alt="pet.name" @error="imgErr" /></div>
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
      <div class="full-rank-section anim-up a-delay-4">
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
            <span class="rank-thumb"><img :src="pet.image" :alt="pet.name" @error="imgErr" /></span>
            <span class="rank-name">{{ pet.name }}</span>
            <span class="rank-score">{{ pet.similarity }}%</span>
            <div class="rank-bar">
              <div class="rank-bar-fill" :style="{ width: pet.similarity + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="bottom-actions anim-up a-delay-5">
        <button class="share-btn" @click="shareResult">
          📤 分享链接
        </button>
        <button class="card-btn" :disabled="cardLoading" @click="generateCard">
          {{ cardLoading ? '⏳ 生成中...' : '🖼️ 分享卡片' }}
        </button>
        <button class="retest-btn" @click="goHome">
          🔄 重新测试
        </button>
      </div>

      <!-- 分享引导弹窗 -->
      <div v-if="showShareGuide" class="share-overlay" @click="dismissShareGuide">
        <div class="share-modal" @click.stop>
          <div class="share-close" @click="dismissShareGuide">✕</div>
          <div class="share-modal-icon">🎉</div>
          <h2 class="share-modal-title">结果出来了！</h2>
          <p class="share-modal-desc">生成一张分享卡片发到朋友圈<br/>看看朋友们适合哪种异宠吧！</p>
          <div class="share-modal-actions">
            <button class="share-modal-btn primary" @click="handleShareGuideCard">
              🖼️ 生成分享卡片
            </button>
            <button class="share-modal-btn text" @click="dismissShareGuide">
              下次再说
            </button>
          </div>
        </div>
      </div>

      <!-- 详情弹窗 -->
      <van-action-sheet v-model:show="detailSheet" :round="true">
        <div v-if="detailPet" class="detail-sheet">
          <div class="detail-image">
            <img :src="detailImgSrc" :alt="detailPet.name" @error="imgErr" />
            <button class="toggle-style-btn" @click="togglePetStyle">
              {{ showRealistic ? '🎨 卡通' : '📷 真实' }}
            </button>
          </div>
          <h2 class="detail-name">{{ detailPet.name }}</h2>
          <div class="detail-title">{{ detailPet.title }}</div>
          <div class="detail-match-badge">
            匹配度 <strong>{{ detailPet.similarity }}%</strong>
          </div>

          <!-- 标签切换 -->
          <div class="detail-tabs">
            <span
              class="tab"
              :class="{ active: detailTab === 'intro' }"
              @click="detailTab = 'intro'"
            >📖 简介</span>
            <span
              class="tab"
              :class="{ active: detailTab === 'care' }"
              @click="detailTab = 'care'"
            >📋 饲养档案</span>
          </div>

          <!-- 简介标签 -->
          <div v-show="detailTab === 'intro'">
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
          </div>

          <!-- 饲养档案标签 -->
          <div v-show="detailTab === 'care'">
            <div v-if="careGuide" class="care-guide">
              <div class="care-item">
                <div class="care-label">🌡️ 环境要求</div>
                <div class="care-value">{{ careGuide.environment }}</div>
              </div>
              <div class="care-item">
                <div class="care-label">🍽️ 喂食指南</div>
                <div class="care-value">{{ careGuide.feeding }}</div>
              </div>
              <div class="care-item">
                <div class="care-label">🧹 日常维护</div>
                <div class="care-value">{{ careGuide.maintenance }}</div>
              </div>
              <div class="care-item">
                <div class="care-label">💡 新手贴士</div>
                <div class="care-value care-tips">{{ careGuide.tips }}</div>
              </div>
              <div class="care-item">
                <div class="care-label">⚠️ 常见问题</div>
                <div class="care-value care-warn">{{ careGuide.commonIssues }}</div>
              </div>
            </div>
            <div v-else class="care-empty">
              饲养档案加载中...
            </div>
          </div>
        </div>
      </van-action-sheet>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { matchPets, getUserProfile } from '../utils/match.js'
import { generateShareCard } from '../utils/shareCard.js'
import careGuides from '../data/careGuides.js'
import { showToast, showLoadingToast, closeToast } from 'vant'

const router = useRouter()
const hasResult = ref(false)
const allRanked = ref([])
const userTags = ref([])
const detailSheet = ref(false)
const detailPet = ref(null)
const detailTab = ref('intro')
const showFullRank = ref(false)

const careGuide = computed(() => {
  if (!detailPet.value || !detailPet.value.id) return null
  return careGuides[detailPet.value.id] || null
})
const cardLoading = ref(false)
const showShareGuide = ref(false)
const showRealistic = ref(false)
let shareGuideTimer = null

const detailImgSrc = computed(() => {
  if (!detailPet.value || !detailPet.value.id) return ''
  if (showRealistic.value) {
    return `/images/realistic/${detailPet.value.id}.jpg`
  }
  return detailPet.value.image
})

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
  detailTab.value = 'intro'
  showRealistic.value = false
  detailSheet.value = true
}

function togglePetStyle() {
  showRealistic.value = !showRealistic.value
}

async function generateCard() {
  const pet = topPick.value
  if (!pet || !pet.id) return

  cardLoading.value = true
  showLoadingToast({ message: '生成分享卡片...', forbidClick: true })

  try {
    const blob = await generateShareCard(pet, userTags.value)
    closeToast()

    // 尝试用 Web Share API 分享图片
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], 'exotic-pet-test.png', { type: 'image/png' })
      try {
        await navigator.share({
          title: '我的异宠人格测试结果',
          text: `最适合我的是「${pet.name}」`,
          files: [file]
        })
        return
      } catch (e) {
        // 分享取消或失败，走下载
      }
    }

    // 下载图片（手机端长按可保存）
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `异宠人格-${pet.name}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showToast('卡片已保存，快去分享到朋友圈吧！')
  } catch (e) {
    closeToast()
    showToast('生成失败，请重试')
    console.error('Card generation error:', e)
  } finally {
    cardLoading.value = false
  }
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
    navigator.clipboard.writeText(text + ' ' + window.location.origin).then(() => {
      showToast('已复制到剪贴板，快去分享给朋友吧！')
    }).catch(() => {
      showToast('分享失败，请手动复制')
    })
  }
}

// 图片加载失败时替换为纯色占位
const placeHolderSvg = () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#1a1a2e" rx="16"/></svg>'
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}
function imgErr(e) {
  const img = e.target
  if (img.src.includes('data:image/svg')) return
  img.src = placeHolderSvg()
}

function dismissShareGuide() {
  showShareGuide.value = false
}

async function handleShareGuideCard() {
  showShareGuide.value = false
  await generateCard()
  // 生成完后延迟再弹一次（让用户知道可以分享）
  setTimeout(() => {
    if (!cardLoading.value) {
      showToast('长按图片可保存到相册，快去发朋友圈吧！')
    }
  }, 1000)
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
      // 延迟弹出分享引导
      shareGuideTimer = setTimeout(() => {
        if (hasResult.value) {
          showShareGuide.value = true
        }
      }, 1500)
    } catch (e) {
      console.error('解析答案失败', e)
    }
  }
})

onBeforeUnmount(() => {
  if (shareGuideTimer) clearTimeout(shareGuideTimer)
})
</script>

<style scoped>
/* ===== 入场动画 ===== */
.anim-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeUp 0.6s ease forwards;
}
.a-delay-1 { animation-delay: 0.1s; }
.a-delay-2 { animation-delay: 0.3s; }
.a-delay-3 { animation-delay: 0.5s; }
.a-delay-4 { animation-delay: 0.7s; }
.a-delay-5 { animation-delay: 0.9s; }

@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}

/* ===== 分享引导弹窗 ===== */
.share-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  backdrop-filter: blur(4px);
  animation: overlayIn 0.3s ease;
}
@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.share-modal {
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 36px 28px 28px;
  max-width: 340px;
  width: 100%;
  text-align: center;
  position: relative;
  animation: modalPop 0.4s ease;
}
@keyframes modalPop {
  from { transform: scale(0.85); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.share-close {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 20px;
  color: var(--text-muted);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.share-close:active {
  background: rgba(255, 255, 255, 0.06);
}
.share-modal-icon {
  font-size: 56px;
  margin-bottom: 12px;
}
.share-modal-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.share-modal-desc {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 24px;
}
.share-modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.share-modal-btn {
  border: none;
  border-radius: 14px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}
.share-modal-btn.primary {
  background: linear-gradient(135deg, #7c6cf0, #5a4ad8);
  color: white;
  box-shadow: 0 8px 32px rgba(124, 108, 240, 0.3);
}
.share-modal-btn.primary:active {
  transform: scale(0.97);
}
.share-modal-btn.text {
  background: transparent;
  color: var(--text-muted);
  font-size: 14px;
  padding: 8px;
}
.share-modal-btn.text:active {
  color: var(--text-secondary);
}

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

.top-image {
  width: 200px;
  height: 200px;
  margin: 0 auto 16px;
  border-radius: 16px;
  overflow: hidden;
}
.top-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
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
.pet-thumb {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}
.pet-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
.rank-thumb {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}
.rank-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
.card-btn {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-secondary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 14px;
  font-size: 15px;
  cursor: pointer;
}
.card-btn:active:not(:disabled) {
  transform: scale(0.97);
  background: rgba(255, 255, 255, 0.1);
}
.card-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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

.detail-image {
  width: 240px;
  height: 240px;
  margin: 0 auto 12px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}
.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.toggle-style-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(15, 15, 15, 0.75);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.25s ease;
}
.toggle-style-btn:active {
  transform: scale(0.94);
  background: rgba(15, 15, 15, 0.9);
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

/* 详情标签切换 */
.detail-tabs {
  display: flex;
  gap: 0;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 20px;
}
.tab {
  flex: 1;
  text-align: center;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.tab.active {
  background: rgba(124, 108, 240, 0.15);
  color: #9b8ff5;
}

/* 饲养档案 */
.care-guide {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.care-item {
  text-align: left;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 14px 16px;
}
.care-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.care-value {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
}
.care-tips {
  color: #4ade80;
}
.care-warn {
  color: #f0a86c;
}
.care-empty {
  padding: 40px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
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
