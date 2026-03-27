<template>
  <div class="monitor-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">考场监控</h1>
        <p class="page-subtitle">实时监控考试进行状态，支持全场延时和强制收卷</p>
      </div>
      <div class="page-actions">
        <el-button :type="isAutoRefresh ? 'success' : 'default'" @click="toggleAutoRefresh">
          <el-icon class="mr-2"><Refresh /></el-icon>
          {{ isAutoRefresh ? '自动刷新中' : '自动刷新' }}
        </el-button>
      </div>
    </div>

    <!-- 监控统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <div class="stat-card blue">
          <div class="stat-icon"><el-icon :size="32"><User /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ monitorStats.total }}</div>
            <div class="stat-label">考生总数</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card green">
          <div class="stat-icon"><el-icon :size="32"><VideoPlay /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ monitorStats.online }}</div>
            <div class="stat-label">在线考生</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card orange">
          <div class="stat-icon"><el-icon :size="32"><CircleCheck /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ monitorStats.submitted }}</div>
            <div class="stat-label">已交卷</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card red">
          <div class="stat-icon"><el-icon :size="32"><Warning /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ monitorStats.abnormal }}</div>
            <div class="stat-label">异常掉线</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 进行中场次 -->
    <el-card class="session-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon class="mr-2"><VideoCamera /></el-icon>
            进行中场次
          </span>
          <el-select v-model="selectedSession" placeholder="选择场次" style="width: 200px">
            <el-option 
              v-for="session in activeSessions" 
              :key="session.id" 
              :label="session.sessionName" 
              :value="session.id" 
            />
          </el-select>
        </div>
      </template>
      
      <div v-if="selectedSession" class="session-detail">
        <div class="detail-header">
          <div class="session-title">{{ currentSession?.sessionName }}</div>
          <div class="countdown">
            <span class="countdown-label">剩余时间：</span>
            <span class="countdown-value" :class="{ warning: remainingMinutes < 10 }">
              {{ formatCountdown(remainingMinutes) }}
            </span>
          </div>
        </div>
        
        <el-progress 
          :percentage="submitProgress" 
          :stroke-width="20"
          :format="() => `${monitorStats.submitted}/${monitorStats.total}`"
          class="submit-progress"
        />
        
        <div class="action-buttons">
          <el-button type="warning" @click="extendAllTime">
            <el-icon class="mr-2"><Timer /></el-icon>
            全场延时
          </el-button>
          <el-button type="danger" @click="forceCloseAll">
            <el-icon class="mr-2"><CircleClose /></el-icon>
            强制收卷
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 实时考生状态 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">实时考生状态</span>
          <div class="header-filters">
            <el-radio-group v-model="statusFilter" size="small">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="online">在线</el-radio-button>
              <el-radio-button label="submitted">已交卷</el-radio-button>
              <el-radio-button label="abnormal">异常</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>
      
      <el-table :data="filteredCandidates" stripe v-loading="loading">
        <el-table-column prop="id" label="序号" width="70" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="idCard" label="身份证号" min-width="180" />
        <el-table-column prop="loginTime" label="登录时间" width="160" />
        <el-table-column prop="progress" label="答题进度" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :status="row.status === 'submitted' ? 'success' : ''" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">查看</el-button>
            <el-button link type="warning" @click="extendSingleTime(row)">补时</el-button>
            <el-button link type="danger" @click="forceSubmit(row)">强制交卷</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, prev, pager, next"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const isAutoRefresh = ref(true)
const selectedSession = ref(1)
const statusFilter = ref('all')
const remainingMinutes = ref(45)

const monitorStats = reactive({
  total: 500,
  online: 480,
  submitted: 320,
  abnormal: 5
})

const activeSessions = ref([
  { id: 1, sessionName: '2026年小学组初赛' },
  { id: 2, sessionName: '2026年初中组模拟赛' },
])

const currentSession = computed(() => 
  activeSessions.value.find(s => s.id === selectedSession.value)
)

const submitProgress = computed(() => 
  Math.round((monitorStats.submitted / monitorStats.total) * 100)
)

