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
        <el-table-column label="角色" width="140" v-if="showRoleColumn">
          <template #default="{ row }">
            <el-tooltip v-if="row.accountType === 'STAFF'" :content="getRoleTooltip(row.id)" placement="top">
              <div class="role-tags">
                <el-tag v-for="role in getAccountRoles(row.id)" :key="role" size="small" class="mr-1">
                  {{ getRoleText(role) }}
                </el-tag>
                <el-button v-if="row.accountType === 'STAFF'" link type="primary" size="small" @click="showRoleDialog(row)">
                  配置
                </el-button>
              </div>
            </el-tooltip>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <!-- 训练账号显示指导教师 -->
        <el-table-column label="指导教师" width="160" v-if="showTeacherColumn">
          <template #default="{ row }">
            <div v-if="row.accountType === 'PRACTICE'">
              <template v-if="getStudentTeacher(row.id)">
                <el-tag size="small" type="success">{{ getStudentTeacher(row.id)?.teacherName }}</el-tag>
                <el-button link type="primary" size="small" @click="showChangeTeacherDialog(row)">更换</el-button>
              </template>
              <el-button v-else link type="primary" size="small" @click="showAssignTeacherDialog(row)">分配教师</el-button>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <!-- 教师账号显示带生数 -->
        <el-table-column label="带生数" width="120" v-if="showStudentCountColumn">
          <template #default="{ row }">
            <div v-if="row.accountType === 'STAFF'">
              <el-badge :value="getTeacherStudentCount(row.id)" :max="99" type="primary">
                <el-button link type="primary" size="small" @click="showTeacherStudents(row)">查看</el-button>
              </el-badge>
              <el-button link type="warning" size="small" @click="showBatchTransferDialog(row)" class="ml-2">转移</el-button>
            </div>
            <span v-else>-</span>
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
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
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
            </div>
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

    <!-- 角色配置弹窗 -->
    <el-dialog
      v-model="roleDialogVisible"
      :title="`配置角色 - ${currentRoleUser?.realName || ''}`"
      width="500px"
    >
      <el-alert
        title="请为该教师账号配置角色权限"
        type="info"
        :closable="false"
        class="mb-4"
      />
      <el-form :model="roleForm" label-width="100px">
        <el-form-item label="角色权限">
          <el-checkbox-group v-model="roleForm.roles">
            <el-checkbox label="TEACHER">指导老师（可组卷、查看学情）</el-checkbox>
            <el-checkbox label="REVIEWER">评卷老师（可评卷、处理复查）</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <div class="role-tips">
            <p>角色说明：</p>
            <ul>
              <li>指导老师：可创建练习卷、查看所带学生学情</li>
              <li>评卷老师：可对主观题进行评分、处理复查申请</li>
              <li>可同时拥有两个角色，权限叠加</li>
            </ul>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRoleConfig">确认配置</el-button>
      </template>
    </el-dialog>

    <!-- 分配教师弹窗 -->
    <el-dialog
      v-model="assignTeacherDialogVisible"
      :title="`分配教师 - ${currentStudent?.realName || ''}`"
      width="500px"
    >
      <el-form label-width="100px">
        <el-form-item label="学生">
          <el-input :model-value="currentStudent?.realName" disabled />
        </el-form-item>
        <el-form-item label="学段">
          <el-tag>{{ currentStudent?.stage === 'PRIMARY' ? '小学' : '初中' }}</el-tag>
        </el-form-item>
        <el-form-item label="指导教师">
          <el-select v-model="selectedTeacherId" placeholder="选择教师" filterable style="width: 100%">
            <el-option
              v-for="t in teacherOptions.filter(t => t.stage === currentStudent?.stage)"
              :key="t.id"
              :label="t.name"
              :value="t.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignTeacherDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAssignTeacher" :disabled="!selectedTeacherId">确认分配</el-button>
      </template>
    </el-dialog>

    <!-- 更换教师弹窗 -->
    <el-dialog
      v-model="changeTeacherDialogVisible"
      :title="`更换教师 - ${currentStudent?.realName || ''}`"
      width="500px"
    >
      <el-alert
        :title="`当前教师: ${getStudentTeacher(currentStudent?.id || 0)?.teacherName || ''}`"
        type="info"
        :closable="false"
        class="mb-4"
      />
      <el-form label-width="100px">
        <el-form-item label="新指导教师">
          <el-select v-model="selectedTeacherId" placeholder="选择新教师" filterable style="width: 100%">
            <el-option
              v-for="t in teacherOptions.filter(t => t.stage === currentStudent?.stage && t.id !== getStudentTeacher(currentStudent?.id || 0)?.teacherId)"
              :key="t.id"
              :label="t.name"
              :value="t.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="changeTeacherDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitChangeTeacher" :disabled="!selectedTeacherId">确认更换</el-button>
      </template>
    </el-dialog>

    <!-- 教师学生列表弹窗 -->
    <el-dialog
      v-model="teacherStudentsDialogVisible"
      :title="`${currentTeacher?.realName} 的学生列表（${teacherStudentList.length}人）`"
      width="700px"
    >
      <el-table :data="teacherStudentList" stripe max-height="400">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="studentName" label="学生姓名" width="120" />
        <el-table-column prop="studentIdCard" label="身份证号" min-width="180" />
        <el-table-column prop="relationType" label="关联方式" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ row.relationType === 'MANUAL' ? '手工' : '批量' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="关联时间" width="160" />
      </el-table>
      <template #footer>
        <el-button @click="teacherStudentsDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="teacherStudentsDialogVisible = false; showBatchTransferDialog(currentTeacher!)">批量转移</el-button>
      </template>
    </el-dialog>

    <!-- 批量转移弹窗 -->
    <el-dialog
      v-model="batchTransferDialogVisible"
      :title="`批量转移学生 - ${currentTeacher?.realName}`"
      width="800px"
    >
      <el-alert
        title="请选择要转移的学生和目标教师"
        type="info"
        :closable="false"
        class="mb-4"
      />
      <el-row :gutter="20">
        <el-col :span="14">
          <el-card>
            <template #header>
              <span>选择学生（已选 {{ transferSelectedStudents.length }} 人）</span>
            </template>
            <el-table
              :data="teacherStudentList"
              stripe
              height="300"
              @selection-change="transferSelectedStudents = $event"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="studentName" label="学生姓名" width="120" />
              <el-table-column prop="studentIdCard" label="身份证号" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card>
            <template #header>
              <span>目标教师</span>
            </template>
            <el-form label-width="80px">
              <el-form-item label="原教师">
                <el-input :model-value="currentTeacher?.realName" disabled />
              </el-form-item>
              <el-form-item label="学段">
                <el-tag>{{ currentTeacher?.stage === 'PRIMARY' ? '小学' : '初中' }}</el-tag>
              </el-form-item>
              <el-form-item label="新教师">
                <el-select v-model="transferTargetTeacherId" placeholder="选择新教师" style="width: 100%">
                  <el-option
                    v-for="t in getAvailableTargetTeachers"
                    :key="t.id"
                    :label="t.realName"
                    :value="t.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <template #footer>
        <el-button @click="batchTransferDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitBatchTransfer"
          :disabled="transferSelectedStudents.length === 0 || !transferTargetTeacherId"
        >
          确认转移（{{ transferSelectedStudents.length }}人）
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
import StatusTag from '../../../components/common/StatusTag.vue'
import { mockAccounts, mockTeacherRoles, mockTeacherStudentRelations } from '../../../mock/admin'
import type { AccountItem, TeacherRole, TeacherStudentRelation } from '../../../types'

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

