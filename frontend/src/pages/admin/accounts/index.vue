<template>
  <div class="accounts-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div>
        <h1 class="page-title">账号列表</h1>
        <p class="page-subtitle">管理所有学生训练账号、考试账号和教师账号</p>
      </div>
      <div class="page-actions">
        <el-button @click="showImportDialog">
          <el-icon class="mr-2"><Download /></el-icon>
          批量导入
        </el-button>
        <el-button type="primary" @click="showCreateDialog">
          <el-icon class="mr-2"><Plus /></el-icon>
          创建账号
        </el-button>
      </div>
    </div>

    <!-- 筛选栏 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="账号类型">
          <el-select v-model="filterForm.accountType" placeholder="全部类型" clearable style="width: 140px">
            <el-option label="训练账号" value="PRACTICE" />
            <el-option label="考试账号" value="EXAM" />
            <el-option label="教师账号" value="STAFF" />
          </el-select>
        </el-form-item>
        <el-form-item label="学段">
          <el-select v-model="filterForm.stage" placeholder="全部学段" clearable style="width: 140px">
            <el-option label="小学" value="PRIMARY" />
            <el-option label="初中" value="MIDDLE" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 140px">
            <el-option label="正常" value="ENABLED" />
            <el-option label="已禁用" value="DISABLED" />
            <el-option label="已锁定" value="LOCKED" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input 
            v-model="filterForm.keyword" 
            placeholder="用户名/姓名" 
            clearable
            style="width: 200px"
          />
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

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table 
        :data="accountList" 
        v-loading="loading"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="用户名" min-width="140">
          <template #default="{ row }">
            <div class="user-info-cell">
              <el-avatar :size="32" :icon="UserFilled" />
              <span class="username-text">{{ row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="真实姓名" width="100" />
        <el-table-column prop="accountType" label="账号类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getAccountTypeType(row.accountType)" size="small">
              {{ getAccountTypeText(row.accountType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="stage" label="学段" width="80">
          <template #default="{ row }">
            {{ row.stage === 'PRIMARY' ? '小学' : '初中' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <status-tag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column prop="lastLoginAt" label="最后登录" width="160">
          <template #default="{ row }">
            {{ row.lastLoginAt || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="editAccount(row)">编辑</el-button>
            <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
            <el-dropdown trigger="click">
              <el-button link type="primary">
                更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="resetPassword(row)">重置密码</el-dropdown-item>
                  <el-dropdown-item v-if="row.status !== 'LOCKED'" @click="lockAccount(row)">锁定账号</el-dropdown-item>
                  <el-dropdown-item v-if="row.status === 'LOCKED'" @click="unlockAccount(row)">解锁账号</el-dropdown-item>
                  <el-dropdown-item divided type="danger" @click="deleteAccount(row)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 创建/编辑账号弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '创建账号' : '编辑账号'"
      width="500px"
    >
      <el-form :model="accountForm" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="accountForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="accountForm.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCardNo">
          <el-input v-model="accountForm.idCardNo" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="accountForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="账号类型" prop="accountType">
          <el-radio-group v-model="accountForm.accountType">
            <el-radio label="PRACTICE">训练账号</el-radio>
            <el-radio label="EXAM">考试账号</el-radio>
            <el-radio label="STAFF">教师账号</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学段" prop="stage">
          <el-radio-group v-model="accountForm.stage">
            <el-radio label="PRIMARY">小学</el-radio>
            <el-radio label="MIDDLE">初中</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 批量导入弹窗 -->
    <el-dialog
      v-model="importDialogVisible"
      title="批量导入账号"
      width="600px"
    >
      <div class="import-dialog-content">
        <el-alert
          title="请下载模板文件，按要求填写后上传"
          type="info"
          :closable="false"
          class="mb-4"
        />
        <div class="template-download">
          <span>模板文件：</span>
          <el-button link type="primary" @click="downloadTemplate">
            <el-icon><Download /></el-icon>
            下载导入模板
          </el-button>
        </div>
        <el-upload
          drag
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          class="upload-area"
        >
          <el-icon :size="48" class="upload-icon"><Upload /></el-icon>
          <div class="upload-text">
            <em>点击上传</em> 或拖拽文件到此处
          </div>
          <template #tip>
            <div class="upload-tip">
              支持 .xlsx, .xls 格式，单个文件不超过 10MB
            </div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitImport" :loading="importLoading">开始导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import StatusTag from '../../../components/common/StatusTag.vue'
import { mockAccounts } from '../../../mock/admin'
import type { AccountItem } from '../../../types'

// 筛选表单
const filterForm = reactive({
  accountType: '',
  stage: '',
  status: '',
  keyword: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 数据列表
const accountList = ref<AccountItem[]>([])
const loading = ref(false)
const selectedRows = ref<AccountItem[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')
const accountForm = reactive({
  id: 0,
  username: '',
  realName: '',
  idCardNo: '',
  mobile: '',
  accountType: 'PRACTICE',
  stage: 'PRIMARY'
})
const formRef = ref()
const submitLoading = ref(false)

// 导入弹窗
const importDialogVisible = ref(false)
const importLoading = ref(false)
const importFile = ref<File | null>(null)

// 表单校验规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  accountType: [{ required: true, message: '请选择账号类型', trigger: 'change' }],
  stage: [{ required: true, message: '请选择学段', trigger: 'change' }]
}

// 加载数据
const loadData = () => {
  loading.value = true
  // 模拟 API 调用
  setTimeout(() => {
    let data = [...mockAccounts]
    
    // 筛选
    if (filterForm.accountType) {
      data = data.filter(item => item.accountType === filterForm.accountType)
    }
    if (filterForm.stage) {
      data = data.filter(item => item.stage === filterForm.stage)
    }
    if (filterForm.status) {
      data = data.filter(item => item.status === filterForm.status)
    }
    if (filterForm.keyword) {
      data = data.filter(item => 
        item.username.includes(filterForm.keyword) || 
        item.realName.includes(filterForm.keyword)
      )
    }
    
    pagination.total = data.length
    accountList.value = data.slice(
      (pagination.page - 1) * pagination.pageSize,
      pagination.page * pagination.pageSize
    )
    loading.value = false
  }, 300)
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

// 重置筛选
const resetFilter = () => {
  filterForm.accountType = ''
  filterForm.stage = ''
  filterForm.status = ''
  filterForm.keyword = ''
  handleSearch()
}

// 选择变化
const handleSelectionChange = (rows: AccountItem[]) => {
  selectedRows.value = rows
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadData()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadData()
}

// 显示创建弹窗
const showCreateDialog = () => {
  dialogType.value = 'create'
  Object.assign(accountForm, {
    id: 0,
    username: '',
    realName: '',
    idCardNo: '',
    mobile: '',
    accountType: 'PRACTICE',
    stage: 'PRIMARY'
  })
  dialogVisible.value = true
}

// 编辑账号
const editAccount = (row: AccountItem) => {
  dialogType.value = 'edit'
  Object.assign(accountForm, row)
  dialogVisible.value = true
}

// 查看详情
const viewDetail = (row: AccountItem) => {
  ElMessage.info(`查看账号详情: ${row.realName}`)
}

// 提交表单
const submitForm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  
  submitLoading.value = true
  setTimeout(() => {
    ElMessage.success(dialogType.value === 'create' ? '创建成功' : '更新成功')
    dialogVisible.value = false
    submitLoading.value = false
    loadData()
  }, 500)
}

// 重置密码
const resetPassword = (row: AccountItem) => {
  ElMessageBox.confirm(
    `确定要重置 ${row.realName} 的密码吗？`,
    '确认重置',
    { type: 'warning' }
  ).then(() => {
    ElMessage.success('密码已重置并复制到剪贴板')
  })
}

// 锁定账号
const lockAccount = (row: AccountItem) => {
  ElMessageBox.confirm(
    `确定要锁定 ${row.realName} 的账号吗？`,
    '确认锁定',
    { type: 'warning' }
  ).then(() => {
    row.status = 'LOCKED'
    ElMessage.success('账号已锁定')
  })
}

// 解锁账号
const unlockAccount = (row: AccountItem) => {
  row.status = 'ENABLED'
  ElMessage.success('账号已解锁')
}

// 删除账号
const deleteAccount = (row: AccountItem) => {
  ElMessageBox.confirm(
    `确定要删除 ${row.realName} 的账号吗？此操作不可恢复！`,
    '确认删除',
    { type: 'danger' }
  ).then(() => {
    accountList.value = accountList.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  })
}

// 获取账号类型文本
const getAccountTypeText = (type: string) => {
  const map: Record<string, string> = {
    'PRACTICE': '训练账号',
    'EXAM': '考试账号',
    'STAFF': '教师账号'
  }
  return map[type] || type
}

// 获取账号类型标签样式
const getAccountTypeType = (type: string) => {
  const map: Record<string, any> = {
    'PRACTICE': 'success',
    'EXAM': 'warning',
    'STAFF': 'primary'
  }
  return map[type] || 'info'
}

// 显示导入弹窗
const showImportDialog = () => {
  importDialogVisible.value = true
}

// 下载模板
const downloadTemplate = () => {
  ElMessage.success('模板下载中...')
}

// 文件选择
const handleFileChange = (file: any) => {
  importFile.value = file.raw
}

// 提交导入
const submitImport = () => {
  if (!importFile.value) {
    ElMessage.warning('请先选择文件')
    return
  }
  importLoading.value = true
  setTimeout(() => {
    ElMessage.success('导入成功，共导入 500 条记录')
    importDialogVisible.value = false
    importLoading.value = false
    loadData()
  }, 1500)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.accounts-page {
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

.user-info-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username-text {
  font-size: 14px;
  color: #1E293B;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.import-dialog-content {
  padding: 10px 0;
}

.template-download {
  margin-bottom: 20px;
  color: #64748B;
}

.upload-area {
  width: 100%;
}

.upload-area :deep(.el-upload-dragger) {
  width: 100%;
  padding: 40px 20px;
}

.upload-icon {
  color: #3B82F6;
  margin-bottom: 16px;
}

.upload-text {
  color: #64748B;
}

.upload-text em {
  color: #3B82F6;
  font-style: normal;
}

.upload-tip {
  margin-top: 12px;
  font-size: 12px;
  color: #94a3b8;
}

.mr-2 {
  margin-right: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
