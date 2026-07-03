<template>
  <div class="loading-page">
    <!-- 阶段一：分析进度条 -->
    <div v-if="phase === 'analyzing'" class="phase-analyze">
      <div class="analyze-content">
        <div class="analyze-icon">🔮</div>
        <h2 class="analyze-title">正在分析你的异宠人格...</h2>

        <div class="analyze-bar-wrap">
          <div class="analyze-bar">
            <div class="analyze-fill" :style="{ width: analyzeProgress + '%' }"></div>
          </div>
          <span class="analyze-percent">{{ analyzeProgress }}%</span>
        </div>

        <p class="analyze-hint">{{ analyzeHints[currentHint] }}</p>
      </div>
    </div>

    <!-- 阶段二：结果已生成 + 广告解锁 -->
    <div v-else class="phase-ad">
      <div class="result-badge">
        <div class="badge-icon">🎉</div>
        <h2 class="badge-title">结果已生成！</h2>
        <p class="badge-desc">看完下方广告即可免费解锁</p>
      </div>

      <!-- 模拟视频广告 -->
      <div class="ad-container">
        <!-- 视频区域 -->
        <div class="video-player">
          <div class="video-overlay">
            <div class="video-icon">📺</div>
            <p class="video-title">异宠饲养小课堂</p>
            <p class="video-sub">广告 | 剩余 {{ adCountdown }}s</p>
          </div>
          <div class="video-progress-bar">
            <div class="video-progress-fill" :style="{ width: adProgress + '%' }"></div>
          </div>
        </div>

        <!-- 广告倒计时环形 -->
        <div class="ad-timer-ring">
          <svg class="timer-svg" viewBox="0 0 100 100">
            <circle class="timer-bg" cx="50" cy="50" r="42" />
            <circle
              class="timer-fill"
              cx="50" cy="50" r="42"
              :style="{
                strokeDasharray: circumference,
                strokeDashoffset: circumference * (1 - adProgress / 100)
              }"
            />
          </svg>
          <div class="timer-text">
            <span class="timer-num">{{ adCountdown }}</span>
            <span class="timer-unit">秒</span>
          </div>
        </div>

        <p class="ad-note">观看完整广告后即可免费查看结果</p>
      </div>

      <!-- 解锁按钮 -->
      <button
        class="unlock-btn"
        :class="{ ready: adFinished }"
        :disabled="!adFinished"
        @click="goToResult"
      >
        {{ adFinished ? '✨ 免费查看结果' : '⏳ 观看广告中...' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 阶段控制
const phase = ref('analyzing')
const analyzeProgress = ref(0)
const currentHint = ref(0)
let analyzeTimer = null

const analyzeHints = [
  '正在匹配你的性格维度...',
  '分析居住环境适配度...',
  '计算消费能力区间...',
  '评估饲养经验水平...',
  '正在加载神秘异宠数据库...',
  '即将揭晓你的天选异宠！'
]

// 广告倒计时
const adCountdown = ref(30)
const adProgress = ref(0)
const adFinished = ref(false)
let adTimer = null
const totalAdSeconds = 30

const circumference = computed(() => 2 * Math.PI * 42)

// 阶段一：分析进度条动画
function startAnalyzing() {
  let progress = 0
  analyzeTimer = setInterval(() => {
    progress += Math.random() * 8 + 3
    if (progress >= 100) {
      progress = 100
      clearInterval(analyzeTimer)
      setTimeout(() => {
        phase.value = 'ad'
        startAdCountdown()
      }, 400)
    }
    analyzeProgress.value = Math.min(100, Math.round(progress))

    // 轮换提示语
    if (progress > 20 && currentHint.value < 1) currentHint.value = 1
    if (progress > 40 && currentHint.value < 2) currentHint.value = 2
    if (progress > 60 && currentHint.value < 3) currentHint.value = 3
    if (progress > 75 && currentHint.value < 4) currentHint.value = 4
    if (progress > 90 && currentHint.value < 5) currentHint.value = 5
  }, 150)
}

// 阶段二：广告倒计时
function startAdCountdown() {
  let remaining = totalAdSeconds
  adProgress.value = 0
  adCountdown.value = remaining

  adTimer = setInterval(() => {
    remaining--
    if (remaining <= 0) {
      remaining = 0
      clearInterval(adTimer)
      adFinished.value = true
    }
    adCountdown.value = remaining
    adProgress.value = ((totalAdSeconds - remaining) / totalAdSeconds) * 100
  }, 1000)
}

function goToResult() {
  router.push('/result')
}

onMounted(() => {
  startAnalyzing()
})

onBeforeUnmount(() => {
  if (analyzeTimer) clearInterval(analyzeTimer)
  if (adTimer) clearInterval(adTimer)
})
</script>

<style scoped>
.loading-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%);
  padding: 40px 24px;
  position: relative;
  overflow: hidden;
}

/* ===== 阶段一：分析中 ===== */
.phase-analyze {
  width: 100%;
  max-width: 360px;
  text-align: center;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.analyze-icon {
  font-size: 64px;
  margin-bottom: 24px;
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.analyze-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 32px;
}

.analyze-bar-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.analyze-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  overflow: hidden;
}
.analyze-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: 8px;
  transition: width 0.15s ease;
}

.analyze-percent {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary);
  min-width: 48px;
  text-align: right;
}

.analyze-hint {
  font-size: 14px;
  color: var(--text-muted);
  height: 20px;
  transition: all 0.3s ease;
}

/* ===== 阶段二：广告解锁 ===== */
.phase-ad {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.6s ease;
}

.result-badge {
  text-align: center;
  margin-bottom: 32px;
}

.badge-icon {
  font-size: 48px;
  margin-bottom: 12px;
  animation: bounceIn 0.6s ease;
}
@keyframes bounceIn {
  0% { transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.badge-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.badge-desc {
  font-size: 14px;
  color: var(--text-muted);
}

.ad-container {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  text-align: center;
}

.video-player {
  background: #000;
  border-radius: 12px;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}
.video-overlay {
  text-align: center;
}
.video-icon {
  font-size: 40px;
  margin-bottom: 8px;
}
.video-title {
  font-size: 16px;
  color: #fff;
  font-weight: 500;
  margin-bottom: 4px;
}
.video-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.video-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.15);
}
.video-progress-fill {
  height: 100%;
  background: var(--primary);
  transition: width 1s linear;
}

.ad-timer-ring {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
}
.timer-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.timer-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 6;
}
.timer-fill {
  fill: none;
  stroke: var(--primary);
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
}
.timer-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.timer-num {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}
.timer-unit {
  font-size: 12px;
  color: var(--text-muted);
}

.ad-note {
  font-size: 13px;
  color: var(--text-muted);
}

.unlock-btn {
  width: 100%;
  max-width: 380px;
  border: none;
  border-radius: 14px;
  padding: 18px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;

  background: rgba(255, 255, 255, 0.06);
  color: var(--text-muted);
  cursor: not-allowed;
}
.unlock-btn.ready {
  background: linear-gradient(135deg, #7c6cf0, #5a4ad8);
  color: white;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(124, 108, 240, 0.3);
}
.unlock-btn.ready:active {
  transform: scale(0.97);
}
</style>