// 角色配置弹窗
const roleDialogVisible = ref(false)
const roleForm = reactive({
  userId: 0,
  roles: [] as TeacherRole[]
})
const currentRoleUser = ref<AccountItem | null>(null)

// 分配/更换教师弹窗
const assignTeacherDialogVisible = ref(false)
const changeTeacherDialogVisible = ref(false)
const teacherStudentsDialogVisible = ref(false)
const batchTransferDialogVisible = ref(false)
const currentStudent = ref<AccountItem | null>(null)
const currentTeacher = ref<AccountItem | null>(null)
const selectedTeacherId = ref<number | null>(null)
const teacherStudentList = ref<TeacherStudentRelation[]>([])
const transferSelectedStudents = ref<TeacherStudentRelation[]>([])
const transferTargetTeacherId = ref<number | null>(null)

// 教师选项（同段段的教师）
const teacherOptions = computed(() => {
  return mockAccounts.filter(a => a.accountType === 'STAFF').map(t => ({
    id: t.id,
    name: t.realName,
    stage: t.stage
  }))
})

// 获取学生关联的教师
const getStudentTeacher = (studentId: number) => {
  return mockTeacherStudentRelations.find(r => r.studentId === studentId)
}

// 获取教师带生数
const getTeacherStudentCount = (teacherId: number) => {
  return mockTeacherStudentRelations.filter(r => r.teacherId === teacherId).length
}

