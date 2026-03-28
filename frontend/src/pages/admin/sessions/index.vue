<template>
  <div class="sessions-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div>
        <h1 class="page-title">场次配置</h1>
        <p class="page-subtitle">创建和管理考试场次，配置考试时间、白名单等</p>
      </div>
      <div class="page-actions">
        <el-button type="primary" @click="showCreateDialog">
          <el-icon class="mr-2"><Plus /></el-icon>
          创建场次
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value text-blue">8</div>
          <div class="stat-label">总场次</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value text-green">2</div>
          <div class="stat-label">进行中</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value text-orange">3</div>
          <div class="stat-label">待开始</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value text-gray">3</div>
          <div class="stat-label">已结束</div>
        </div>
      </el-col>
    </el-row>

    <!-- 筛选栏 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="学段">
          <el-select v-model="filterForm.stage" placeholder="全部学段" clearable style="width: 140px">
            <el-option label="小学" value="PRIMARY" />
            <el-option label="初中" value="MIDDLE" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 140px">
            <el-option label="草稿" value="DRAFT" />
            <el-option label="未开始" value="PENDING" />
            <el-option label="进行中" value="OPEN" />
            <el-option label="已关闭" value="CLOSED" />
            <el-option label="已完成" value="FINISHED" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="filterForm.keyword" placeholder="场次名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 场次列表 -->
    <el-card class="table-card">
      <el-table :data="sessionList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="sessionName" label="场次名称" min-width="180">
          <template #default="{ row }">
            <div class="session-name-cell">
              <el-icon :size="20" :color="getStatusColor(row.status)"><Calendar /></el-icon>
              <div class="session-info">
                <div class="session-name">{{ row.sessionName }}</div>
                <div class="session-time">{{ formatTimeRange(row) }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stage" label="学段" width="80">
          <template #default="{ row }">
            <el-tag :type="row.stage === 'PRIMARY' ? 'success' : 'warning'" size="small">
              {{ row.stage === 'PRIMARY' ? '小学' : '初中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="durationMinutes" label="时长" width="90">
          <template #default="{ row }">
            {{ Math.floor(row.durationMinutes / 60) }}小时{{ row.durationMinutes % 60 }}分
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <status-tag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column prop="candidateCount" label="考生数" width="80" align="center" />
        <el-table-column prop="submittedCount" label="交卷数" width="80" align="center">
          <template #default="{ row }">
            <span :class="row.submittedCount > 0 ? 'text-primary' : ''">
              {{ row.submittedCount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="进度" width="120">
          <template #default="{ row }">
            <el-progress 
              :percentage="Math.round((row.submittedCount / row.candidateCount) * 100)" 
              :status="row.status === 'FINISHED' ? 'success' : ''"
              :stroke-width="6"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-button link type="primary" @click="editSession(row)">编辑</el-button>
              <el-button link type="primary" @click="manageWhitelist(row)">白名单</el-button>
              <el-dropdown trigger="click">
                <el-button link type="primary">
                  更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="row.status === 'OPEN'" @click="extendTime(row)">全场延时</el-dropdown-item>
                    <el-dropdown-item v-if="row.status === 'OPEN'" divided @click="forceClose(row)">强制收卷</el-dropdown-item>
                    <el-dropdown-item v-if="row.status === 'FINISHED'" @click="publishScore(row)">成绩发布</el-dropdown-item>
                    <el-dropdown-item divided type="danger" @click="deleteSession(row)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 创建/编辑场次弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="650px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="场次名称" prop="sessionName">
              <el-input v-model="form.sessionName" placeholder="请输入场次名称，如：2026年小学组初赛" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="学段" prop="stage">
              <el-radio-group v-model="form.stage" style="width: 100%">
                <el-radio-button label="PRIMARY">小学</el-radio-button>
                <el-radio-button label="MIDDLE">初中</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="绑定试卷" prop="paperId">
              <el-select v-model="form.paperId" placeholder="选择试卷" style="width: 100%">
                <el-option 
                  v-for="paper in paperOptions" 
                  :key="paper.id" 
                  :label="paper.paperName" 
                  :value="paper.id" 
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="选择开始时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考试时长" prop="durationType">
              <el-select v-model="form.durationType" placeholder="选择时长" style="width: 100%">
                <el-option label="30分钟" value="30" />
                <el-option label="1小时" value="60" />
                <el-option label="1.5小时" value="90" />
                <el-option label="1小时45分" value="105" />
                <el-option label="2小时" value="120" />
                <el-option label="自定义" value="custom" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16" v-if="form.durationType === 'custom'">
          <el-col :span="12">
            <el-form-item label="自定义时长">
              <el-input-number v-model="form.customDuration" :min="10" :max="300" style="width: 100%">
                <template #append>分钟</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="自动计算，可微调"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="白名单">
          <div class="whitelist-upload">
            <el-upload
              action="#"
              :auto-upload="false"
              :on-change="handleWhitelistChange"
              accept=".xlsx,.xls"
            >
              <el-button>
                <el-icon class="mr-2"><Upload /></el-icon>
                导入白名单
              </el-button>
            </el-upload>
            <span class="upload-hint">支持 Excel 格式，包含考生身份证号</span>
          </div>
        </el-form-item>
        <el-form-item label="成绩公布">
          <el-radio-group v-model="form.publishType">
            <el-radio label="immediate">交卷后立即公布（仅客观题）</el-radio>
            <el-radio label="scheduled">指定时间公布</el-radio>
            <el-radio label="manual">评卷完成后手动设置</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="saveAsDraft">存为草稿</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">发布场次</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import StatusTag from '../../../components/common/StatusTag.vue'
import { mockExamSessions, mockExamPapers } from '../../../mock/admin'
import type { ExamSession, ExamPaper } from '../../../types'

const router = useRouter()

// 筛选表单
const filterForm = reactive({
  stage: '',
  status: '',
  dateRange: [] as Date[],
  keyword: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 数据
const sessionList = ref<ExamSession[]>([])
const loading = ref(false)
const paperOptions = ref<ExamPaper[]>([])

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('创建场次')
const formRef = ref()
const submitLoading = ref(false)
const form = reactive({
  id: 0,
  sessionName: '',
  stage: 'PRIMARY',
  paperId: null as number | null,
  startTime: '',
  durationType: '90',
  customDuration: 90,
  endTime: '',
  publishType: 'manual'
})

const rules = {
  sessionName: [{ required: true, message: '请输入场次名称', trigger: 'blur' }],
  stage: [{ required: true, message: '请选择学段', trigger: 'change' }],
  paperId: [{ required: true, message: '请选择试卷', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  durationType: [{ required: true, message: '请选择考试时长', trigger: 'change' }]
}

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    let data = [...mockExamSessions]
    
    if (filterForm.stage) {
      data = data.filter(item => item.stage === filterForm.stage)
    }
    if (filterForm.status) {
      data = data.filter(item => item.status === filterForm.status)
    }
    if (filterForm.keyword) {
      data = data.filter(item => item.sessionName.includes(filterForm.keyword))
    }
    
    pagination.total = data.length
    sessionList.value = data
    paperOptions.value = mockExamPapers
    loading.value = false
  }, 300)
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const resetFilter = () => {
  filterForm.stage = ''
  filterForm.status = ''
  filterForm.dateRange = []
  filterForm.keyword = ''
  handleSearch()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadData()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadData()
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    'DRAFT': '#94a3b8',
    'PENDING': '#F59E0B',
    'OPEN': '#10B981',
    'CLOSED': '#EF4444',
    'FINISHED': '#64748B'
  }
  return map[status] || '#94a3b8'
}

// 格式化时间范围
const formatTimeRange = (row: ExamSession) => {
  const start = new Date(row.startTime).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  const end = new Date(row.endTime).toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  return `${start} - ${end}`
}

// 显示创建弹窗
const showCreateDialog = () => {
  dialogTitle.value = '创建场次'
  form.id = 0
  form.sessionName = ''
  form.stage = 'PRIMARY'
  form.paperId = null
  form.startTime = ''
  form.durationType = '90'
  form.publishType = 'manual'
  dialogVisible.value = true
}

// 编辑场次
const editSession = (row: ExamSession) => {
  dialogTitle.value = '编辑场次'
  form.id = row.id
  form.sessionName = row.sessionName
  form.stage = row.stage
  dialogVisible.value = true
}

// 管理白名单
const manageWhitelist = (row: ExamSession) => {
  router.push(`/admin/sessions/whitelist?id=${row.id}`)
}

// 全场延时
const extendTime = (row: ExamSession) => {
  ElMessageBox.prompt('请输入延时分钟数', '全场延时', {
    inputType: 'number',
    inputPattern: /^[1-9]\d*$/,
    inputErrorMessage: '请输入有效的分钟数'
  }).then(({ value }) => {
    ElMessage.success(`已为场次 "${row.sessionName}" 延时 ${value} 分钟`)
  })
}

// 强制收卷
const forceClose = (row: ExamSession) => {
  ElMessageBox.confirm(
    `确定要强制结束场次 "${row.sessionName}" 吗？所有未交卷考生将强制交卷。`,
    '强制收卷',
    { type: 'warning' }
  ).then(() => {
    row.status = 'CLOSED'
    ElMessage.success('强制收卷成功')
  })
}

// 发布成绩
const publishScore = (row: ExamSession) => {
  ElMessageBox.confirm(
    `确定要发布场次 "${row.sessionName}" 的成绩吗？`,
    '发布成绩',
    { type: 'info' }
  ).then(() => {
    ElMessage.success('成绩发布成功')
  })
}

// 删除场次
const deleteSession = (row: ExamSession) => {
  ElMessageBox.confirm(
    `确定要删除场次 "${row.sessionName}" 吗？`,
    '删除场次',
    { type: 'warning' }
  ).then(() => {
    sessionList.value = sessionList.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  })
}

// 白名单上传
const handleWhitelistChange = (file: any) => {
  ElMessage.success(`已选择文件: ${file.name}`)
}

// 保存草稿
const saveAsDraft = () => {
  ElMessage.success('已保存为草稿')
  dialogVisible.value = false
}

// 提交表单
const submitForm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  
  submitLoading.value = true
  setTimeout(() => {
    ElMessage.success('场次发布成功')
    dialogVisible.value = false
    submitLoading.value = false
    loadData()
  }, 800)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.sessions-page {
  padding-bottom: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.stat-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 8px;
}

.stat-value.text-blue { color: #3B82F6; }
.stat-value.text-green { color: #10B981; }
.stat-value.text-orange { color: #F59E0B; }
.stat-value.text-gray { color: #64748B; }

.stat-label {
  font-size: 14px;
  color: #64748B;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.table-card {
  margin-bottom: 20px;
}

.table-actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  white-space: nowrap;
}

.session-name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.session-info {
  display: flex;
  flex-direction: column;
}

.session-name {
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
}

.session-time {
  font-size: 12px;
  color: #64748B;
  margin-top: 4px;
}

.text-primary {
  color: #3B82F6;
  font-weight: 500;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.whitelist-upload {
  display: flex;
  align-items: center;
  gap: 12px;
}

.upload-hint {
  font-size: 12px;
  color: #94a3b8;
}

.mr-2 {
  margin-right: 8px;
}
</style>
