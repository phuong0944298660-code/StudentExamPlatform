<template>
  <div class="score-publish-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">成绩发布</h1>
        <p class="page-subtitle">设置成绩公布时间，到期自动开放成绩查询</p>
      </div>
    </div>

    <el-row :gutter="20">
      <!-- 待发布场次 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon class="mr-2"><Clock /></el-icon>
                待发布场次
              </span>
            </div>
          </template>
          <div class="session-list">
            <div 
              v-for="session in pendingSessions" 
              :key="session.id"
              class="session-item"
              :class="{ active: selectedSession?.id === session.id }"
              @click="selectSession(session)"
            >
              <div class="session-info">
                <div class="session-name">{{ session.sessionName }}</div>
                <div class="session-meta">
                  <el-tag size="small" :type="session.stage === 'PRIMARY' ? 'success' : 'warning'">
                    {{ session.stage === 'PRIMARY' ? '小学' : '初中' }}
                  </el-tag>
                  <span class="review-status" :class="session.reviewStatus">
                    {{ session.reviewStatus === 'completed' ? '阅卷完成' : '阅卷中' }}
                  </span>
                </div>
              </div>
              <el-icon v-if="selectedSession?.id === session.id"><ArrowRight /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 发布设置 -->
      <el-col :span="12">
        <el-card v-if="selectedSession">
          <template #header>
            <span class="card-title">发布设置 - {{ selectedSession.sessionName }}</span>
          </template>
          <el-form :model="publishForm" label-width="120px">
            <el-form-item label="阅卷状态">
              <el-tag :type="selectedSession.reviewStatus === 'completed' ? 'success' : 'warning'">
                {{ selectedSession.reviewStatus === 'completed' ? '阅卷已完成' : '阅卷进行中' }}
              </el-tag>
              <div class="form-tip" v-if="selectedSession.reviewStatus !== 'completed'">
                阅卷未完成时无法设置公布时间
              </div>
            </el-form-item>
            <el-form-item label="公布方式">
              <el-radio-group v-model="publishForm.type" :disabled="selectedSession.reviewStatus !== 'completed'">
                <el-radio label="immediate">立即公布</el-radio>
                <el-radio label="scheduled">定时公布</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="公布时间" v-if="publishForm.type === 'scheduled'">
              <el-date-picker
                v-model="publishForm.time"
                type="datetime"
                placeholder="选择公布时间"
                style="width: 100%"
                :disabled="selectedSession.reviewStatus !== 'completed'"
              />
            </el-form-item>
            <el-form-item label="复查申请期限">
              <el-input-number v-model="publishForm.recheckDays" :min="1" :max="7" style="width: 150px">
                <template #append>天</template>
              </el-input-number>
              <div class="form-tip">成绩公布后，考生可在该期限内申请复查</div>
            </el-form-item>
            <el-form-item>
              <el-button 
                type="primary" 
                @click="savePublish" 
                :disabled="selectedSession.reviewStatus !== 'completed'"
              >
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-empty v-else description="请选择左侧场次" />
      </el-col>
    </el-row>

    <!-- 已发布场次 -->
    <el-card class="published-card">
      <template #header>
        <span class="card-title">已发布场次</span>
      </template>
      <el-table :data="publishedSessions" stripe>
        <el-table-column prop="sessionName" label="场次名称" min-width="200" />
        <el-table-column prop="publishTime" label="公布时间" width="160" />
        <el-table-column prop="recheckDeadline" label="复查截止" width="160" />
        <el-table-column prop="viewCount" label="查询人次" width="100" align="center" />
        <el-table-column prop="recheckCount" label="复查申请" width="100" align="center" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'open' ? 'success' : 'info'" size="small">
              {{ row.status === 'open' ? '查询开放' : '已关闭' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const selectedSession = ref<any>(null)
const publishForm = reactive({ type: 'scheduled', time: '', recheckDays: 2 })

const pendingSessions = ref([
  { id: 1, sessionName: '2026年小学组初赛', stage: 'PRIMARY', reviewStatus: 'completed' },
  { id: 2, sessionName: '2026年初中组初赛', stage: 'MIDDLE', reviewStatus: 'reviewing' },
])

const publishedSessions = ref([
  { id: 3, sessionName: '2026年小学组模拟赛', publishTime: '2026-03-26 10:00', recheckDeadline: '2026-03-28 10:00', viewCount: 298, recheckCount: 2, status: 'open' },
])

const selectSession = (session: any) => { selectedSession.value = session }
const savePublish = () => { 
  if (publishForm.type === 'scheduled' && !publishForm.time) {
    ElMessage.warning('请选择公布时间')
    return
  }
  ElMessage.success('成绩发布设置已保存') 
}
</script>

<style scoped>
.score-publish-page { padding-bottom: 40px; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 600; color: #1E293B; margin: 0 0 8px 0; }
.page-subtitle { font-size: 14px; color: #64748B; margin: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-size: 16px; font-weight: 600; color: #1E293B; display: flex; align-items: center; }
.session-list { max-height: 500px; overflow-y: auto; }
.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s;
}
.session-item:hover, .session-item.active {
  background: #eff6ff;
  border-left: 3px solid #3B82F6;
}
.session-name { font-size: 15px; font-weight: 500; color: #1E293B; margin-bottom: 8px; }
.session-meta { display: flex; gap: 8px; align-items: center; }
.review-status { font-size: 12px; color: #64748B; }
.review-status.completed { color: #10B981; }
.form-tip { font-size: 12px; color: #94a3b8; margin-top: 4px; }
.published-card { margin-top: 24px; }
.mr-2 { margin-right: 8px; }
</style>
