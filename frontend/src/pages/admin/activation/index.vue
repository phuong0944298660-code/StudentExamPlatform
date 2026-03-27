<template>
  <div class="activation-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div>
        <h1 class="page-title">码池管理</h1>
        <p class="page-subtitle">生成和管理训练账号、教师账号的激活码</p>
      </div>
      <div class="page-actions">
        <el-button type="primary" @click="showGenerateDialog">
          <el-icon class="mr-2"><Plus /></el-icon>
          生成激活码
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value text-blue">1,256</div>
          <div class="stat-label">总激活码数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value text-green">892</div>
          <div class="stat-label">已激活</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value text-orange">256</div>
          <div class="stat-label">生效中</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value text-gray">108</div>
          <div class="stat-label">未生效/已过期</div>
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
        <el-form-item label="角色">
          <el-select v-model="filterForm.targetRole" placeholder="全部角色" clearable style="width: 140px">
            <el-option label="学生" value="STUDENT" />
            <el-option label="教师" value="TEACHER" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 140px">
            <el-option label="未生效" value="NOT_EFFECTIVE" />
            <el-option label="生效中" value="ACTIVE" />
            <el-option label="已使用" value="USED" />
            <el-option label="已过期" value="EXPIRED" />
          </el-select>
        </el-form-item>
        <el-form-item label="激活码">
          <el-input v-model="filterForm.code" placeholder="输入激活码" clearable style="width: 200px" />
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
      <el-table :data="codeList" v-loading="loading" stripe>
        <el-table-column prop="code" label="激活码" min-width="200" />
        <el-table-column prop="stage" label="学段" width="80">
          <template #default="{ row }">
            {{ row.stage === 'PRIMARY' ? '小学' : '初中' }}
          </template>
        </el-table-column>
        <el-table-column prop="targetRole" label="目标角色" width="90">
          <template #default="{ row }">
            <el-tag :type="row.targetRole === 'TEACHER' ? 'primary' : 'success'" size="small">
              {{ row.targetRole === 'TEACHER' ? '教师' : '学生' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="validFrom" label="生效时间" width="160" />
        <el-table-column prop="validTo" label="失效时间" width="160" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <status-tag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column prop="usedBy" label="使用者" width="100">
          <template #default="{ row }">
            {{ row.usedBy || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button 
              v-if="row.status === 'EXPIRED'" 
              link 
              type="primary" 
              @click="showReactivateDialog(row)"
            >
              重新激活
            </el-button>
            <el-button link type="primary" @click="copyCode(row)">复制</el-button>
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

    <!-- 生成激活码弹窗 -->
    <el-dialog v-model="generateDialogVisible" title="生成激活码" width="500px">
      <el-form :model="generateForm" label-width="100px" :rules="rules" ref="generateFormRef">
        <el-form-item label="学段" prop="stage">
          <el-radio-group v-model="generateForm.stage">
            <el-radio-button label="PRIMARY">小学</el-radio-button>
            <el-radio-button label="MIDDLE">初中</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="targetRole">
          <el-radio-group v-model="generateForm.targetRole">
            <el-radio-button label="STUDENT">学生</el-radio-button>
            <el-radio-button label="TEACHER">教师</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生成数量" prop="count">
          <el-input-number v-model="generateForm.count" :min="1" :max="1000" :step="10" />
        </el-form-item>
        <el-form-item label="有效期" prop="durationType">
          <el-radio-group v-model="generateForm.durationType">
            <el-radio-button label="3months">3个月</el-radio-button>
            <el-radio-button label="6months">半年</el-radio-button>
            <el-radio-button label="1year">1年</el-radio-button>
            <el-radio-button label="custom">自定义</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="generateForm.durationType === 'custom'" label="自定义时间">
          <el-date-picker
            v-model="generateForm.customDateRange"
            type="daterange"
            start-placeholder="生效日期"
            end-placeholder="失效日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="generateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitGenerate" :loading="generateLoading">生成</el-button>
      </template>
    </el-dialog>

    <!-- 重新激活弹窗 -->
    <el-dialog v-model="reactivateDialogVisible" title="重新激活" width="450px">
      <el-alert
        title="重新激活将延长激活码的有效期"
        description="可选择立即生效或设置未来生效时间，默认周期与上次一致"
        type="info"
        :closable="false"
        class="mb-4"
      />
      <el-form :model="reactivateForm" label-width="100px">
        <el-form-item label="激活码">
          <el-input v-model="reactivateForm.code" disabled />
        </el-form-item>
        <el-form-item label="生效方式">
          <el-radio-group v-model="reactivateForm.reactivateType">
            <el-radio label="immediate">立即生效</el-radio>
            <el-radio label="future">未来生效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="reactivateForm.reactivateType === 'future'" label="生效时间">
          <el-date-picker
            v-model="reactivateForm.validFrom"
            type="datetime"
            placeholder="选择生效时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="有效期">
          <el-select v-model="reactivateForm.durationType" style="width: 100%">
            <el-option label="3个月（默认）" value="3months" />
            <el-option label="半年" value="6months" />
            <el-option label="1年" value="1year" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reactivateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReactivate" :loading="reactivateLoading">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import StatusTag from '../../../components/common/StatusTag.vue'
import { mockActivationCodes } from '../../../mock/admin'
import type { ActivationCode } from '../../../types'

// 筛选表单
const filterForm = reactive({
  stage: '',
  targetRole: '',
  status: '',
  code: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 数据列表
const codeList = ref<ActivationCode[]>([])
const loading = ref(false)

// 生成弹窗
const generateDialogVisible = ref(false)
const generateLoading = ref(false)
const generateFormRef = ref()
const generateForm = reactive({
  stage: 'PRIMARY',
  targetRole: 'STUDENT',
  count: 100,
  durationType: '3months',
  customDateRange: [] as Date[]
})

// 重新激活弹窗
const reactivateDialogVisible = ref(false)
const reactivateLoading = ref(false)
const reactivateForm = reactive({
  id: 0,
  code: '',
  reactivateType: 'immediate',
  validFrom: '',
  durationType: '3months'
})

// 校验规则
const rules = {
  stage: [{ required: true, message: '请选择学段', trigger: 'change' }],
  targetRole: [{ required: true, message: '请选择角色', trigger: 'change' }],
  count: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  durationType: [{ required: true, message: '请选择有效期', trigger: 'change' }]
}

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    let data = [...mockActivationCodes]
    
    if (filterForm.stage) {
      data = data.filter(item => item.stage === filterForm.stage)
    }
    if (filterForm.targetRole) {
      data = data.filter(item => item.targetRole === filterForm.targetRole)
    }
    if (filterForm.status) {
      data = data.filter(item => item.status === filterForm.status)
    }
    if (filterForm.code) {
      data = data.filter(item => item.code.includes(filterForm.code))
    }
    
    pagination.total = data.length
    codeList.value = data.slice(
      (pagination.page - 1) * pagination.pageSize,
      pagination.page * pagination.pageSize
    )
    loading.value = false
  }, 300)
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const resetFilter = () => {
  filterForm.stage = ''
  filterForm.targetRole = ''
  filterForm.status = ''
  filterForm.code = ''
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

const showGenerateDialog = () => {
  generateForm.stage = 'PRIMARY'
  generateForm.targetRole = 'STUDENT'
  generateForm.count = 100
  generateForm.durationType = '3months'
  generateForm.customDateRange = []
  generateDialogVisible.value = true
}

const submitGenerate = async () => {
  const valid = await generateFormRef.value?.validate().catch(() => false)
  if (!valid) return
  
  generateLoading.value = true
  setTimeout(() => {
    ElMessage.success(`成功生成 ${generateForm.count} 个激活码`)
    generateDialogVisible.value = false
    generateLoading.value = false
    loadData()
  }, 800)
}

const showReactivateDialog = (row: ActivationCode) => {
  reactivateForm.id = row.id
  reactivateForm.code = row.code
  reactivateForm.reactivateType = 'immediate'
  reactivateForm.durationType = '3months'
  reactivateDialogVisible.value = true
}

const submitReactivate = () => {
  reactivateLoading.value = true
  setTimeout(() => {
    const status = reactivateForm.reactivateType === 'immediate' ? 'ACTIVE' : 'NOT_EFFECTIVE'
    const item = codeList.value.find(i => i.id === reactivateForm.id)
    if (item) {
      item.status = status
    }
    ElMessage.success('重新激活成功')
    reactivateDialogVisible.value = false
    reactivateLoading.value = false
  }, 500)
}

const copyCode = (row: ActivationCode) => {
  navigator.clipboard.writeText(row.code).then(() => {
    ElMessage.success('激活码已复制')
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.activation-page {
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

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.mb-4 {
  margin-bottom: 16px;
}

.mr-2 {
  margin-right: 8px;
}
</style>