// 显示分配教师弹窗
const showAssignTeacherDialog = (row: AccountItem) => {
  currentStudent.value = row
  selectedTeacherId.value = null
  assignTeacherDialogVisible.value = true
}

// 显示更换教师弹窗
const showChangeTeacherDialog = (row: AccountItem) => {
  currentStudent.value = row
  const currentRelation = getStudentTeacher(row.id)
  selectedTeacherId.value = currentRelation?.teacherId || null
  changeTeacherDialogVisible.value = true
}

// 显示教师学生列表弹窗
const showTeacherStudents = (row: AccountItem) => {
  currentTeacher.value = row
  teacherStudentList.value = mockTeacherStudentRelations.filter(r => r.teacherId === row.id)
  teacherStudentsDialogVisible.value = true
}

// 显示批量转移弹窗
const showBatchTransferDialog = (row: AccountItem) => {
  currentTeacher.value = row
  teacherStudentList.value = mockTeacherStudentRelations.filter(r => r.teacherId === row.id)
  transferSelectedStudents.value = []
  transferTargetTeacherId.value = null
  batchTransferDialogVisible.value = true
}

// 提交分配教师
const submitAssignTeacher = () => {
  if (!selectedTeacherId.value || !currentStudent.value) return

  const teacher = mockAccounts.find(a => a.id === selectedTeacherId.value)
  if (!teacher) return

  // 添加到关联列表
  mockTeacherStudentRelations.push({
    id: Date.now(),
    teacherId: teacher.id,
    teacherName: teacher.realName,
    teacherStage: teacher.stage!,
    studentId: currentStudent.value.id,
    studentName: currentStudent.value.realName,
    studentIdCard: currentStudent.value.username,
    studentStage: currentStudent.value.stage,
    relationType: 'MANUAL',
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
  })

  ElMessage.success(`已成功将 ${currentStudent.value.realName} 分配给 ${teacher.realName}`)
  assignTeacherDialogVisible.value = false
}

// 提交更换教师
const submitChangeTeacher = () => {
  if (!selectedTeacherId.value || !currentStudent.value) return

  const relation = mockTeacherStudentRelations.find(r => r.studentId === currentStudent.value!.id)
  const newTeacher = mockAccounts.find(a => a.id === selectedTeacherId.value)

  if (!relation || !newTeacher) return

  // 更新关联
  relation.teacherId = newTeacher.id
  relation.teacherName = newTeacher.realName
  relation.teacherStage = newTeacher.stage!
  relation.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')

  ElMessage.success(`已成功将 ${currentStudent.value.realName} 更换到 ${newTeacher.realName}`)
  changeTeacherDialogVisible.value = false
}

