<template>
  <div class="import-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div>
        <h1 class="page-title">名单导入</h1>
        <p class="page-subtitle">批量导入学生和教师的基础信息</p>
      </div>
    </div>

    <!-- 导入步骤 -->
    <el-card class="steps-card">
      <el-steps :active="currentStep" finish-status="success" simple>
        <el-step title="下载模板" />
        <el-step title="填写数据" />
        <el-step title="上传文件" />
        <el-step title="确认导入" />
      </el-steps>
    </el-card>

    <!-- 导入类型选择 -->
    <el-row :gutter="20" class="import-types">
      <el-col :span="12">
        <div 
          class="import-type-card" 
          :class="{ active: importType === 'STUDENT' }"
          @click="importType = 'STUDENT'"
        >
          <div class="type-icon blue">
            <el-icon :size="32"><User /></el-icon>
          </div>
          <div class="type-content">
            <div class="type-title">学生名单导入</div>
            <div class="type-desc">导入参赛学生的基础信息，包括姓名、身份证号、学校等</div>
          </div>
          <el-icon v-if="importType === 'STUDENT'" class="type-check" :size="24"><Check /></el-icon>
        </div>
      </el-col>
      <el-col :span="12">
        <div 
          class="import-type-card" 
          :class="{ active: importType === 'TEACHER' }"
          @click="importType = 'TEACHER'"
        >
          <div class="type-icon green">
            <el-icon :size="32"><UserFilled /></el-icon>
          </div>
          <div class="type-content">
            <div class="type-title">教师名单导入</div>
            <div class="type-desc">导入指导教师的基础信息，用于后续师生关联</div>
          </div>
          <el-icon v-if="importType === 'TEACHER'" class="type-check" :size="24"><Check /></el-icon>
        </div>
      </el-col>
    </el-row>

    <!-- 模板下载 -->
    <el-card class="template-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon class="mr-2"><Document /></el-icon>
            模板文件
          </span>
        </div>
      </template>
      <div class="template-info">
        <div class="template-item">
          <div class="template-name">
            {{ importType === 'STUDENT' ? '学生名单导入模板.xlsx' : '教师名单导入模板.xlsx' }}
          </div>
          <div class="template-fields">
            <el-tag v-for="field in currentFields" :key="field" size="small" class="field-tag">
              {{ field }}
            </el-tag>
          </div>
        </div>
        <el-button type="primary" @click="downloadTemplate">
          <el-icon class="mr-2"><Download /></el-icon>
          下载模板
        </el-button>
      </div>
      <el-alert
        title="导入说明"
        type="info"
        :closable="false"
        class="import-tips"
      >
        <template #default>
          <ul>
            <li>请使用最新版本的模板文件，避免格式不兼容</li>
            <li>身份证号为必填项，且不能重复</li>
            <li>单次导入建议不超过 5000 条记录</li>
            <li>导入过程中请勿关闭页面或刷新</li>
          </ul>
        </template>
      </el-alert>
    </el-card>

    <!-- 文件上传 -->
    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon class="mr-2"><Upload /></el-icon>
            上传文件
          </span>
        </div>
      </template>
      <el-upload
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        :before-upload="beforeUpload"
        accept=".xlsx,.xls"
        class="upload-area"
      >
        <el-icon :size="64" class="upload-icon"><UploadFilled /></el-icon>
        <div class="upload-text">
          <div class="upload-title">将文件拖拽到此处，或 <em>点击上传</em></div>
          <div class="upload-hint">支持 .xlsx, .xls 格式，单个文件不超过 10MB</div>
        </div>
      </el-upload>
      
      <div v-if="uploadFile" class="file-preview">
        <div class="file-info">
          <el-icon :size="40" class="file-icon"><Document /></el-icon>
          <div class="file-detail">
            <div class="file-name">{{ uploadFile.name }}</div>
            <div class="file-size">{{ formatFileSize(uploadFile.size) }}</div>
          </div>
        </div>
        <el-button type="danger" link @click="uploadFile = null">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>

      <div class="upload-actions">
        <el-button @click="resetUpload">重置</el-button>
        <el-button type="primary" @click="previewImport" :disabled="!uploadFile" :loading="previewLoading">
          预览数据
        </el-button>
      </div>
    </el-card>

    <!-- 导入记录 -->
    <el-card class="history-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">导入记录</span>
          <el-button text type="primary" @click="loadHistory">刷新</el-button>
        </div>
      </template>
      <el-table :data="importHistory" stripe>
        <el-table-column prop="batchNo" label="批次号" width="160" />
        <el-table-column prop="fileName" label="文件名" min-width="180" />
        <el-table-column prop="importType" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.importType === 'STUDENT' ? 'success' : 'primary'" size="small">
              {{ row.importType === 'STUDENT' ? '学生' : '教师' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalCount" label="总数" width="80" align="center" />
        <el-table-column prop="successCount" label="成功" width="80" align="center">
          <template #default="{ row }">
            <span class="text-success">{{ row.successCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="failCount" label="失败" width="80" align="center">
          <template #default="{ row }">
            <span :class="row.failCount > 0 ? 'text-danger' : ''">{{ row.failCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <status-tag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="导入时间" width="160" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 预览弹窗 -->
    <el-dialog v-model="previewDialogVisible" title="数据预览" width="800px">
      <el-alert
        :title="`共解析到 ${previewData.length} 条记录，请确认无误后提交导入`"
        type="info"
        :closable="false"
        class="mb-4"
      />
      <el-table :data="previewData" height="300" stripe border>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="idCard" label="身份证号" width="180" />
        <el-table-column prop="school" label="学校" min-width="150" />
        <el-table-column prop="teacher" label="指导教师" width="100" />
        <el-table-column label="校验" width="80" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.valid" color="#10B981"><CircleCheck /></el-icon>
            <el-icon v-else color="#EF4444"><CircleClose /></el-icon>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="previewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitImport" :loading="importLoading">
          确认导入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import StatusTag from '../../../components/common/StatusTag.vue'
import { mockImportRecords } from '../../../mock/admin'
import type { ImportRecord } from '../../../types'

const currentStep = ref(0)
const importType = ref<'STUDENT' | 'TEACHER'>('STUDENT')
const uploadFile = ref<File | null>(null)
const previewLoading = ref(false)
const importLoading = ref(false)
const previewDialogVisible = ref(false)
const previewData = ref<any[]>([])
const importHistory = ref<ImportRecord[]>([])

const studentFields = ['姓名', '身份证号', '学校', '年级', '指导教师', '联系电话']
const teacherFields = ['姓名', '身份证号', '单位', '职称', '联系电话', '邮箱']

const currentFields = computed(() => {
  return importType.value === 'STUDENT' ? studentFields : teacherFields
})

const handleFileChange = (file: any) => {
  uploadFile.value = file.raw
  currentStep.value = 2
}

const beforeUpload = (file: File) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                  file.type === 'application/vnd.ms-excel'
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isExcel) {
    ElMessage.error('请上传 Excel 文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }
  return false // 阻止自动上传
}

const formatFileSize = (size: number) => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

const resetUpload = () => {
  uploadFile.value = null
  currentStep.value = 0
}

const downloadTemplate = () => {
  ElMessage.success(`正在下载${importType.value === 'STUDENT' ? '学生' : '教师'}名单模板...`)
  currentStep.value = 1
}

const previewImport = () => {
  previewLoading.value = true
  // 模拟解析数据
  setTimeout(() => {
    previewData.value = Array.from({ length: 10 }, (_, i) => ({
      name: `学生${i + 1}`,
      idCard: `4501022012${String(i + 1).padStart(4, '0')}1234`,
      school: '南宁市第一小学',
      teacher: `老师${i + 1}`,
      valid: Math.random() > 0.1
    }))
    previewDialogVisible.value = true
    previewLoading.value = false
    currentStep.value = 3
  }, 800)
}

const submitImport = () => {
  importLoading.value = true
  setTimeout(() => {
    ElMessage.success('导入成功！')
    previewDialogVisible.value = false
    importLoading.value = false
    uploadFile.value = null
    currentStep.value = 0
    loadHistory()
  }, 1500)
}

const loadHistory = () => {
  importHistory.value = mockImportRecords
}

const viewDetail = (row: ImportRecord) => {
  ElMessage.info(`查看导入详情: ${row.batchNo}`)
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.import-page {
  padding-bottom: 40px;
}

.page-header {
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

.steps-card {
  margin-bottom: 24px;
}

.import-types {
  margin-bottom: 24px;
}

.import-type-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.import-type-card:hover {
  border-color: #3B82F6;
}

.import-type-card.active {
  border-color: #3B82F6;
  background: rgba(59, 130, 246, 0.05);
}

.type-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.type-icon.blue {
  background: linear-gradient(135deg, #3B82F6, #6366F1);
}

.type-icon.green {
  background: linear-gradient(135deg, #10B981, #059669);
}

.type-content {
  flex: 1;
}

.type-title {
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 8px;
}

.type-desc {
  font-size: 14px;
  color: #64748B;
}

.type-check {
  color: #3B82F6;
}

.template-card,
.upload-card,
.history-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  display: flex;
  align-items: center;
}

.template-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.template-name {
  font-size: 14px;
  color: #1E293B;
  margin-bottom: 12px;
}

.template-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.field-tag {
  background: #f1f5f9;
}

.import-tips {
  margin-top: 16px;
}

.import-tips ul {
  margin: 8px 0 0 16px;
  padding: 0;
}

.import-tips li {
  margin-bottom: 4px;
  color: #64748B;
}

.upload-area :deep(.el-upload-dragger) {
  width: 100%;
  padding: 60px 20px;
}

.upload-icon {
  color: #3B82F6;
  margin-bottom: 20px;
}

.upload-title {
  font-size: 16px;
  color: #1E293B;
  margin-bottom: 8px;
}

.upload-title em {
  color: #3B82F6;
  font-style: normal;
  font-weight: 500;
}

.upload-hint {
  font-size: 14px;
  color: #94a3b8;
}

.file-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  color: #3B82F6;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
}

.file-size {
  font-size: 12px;
  color: #64748B;
  margin-top: 4px;
}

.upload-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.text-success {
  color: #10B981;
}

.text-danger {
  color: #EF4444;
}

.mr-2 {
  margin-right: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
