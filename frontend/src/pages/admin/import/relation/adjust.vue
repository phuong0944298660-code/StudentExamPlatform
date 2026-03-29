<template>
  <div class="adjust-relation-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div>
        <h1 class="page-title">关联调整</h1>
        <p class="page-subtitle">修改或解除指导老师与学生训练账号的关联关系</p>
      </div>
      <el-button @click="$router.back()">
        <el-icon class="mr-2"><ArrowLeft /></el-icon>
        返回
      </el-button>
    </div>

    <!-- 调整方式选择 -->
    <el-row :gutter="20" class="adjust-types">
      <el-col :span="12">
        <div
          class="adjust-type-card"
          :class="{ active: adjustType === 'single' }"
          @click="adjustType = 'single'"
        >
          <div class="type-icon blue">
            <el-icon :size="32"><Edit /></el-icon>
          </div>
          <div class="type-content">
            <div class="type-title">单条调整</div>
            <div class="type-desc">为单个学生更换指导老师</div>
          </div>
          <el-icon v-if="adjustType === 'single'" class="type-check" :size="24"><Check /></el-icon>
        </div>
      </el-col>
      <el-col :span="12">
        <div
          class="adjust-type-card"
          :class="{ active: adjustType === 'batch' }"
          @click="adjustType = 'batch'"
        >
          <div class="type-icon green">
            <el-icon :size="32"><DocumentCopy /></el-icon>
          </div>
          <div class="type-content">
            <div class="type-title">批量转移</div>
            <div class="type-desc">将多个学生从原老师转移到新老师</div>
          </div>
          <el-icon v-if="adjustType === 'batch'" class="type-check" :size="24"><Check /></el-icon>
        </div>
      </el-col>
    </el-row>

    <!-- 单条调整 -->
    <template v-if="adjustType === 'single'">
      <el-card>
        <template #header>
          <span class="card-title">单条关联调整</span>
        </template>

        <el-steps :active="singleStep" finish-status="success" simple>
          <el-step title="选择学生" />
          <el-step title="选择新教师" />
          <el-step title="确认调整" />
        </el-steps>

        <!-- 步骤1：选择学生 -->
        <div v-if="singleStep === 0" class="step-content">
          <el-form :model="singleForm" label-width="100px">
            <el-form-item label="学生姓名">
              <el-input
                v-model="singleForm.studentSearch"
                placeholder="输入姓名或身份证号搜索"
                clearable
                style="width: 300px"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-form>

          <el-table :data="filteredStudents" stripe @row-click="selectStudent" highlight-current-row>
            <el-table-column prop="studentName" label="学生姓名" width="120" />
            <el-table-column prop="studentIdCard" label="身份证号" min-width="180" />
            <el-table-column prop="teacherName" label="当前教师" width="120" />
            <el-table-column prop="studentStage" label="学段" width="100">
              <template #default="{ row }">
                <el-tag :type="row.studentStage === 'PRIMARY' ? 'success' : 'primary'" size="small">
                  {{ row.studentStage === 'PRIMARY' ? '小学' : '初中' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template #default>
                <el-button link type="primary">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 步骤2：选择新教师 -->
        <div v-if="singleStep === 1" class="step-content">
          <el-alert
            :title="`当前学生: ${selectedStudent?.studentName} (${selectedStudent?.studentIdCard}) - 原教师: ${selectedStudent?.teacherName}`"
            type="info"
            :closable="false"
            class="mb-4"
          />

          <el-form :model="singleForm" label-width="100px">
            <el-form-item label="新指导教师">
              <el-select v-model="singleForm.newTeacherId" placeholder="选择新教师" filterable style="width: 300px">
                <el-option
                  v-for="t in availableTeachers"
                  :key="t.id"
                  :label="`${t.name} (${t.stage === 'PRIMARY' ? '小学' : '初中'})`"
                  :value="t.id"
                />
              </el-select>
            </el-form-item>
          </el-form>

          <div class="step-actions">
            <el-button @click="singleStep = 0">上一步</el-button>
            <el-button type="primary" @click="singleStep = 2" :disabled="!singleForm.newTeacherId">下一步</el-button>
          </div>
        </div>

        <!-- 步骤3：确认调整 -->
        <div v-if="singleStep === 2" class="step-content">
          <el-descriptions title="调整信息确认" :column="1" border>
            <el-descriptions-item label="学生姓名">{{ selectedStudent?.studentName }}</el-descriptions-item>
            <el-descriptions-item label="身份证号">{{ selectedStudent?.studentIdCard }}</el-descriptions-item>
            <el-descriptions-item label="原指导教师">{{ selectedStudent?.teacherName }}</el-descriptions-item>
            <el-descriptions-item label="新指导教师">{{ getTeacherName(singleForm.newTeacherId) }}</el-descriptions-item>
          </el-descriptions>

          <el-alert
            title="注意：调整后将立即生效，学生将能看到新教师发布的练习卷"
            type="warning"
            :closable="false"
            class="mt-4"
          />

          <div class="step-actions">
            <el-button @click="singleStep = 1">上一步</el-button>
            <el-button type="primary" @click="confirmSingleAdjust">确认调整</el-button>
          </div>
        </div>
      </el-card>
    </template>

    <!-- 批量转移 -->
    <template v-if="adjustType === 'batch'">
      <el-card>
        <template #header>
          <span class="card-title">批量关联转移</span>
        </template>

        <el-steps :active="batchStep" finish-status="success" simple>
          <el-step title="选择原教师" />
          <el-step title="选择学生" />
          <el-step title="选择新教师" />
          <el-step title="确认转移" />
        </el-steps>

        <!-- 步骤1：选择原教师 -->
        <div v-if="batchStep === 0" class="step-content">
          <el-form :model="batchForm" label-width="120px">
            <el-form-item label="原指导教师">
              <el-select v-model="batchForm.oldTeacherId" placeholder="选择原教师" filterable style="width: 300px">
                <el-option
                  v-for="t in teacherOptions"
                  :key="t.teacherId"
                  :label="`${t.teacherName} (${t.teacherStage === 'PRIMARY' ? '小学' : '初中'}) - 带生${t.students.length}人`"
                  :value="t.teacherId"
                />
              </el-select>
            </el-form-item>
          </el-form>

          <div class="step-actions">
            <el-button type="primary" @click="batchStep = 1" :disabled="!batchForm.oldTeacherId">下一步</el-button>
          </div>
        </div>

        <!-- 步骤2：选择学生 -->
        <div v-if="batchStep === 1" class="step-content">
          <el-alert
            :title="`原教师: ${getOldTeacherName} - 共 ${oldTeacherStudents.length} 名学生`"
            type="info"
            :closable="false"
            class="mb-4"
          />

          <el-table
            :data="oldTeacherStudents"
            stripe
            @selection-change="handleBatchSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="studentName" label="学生姓名" width="120" />
            <el-table-column prop="studentIdCard" label="身份证号" min-width="180" />
            <el-table-column prop="relationType" label="关联方式" width="100">
              <template #default="{ row }">
                <el-tag size="small">{{ row.relationType === 'MANUAL' ? '手工' : '批量' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>

          <div class="step-actions">
            <el-button @click="batchStep = 0">上一步</el-button>
            <el-button type="primary" @click="batchStep = 2" :disabled="batchSelectedStudents.length === 0">
              下一步 (已选{{ batchSelectedStudents.length }}人)
            </el-button>
          </div>
        </div>

        <!-- 步骤3：选择新教师 -->
        <div v-if="batchStep === 2" class="step-content">
          <el-alert
            :title="`已选择 ${batchSelectedStudents.length} 名学生进行转移`"
            type="info"
            :closable="false"
            class="mb-4"
          />

          <el-form :model="batchForm" label-width="120px">
            <el-form-item label="新指导教师">
              <el-select v-model="batchForm.newTeacherId" placeholder="选择新教师" filterable style="width: 300px">
                <el-option
                  v-for="t in availableBatchTeachers"
                  :key="t.teacherId"
                  :label="`${t.teacherName} (${t.teacherStage === 'PRIMARY' ? '小学' : '初中'})`"
                  :value="t.teacherId"
                />
              </el-select>
            </el-form-item>
          </el-form>

          <div class="step-actions">
            <el-button @click="batchStep = 1">上一步</el-button>
            <el-button type="primary" @click="batchStep = 3" :disabled="!batchForm.newTeacherId">下一步</el-button>
          </div>
        </div>

        <!-- 步骤4：确认转移 -->
        <div v-if="batchStep === 3" class="step-content">
          <el-descriptions title="转移信息确认" :column="1" border>
            <el-descriptions-item label="转移学生数">{{ batchSelectedStudents.length }}人</el-descriptions-item>
            <el-descriptions-item label="原指导教师">{{ getOldTeacherName }}</el-descriptions-item>
            <el-descriptions-item label="新指导教师">{{ getNewTeacherName }}</el-descriptions-item>
          </el-descriptions>

          <el-alert
            title="注意：批量转移后将立即生效，请仔细核对信息"
            type="warning"
            :closable="false"
            class="mt-4"
          />

          <div class="step-actions">
            <el-button @click="batchStep = 2">上一步</el-button>
            <el-button type="primary" @click="confirmBatchAdjust">确认转移</el-button>
          </div>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockTeacherStudentRelations, mockAccounts } from '../../../../mock/admin'
import type { TeacherStudentRelation } from '../../../../types'

const adjustType = ref<'single' | 'batch'>('single')

// ========== 单条调整 ==========
const singleStep = ref(0)
const singleForm = reactive({
  studentSearch: '',
  newTeacherId: null as number | null
})
const selectedStudent = ref<TeacherStudentRelation | null>(null)

const filteredStudents = computed(() => {
  let result = [...mockTeacherStudentRelations]
  if (singleForm.studentSearch) {
    const keyword = singleForm.studentSearch.toLowerCase()
    result = result.filter(s =>
      s.studentName.toLowerCase().includes(keyword) ||
      s.studentIdCard.includes(keyword)
    )
  }
  return result
})

const availableTeachers = computed(() => {
  const currentStage = selectedStudent.value?.studentStage
  return mockAccounts.filter(a =>
    a.accountType === 'STAFF' &&
    a.stage === currentStage
  ).map(t => ({ id: t.id, name: t.realName, stage: t.stage }))
})

const selectStudent = (row: TeacherStudentRelation) => {
  selectedStudent.value = row
  singleStep.value = 1
}

const getTeacherName = (id: number | null) => {
  if (!id) return ''
  const teacher = mockAccounts.find(a => a.id === id)
  return teacher?.realName || ''
}

const confirmSingleAdjust = () => {
  ElMessageBox.confirm(
    `确定将 ${selectedStudent.value?.studentName} 的关联教师从 ${selectedStudent.value?.teacherName} 调整为 ${getTeacherName(singleForm.newTeacherId)} 吗？`,
    '确认调整',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('关联调整成功')
    resetSingleForm()
  }).catch(() => {})
}

const resetSingleForm = () => {
  singleStep.value = 0
  singleForm.studentSearch = ''
  singleForm.newTeacherId = null
  selectedStudent.value = null
}

// ========== 批量转移 ==========
const batchStep = ref(0)
const batchForm = reactive({
  oldTeacherId: null as number | null,
  newTeacherId: null as number | null
})
const batchSelectedStudents = ref<TeacherStudentRelation[]>([])

const teacherOptions = computed(() => {
  const map = new Map()
  mockTeacherStudentRelations.forEach(r => {
    if (!map.has(r.teacherId)) {
      map.set(r.teacherId, {
        teacherId: r.teacherId,
        teacherName: r.teacherName,
        teacherStage: r.teacherStage,
        students: []
      })
    }
    map.get(r.teacherId).students.push(r)
  })
  return Array.from(map.values())
})

const oldTeacherStudents = computed(() => {
  if (!batchForm.oldTeacherId) return []
  return mockTeacherStudentRelations.filter(r => r.teacherId === batchForm.oldTeacherId)
})

const getOldTeacherName = computed(() => {
  const teacher = teacherOptions.value.find(t => t.teacherId === batchForm.oldTeacherId)
  return teacher?.teacherName || ''
})

const availableBatchTeachers = computed(() => {
  const oldTeacher = teacherOptions.value.find(t => t.teacherId === batchForm.oldTeacherId)
  if (!oldTeacher) return []
  return teacherOptions.value.filter(t =>
    t.teacherId !== batchForm.oldTeacherId &&
    t.teacherStage === oldTeacher.teacherStage
  )
})

const getNewTeacherName = computed(() => {
  const teacher = availableBatchTeachers.value.find(t => t.teacherId === batchForm.newTeacherId)
  return teacher?.teacherName || ''
})

const handleBatchSelectionChange = (selection: TeacherStudentRelation[]) => {
  batchSelectedStudents.value = selection
}

const confirmBatchAdjust = () => {
  ElMessageBox.confirm(
    `确定将 ${batchSelectedStudents.value.length} 名学生从 ${getOldTeacherName.value} 转移到 ${getNewTeacherName.value} 吗？`,
    '确认批量转移',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('批量转移成功')
    resetBatchForm()
  }).catch(() => {})
}

const resetBatchForm = () => {
  batchStep.value = 0
  batchForm.oldTeacherId = null
  batchForm.newTeacherId = null
  batchSelectedStudents.value = []
}
</script>

<style scoped>
.adjust-relation-page {
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

.adjust-types {
  margin-bottom: 24px;
}

.adjust-type-card {
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

.adjust-type-card:hover {
  border-color: #3B82F6;
}

.adjust-type-card.active {
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

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
}

.step-content {
  padding: 24px 0;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-4 {
  margin-top: 16px;
}

.mr-2 {
  margin-right: 8px;
}
</style>
