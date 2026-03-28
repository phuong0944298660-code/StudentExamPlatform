<template>
  <div class="paper-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">组卷管理</h1>
        <p class="page-subtitle">配置考试卷和练习卷，设置题目组成和分值</p>
      </div>
      <div class="page-actions">
        <el-button @click="showImportDialog">
          <el-icon class="mr-2"><Download /></el-icon>
          导入试卷
        </el-button>
        <el-button type="primary" @click="showCreateDialog">
          <el-icon class="mr-2"><Plus /></el-icon>
          创建试卷
        </el-button>
      </div>
    </div>

    <!-- 筛选栏 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="试卷类型">
          <el-select v-model="filterForm.paperType" placeholder="全部类型" clearable style="width: 140px">
            <el-option label="考试卷" value="EXAM" />
            <el-option label="练习卷" value="PRACTICE" />
            <el-option label="历年真题" value="HISTORY" />
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
            <el-option label="草稿" value="DRAFT" />
            <el-option label="已发布" value="PUBLISHED" />
          </el-select>
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

    <!-- 试卷列表 -->
    <el-card class="table-card">
      <el-table :data="paperList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="paperName" label="试卷名称" min-width="200">
          <template #default="{ row }">
            <div class="paper-name-cell">
              <el-icon :size="20" color="#3B82F6"><DocumentCopy /></el-icon>
              <div class="paper-info">
                <div class="paper-name">{{ row.paperName }}</div>
                <el-tag size="small" :type="getPaperTypeType(row.paperType)">
                  {{ getPaperTypeText(row.paperType) }}
                </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stage" label="学段" width="80">
          <template #default="{ row }">
            {{ row.stage === 'PRIMARY' ? '小学' : '初中' }}
          </template>
        </el-table-column>
        <el-table-column prop="questionCount" label="题目数" width="80" align="center" />
        <el-table-column prop="totalScore" label="总分" width="80" align="center">
          <template #default="{ row }">
            {{ row.totalScore }}分
          </template>
        </el-table-column>
        <el-table-column prop="subjectiveMode" label="主观题模式" width="120">
          <template #default="{ row }">
            <el-tag :type="row.subjectiveMode === 'UPLOAD' ? 'primary' : 'success'" size="small">
              {{ row.subjectiveMode === 'UPLOAD' ? '上传附件' : '富文本' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 'PUBLISHED' ? 'success' : 'info'" size="small">
              {{ row.status === 'PUBLISHED' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-button link type="primary" @click="editPaper(row)">编辑</el-button>
              <el-button link type="primary" @click="previewPaper(row)">预览</el-button>
              <el-dropdown trigger="click">
                <el-button link type="primary">
                  更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="publishPaper(row)" v-if="row.status === 'DRAFT'">发布</el-dropdown-item>
                    <el-dropdown-item @click="copyPaper(row)">复制</el-dropdown-item>
                    <el-dropdown-item @click="convertToHistory(row)" v-if="row.paperType === 'EXAM'">转为真题</el-dropdown-item>
                    <el-dropdown-item divided type="danger" @click="deletePaper(row)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 创建/编辑试卷弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form :model="form" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="试卷名称">
              <el-input v-model="form.paperName" placeholder="请输入试卷名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="试卷类型">
              <el-select v-model="form.paperType" placeholder="选择类型" style="width: 100%">
                <el-option label="考试卷" value="EXAM" />
                <el-option label="练习卷" value="PRACTICE" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="学段">
              <el-radio-group v-model="form.stage">
                <el-radio-button label="PRIMARY">小学</el-radio-button>
                <el-radio-button label="MIDDLE">初中</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主观题模式">
              <el-radio-group v-model="form.subjectiveMode">
                <el-radio-button label="UPLOAD">上传附件</el-radio-button>
                <el-radio-button label="RICHTEXT">富文本</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="题目配置">
          <div class="question-config">
            <div v-for="(item, index) in form.questions" :key="index" class="question-type-row">
              <el-select v-model="item.type" placeholder="题型" style="width: 140px">
                <el-option label="单选题" value="SINGLE" />
                <el-option label="多选题" value="MULTI" />
                <el-option label="判断题" value="JUDGE" />
                <el-option label="主观题" value="SUBJECTIVE" />
              </el-select>
              <el-input-number v-model="item.count" :min="0" placeholder="数量" style="width: 120px" />
              <el-input-number v-model="item.score" :min="0" :precision="1" placeholder="分值" style="width: 120px" />
              <el-button type="danger" link @click="removeQuestionType(index)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <el-button type="primary" link @click="addQuestionType">
              <el-icon class="mr-2"><Plus /></el-icon>
              添加题型
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="saveDraft">存为草稿</el-button>
        <el-button type="primary" @click="submitForm">发布试卷</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockExamPapers } from '../../../mock/admin'
import type { ExamPaper } from '../../../types'

const loading = ref(false)
const paperList = ref<ExamPaper[]>([])
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const filterForm = reactive({ paperType: '', stage: '', status: '' })

const dialogVisible = ref(false)
const dialogTitle = ref('创建试卷')
const form = reactive({
  paperName: '',
  paperType: 'EXAM',
  stage: 'PRIMARY',
  subjectiveMode: 'UPLOAD',
  questions: [] as { type: string; count: number; score: number }[]
})

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    paperList.value = mockExamPapers.map(p => ({ ...p, paperType: 'EXAM' }))
    pagination.total = paperList.value.length
    loading.value = false
  }, 300)
}

