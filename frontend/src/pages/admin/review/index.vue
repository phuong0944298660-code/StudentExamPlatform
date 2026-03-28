<template>
  <div class="review-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">阅卷任务</h1>
        <p class="page-subtitle">管理评卷任务分配和监控评卷进度</p>
      </div>
    </div>

    <!-- 评卷统计 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="14 2 14 8 20 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="16" y1="13" x2="8" y2="13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="16" y1="17" x2="8" y2="17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="10 9 9 9 8 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">待评试卷</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon green">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 4L12 14.01L9 11.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.completed }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon orange">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="12 6 12 12 16 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.progress }}%</div>
            <div class="stat-label">总进度</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon purple">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.reviewers }}</div>
            <div class="stat-label">评卷教师</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 任务分配 -->
    <el-card class="section-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">任务分配</span>
          <el-button type="primary" @click="showAssignDialog">
            <el-icon class="mr-2"><Plus /></el-icon>
            分配任务
          </el-button>
        </div>
      </template>
      <el-table :data="assignmentList" stripe>
        <el-table-column prop="reviewerName" label="评卷教师" width="120" />
        <el-table-column prop="assignedCount" label="分配数量" width="100" align="center" />
        <el-table-column prop="completedCount" label="已完成" width="100" align="center" />
        <el-table-column label="进度" width="180">
          <template #default="{ row }">
            <el-progress :percentage="Math.round((row.completedCount / row.assignedCount) * 100)" />
          </template>
        </el-table-column>
        <el-table-column prop="avgScore" label="平均分" width="100" align="center" />
        <el-table-column prop="lastReviewTime" label="最近评卷" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">查看</el-button>
            <el-button link type="warning" @click="adjustTask(row)">调整</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 评卷进度详情 -->
    <el-card class="section-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">评卷进度监控</span>
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="bySession">按场次</el-radio-button>
            <el-radio-button label="byReviewer">按教师</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <el-table :data="progressList" stripe>
        <el-table-column prop="name" label="名称" min-width="200" />
        <el-table-column prop="total" label="总数量" width="100" align="center" />
        <el-table-column prop="completed" label="已完成" width="100" align="center" />
        <el-table-column label="进度" width="200">
          <template #default="{ row }">
            <el-progress 
              :percentage="Math.round((row.completed / row.total) * 100)"
              :status="row.completed === row.total ? 'success' : ''"
            />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.completed === row.total ? 'success' : 'warning'" size="small">
              {{ row.completed === row.total ? '已完成' : '进行中' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配任务弹窗 -->
    <el-dialog v-model="assignDialogVisible" title="分配评卷任务" width="500px">
      <el-form :model="assignForm" label-width="100px">
        <el-form-item label="选择场次">
          <el-select v-model="assignForm.sessionId" placeholder="选择考试场次" style="width: 100%">
            <el-option v-for="s in sessions" :key="s.id" :label="s.sessionName" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="评卷模式">
          <el-radio-group v-model="assignForm.mode">
            <el-radio label="average">平均分配</el-radio>
            <el-radio label="random">随机分配</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评卷人数">
          <el-input-number v-model="assignForm.reviewerCount" :min="1" :max="10" />
          <div class="form-tip">每份试卷由几名教师评卷（取平均分）</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAssign" :loading="assignLoading">开始分配</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { mockExamSessions } from '../../../mock/admin'

const stats = reactive({ total: 156, completed: 120, progress: 77, reviewers: 8 })
const viewMode = ref('bySession')
const sessions = ref(mockExamSessions)

const assignmentList = ref([
  { reviewerName: '陈老师', assignedCount: 50, completedCount: 48, avgScore: 82.5, lastReviewTime: '2026-03-27 15:30' },
  { reviewerName: '刘老师', assignedCount: 50, completedCount: 45, avgScore: 80.2, lastReviewTime: '2026-03-27 14:20' },
  { reviewerName: '王老师', assignedCount: 56, completedCount: 27, avgScore: 85.0, lastReviewTime: '2026-03-27 16:00' },
])

const progressList = ref([
  { name: '2026年小学组初赛-主观题1', total: 100, completed: 100 },
  { name: '2026年小学组初赛-主观题2', total: 100, completed: 85 },
  { name: '2026年初中组初赛-主观题1', total: 80, completed: 60 },
])

const assignDialogVisible = ref(false)
const assignLoading = ref(false)
const assignForm = reactive({ sessionId: '', mode: 'average', reviewerCount: 3 })

const showAssignDialog = () => { assignDialogVisible.value = true }
const viewDetail = (row: any) => { ElMessage.info(`查看 ${row.reviewerName} 的评卷详情`) }
const adjustTask = (row: any) => { ElMessage.info(`调整 ${row.reviewerName} 的任务`) }
const submitAssign = () => {
  assignLoading.value = true
  setTimeout(() => {
    assignLoading.value = false
    assignDialogVisible.value = false
    ElMessage.success('任务分配成功')
  }, 1000)
}
</script>

<style scoped>
.review-page { padding-bottom: 40px; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 600; color: #1E293B; margin: 0 0 8px 0; }
.page-subtitle { font-size: 14px; color: #64748B; margin: 0; }
.stats-row { margin-bottom: 24px; }
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
}
.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.stat-icon.blue { background: linear-gradient(135deg, #3B82F6, #6366F1); }
.stat-icon.green { background: linear-gradient(135deg, #10B981, #059669); }
.stat-icon.orange { background: linear-gradient(135deg, #F59E0B, #D97706); }
.stat-icon.purple { background: linear-gradient(135deg, #8B5CF6, #7C3AED); }
.stat-value { font-size: 28px; font-weight: 700; color: #1E293B; line-height: 1; }
.stat-label { font-size: 14px; color: #64748B; margin-top: 4px; }
.section-card { margin-bottom: 24px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-size: 16px; font-weight: 600; color: #1E293B; }
.form-tip { font-size: 12px; color: #94a3b8; margin-top: 4px; }
.mr-2 { margin-right: 8px; }
</style>
