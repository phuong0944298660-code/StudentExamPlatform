<template>
  <div class="score-export-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">成绩导出</h1>
        <p class="page-subtitle">按条件筛选导出成绩报表</p>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span class="card-title">导出配置</span>
          </template>
          <el-form :model="exportForm" label-width="100px">
            <el-form-item label="选择场次">
              <el-select v-model="exportForm.sessionId" placeholder="选择要导出场次" style="width: 100%">
                <el-option v-for="s in sessions" :key="s.id" :label="s.sessionName" :value="s.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="导出格式">
              <el-radio-group v-model="exportForm.format">
                <el-radio-button label="xlsx">Excel (.xlsx)</el-radio-button>
                <el-radio-button label="csv">CSV (.csv)</el-radio-button>
                <el-radio-button label="pdf">PDF (.pdf)</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="导出版本">
              <el-radio-group v-model="exportForm.version">
                <el-radio label="full">完整版（含个人信息）</el-radio>
                <el-radio label="anonymous">脱敏版（隐藏身份证号）</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="包含字段">
              <el-checkbox-group v-model="exportForm.fields">
                <el-checkbox label="rank">排名</el-checkbox>
                <el-checkbox label="idCard">身份证号</el-checkbox>
                <el-checkbox label="school">学校</el-checkbox>
                <el-checkbox label="objective">客观题得分</el-checkbox>
                <el-checkbox label="subjective">主观题得分</el-checkbox>
                <el-checkbox label="total">总分</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" @click="startExport" :loading="exporting">
                <el-icon class="mr-2"><Download /></el-icon>
                开始导出
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span class="card-title">导出历史</span>
          </template>
          <div class="export-history">
            <div v-for="item in exportHistory" :key="item.id" class="history-item">
              <div class="history-info">
                <div class="history-name">{{ item.fileName }}</div>
                <div class="history-meta">{{ item.time }} · {{ item.size }}</div>
              </div>
              <el-button link type="primary">
                <el-icon><Download /></el-icon>
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { mockExamSessions } from '../../../mock/admin'

const sessions = ref(mockExamSessions)
const exporting = ref(false)
const exportForm = reactive({
  sessionId: '',
  format: 'xlsx',
  version: 'full',
  fields: ['rank', 'school', 'objective', 'subjective', 'total']
})

const exportHistory = ref([
  { id: 1, fileName: '小学组初赛成绩_完整版.xlsx', time: '2026-03-27 10:30', size: '128KB' },
  { id: 2, fileName: '初中组初赛成绩_脱敏版.xlsx', time: '2026-03-26 15:20', size: '96KB' },
  { id: 3, fileName: '模拟赛成绩.csv', time: '2026-03-25 09:00', size: '45KB' },
])

const startExport = () => {
  if (!exportForm.sessionId) {
    ElMessage.warning('请选择场次')
    return
  }
  exporting.value = true
  setTimeout(() => {
    exporting.value = false
    ElMessage.success('导出成功')
  }, 1500)
}
</script>

<style scoped>
.score-export-page { padding-bottom: 40px; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 600; color: #1E293B; margin: 0 0 8px 0; }
.page-subtitle { font-size: 14px; color: #64748B; margin: 0; }
.card-title { font-size: 16px; font-weight: 600; color: #1E293B; }
.export-history { max-height: 400px; overflow-y: auto; }
.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}
.history-item:last-child { border-bottom: none; }
.history-name { font-size: 14px; color: #1E293B; margin-bottom: 4px; }
.history-meta { font-size: 12px; color: #94a3b8; }
.mr-2 { margin-right: 8px; }
</style>
