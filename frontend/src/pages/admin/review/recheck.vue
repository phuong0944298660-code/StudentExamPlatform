<template>
  <div class="recheck-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">复核管理</h1>
        <p class="page-subtitle">处理考生的成绩复查申请，确保评分公平公正</p>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="8">
        <div class="stat-card warning">
          <div class="stat-icon"><el-icon :size="32"><Bell /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.pending }}</div>
            <div class="stat-label">待处理申请</div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="stat-card success">
          <div class="stat-icon"><el-icon :size="32"><CircleCheck /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.completed }}</div>
            <div class="stat-label">已处理</div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="stat-card info">
          <div class="stat-icon"><el-icon :size="32"><TrendCharts /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.changed }}</div>
            <div class="stat-label">分数变更</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 待处理申请 -->
    <el-card class="section-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon class="mr-2" color="#F59E0B"><Warning /></el-icon>
            待处理复查申请
          </span>
          <el-tag type="warning">{{ pendingList.length }} 个待处理</el-tag>
        </div>
      </template>
      <el-table :data="pendingList" stripe>
        <el-table-column prop="id" label="申请编号" width="120" />
        <el-table-column prop="studentName" label="考生姓名" width="100" />
        <el-table-column prop="idCard" label="身份证号" min-width="180" />
        <el-table-column prop="sessionName" label="考试场次" min-width="180" />
        <el-table-column prop="originalScore" label="原成绩" width="90" align="center" />
        <el-table-column prop="applyTime" label="申请时间" width="160" />
        <el-table-column prop="deadline" label="处理截止" width="160">
          <template #default="{ row }">
            <span :class="isUrgent(row.deadline) ? 'text-danger' : ''">{{ row.deadline }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleRecheck(row)">立即处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 已处理记录 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">已处理记录</span>
          <el-radio-group v-model="filterStatus" size="small">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="uphold">维持原判</el-radio-button>
            <el-radio-button label="modified">分数更正</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <el-table :data="filteredCompletedList" stripe>
        <el-table-column prop="id" label="申请编号" width="120" />
        <el-table-column prop="studentName" label="考生姓名" width="100" />
        <el-table-column prop="sessionName" label="考试场次" min-width="180" />
        <el-table-column prop="originalScore" label="原成绩" width="90" align="center" />
        <el-table-column prop="finalScore" label="最终成绩" width="90" align="center">
          <template #default="{ row }">
            <span :class="row.finalScore !== row.originalScore ? 'text-success' : ''">{{ row.finalScore }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="处理结果" width="120">
          <template #default="{ row }">
            <el-tag :type="row.result === 'uphold' ? 'info' : 'success'" size="small">
              {{ row.result === 'uphold' ? '维持原判' : '分数更正' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="handler" label="处理人" width="100" />
        <el-table-column prop="handleTime" label="处理时间" width="160" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 处理复查弹窗 -->
    <el-dialog v-model="recheckDialogVisible" title="成绩复查处理" width="700px">
      <div v-if="selectedRecheck" class="recheck-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="考生姓名">{{ selectedRecheck.studentName }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ selectedRecheck.idCard }}</el-descriptions-item>
          <el-descriptions-item label="考试场次">{{ selectedRecheck.sessionName }}</el-descriptions-item>
          <el-descriptions-item label="原成绩">
            <span class="text-primary font-bold">{{ selectedRecheck.originalScore }}分</span>
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="recheck-reason">
          <div class="section-label">复查理由：</div>
          <div class="reason-content">{{ selectedRecheck.reason }}</div>
        </div>

        <el-divider />

        <el-form :model="recheckForm" label-width="100px">
          <el-form-item label="复查结果">
            <el-radio-group v-model="recheckForm.result">
              <el-radio-button label="uphold">维持原判</el-radio-button>
              <el-radio-button label="modified">分数更正</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="最终分数" v-if="recheckForm.result === 'modified'">
            <el-input-number v-model="recheckForm.finalScore" :min="0" :max="100" />
          </el-form-item>
          <el-form-item label="复查意见">
            <el-input 
              v-model="recheckForm.comment" 
              type="textarea" 
              :rows="3" 
              placeholder="请填写复查意见，将同步给考生查看"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="recheckDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRecheck" :loading="submitLoading">提交处理</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const stats = reactive({ pending: 5, completed: 12, changed: 3 })
const filterStatus = ref('all')

const pendingList = ref([
  { id: 'RC-2026-001', studentName: '张三', idCard: '450102201201011234', sessionName: '2026年小学组初赛', originalScore: 78, applyTime: '2026-03-27 10:00', deadline: '2026-03-29 10:00', reason: '我认为第3题主观题得分偏低，请求复查。' },
  { id: 'RC-2026-002', studentName: '李四', idCard: '450102201202021234', sessionName: '2026年小学组初赛', originalScore: 65, applyTime: '2026-03-27 11:30', deadline: '2026-03-29 11:30', reason: '我的程序题运行结果正确，但被判0分。' },
])

const completedList = ref([
  { id: 'RC-2026-003', studentName: '王五', sessionName: '2026年小学组初赛', originalScore: 82, finalScore: 82, result: 'uphold', handler: '陈老师', handleTime: '2026-03-26 15:00' },
  { id: 'RC-2026-004', studentName: '赵六', sessionName: '2026年小学组初赛', originalScore: 70, finalScore: 75, result: 'modified', handler: '刘老师', handleTime: '2026-03-26 16:30' },
])

const filteredCompletedList = computed(() => {
  if (filterStatus.value === 'all') return completedList.value
  return completedList.value.filter(item => item.result === filterStatus.value)
})

const recheckDialogVisible = ref(false)
const submitLoading = ref(false)
const selectedRecheck = ref<any>(null)
const recheckForm = reactive({ result: 'uphold', finalScore: 0, comment: '' })

const isUrgent = (deadline: string) => {
  const deadlineDate = new Date(deadline)
  const now = new Date()
  const diff = deadlineDate.getTime() - now.getTime()
  return diff < 24 * 60 * 60 * 1000 // 小于24小时
}

const handleRecheck = (row: any) => {
  selectedRecheck.value = row
  recheckForm.result = 'uphold'
  recheckForm.finalScore = row.originalScore
  recheckForm.comment = ''
  recheckDialogVisible.value = true
}

const viewDetail = (row: any) => { ElMessage.info(`查看申请 ${row.id} 详情`) }

const submitRecheck = () => {
  if (!recheckForm.comment) {
    ElMessage.warning('请填写复查意见')
    return
  }
  submitLoading.value = true
  setTimeout(() => {
    submitLoading.value = false
    recheckDialogVisible.value = false
    // 从待处理列表移除
    pendingList.value = pendingList.value.filter(item => item.id !== selectedRecheck.value.id)
    // 添加到已处理列表
    completedList.value.unshift({
      id: selectedRecheck.value.id,
      studentName: selectedRecheck.value.studentName,
      sessionName: selectedRecheck.value.sessionName,
      originalScore: selectedRecheck.value.originalScore,
      finalScore: recheckForm.finalScore,
      result: recheckForm.result,
      handler: '管理员',
      handleTime: new Date().toLocaleString('zh-CN')
    })
    stats.pending--
    stats.completed++
    if (recheckForm.result === 'modified') stats.changed++
    ElMessage.success('处理成功')
  }, 800)
}
</script>

<style scoped>
.recheck-page { padding-bottom: 40px; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 600; color: #1E293B; margin: 0 0 8px 0; }
.page-subtitle { font-size: 14px; color: #64748B; margin: 0; }
.stats-row { margin-bottom: 24px; }
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: white;
  border-radius: 12px;
}
.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.stat-card.warning .stat-icon { background: linear-gradient(135deg, #F59E0B, #D97706); }
.stat-card.success .stat-icon { background: linear-gradient(135deg, #10B981, #059669); }
.stat-card.info .stat-icon { background: linear-gradient(135deg, #3B82F6, #6366F1); }
.stat-value { font-size: 32px; font-weight: 700; color: #1E293B; line-height: 1; }
.stat-label { font-size: 14px; color: #64748B; margin-top: 4px; }
.section-card { margin-bottom: 24px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-size: 16px; font-weight: 600; color: #1E293B; display: flex; align-items: center; }
.text-danger { color: #EF4444; font-weight: 500; }
.text-primary { color: #3B82F6; }
.text-success { color: #10B981; font-weight: 600; }
.font-bold { font-weight: 600; }
.recheck-detail { padding: 10px 0; }
.recheck-reason { margin: 20px 0; }
.section-label { font-size: 14px; font-weight: 500; color: #1E293B; margin-bottom: 8px; }
.reason-content { padding: 16px; background: #f8fafc; border-radius: 8px; color: #334155; line-height: 1.6; }
.mr-2 { margin-right: 8px; }
</style>
