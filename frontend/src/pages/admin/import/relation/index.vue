<template>
  <div class="relation-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div>
        <h1 class="page-title">关联列表</h1>
        <p class="page-subtitle">查看和管理指导老师与学生训练账号的关联关系</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="$router.push('/admin/import/relation/batch')">
          <el-icon class="mr-2"><DocumentAdd /></el-icon>
          批量关联
        </el-button>
        <el-button @click="$router.push('/admin/import/relation/adjust')">
          <el-icon class="mr-2"><Switch /></el-icon>
          关联调整
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon blue">
              <el-icon :size="28"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalTeachers }}</div>
              <div class="stat-label">指导教师数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon green">
              <el-icon :size="28"><UserFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalStudents }}</div>
              <div class="stat-label">已关联学生数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon orange">
              <el-icon :size="28"><Connection /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.avgStudentsPerTeacher }}</div>
              <div class="stat-label">人均带生数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon red">
              <el-icon :size="28"><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.unassignedStudents }}</div>
              <div class="stat-label">未分配学生数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选条件 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="指导教师">
          <el-select v-model="filterForm.teacherId" placeholder="选择教师" clearable filterable style="width: 180px">
            <el-option v-for="t in teacherOptions" :key="t.id" :label="t.name" :value="t.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="学段">
          <el-select v-model="filterForm.stage" placeholder="选择学段" clearable style="width: 120px">
            <el-option label="小学" value="PRIMARY" />
            <el-option label="初中" value="MIDDLE" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联方式">
          <el-select v-model="filterForm.relationType" placeholder="选择方式" clearable style="width: 120px">
            <el-option label="手工关联" value="MANUAL" />
            <el-option label="批量导入" value="BATCH" />
            <el-option label="系统自动" value="AUTO" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 关联列表 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">关联关系列表</span>
          <el-button text type="primary" @click="exportList">
            <el-icon class="mr-2"><Download /></el-icon>
            导出
          </el-button>
        </div>
      </template>
      <el-table :data="filteredRelations" stripe v-loading="loading">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="teacherName" label="指导教师" width="120" />
        <el-table-column prop="teacherStage" label="教师学段" width="100">
          <template #default="{ row }">
            <el-tag :type="row.teacherStage === 'PRIMARY' ? 'success' : 'primary'" size="small">
              {{ row.teacherStage === 'PRIMARY' ? '小学' : '初中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="studentName" label="学生姓名" width="120" />
        <el-table-column prop="studentIdCard" label="身份证号" min-width="180" />
        <el-table-column prop="studentStage" label="学生学段" width="100">
          <template #default="{ row }">
            <el-tag :type="row.studentStage === 'PRIMARY' ? 'success' : 'primary'" size="small">
              {{ row.studentStage === 'PRIMARY' ? '小学' : '初中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="relationType" label="关联方式" width="100">
          <template #default="{ row }">
            <el-tag :type="getRelationTypeType(row.relationType)" size="small">
              {{ getRelationTypeText(row.relationType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="关联时间" width="160" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="danger" @click="handleUnbind(row)">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 按教师查看 -->
    <el-card class="teacher-view-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">按教师查看</span>
        </div>
      </template>
      <el-collapse>
        <el-collapse-item v-for="teacher in teacherStudentMap" :key="teacher.teacherId">
          <template #title>
            <div class="collapse-title">
              <span class="teacher-name">{{ teacher.teacherName }}</span>
              <el-tag :type="teacher.teacherStage === 'PRIMARY' ? 'success' : 'primary'" size="small" class="ml-2">
                {{ teacher.teacherStage === 'PRIMARY' ? '小学' : '初中' }}
              </el-tag>
              <span class="student-count">带生数: {{ teacher.students.length }}</span>
            </div>
          </template>
          <el-table :data="teacher.students" size="small">
            <el-table-column prop="studentName" label="学生姓名" width="120" />
            <el-table-column prop="studentIdCard" label="身份证号" min-width="180" />
            <el-table-column prop="relationType" label="关联方式" width="100">
              <template #default="{ row }">
                <el-tag :type="getRelationTypeType(row.relationType)" size="small">
                  {{ getRelationTypeText(row.relationType) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="关联时间" width="160" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockTeacherStudentRelations, mockAccounts } from '../../../../mock/admin'
import type { TeacherStudentRelation } from '../../../../types'

// 筛选表单
const filterForm = reactive({
  teacherId: null as number | null,
  stage: '',
  relationType: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const loading = ref(false)

// 统计数据
const stats = computed(() => {
  const teacherIds = new Set(mockTeacherStudentRelations.map(r => r.teacherId))
  const studentIds = new Set(mockTeacherStudentRelations.map(r => r.studentId))
  const practiceStudents = mockAccounts.filter(a => a.accountType === 'PRACTICE')
  const unassigned = practiceStudents.length - studentIds.size

  return {
    totalTeachers: teacherIds.size,
    totalStudents: studentIds.size,
    avgStudentsPerTeacher: teacherIds.size > 0 ? (studentIds.size / teacherIds.size).toFixed(1) : '0',
    unassignedStudents: Math.max(0, unassigned)
  }
})

// 教师选项
const teacherOptions = computed(() => {
  return mockAccounts.filter(a => a.accountType === 'STAFF').map(t => ({ id: t.id, name: t.realName }))
})

// 筛选后的关联列表
const filteredRelations = computed(() => {
  let result = [...mockTeacherStudentRelations]

  if (filterForm.teacherId) {
    result = result.filter(r => r.teacherId === filterForm.teacherId)
  }
  if (filterForm.stage) {
    result = result.filter(r => r.studentStage === filterForm.stage)
  }
  if (filterForm.relationType) {
    result = result.filter(r => r.relationType === filterForm.relationType)
  }

  pagination.total = result.length
  const start = (pagination.page - 1) * pagination.pageSize
  return result.slice(start, start + pagination.pageSize)
})

// 按教师分组的学生映射
const teacherStudentMap = computed(() => {
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

// 获取关联方式标签类型
const getRelationTypeType = (type: string) => {
  const typeMap: Record<string, string> = {
    'MANUAL': 'primary',
    'BATCH': 'success',
    'AUTO': 'info'
  }
  return typeMap[type] || 'info'
}

// 获取关联方式文本
const getRelationTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    'MANUAL': '手工关联',
    'BATCH': '批量导入',
    'AUTO': '系统自动'
  }
  return textMap[type] || type
}

// 查询
const handleSearch = () => {
  pagination.page = 1
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
}

// 重置筛选
const resetFilter = () => {
  filterForm.teacherId = null
  filterForm.stage = ''
  filterForm.relationType = ''
  pagination.page = 1
}

// 解除关联
const handleUnbind = (row: TeacherStudentRelation) => {
  ElMessageBox.confirm(
    `确定要解除 ${row.teacherName} 与 ${row.studentName} 的关联关系吗？`,
    '确认解除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('解除关联成功')
  }).catch(() => {})
}

// 导出列表
const exportList = () => {
  ElMessage.success('正在导出关联列表...')
}

// 分页事件
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
}

const handlePageChange = (page: number) => {
  pagination.page = page
}

onMounted(() => {
  pagination.total = mockTeacherStudentRelations.length
})
</script>

<style scoped>
.relation-page {
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

.header-actions {
  display: flex;
  gap: 12px;
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  .stat-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;

    &.blue {
      background: linear-gradient(135deg, #3B82F6, #6366F1);
    }

    &.green {
      background: linear-gradient(135deg, #10B981, #059669);
    }

    &.orange {
      background: linear-gradient(135deg, #F59E0B, #D97706);
    }

    &.red {
      background: linear-gradient(135deg, #EF4444, #DC2626);
    }
  }

  .stat-info {
    flex: 1;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: #1E293B;
    line-height: 1.2;
  }

  .stat-label {
    font-size: 14px;
    color: #64748B;
    margin-top: 4px;
  }
}

.filter-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.teacher-view-card {
  margin-top: 24px;
}

.collapse-title {
  display: flex;
  align-items: center;
  flex: 1;
  padding-right: 16px;
}

.teacher-name {
  font-size: 16px;
  font-weight: 500;
  color: #1E293B;
}

.student-count {
  margin-left: auto;
  font-size: 14px;
  color: #64748B;
}

.ml-2 {
  margin-left: 8px;
}

.mr-2 {
  margin-right: 8px;
}
</style>
