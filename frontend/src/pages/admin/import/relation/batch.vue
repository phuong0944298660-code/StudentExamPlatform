<template>
  <div class="batch-relation-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div>
        <h1 class="page-title">批量关联</h1>
        <p class="page-subtitle">通过Excel模板批量导入教师-学生关联关系</p>
      </div>
      <el-button @click="$router.back()">
        <el-icon class="mr-2"><ArrowLeft /></el-icon>
        返回
      </el-button>
    </div>

    <!-- 操作步骤 -->
    <el-card class="steps-card">
      <el-steps :active="currentStep" finish-status="success">
        <el-step title="下载模板" description="获取标准导入模板" />
        <el-step title="填写数据" description="按格式填写关联信息" />
        <el-step title="上传文件" description="上传Excel文件" />
        <el-step title="确认导入" description="校验并确认关联关系" />
      </el-steps>
    </el-card>

    <!-- 模板下载 -->
    <el-card v-if="currentStep === 0">
      <template #header>
        <span class="card-title">下载导入模板</span>
      </template>
      <div class="template-content">
        <div class="template-info">
          <el-icon :size="48" class="template-icon"><Document /></el-icon>
          <div class="template-detail">
            <div class="template-name">教师学生关联导入模板.xlsx</div>
            <div class="template-fields">
              <el-tag v-for="field in templateFields" :key="field" size="small" class="field-tag">
                {{ field }}
              </el-tag>
            </div>
            <el-alert
              title="填写说明"
              type="info"
              :closable="false"
              class="template-tips"
            >
              <template #default>
                <ul>
                  <li>教师姓名必须已存在于系统中（需先导入教师名单）</li>
                  <li>学生身份证号必须对应已存在的训练账号</li>
                  <li>教师与学生必须属于相同学段</li>
                  <li>导入将覆盖该学生已有的关联关系</li>
                </ul>
              </template>
            </el-alert>
          </div>
        </div>
        <el-button type="primary" size="large" @click="downloadTemplate">
          <el-icon class="mr-2"><Download /></el-icon>
          下载模板
        </el-button>
      </div>
    </el-card>

    <!-- 文件上传 -->
    <el-card v-if="currentStep === 1 || currentStep === 2">
      <template #header>
        <span class="card-title">上传关联文件</span>
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
          <div class="upload-hint">支持 .xlsx, .xls 格式，单个文件不超过 5MB</div>
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

      <div class="upload-actions" v-if="uploadFile">
        <el-button @click="uploadFile = null; currentStep = 1">重新选择</el-button>
        <el-button type="primary" @click="previewData" :loading="previewLoading">
          <el-icon class="mr-2"><View /></el-icon>
          预览数据
        </el-button>
      </div>
    </el-card>

    <!-- 数据预览 -->
    <el-card v-if="currentStep === 3">
      <template #header>
        <div class="card-header">
          <span class="card-title">数据预览</span>
          <div class="preview-stats">
            <el-tag type="success">有效: {{ validCount }}条</el-tag>
            <el-tag type="danger" class="ml-2">无效: {{ invalidCount }}条</el-tag>
          </div>
        </div>
      </template>

      <el-alert
        :title="`共解析到 ${previewList.length} 条关联记录，其中 ${validCount} 条有效，${invalidCount} 条存在问题`"
        :type="invalidCount > 0 ? 'warning' : 'success'"
        :closable="false"
        class="mb-4"
      />

      <el-table :data="previewList" height="400" stripe border>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="teacherName" label="教师姓名" width="120" />
        <el-table-column prop="studentName" label="学生姓名" width="120" />
        <el-table-column prop="studentIdCard" label="学生身份证号" min-width="180" />
        <el-table-column prop="stage" label="学段" width="100">
          <template #default="{ row }">
            <el-tag :type="row.stage === 'PRIMARY' ? 'success' : 'primary'" size="small">
              {{ row.stage === 'PRIMARY' ? '小学' : '初中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="校验结果" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.valid ? 'success' : 'danger'" size="small">
              {{ row.valid ? '有效' : '无效' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="errorMsg" label="错误信息" min-width="200">
          <template #default="{ row }">
            <span v-if="row.errorMsg" class="error-text">{{ row.errorMsg }}</span>
            <span v-else class="success-text">校验通过</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="confirm-actions">
        <el-button @click="currentStep = 1; uploadFile = null">返回修改</el-button>
        <el-button type="primary" @click="submitImport" :loading="submitLoading" :disabled="validCount === 0">
          <el-icon class="mr-2"><CircleCheck /></el-icon>
          确认导入 ({{ validCount }}条)
        </el-button>
      </div>
    </el-card>

    <!-- 导入结果 -->
    <el-card v-if="currentStep === 4">
      <template #header>
        <span class="card-title">导入结果</span>
      </template>
      <div class="result-content">
        <el-result
          :icon="result.success ? 'success' : 'warning'"
          :title="result.success ? '导入成功' : '部分导入成功'"
          :sub-title="result.message"
        >
          <template #extra>
            <div class="result-stats">
              <div class="stat-item">
                <span class="stat-label">成功导入:</span>
                <span class="stat-value success">{{ result.successCount }}条</span>
              </div>
              <div class="stat-item" v-if="result.failCount > 0">
                <span class="stat-label">导入失败:</span>
                <span class="stat-value error">{{ result.failCount }}条</span>
              </div>
            </div>
            <div class="result-actions">
              <el-button @click="$router.push('/admin/import/relation')">返回关联列表</el-button>
              <el-button type="primary" @click="resetImport">继续导入</el-button>
            </div>
          </template>
        </el-result>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const currentStep = ref(0)
const uploadFile = ref<File | null>(null)
const previewLoading = ref(false)
const submitLoading = ref(false)
const previewList = ref<any[]>([])

const templateFields = ['教师姓名', '学生姓名', '学生身份证号', '学段(小学/初中)']

const validCount = computed(() => previewList.value.filter(item => item.valid).length)
const invalidCount = computed(() => previewList.value.filter(item => !item.valid).length)

const result = ref({
  success: true,
  message: '',
  successCount: 0,
  failCount: 0
})

const handleFileChange = (file: any) => {
  uploadFile.value = file.raw
  currentStep.value = 2
}

const beforeUpload = (file: File) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                  file.type === 'application/vnd.ms-excel'
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isExcel) {
    ElMessage.error('请上传 Excel 文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过 5MB!')
    return false
  }
  return false
}

const formatFileSize = (size: number) => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

const downloadTemplate = () => {
  ElMessage.success('正在下载模板...')
  currentStep.value = 1
}

const previewData = () => {
  previewLoading.value = true
  // 模拟解析数据
  setTimeout(() => {
    previewList.value = [
      { teacherName: '陈老师', studentName: '张三', studentIdCard: '450102201201011234', stage: 'PRIMARY', valid: true, errorMsg: '' },
      { teacherName: '陈老师', studentName: '赵六', studentIdCard: '450102201204041234', stage: 'PRIMARY', valid: true, errorMsg: '' },
      { teacherName: '刘老师', studentName: '李四', studentIdCard: '450102201202021234', stage: 'MIDDLE', valid: true, errorMsg: '' },
      { teacherName: '刘老师', studentName: '周八', studentIdCard: '450102201208081234', stage: 'MIDDLE', valid: true, errorMsg: '' },
      { teacherName: '王老师', studentName: '钱九', studentIdCard: '450102201209091234', stage: 'MIDDLE', valid: false, errorMsg: '教师不存在' },
      { teacherName: '陈老师', studentName: '孙十', studentIdCard: '450102201210101234', stage: 'MIDDLE', valid: false, errorMsg: '学段不匹配（教师为小学，学生为初中）' },
    ]
    currentStep.value = 3
    previewLoading.value = false
  }, 800)
}

const submitImport = () => {
  submitLoading.value = true
  setTimeout(() => {
    result.value = {
      success: invalidCount.value === 0,
      message: invalidCount.value === 0
        ? '所有关联关系已成功导入'
        : `成功导入${validCount.value}条，${invalidCount.value}条因校验失败未导入`,
      successCount: validCount.value,
      failCount: invalidCount.value
    }
    submitLoading.value = false
    currentStep.value = 4
  }, 1500)
}

const resetImport = () => {
  currentStep.value = 0
  uploadFile.value = null
  previewList.value = []
}
</script>

<style scoped>
.batch-relation-page {
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

.steps-card {
  margin-bottom: 24px;
  padding: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-content {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 20px;
}

.template-info {
  flex: 1;
  display: flex;
  gap: 20px;
}

.template-icon {
  color: #3B82F6;
}

.template-detail {
  flex: 1;
}

.template-name {
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 12px;
}

.template-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.field-tag {
  background: #f1f5f9;
}

.template-tips {
  margin-top: 16px;
}

.template-tips ul {
  margin: 8px 0 0 16px;
  padding: 0;
}

.template-tips li {
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

.preview-stats {
  display: flex;
  gap: 8px;
}

.ml-2 {
  margin-left: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}

.error-text {
  color: #EF4444;
}

.success-text {
  color: #10B981;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.result-content {
  padding: 40px;
}

.result-stats {
  margin-bottom: 24px;
}

.stat-item {
  margin-bottom: 8px;
  font-size: 16px;
}

.stat-label {
  color: #64748B;
  margin-right: 8px;
}

.stat-value {
  font-weight: 600;
}

.stat-value.success {
  color: #10B981;
}

.stat-value.error {
  color: #EF4444;
}

.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.mr-2 {
  margin-right: 8px;
}
</style>