// 提交批量转移
const submitBatchTransfer = () => {
  if (!transferTargetTeacherId.value || transferSelectedStudents.value.length === 0) return

  const targetTeacher = mockAccounts.find(a => a.id === transferTargetTeacherId.value)
  if (!targetTeacher) return

  // 更新所有选中学生的关联
  transferSelectedStudents.value.forEach(student => {
    const relation = mockTeacherStudentRelations.find(r => r.studentId === student.studentId)
    if (relation) {
      relation.teacherId = targetTeacher.id
      relation.teacherName = targetTeacher.realName
      relation.teacherStage = targetTeacher.stage!
      relation.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
  })

  ElMessage.success(`已成功转移 ${transferSelectedStudents.value.length} 名学生到 ${targetTeacher.realName}`)
  batchTransferDialogVisible.value = false
  teacherStudentList.value = mockTeacherStudentRelations.filter(r => r.teacherId === currentTeacher.value!.id)
}

// 获取可用目标教师（排除当前教师，同段段）
const getAvailableTargetTeachers = computed(() => {
  if (!currentTeacher.value) return []
  return mockAccounts.filter(a =>
    a.accountType === 'STAFF' &&
    a.id !== currentTeacher.value!.id &&
    a.stage === currentTeacher.value!.stage
  )
})

// 是否显示角色列（当筛选教师账号或全部时显示）
const showRoleColumn = computed(() => {
  return !filterForm.accountType || filterForm.accountType === 'STAFF'
})

// 是否显示指导教师列（当筛选训练账号或全部时显示）
const showTeacherColumn = computed(() => {
  return !filterForm.accountType || filterForm.accountType === 'PRACTICE'
})

// 是否显示带生数列（当筛选教师账号或全部时显示）
const showStudentCountColumn = computed(() => {
  return !filterForm.accountType || filterForm.accountType === 'STAFF'
})

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
    { type: 'error' }
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

// 获取账号角色
const getAccountRoles = (userId: number): TeacherRole[] => {
  const roleConfig = mockTeacherRoles.find(r => r.userId === userId)
  return roleConfig?.roles || []
}

// 获取角色显示文本
const getRoleText = (role: TeacherRole): string => {
  const textMap: Record<string, string> = {
    'TEACHER': '指导',
    'REVIEWER': '评卷',
    'TEACHER_REVIEWER': '双角色'
  }
  return textMap[role] || role
}

// 获取角色tooltip
const getRoleTooltip = (userId: number): string => {
  const roles = getAccountRoles(userId)
  if (roles.includes('TEACHER') && roles.includes('REVIEWER')) {
    return '该账号同时拥有指导老师和评卷老师权限'
  } else if (roles.includes('TEACHER')) {
    return '该账号为指导老师'
  } else if (roles.includes('REVIEWER')) {
    return '该账号为评卷老师'
  }
  return '点击配置角色权限'
}

// 显示角色配置弹窗
const showRoleDialog = (row: AccountItem) => {
  if (row.accountType !== 'STAFF') {
    ElMessage.warning('只有教师账号可以配置角色')
    return
  }
  currentRoleUser.value = row
  roleForm.userId = row.id
  roleForm.roles = [...getAccountRoles(row.id)]
  roleDialogVisible.value = true
}

// 提交角色配置
const submitRoleConfig = () => {
  const userId = roleForm.userId
  const existingConfig = mockTeacherRoles.find(r => r.userId === userId)

  if (existingConfig) {
    existingConfig.roles = [...roleForm.roles]
  } else {
    mockTeacherRoles.push({
      userId: userId,
      roles: [...roleForm.roles]
    })
  }

  ElMessage.success('角色配置成功')
  roleDialogVisible.value = false
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

.table-actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  white-space: nowrap;
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