const candidates = ref([
  { id: 1, name: '张三', idCard: '450102201201011234', loginTime: '2026-04-01 09:00:05', progress: 100, status: 'submitted' },
  { id: 2, name: '李四', idCard: '450102201202021234', loginTime: '2026-04-01 09:01:12', progress: 85, status: 'online' },
  { id: 3, name: '王五', idCard: '450102201203031234', loginTime: '2026-04-01 09:02:30', progress: 60, status: 'online' },
  { id: 4, name: '赵六', idCard: '450102201204041234', loginTime: '2026-04-01 09:00:45', progress: 0, status: 'abnormal' },
])

const filteredCandidates = computed(() => {
  if (statusFilter.value === 'all') return candidates.value
  return candidates.value.filter(c => c.status === statusFilter.value)
})

const pagination = reactive({ page: 1, pageSize: 20, total: 500 })

let refreshTimer: NodeJS.Timeout | null = null

const toggleAutoRefresh = () => {
  isAutoRefresh.value = !isAutoRefresh.value
  if (isAutoRefresh.value) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

const startAutoRefresh = () => {
  refreshTimer = setInterval(() => {
    // 模拟刷新数据
    monitorStats.online = Math.floor(Math.random() * 50) + 450
    monitorStats.submitted = Math.min(monitorStats.submitted + Math.floor(Math.random() * 3), monitorStats.total)
  }, 5000)
}

const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

const formatCountdown = (minutes: number) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = { online: 'success', submitted: 'info', abnormal: 'danger', offline: 'warning' }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = { online: '答题中', submitted: '已交卷', abnormal: '异常', offline: '离线' }
  return map[status] || status
}

const extendAllTime = () => {
  ElMessageBox.prompt('请输入全场延时分钟数', '全场延时', { inputType: 'number' })
    .then(({ value }) => { ElMessage.success(`已为全场延时 ${value} 分钟`) })
}

const forceCloseAll = () => {
  ElMessageBox.confirm('确定要强制结束本场考试吗？所有未交卷考生将被强制交卷。', '强制收卷', { type: 'danger' })
    .then(() => { ElMessage.success('强制收卷成功') })
}

const extendSingleTime = (row: any) => {
  ElMessageBox.prompt(`为 ${row.name} 补时`, '单人补时', { inputType: 'number' })
    .then(({ value }) => { ElMessage.success(`已为 ${row.name} 补时 ${value} 分钟`) })
}

const forceSubmit = (row: any) => {
  ElMessageBox.confirm(`确定强制 ${row.name} 交卷吗？`, '强制交卷', { type: 'warning' })
    .then(() => { row.status = 'submitted'; row.progress = 100; ElMessage.success('强制交卷成功') })
}

const viewDetail = (row: any) => { ElMessage.info(`查看考生 ${row.name} 详情`) }

onMounted(() => { startAutoRefresh() })
onUnmounted(() => { stopAutoRefresh() })
</script>

<style scoped>
.monitor-page { padding-bottom: 40px; }
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-title { font-size: 24px; font-weight: 600; color: #1E293B; margin: 0 0 8px 0; }
.page-subtitle { font-size: 14px; color: #64748B; margin: 0; }
.page-actions { display: flex; gap: 12px; }
.stats-row { margin-bottom: 24px; }
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-radius: 12px;
  color: white;
}
.stat-card.blue { background: linear-gradient(135deg, #3B82F6, #6366F1); }
.stat-card.green { background: linear-gradient(135deg, #10B981, #059669); }
.stat-card.orange { background: linear-gradient(135deg, #F59E0B, #D97706); }
.stat-card.red { background: linear-gradient(135deg, #EF4444, #DC2626); }
.stat-icon { opacity: 0.8; }
.stat-value { font-size: 32px; font-weight: 700; line-height: 1; }
.stat-label { font-size: 14px; opacity: 0.9; margin-top: 4px; }
.session-card { margin-bottom: 24px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-size: 16px; font-weight: 600; color: #1E293B; display: flex; align-items: center; }
.session-detail { padding: 20px 0; }
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.session-title { font-size: 18px; font-weight: 600; color: #1E293B; }
.countdown-label { color: #64748B; }
.countdown-value { font-size: 24px; font-weight: 700; color: #3B82F6; font-family: monospace; }
.countdown-value.warning { color: #EF4444; animation: blink 1s infinite; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.submit-progress { margin-bottom: 20px; }
.action-buttons { display: flex; gap: 16px; }
.header-filters { display: flex; gap: 12px; }
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}
.mr-2 { margin-right: 8px; }
</style>
