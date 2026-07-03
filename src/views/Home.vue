<template>
  <div class="home">
    <div class="bg-decoration">
      <div class="circle c1"></div>
      <div class="circle c2"></div>
      <div class="circle c3"></div>
    </div>

    <div class="content">
      <!-- Logo / 标题区 -->
      <div class="header-section">
        <div class="logo-icon">🦎</div>
        <h1 class="title">异宠人格测试</h1>
        <p class="subtitle">15道题测出你的天选异宠伴侣</p>
      </div>

      <!-- 特征卡片 -->
      <div class="features">
        <div class="feature-item">
          <span class="feature-icon">🧬</span>
          <span>性格×环境×MBTI全维度匹配</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🎯</span>
          <span>精准推荐最适合你的异宠</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🔄</span>
          <span>分享给朋友比比谁的更奇葩</span>
        </div>
      </div>

      <!-- 异宠预览滚动 -->
      <div class="pet-preview">
        <div class="scroll-row">
          <span v-for="pet in previewPets" :key="pet.id" class="pet-chip">
            {{ pet.emoji }} {{ pet.name }}
          </span>
        </div>
      </div>

      <!-- 开始按钮 -->
      <div class="action-section">
        <button class="start-btn" @click="startQuiz">
          <span class="btn-text">开始测试</span>
          <span class="btn-icon">→</span>
        </button>
        <p class="hint">全程约 2 分钟 · 无需注册</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import pets from '../data/pets.js'

const router = useRouter()

const previewPets = pets.slice(0, 8)

function startQuiz() {
  router.push('/quiz')
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%);
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}
.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}
.c1 {
  width: 300px;
  height: 300px;
  background: #7c6cf0;
  top: -100px;
  right: -80px;
}
.c2 {
  width: 250px;
  height: 250px;
  background: #f0a86c;
  bottom: 100px;
  left: -80px;
}
.c3 {
  width: 200px;
  height: 200px;
  background: #4ade80;
  top: 50%;
  right: -60px;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 24px 60px;
  position: relative;
  z-index: 1;
}

.header-section {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  font-size: 72px;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 0 30px rgba(124, 108, 240, 0.3));
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.title {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #7c6cf0, #f0a86c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  letter-spacing: 1px;
}

.features {
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 14px;
  color: var(--text-secondary);
}

.feature-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.pet-preview {
  margin-bottom: 40px;
  overflow: hidden;
}

.scroll-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 4px 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.scroll-row::-webkit-scrollbar { display: none; }

.pet-chip {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.action-section {
  text-align: center;
}

.start-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #7c6cf0, #5a4ad8);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 18px 48px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(124, 108, 240, 0.3);
  letter-spacing: 2px;
}
.start-btn:active {
  transform: scale(0.96);
  box-shadow: 0 4px 16px rgba(124, 108, 240, 0.2);
}
.btn-icon {
  font-size: 22px;
  transition: transform 0.3s ease;
}
.start-btn:active .btn-icon {
  transform: translateX(4px);
}

.hint {
  margin-top: 16px;
  font-size: 13px;
  color: var(--text-muted);
}
</style>
