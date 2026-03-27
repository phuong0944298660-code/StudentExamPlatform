<template>
  <el-container class="admin-layout">
    <!-- 侧边栏 -->
    <el-aside width="240px" class="admin-sidebar">
      <div class="logo-area">
        <div class="logo-icon">
          <el-icon :size="32" color="#3B82F6"><School /></el-icon>
        </div>
        <div class="logo-text">
          <div class="logo-title">接力教育</div>
          <div class="logo-subtitle">智慧云平台</div>
        </div>
      </div>
      
      <!-- 菜单 -->
      <el-menu
        :default-active="activeMenu"
        class="admin-menu"
        background-color="transparent"
        text-color="#94a3b8"
        active-text-color="#3B82F6"
        router
        :collapse="isCollapse"
      >
        <!-- 总览看板 -->
        <el-menu-item index="/admin/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>看板概览</template>
        </el-menu-item>

        <!-- 账号管理 -->
        <el-sub-menu index="/admin/accounts">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>账号管理</span>
          </template>
          <el-menu-item index="/admin/accounts">账号列表</el-menu-item>
          <el-menu-item index="/admin/accounts/strategy">策略配置</el-menu-item>
        </el-sub-menu>

        <!-- 激活管理 -->
        <el-sub-menu index="/admin/activation">
          <template #title>
            <el-icon><Key /></el-icon>
            <span>激活管理</span>
          </template>
          <el-menu-item index="/admin/activation">码池管理</el-menu-item>
          <el-menu-item index="/admin/activation/records">激活记录</el-menu-item>
        </el-sub-menu>

        <!-- 导入管理 -->
        <el-sub-menu index="/admin/import">
          <template #title>
            <el-icon><Upload /></el-icon>
            <span>导入管理</span>
          </template>
          <el-menu-item index="/admin/import">名单导入</el-menu-item>
          <el-menu-item index="/admin/import/completion">名单补全</el-menu-item>
        </el-sub-menu>

        <!-- 题库管理 -->
        <el-sub-menu index="/admin/question-bank">
          <template #title>
            <el-icon><FolderOpened /></el-icon>
            <span>题库管理</span>
          </template>
          <el-menu-item index="/admin/question-bank">目录管理</el-menu-item>
          <el-menu-item index="/admin/question-bank/paper">组卷管理</el-menu-item>
          <el-menu-item index="/admin/question-bank/questions">题目管理</el-menu-item>
        </el-sub-menu>

        <!-- 场次管理 -->
        <el-sub-menu index="/admin/sessions">
          <template #title>
            <el-icon><Calendar /></el-icon>
            <span>场次管理</span>
          </template>
          <el-menu-item index="/admin/sessions">场次配置</el-menu-item>
          <el-menu-item index="/admin/sessions/monitor">考场监控</el-menu-item>
          <el-menu-item index="/admin/sessions/whitelist">白名单管理</el-menu-item>
        </el-sub-menu>

        <!-- 资源管理 -->
        <el-menu-item index="/admin/resources">
          <el-icon><Collection /></el-icon>
          <template #title>资源管理</template>
        </el-menu-item>

        <!-- 阅卷管理 -->
        <el-sub-menu index="/admin/review">
          <template #title>
            <el-icon><Reading /></el-icon>
            <span>阅卷管理</span>
          </template>
          <el-menu-item index="/admin/review">阅卷任务</el-menu-item>
          <el-menu-item index="/admin/review/recheck">复核管理</el-menu-item>
        </el-sub-menu>

        <!-- 成绩管理 -->
        <el-sub-menu index="/admin/scores">
          <template #title>
            <el-icon><TrendCharts /></el-icon>
            <span>成绩管理</span>
          </template>
          <el-menu-item index="/admin/scores">成绩查询</el-menu-item>
          <el-menu-item index="/admin/scores/export">成绩导出</el-menu-item>
          <el-menu-item index="/admin/scores/publish">成绩发布</el-menu-item>
        </el-sub-menu>

        <!-- 留痕管理 -->
        <el-menu-item index="/admin/audit">
          <el-icon><Clock /></el-icon>
          <template #title>留痕管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container class="main-container">
      <!-- 顶部导航栏 -->
      <el-header class="admin-header" height="64px">
        <div class="header-left">
          <el-button 
            text 
            @click="toggleSidebar"
            class="collapse-btn"
          >
            <el-icon :size="20"><Fold v-if="!isCollapse" /><Expand v-else /></el-icon>
          </el-button>
          <breadcrumb />
        </div>
        <div class="header-right">
          <!-- 搜索 -->
          <el-input
            v-model="searchKeyword"
            placeholder="全局搜索..."
            class="header-search"
            prefix-icon="Search"
            clearable
          />
          <!-- 通知 -->
          <el-badge :value="3" class="header-icon">
            <el-button text>
              <el-icon :size="20"><Bell /></el-icon>
            </el-button>
          </el-badge>
          <!-- 全屏 -->
          <el-button text @click="toggleFullscreen" class="header-icon">
            <el-icon :size="20"><FullScreen /></el-icon>
          </el-button>
          <!-- 用户信息 -->
          <el-dropdown trigger="click">
            <div class="user-info">
              <el-avatar :size="36" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <span class="username">管理员</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 页面内容 -->
      <el-main class="admin-main">
        <router-view v-slot="{ Component }">
          <transition name="slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '../components/common/Breadcrumb.vue'

const route = useRoute()
const router = useRouter()

// 侧边栏折叠状态
const isCollapse = ref(false)
const searchKeyword = ref('')

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 切换侧边栏
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 全屏切换
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 退出登录
const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  overflow: hidden;
}

.admin-sidebar {
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
}

.logo-area {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.logo-text {
  color: white;
}

.logo-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.2;
}

.admin-menu {
  flex: 1;
  border-right: none;
  padding: 12px 0;
}

.admin-menu :deep(.el-menu-item),
.admin-menu :deep(.el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
  margin: 4px 12px;
  border-radius: 8px;
}

.admin-menu :deep(.el-menu-item:hover),
.admin-menu :deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.admin-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #3B82F6 0%, #6366F1 100%) !important;
  color: white !important;
}

.main-container {
  background-color: #F8FAFC;
  display: flex;
  flex-direction: column;
}

.admin-header {
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  padding: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-search {
  width: 240px;
}

.header-search :deep(.el-input__wrapper) {
  border-radius: 20px;
  background-color: #f1f5f9;
  box-shadow: none;
}

.header-icon {
  padding: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f1f5f9;
}

.username {
  font-size: 14px;
  color: #1E293B;
  font-weight: 500;
}

.admin-main {
  padding: 24px;
  overflow-y: auto;
}

/* 过渡动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
