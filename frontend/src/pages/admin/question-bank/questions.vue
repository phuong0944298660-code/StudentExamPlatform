<template>
  <div class="questions-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">题目管理</h1>
        <p class="page-subtitle">管理题库中的具体题目，支持批量导入和编辑</p>
      </div>
      <div class="page-actions">
        <el-button @click="showImportDialog">
          <el-icon class="mr-2"><Upload /></el-icon>
          批量导入
        </el-button>
        <el-button type="primary" @click="showCreateDialog">
          <el-icon class="mr-2"><Plus /></el-icon>
          新增题目
        </el-button>
      </div>
    </div>

    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-select v-model="filterForm.bankId" placeholder="选择题库" clearable style="width: 180px">
              <el-option v-for="bank in bankOptions" :key="bank.id" :label="bank.bankName" :value="bank.id" />
            </el-select>
            <el-select v-model="filterForm.questionType" placeholder="题型" clearable style="width: 120px">
              <el-option label="单选题" value="SINGLE" />
              <el-option label="多选题" value="MULTI" />
              <el-option label="判断题" value="JUDGE" />
              <el-option label="主观题" value="SUBJECTIVE" />
            </el-select>
            <el-input v-model="filterForm.keyword" placeholder="搜索题目内容" clearable style="width: 200px">
              <template #prefix><el-icon><Search /></el-icon></template>
            </el-input>
          </div>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>
      </template>

      <el-table :data="questionList" stripe>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="content" label="题目内容" min-width="300">
          <template #default="{ row }">
            <div class="question-content">{{ row.content }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="questionType" label="题型" width="100">
          <template #default="{ row }">
            <el-tag :type="getQuestionTypeType(row.questionType)" size="small">
              {{ getQuestionTypeText(row.questionType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="分值" width="80" align="center" />
        <el-table-column prop="difficulty" label="难度" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.difficulty" disabled :max="5" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <status-tag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="editQuestion(row)">编辑</el-button>
            <el-button link type="danger" @click="deleteQuestion(row)">删除</el-button>
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

    <!-- 编辑题目弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑题目" width="700px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="题目内容">
          <el-input v-model="form.content" type="textarea" :rows="3" placeholder="请输入题目内容" />
        </el-form-item>
        <el-form-item label="题型">
          <el-radio-group v-model="form.questionType">
            <el-radio-button label="SINGLE">单选题</el-radio-button>
            <el-radio-button label="MULTI">多选题</el-radio-button>
            <el-radio-button label="JUDGE">判断题</el-radio-button>
            <el-radio-button label="SUBJECTIVE">主观题</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选项" v-if="form.questionType !== 'SUBJECTIVE'">
          <div v-for="(option, index) in form.options" :key="index" class="option-row">
            <el-radio v-model="form.correctOption" :label="option.key" v-if="form.questionType === 'SINGLE' || form.questionType === 'JUDGE'">
              {{ option.key }}.
            </el-radio>
            <el-checkbox v-model="option.isCorrect" v-else>
              {{ option.key }}.
            </el-checkbox>
            <el-input v-model="option.text" placeholder="选项内容" style="flex: 1" />
            <el-button type="danger" link @click="removeOption(index)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          <el-button type="primary" link @click="addOption">
            <el-icon class="mr-2"><Plus /></el-icon>
            添加选项
          </el-button>
        </el-form-item>
        <el-form-item label="答案解析">
          <el-input v-model="form.analysis" type="textarea" :rows="3" placeholder="请输入答案解析" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveQuestion">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import StatusTag from '../../../components/common/StatusTag.vue'
import { mockQuestionBanks } from '../../../mock/admin'

const filterForm = reactive({ bankId: '', questionType: '', keyword: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 100 })
const bankOptions = ref(mockQuestionBanks)
const questionList = ref([
  { id: 1, content: '1 + 1 = ?', questionType: 'SINGLE', score: 5, difficulty: 1, status: 'PUBLISHED', options: [{key: 'A', text: '1'}, {key: 'B', text: '2'}] },
  { id: 2, content: '以下哪些是编程语言？', questionType: 'MULTI', score: 10, difficulty: 2, status: 'PUBLISHED', options: [{key: 'A', text: 'Java'}, {key: 'B', text: 'Python'}] },
  { id: 3, content: '请简述人工智能的发展历程', questionType: 'SUBJECTIVE', score: 20, difficulty: 4, status: 'PUBLISHED' },
])

const dialogVisible = ref(false)
const form = reactive({
  content: '',
  questionType: 'SINGLE',
  options: [] as {key: string, text: string, isCorrect?: boolean}[],
  correctOption: '',
  analysis: ''
})

const handleSearch = () => { ElMessage.info('搜索题目') }
const getQuestionTypeText = (type: string) => {
  const map: Record<string, string> = { SINGLE: '单选题', MULTI: '多选题', JUDGE: '判断题', SUBJECTIVE: '主观题' }
  return map[type] || type
}
const getQuestionTypeType = (type: string) => {
  const map: Record<string, any> = { SINGLE: 'primary', MULTI: 'success', JUDGE: 'warning', SUBJECTIVE: 'info' }
  return map[type] || 'info'
}
const showCreateDialog = () => {
  form.content = ''
  form.questionType = 'SINGLE'
  form.options = [{key: 'A', text: ''}]
  dialogVisible.value = true
}
const editQuestion = (row: any) => {
  Object.assign(form, row)
  dialogVisible.value = true
}
const deleteQuestion = (row: any) => {
  ElMessageBox.confirm(`确定删除题目 ${row.id} 吗？`, '确认删除', { type: 'warning' })
    .then(() => { questionList.value = questionList.value.filter(q => q.id !== row.id); ElMessage.success('删除成功') })
}
const addOption = () => {
  const keys = 'ABCDEFGHIJ'
  form.options.push({ key: keys[form.options.length] || 'X', text: '' })
}
const removeOption = (index: number) => { form.options.splice(index, 1) }
const saveQuestion = () => { ElMessage.success('保存成功'); dialogVisible.value = false }
const showImportDialog = () => { ElMessage.info('批量导入题目') }
</script>

<style scoped>
.questions-page { padding-bottom: 40px; }
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-title { font-size: 24px; font-weight: 600; color: #1E293B; margin: 0 0 8px 0; }
.page-subtitle { font-size: 14px; color: #64748B; margin: 0; }
.page-actions { display: flex; gap: 12px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.header-left { display: flex; gap: 12px; }
.question-content {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}
.option-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.mr-2 { margin-right: 8px; }
</style>
