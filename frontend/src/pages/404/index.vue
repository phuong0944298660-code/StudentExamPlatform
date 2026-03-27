<template>
  <div class="not-found-page">
    <div class="error-content">
      <div class="error-code">
        <span class="digit">4</span>
        <div class="zero">
          <div class="face">
            <div class="eyes">
              <div class="eye"></div>
              <div class="eye"></div>
            </div>
            <div class="mouth"></div>
          </div>
        </div>
        <span class="digit">4</span>
      </div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-desc">抱歉，您访问的页面不存在或已被移除</p>
      <div class="error-actions">
        <el-button type="primary" size="large" @click="goBack">
          <el-icon class="mr-2"><Back /></el-icon>
          返回上一页
        </el-button>
        <el-button size="large" @click="goHome">
          <el-icon class="mr-2"><HomeFilled /></el-icon>
          返回首页
        </el-button>
      </div>
    </div>
    
    <!-- 装饰元素 -->
    <div class="decoration">
      <div class="circle c1"></div>
      <div class="circle c2"></div>
      <div class="circle c3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  overflow: hidden;
}

.error-content {
  text-align: center;
  z-index: 1;
}

.error-code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 32px;
}

.digit {
  font-size: 120px;
  font-weight: 800;
  background: linear-gradient(135deg, #3B82F6, #6366F1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.zero {
  width: 100px;
  height: 120px;
  border: 8px solid #3B82F6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.face {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.eyes {
  display: flex;
  gap: 20px;
}

.eye {
  width: 12px;
  height: 12px;
  background: #3B82F6;
  border-radius: 50%;
  animation: blink 4s ease-in-out infinite;
}

@keyframes blink {
  0%, 48%, 52%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.1); }
}

.mouth {
  width: 24px;
  height: 12px;
  border: 3px solid #3B82F6;
  border-top: none;
  border-radius: 0 0 24px 24px;
}

.error-title {
  font-size: 32px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 12px 0;
}

.error-desc {
  font-size: 16px;
  color: #64748B;
  margin: 0 0 32px 0;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.5;
}

.c1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #3B82F6, #6366F1);
  top: -200px;
  right: -100px;
  filter: blur(100px);
}

.c2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #10B981, #059669);
  bottom: -100px;
  left: -100px;
  filter: blur(80px);
}

.c3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #F59E0B, #D97706);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: blur(60px);
  opacity: 0.3;
}

.mr-2 {
  margin-right: 8px;
}
</style>
