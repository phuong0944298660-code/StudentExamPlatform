<template>
  <div class="dashboard-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div>
        <h1 class="page-title">看板概览</h1>
        <p class="page-subtitle">欢迎回来，管理员！以下是系统实时数据概览</p>
      </div>
      <div class="page-actions">
        <el-button type="primary" @click="refreshData">
          <el-icon class="mr-2"><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card card-hover">
          <div class="stat-icon blue">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalAccounts }}</div>
            <div class="stat-label">总账号数</div>
          </div>
          <div class="stat-trend up">
            <el-icon><ArrowUp /></el-icon>
            <span>+12%</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card card-hover">
          <div class="stat-icon green">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 17L15 12L10 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 12H3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.todayLogin }}</div>
            <div class="stat-label">今日登录</div>
          </div>
          <div class="stat-trend up">
            <el-icon><ArrowUp /></el-icon>
            <span>+8%</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card card-hover">
          <div class="stat-icon orange">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="15" r="1" fill="white"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.activeSessions }}</div>
            <div class="stat-label">进行中场次</div>
          </div>
          <div class="stat-trend">
            <span>实时</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card card-hover">
          <div class="stat-icon purple">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6.5 2H20V20H6.5A2.5 2.5 0 0 1 4 17.5V4.5A2.5 2.5 0 0 1 6.5 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 7V13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 10H15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.pendingReviews }}</div>
            <div class="stat-label">待阅试卷</div>
          </div>
          <div class="stat-trend down">
            <el-icon><ArrowDown /></el-icon>
            <span>-5%</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 主要内容区 -->
    <el-row :gutter="20" class="main-content">
      <!-- 左侧：图表和场次状态 -->
      <el-col :span="16">
        <!-- 场次状态 -->
        <el-card class="section-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">考试场次状态</span>
              <el-button text type="primary" @click="$router.push('/admin/sessions')">
                查看全部
                <el-icon class="ml-1"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </template>
          <el-table :data="examSessions" style="width: 100%">
            <el-table-column prop="sessionName" label="场次名称" min-width="180" />
            <el-table-column prop="stage" label="学段" width="100">
              <template #default="{ row }">
                <el-tag :type="row.stage === 'PRIMARY' ? 'success' : 'warning'" size="small">
                  {{ row.stage === 'PRIMARY' ? '小学' : '初中' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间" width="160">
              <template #default="{ row }">
                {{ formatDate(row.startTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <status-tag :status="row.status" />
              </template>
            </el-table-column>
            <el-table-column prop="candidateCount" label="考生数" width="80" align="center" />
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="viewSession(row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 快捷操作 -->
        <el-card class="section-card mt-4">
          <template #header>
            <div class="card-header">
              <span class="card-title">赛前准备快捷入口</span>
            </div>
          </template>
          <div class="quick-actions">
            <!-- 导入名单 -->
            <div class="quick-action-item card-hover" @click="$router.push('/admin/import')">
              <div class="action-icon blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M17 8L12 3L7 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 3V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="action-info">
                <div class="action-title">导入名单</div>
                <div class="action-desc">批量导入学生/教师信息</div>
              </div>
              <el-icon class="action-arrow"><ArrowRight /></el-icon>
            </div>
            <!-- 生成激活码 -->
            <div class="quick-action-item card-hover" @click="$router.push('/admin/activation')">
              <div class="action-icon green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10C21 10 18 17 12 17C6 17 3 10 3 10C3 10 6 3 12 3C18 3 21 10 21 10Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="action-info">
                <div class="action-title">生成激活码</div>
                <div class="action-desc">创建新的激活码批次</div>
              </div>
              <el-icon class="action-arrow"><ArrowRight /></el-icon>
            </div>
            <!-- 创建场次 -->
            <div class="quick-action-item card-hover" @click="$router.push('/admin/sessions')">
              <div class="action-icon orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="action-info">
                <div class="action-title">创建场次</div>
                <div class="action-desc">配置新的考试场次</div>
              </div>
              <el-icon class="action-arrow"><ArrowRight /></el-icon>
            </div>
            <!-- 组卷管理 -->
            <div class="quick-action-item card-hover" @click="$router.push('/admin/question-bank/paper')">
              <div class="action-icon purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="action-info">
                <div class="action-title">组卷管理</div>
                <div class="action-desc">配置考试/练习试卷</div>
              </div>
              <el-icon class="action-arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：待办和动态 -->
      <el-col :span="8">
        <!-- 待办任务 -->
        <el-card class="section-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                待办任务
                <el-badge :value="todoList.length" class="ml-2" />
              </span>
            </div>
          </template>
          <div class="todo-list">
            <div 
              v-for="todo in todoList" 
              :key="todo.id"
              class="todo-item"
              :class="`priority-${todo.priority}`"
            >
              <div class="todo-dot"></div>
              <div class="todo-content">
                <div class="todo-title">{{ todo.title }}</div>
                <div class="todo-meta">
                  <span class="todo-deadline">
                    <el-icon><Clock /></el-icon>
                    {{ todo.deadline }}
                  </span>
                  <el-tag :type="getPriorityType(todo.priority)" size="small">
                    {{ getPriorityLabel(todo.priority) }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 最近动态 -->
        <el-card class="section-card mt-4">
          <template #header>
            <div class="card-header">
              <span class="card-title">最近动态</span>
            </div>
          </template>
          <div class="activity-list">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-icon" :class="activity.type">
                <el-icon>
                  <component :is="getActivityIcon(activity.type)" />
                </el-icon>
              </div>
              <div class="activity-content">
                <div class="activity-text">{{ activity.content }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StatusTag from '../../../components/common/StatusTag.vue'
import { 
  mockDashboardStats, 
  mockExamSessions, 
  mockTodoList, 
  mockRecentActivities 
} from '../../../mock/admin'
import type { DashboardStats, ExamSession } from '../../../types'

const router = useRouter()

// 统计数据
const stats = ref<DashboardStats>(mockDashboardStats)
const examSessions = ref<ExamSession[]>(mockExamSessions.slice(0, 4))
const todoList = ref(mockTodoList)
const recentActivities = ref(mockRecentActivities)



// 刷新数据
const refreshData = () => {
  // 模拟刷新
  stats.value = { ...mockDashboardStats }
}

// 查看场次详情
const viewSession = (row: ExamSession) => {
  router.push(`/admin/sessions`)
}

// 格式化日期
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取优先级类型
const getPriorityType = (priority: string) => {
  const map: Record<string, string> = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return map[priority] || 'info'
}

// 获取优先级标签
const getPriorityLabel = (priority: string) => {
  const map: Record<string, string> = {
    high: '紧急',
    medium: '普通',
    low: '低'
  }
  return map[priority] || priority
}

// 获取活动图标
const getActivityIcon = (type: string) => {
  const map: Record<string, string> = {
    session: 'Calendar',
    import: 'Upload',
    paper: 'DocumentCopy',
    activation: 'Key',
    review: 'Reading'
  }
  return map[type] || 'InfoFilled'
}

onMounted(() => {
  // 页面加载时的初始化
})
</script>

<style scoped>
.dashboard-page {
  padding-bottom: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #64748B;
  margin: 0;
}

.page-actions {
  display: flex;
  gap: 12px;
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-icon.blue { background: linear-gradient(135deg, #3B82F6, #6366F1); }
.stat-icon.green { background: linear-gradient(135deg, #10B981, #059669); }
.stat-icon.orange { background: linear-gradient(135deg, #F59E0B, #D97706); }
.stat-icon.purple { background: linear-gradient(135deg, #8B5CF6, #7C3AED); }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1E293B;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #64748B;
  margin-top: 4px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.stat-trend.up {
  color: #10B981;
}

.stat-trend.down {
  color: #EF4444;
}

.main-content {
  margin-top: 0;
}

.section-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.quick-action-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-action-item:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.action-icon.blue { background: linear-gradient(135deg, #3B82F6, #6366F1); }
.action-icon.green { background: linear-gradient(135deg, #10B981, #059669); }
.action-icon.orange { background: linear-gradient(135deg, #F59E0B, #D97706); }
.action-icon.purple { background: linear-gradient(135deg, #8B5CF6, #7C3AED); }

.action-info {
  flex: 1;
}

.action-title {
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 4px;
}

.action-desc {
  font-size: 12px;
  color: #64748B;
}

.action-arrow {
  color: #94a3b8;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.todo-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f8fafc;
}

.todo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.priority-high .todo-dot { background: #EF4444; }
.priority-medium .todo-dot { background: #F59E0B; }
.priority-low .todo-dot { background: #3B82F6; }

.todo-content {
  flex: 1;
}

.todo-title {
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
  margin-bottom: 8px;
}

.todo-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.todo-deadline {
  font-size: 12px;
  color: #64748B;
  display: flex;
  align-items: center;
  gap: 4px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #64748B;
  flex-shrink: 0;
}

.activity-icon.session { color: #3B82F6; background: rgba(59, 130, 246, 0.1); }
.activity-icon.import { color: #10B981; background: rgba(16, 185, 129, 0.1); }
.activity-icon.paper { color: #8B5CF6; background: rgba(139, 92, 246, 0.1); }
.activity-icon.activation { color: #F59E0B; background: rgba(245, 158, 11, 0.1); }
.activity-icon.review { color: #EF4444; background: rgba(239, 68, 68, 0.1); }

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  color: #1E293B;
  line-height: 1.5;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #94a3b8;
}

.mt-4 {
  margin-top: 16px;
}

.mr-2 {
  margin-right: 8px;
}

.ml-1 {
  margin-left: 4px;
}

.ml-2 {
  margin-left: 8px;
}
</style>
