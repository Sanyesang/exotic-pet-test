<template>
  <div class="quiz">
    <!-- 顶部进度 -->
    <div class="quiz-header">
      <div class="progress-info">
        <span class="step-num">{{ currentIndex + 1 }} / {{ questions.length }}</span>
        <span class="step-percent">{{ Math.round(progress) }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- 题目卡片 -->
    <div class="question-area" :key="currentIndex">
      <div class="question-card">
        <div class="question-icon">{{ currentQ.icon }}</div>
        <h2 class="question-title">{{ currentQ.title }}</h2>

        <div class="options">
          <div
            v-for="(option, idx) in currentQ.options"
            :key="idx"
            class="option-item"
            :class="{ selected: selectedIndex === idx }"
            @click="selectOption(idx)"
          >
            <div class="option-radio">
              <div v-if="selectedIndex === idx" class="radio-dot"></div>
            </div>
            <span class="option-label">{{ option.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-bar">
      <button
        class="next-btn"
        :class="{ disabled: selectedIndex === null }"
        :disabled="selectedIndex === null"
        @click="nextQuestion"
      >
        {{ isLast ? '查看结果' : '下一题' }}
        <span class="next-arrow">→</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import questions from '../data/questions.js'

const router = useRouter()
const currentIndex = ref(0)
const selectedIndex = ref(null)
const answers = ref([])

const currentQ = computed(() => questions[currentIndex.value])
const progress = computed(() => ((currentIndex.value) / questions.length) * 100)
const isLast = computed(() => currentIndex.value === questions.length - 1)

function selectOption(idx) {
  selectedIndex.value = idx
}

function nextQuestion() {
  if (selectedIndex.value === null) return

  // 保存当前答案
  answers.value.push({
    questionId: currentQ.value.id,
    scores: currentQ.value.options[selectedIndex.value].scores
  })

  if (isLast.value) {
    // 将答案传给结果页
    router.push({
      path: '/loading',
      query: { t: Date.now() }
    })
    // 用 sessionStorage 传递答案
    sessionStorage.setItem('quiz_answers', JSON.stringify(answers.value))
  } else {
    currentIndex.value++
    selectedIndex.value = null
    // 滑动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.quiz {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%);
  padding: 20px 20px 100px;
}

.quiz-header {
  margin-bottom: 24px;
  padding-top: 20px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: var(--text-secondary);
}
.step-percent {
  color: var(--primary);
  font-weight: 600;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: 4px;
  transition: width 0.5s ease;
}

.question-area {
  flex: 1;
  display: flex;
  align-items: flex-start;
  animation: fadeInUp 0.4s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.question-card {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 32px 24px;
}

.question-icon {
  font-size: 48px;
  text-align: center;
  margin-bottom: 20px;
}

.question-title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 28px;
  color: var(--text-primary);
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 16px 18px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.option-item:active {
  transform: scale(0.98);
}
.option-item.selected {
  border-color: var(--primary);
  background: rgba(124, 108, 240, 0.08);
  box-shadow: 0 0 20px rgba(124, 108, 240, 0.1);
}

.option-radio {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.25s ease;
}
.option-item.selected .option-radio {
  border-color: var(--primary);
  background: var(--primary);
}
.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.option-label {
  font-size: 16px;
  color: var(--text-primary);
  line-height: 1.4;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px 20px 30px;
  background: linear-gradient(0deg, #1a1a2e 60%, transparent);
  z-index: 10;
}

.next-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #7c6cf0, #5a4ad8);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}
.next-btn:active:not(.disabled) {
  transform: scale(0.97);
}
.next-btn.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.next-arrow {
  font-size: 20px;
}
</style>
