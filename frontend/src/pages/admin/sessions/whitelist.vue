<template>
  <div class="whitelist-page">
    <div class="page-header">
      <div class="header-left">
        <el-button text @click="$router.back()">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div>
          <h1 class="page-title">白名单管理</h1>
          <p class="page-subtitle">管理考试场次的准入考生名单</p>
        </div>
      </div>
      <div class="page-actions">
        <el-button @click="showImportDialog">
          <el-icon class="mr-2"><Upload /></el-icon>
          批量导入
        </el-button>
        <el-button type="primary" @click="showAddDialog">
          <el-icon class="mr-2"><Plus /></el-icon>
          添加考生
        </el-button>
      </div>
    </div>

    <!-- 场次信息卡片 -->
    <el-card class="session-info-card">
      <div class="session-info">
        <div class="info-item">
          <span class="info-label">场次名称：</span>
          <span class="info-value">2026年小学组初赛</span>
        </div>
        <div class="info-item">
          <span class="info-label">考试时间：</span>
          <span class="info-value">2026-04-01 09:00 - 10:30</span>
        </div>
        <div class="info-item">
          <span class="info-label">白名单人数：</span>
          <span class="info-value text-primary">{{ whitelist.length }} / 500</span>
        </div>
        <div class="info-item">
          <span class="info-label">准入状态：</span>
          <el-tag type="success" size="small">正常开放</el-tag>
        </div>
      </div>
    </el-card>

    <!-- 白名单列表 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-input v-model="searchKeyword" placeholder="搜索姓名/身份证号" clearable style="width: 240px">
              <template #prefix><el-icon><Search /></el-icon></template>
            </el-input>
          </div>
          <el-button type="danger" :disabled="!selectedRows.length" @click="batchRemove">
            批量移除 ({{ selectedRows.length }})
          </el-button>
        </div>
      </template>

      <el-table :data="filteredWhitelist" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="序号" width="70" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="idCard" label="身份证号" min-width="180" />
        <el-table-column prop="school" label="学校" min-width="180" />
        <el-table-column prop="teacher" label="指导教师" width="120" />
        <el-table-column prop="extraTime" label="补时" width="100" align="center">
          <template #default="{ row }">
            <span v-if="row.extraTime" class="text-warning">+{{ row.extraTime }}分钟</span>
            <span v-else class="text-gray">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="editExtraTime(row)">补时</el-button>
            <el-button link type="danger" @click="removeCandidate(row)">移除</el-button>
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

    <!-- 添加考生弹窗 -->
    <el-dialog v-model="addDialogVisible" title="添加考生" width="500px">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="考生姓名">
          <el-input v-model="addForm.name" placeholder="请输入考生姓名" />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="addForm.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="学校">
          <el-input v-model="addForm.school" placeholder="请输入学校名称" />
        </el-form-item>
        <el-form-item label="指导教师">
          <el-input v-model="addForm.teacher" placeholder="请输入指导教师姓名" />
        </el-form-item>
        <el-form-item label="补时">
          <el-input-number v-model="addForm.extraTime" :min="0" :max="60" placeholder="分钟" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCandidate">添加</el-button>
      </template>
    </el-dialog>

    <!-- 批量导入弹窗 -->
    <el-dialog v-model="importDialogVisible" title="批量导入白名单" width="600px">
      <el-alert title="请下载模板，按要求填写后上传" type="info" :closable="false" class="mb-4" />
      <el-upload drag action="#" :auto-upload="false" class="upload-area">
        <el-icon :size="48" class="upload-icon"><Upload /></el-icon>
        <div class="upload-text"><em>点击上传</em> 或拖拽文件到此处</div>
        <template #tip>
          <div class="upload-tip">支持 .xlsx 格式，包含姓名、身份证号、学校、指导教师列</div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitImport">开始导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchKeyword = ref('')
const selectedRows = ref<any[]>([])
const pagination = reactive({ page: 1, pageSize: 20, total: 500 })

const whitelist = ref([
  { id: 1, name: '张三', idCard: '450102201201011234', school: '南宁市第一小学', teacher: '陈老师', extraTime: 0 },
  { id: 2, name: '李四', idCard: '450102201202021234', school: '南宁市第一小学', teacher: '陈老师', extraTime: 10 },
  { id: 3, name: '王五', idCard: '450102201203031234', school: '南宁市第二小学', teacher: '刘老师', extraTime: 0 },
])

const filteredWhitelist = computed(() => {
  if (!searchKeyword.value) return whitelist.value
  return whitelist.value.filter(item => 
    item.name.includes(searchKeyword.value) || 
    item.idCard.includes(searchKeyword.value)
  )
})

const addDialogVisible = ref(false)
const importDialogVisible = ref(false)
const addForm = reactive({ name: '', idCard: '', school: '', teacher: '', extraTime: 0 })

const handleSelectionChange = (rows: any[]) => { selectedRows.value = rows }
const editExtraTime = (row: any) => {
  ElMessageBox.prompt('请输入补时分钟数', '单人补时', { inputType: 'number', inputValue: String(row.extraTime) })
    .then(({ value }) => { row.extraTime = parseInt(value); ElMessage.success('补时设置成功') })
}
const removeCandidate = (row: any) => {
  ElMessageBox.confirm(`确定将 ${row.name} 移出白名单吗？`, '确认移除', { type: 'warning' })
    .then(() => { whitelist.value = whitelist.value.filter(item => item.id !== row.id); ElMessage.success('移除成功') })
}
const batchRemove = () => {
  ElMessageBox.confirm(`确定移除选中的 ${selectedRows.value.length} 名考生吗？`, '批量移除', { type: 'warning' })
    .then(() => {
      const ids = selectedRows.value.map(r => r.id)
      whitelist.value = whitelist.value.filter(item => !ids.includes(item.id))
      ElMessage.success('批量移除成功')
    })
}
const showAddDialog = () => { addForm.name = ''; addForm.idCard = ''; addDialogVisible.value = true }
const saveCandidate = () => { 
  whitelist.value.push({ id: Date.now(), ...addForm })
  ElMessage.success('添加成功')
  addDialogVisible.value = false 
}
const showImportDialog = () => { importDialogVisible.value = true }
const submitImport = () => { ElMessage.success('导入成功'); importDialogVisible.value = false }
</script>

<style scoped>
.whitelist-page { padding-bottom: 40px; }
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.header-left { display: flex; align-items: center; gap: 16px; }
.page-title { font-size: 24px; font-weight: 600; color: #1E293B; margin: 0 0 8px 0; }
.page-subtitle { font-size: 14px; color: #64748B; margin: 0; }
.page-actions { display: flex; gap: 12px; }
.session-info-card { margin-bottom: 20px; }
.session-info { display: flex; gap: 40px; flex-wrap: wrap; }
.info-item { display: flex; align-items: center; }
.info-label { color: #64748B; }
.info-value { color: #1E293B; font-weight: 500; margin-left: 8px; }
.text-primary { color: #3B82F6; }
.text-warning { color: #F59E0B; }
.text-gray { color: #94a3b8; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}
.upload-area :deep(.el-upload-dragger) { width: 100%; padding: 40px; }
.upload-icon { color: #3B82F6; margin-bottom: 16px; }
.upload-text { color: #64748B; }
.upload-text em { color: #3B82F6; font-style: normal; }
.upload-tip { margin-top: 12px; font-size: 12px; color: #94a3b8; }
.mb-4 { margin-bottom: 16px; }
.mr-2 { margin-right: 8px; }
</style>