const handleSearch = () => { pagination.page = 1; loadData() }
const resetFilter = () => { filterForm.paperType = ''; filterForm.stage = ''; filterForm.status = ''; handleSearch() }
const handleSizeChange = (size: number) => { pagination.pageSize = size; loadData() }
const handlePageChange = (page: number) => { pagination.page = page; loadData() }

const getPaperTypeText = (type: string) => {
  const map: Record<string, string> = { EXAM: '考试卷', PRACTICE: '练习卷', HISTORY: '历年真题' }
  return map[type] || type
}

const getPaperTypeType = (type: string) => {
  const map: Record<string, any> = { EXAM: 'danger', PRACTICE: 'success', HISTORY: 'warning' }
  return map[type] || 'info'
}

const showCreateDialog = () => {
  dialogTitle.value = '创建试卷'
  form.paperName = ''
  form.questions = []
  dialogVisible.value = true
}

const editPaper = (row: ExamPaper) => {
  dialogTitle.value = '编辑试卷'
  form.paperName = row.paperName
  form.stage = row.stage
  form.subjectiveMode = row.subjectiveMode
  dialogVisible.value = true
}

const previewPaper = (row: ExamPaper) => { ElMessage.info(`预览试卷: ${row.paperName}`) }
const publishPaper = (row: ExamPaper) => { ElMessage.success('试卷已发布') }
const copyPaper = (row: ExamPaper) => { ElMessage.success('试卷已复制') }
const convertToHistory = (row: ExamPaper) => { ElMessage.success('已转为历年真题') }
const deletePaper = (row: ExamPaper) => {
  ElMessageBox.confirm(`确定删除试卷 "${row.paperName}" 吗？`, '确认删除', { type: 'warning' })
    .then(() => { paperList.value = paperList.value.filter(p => p.id !== row.id); ElMessage.success('删除成功') })
}

const addQuestionType = () => { form.questions.push({ type: '', count: 0, score: 0 }) }
const removeQuestionType = (index: number) => { form.questions.splice(index, 1) }
const saveDraft = () => { ElMessage.success('已保存为草稿'); dialogVisible.value = false }
const submitForm = () => { ElMessage.success('试卷发布成功'); dialogVisible.value = false; loadData() }
const showImportDialog = () => { ElMessage.info('导入试卷功能') }

onMounted(() => { loadData() })
</script>

<style scoped>
.paper-page { padding-bottom: 40px; }
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-title { font-size: 24px; font-weight: 600; color: #1E293B; margin: 0 0 8px 0; }
.page-subtitle { font-size: 14px; color: #64748B; margin: 0; }
.page-actions { display: flex; gap: 12px; }
.filter-card { margin-bottom: 20px; }
.filter-form { display: flex; flex-wrap: wrap; gap: 8px; }
.table-card { margin-bottom: 20px; }
.table-actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  white-space: nowrap;
}
.paper-name-cell { display: flex; align-items: center; gap: 12px; }
.paper-info { display: flex; flex-direction: column; gap: 4px; }
.paper-name { font-size: 14px; font-weight: 500; color: #1E293B; }
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}
.question-config { display: flex; flex-direction: column; gap: 12px; }
.question-type-row { display: flex; gap: 12px; align-items: center; }
.mr-2 { margin-right: 8px; }
</style>
