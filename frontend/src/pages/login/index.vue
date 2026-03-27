<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 左侧装饰区 -->
      <div class="login-left">
        <div class="brand-section">
          <div class="logo">
            <el-icon :size="48" color="#3B82F6"><School /></el-icon>
          </div>
          <h1 class="brand-title">接力教育智慧云平台</h1>
          <p class="brand-subtitle">题库与考试管理系统</p>
        </div>
        <div class="features">
          <div class="feature-item">
            <el-icon :size="24" color="#10B981"><CircleCheck /></el-icon>
            <span>高并发考试支持</span>
          </div>
          <div class="feature-item">
            <el-icon :size="24" color="#10B981"><CircleCheck /></el-icon>
            <span>智能组卷与阅卷</span>
          </div>
          <div class="feature-item">
            <el-icon :size="24" color="#10B981"><CircleCheck /></el-icon>
            <span>完善的成绩管理</span>
          </div>
        </div>
        <div class="decoration">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        </div>
      </div>

      <!-- 右侧登录区 -->
      <div class="login-right">
        <div class="login-form-wrapper">
          <h2 class="form-title">管理员登录</h2>
          <p class="form-subtitle">请输入您的账号和密码</p>
          
          <el-form 
            :model="loginForm" 
            :rules="rules" 
            ref="formRef"
            class="login-form"
            @keyup.enter="handleLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                size="large"
                :prefix-icon="User"
                clearable
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                :prefix-icon="Lock"
                show-password
                clearable
              />
            </el-form-item>
            <el-form-item>
              <div class="form-options">
                <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
                <el-button link type="primary">忘记密码?</el-button>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="login-btn"
                :loading="loading"
                @click="handleLogin"
              >
                登 录
              </el-button>
            </el-form-item>
          </el-form>

          <div class="role-switch">
            <span>其他角色入口：</span>
            <el-button link type="primary">教师端</el-button>
            <el-divider direction="vertical" />
            <el-button link type="primary">评卷端</el-button>
            <el-divider direction="vertical" />
            <el-button link type="primary">学生端</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="login-footer">
      <p>© 2026 接力教育智慧云平台 版权所有</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: '123456',
  remember: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  // 模拟登录请求
  setTimeout(() => {
    localStorage.setItem('token', 'mock-token-' + Date.now())
    ElMessage.success('登录成功')
    router.push('/admin/dashboard')
    loading.value = false
  }, 1000)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%);
}

.login-container {
  flex: 1;
  display: flex;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px;
}

.login-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  position: relative;
  overflow: hidden;
}

.brand-section {
  position: relative;
  z-index: 1;
}

.logo {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px rgba(59, 130, 246, 0.2);
  margin-bottom: 32px;
}

.brand-title {
  font-size: 36px;
  font-weight: 700;
  color: #1E293B;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.brand-subtitle {
  font-size: 18px;
  color: #64748B;
  margin: 0 0 48px 0;
}

.features {
  position: relative;
  z-index: 1;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 16px;
  color: #334155;
}

.decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #3B82F6, #6366F1);
  top: -100px;
  right: -50px;
  filter: blur(60px);
}

.circle-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #10B981, #059669);
  bottom: 100px;
  right: 100px;
  filter: blur(40px);
}

.circle-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #F59E0B, #D97706);
  bottom: -50px;
  left: 50px;
  filter: blur(30px);
}

.login-right {
  width: 460px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form-wrapper {
  width: 100%;
  background: white;
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 28px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 8px 0;
}

.form-subtitle {
  font-size: 14px;
  color: #64748B;
  margin: 0 0 32px 0;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 12px;
  padding: 4px 16px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
}

.login-form :deep(.el-input__inner) {
  height: 48px;
  font-size: 15px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.login-btn {
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 12px;
  background: linear-gradient(135deg, #3B82F6 0%, #6366F1 100%);
  border: none;
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
  transition: all 0.3s;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.5);
}

.role-switch {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  font-size: 14px;
  color: #64748B;
}

.login-footer {
  text-align: center;
  padding: 24px;
  font-size: 14px;
  color: #94a3b8;
}

@media (max-width: 992px) {
  .login-left {
    display: none;
  }
  
  .login-right {
    width: 100%;
  }
}
</style>
