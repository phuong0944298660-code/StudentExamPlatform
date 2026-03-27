<template>
  <div class="question-bank-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div>
        <h1 class="page-title">目录管理</h1>
        <p class="page-subtitle">管理题库目录结构，支持四级分类</p>
      </div>
      <div class="page-actions">
        <el-button type="primary" @click="showCreateDialog">
          <el-icon class="mr-2"><Plus /></el-icon>
          新建目录
        </el-button>
      </div>
    </div>

    <!-- 主体内容 -->
    <el-row :gutter="20" class="main-content">
      <!-- 左侧目录树 -->
      <el-col :span="7">
        <el-card class="tree-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">题库目录</span>
              <el-button text type="primary" @click="expandAll">
                {{ isExpandAll ? '收起' : '展开' }}全部
              </el-button>
            </div>
          </template>
          <el-tree
            ref="treeRef"
            :data="catalogTree"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            :default-expanded-keys="expandedKeys"
          >
            <template #default="{ node, data }">
              <div class="tree-node">
                <el-icon class="tree-icon">
                  <FolderOpened v-if="data.children?.length" />
                  <Document v-else />
                </el-icon>
                <span class="tree-label">{{ node.label }}</span>
                <span class="tree-count" v-if="data.questionCount">({{ data.questionCount }})</span>
                <el-dropdown trigger="click" @command="(cmd) => handleCommand(cmd, data)">
                  <el-button link class="tree-more">
                    <el-icon><MoreFilled /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="add">添加子目录</el-dropdown-item>
                      <el-dropdown-item command="edit">编辑</el-dropdown-item>
                      <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-col>

      <!-- 右侧题库列表 -->
      <el-col :span="17">
        <el-card class="bank-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <span class="card-title">{{ currentNode?.name || '全部题库' }}</span>
                <el-tag v-if="currentNode?.stage" size="small" :type="currentNode.stage === 'PRIMARY' ? 'success' : 'warning'">
                  {{ currentNode.stage === 'PRIMARY' ? '小学' : '初中' }}
                </el-tag>
              </div>
              <div class="header-right">
                <el-input
                  v-model="searchKeyword"
                  placeholder="搜索题库名称"
                  clearable
                  style="width: 200px"
                  prefix-icon="Search"
                />
              </div>
            </div>
          </template>

          <el-table :data="bankList" stripe v-loading="loading">
            <el-table-column prop="bankName" label="题库名称" min-width="180">
              <template #default="{ row }">
                <div class="bank-name-cell">
                  <el-icon :size="20" color="#3B82F6"><Collection /></el-icon>
                  <span>{{ row.bankName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="stage" label="学段" width="80">
              <template #default="{ row }">
                {{ row.stage === 'PRIMARY' ? '小学' : '初中' }}
              </template>
            </el-table-column>
            <el-table-column prop="suiteNo" label="套卷编号" width="90" align="center" />
            <el-table-column prop="questionCount" label="题目数" width="90" align="center" />
            <el-table-column prop="status" label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="row.status === 'PUBLISHED' ? 'success' : 'info'" size="small">
                  {{ row.status === 'PUBLISHED' ? '已发布' : '草稿' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="160" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="editBank(row)">编辑</el-button>
                <el-button link type="primary" @click="manageQuestions(row)">题目管理</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
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
      </el-col>
    </el-row>

    <!-- 新建/编辑目录弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="目录名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入目录名称" />
        </el-form-item>
        <el-form-item label="所属学段" prop="stage">
          <el-radio-group v-model="form.stage">
            <el-radio-button label="PRIMARY">小学</el-radio-button>
            <el-radio-button label="MIDDLE">初中</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级目录" prop="parentId">
          <el-cascader
            v-model="form.parentId"
            :options="catalogTree"
            :props="{ value: 'id', label: 'name', children: 'children', checkStrictly: true }"
            placeholder="不选则为根目录"
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" style="width: 150px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockQuestionBanks } from '../../../mock/admin'
import type { QuestionBank } from '../../../types'

const router = useRouter()

// 目录树数据
const catalogTree = ref([
  {
    id: 1,
    name: '小学题库',
    stage: 'PRIMARY',
    questionCount: 850,
    children: [
      { id: 11, name: '初赛题库', stage: 'PRIMARY', questionCount: 200 },
      { id: 12, name: '决赛题库', stage: 'PRIMARY', questionCount: 150 },
      { id: 13, name: '练习题库', stage: 'PRIMARY', questionCount: 500 }
    ]
  },
  {
    id: 2,
    name: '初中题库',
    stage: 'MIDDLE',
    questionCount: 680,
    children: [
      { id: 21, name: '初赛题库', stage: 'MIDDLE', questionCount: 250 },
      { id: 22, name: '决赛题库', stage: 'MIDDLE', questionCount: 180 },
      { id: 23, name: '历年真题', stage: 'MIDDLE', questionCount: 250 }
    ]
  },
  {
    id: 3,
    name: '公共题库',
    questionCount: 320,
    children: [
      { id: 31, name: '入门练习', questionCount: 150 },
      { id: 32, name: '进阶训练', questionCount: 170 }
    ]
  }
])

const treeRef = ref()
const expandedKeys = ref<number[]>([1, 2])
const isExpandAll = ref(false)
const currentNode = ref<any>(null)

// 题库列表
const bankList = ref<QuestionBank[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('新建目录')
const formRef = ref()
const submitLoading = ref(false)
const form = reactive({
  id: 0,
  name: '',
  stage: 'PRIMARY',
  parentId: null as number | null,
  sort: 0
})

const rules = {
  name: [{ required: true, message: '请输入目录名称', trigger: 'blur' }],
  stage: [{ required: true, message: '请选择学段', trigger: 'change' }]
}

// 展开/收起全部
const expandAll = () => {
  isExpandAll.value = !isExpandAll.value
  if (isExpandAll.value) {
    expandedKeys.value = [1, 2, 3, 11, 12, 13, 21, 22, 23, 31, 32]
  } else {
    expandedKeys.value = []
  }
}

// 节点点击
const handleNodeClick = (data: any) => {
  currentNode.value = data
  loadBanks()
}

// 加载题库
const loadBanks = () => {
  loading.value = true
  setTimeout(() => {
    let data = [...mockQuestionBanks]
    
    if (currentNode.value?.stage) {
      data = data.filter(item => item.stage === currentNode.value.stage)
    }
    if (searchKeyword.value) {
      data = data.filter(item => item.bankName.includes(searchKeyword.value))
    }
    
    pagination.total = data.length
    bankList.value = data
    loading.value = false
  }, 300)
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadBanks()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadBanks()
}

// 显示创建弹窗
const showCreateDialog = () => {
  dialogTitle.value = '新建目录'
  form.id = 0
  form.name = ''
  form.stage = 'PRIMARY'
  form.parentId = null
  form.sort = 0
  dialogVisible.value = true
}

// 编辑题库
const editBank = (row: QuestionBank) => {
  ElMessage.info(`编辑题库: ${row.bankName}`)
}

// 管理题目
const manageQuestions = (row: QuestionBank) => {
  router.push('/admin/question-bank/questions')
}

// 树节点操作
const handleCommand = (cmd: string, data: any) => {
  if (cmd === 'add') {
    dialogTitle.value = '添加子目录'
    form.parentId = data.id
    dialogVisible.value = true
  } else if (cmd === 'edit') {
    dialogTitle.value = '编辑目录'
    form.name = data.name
    form.stage = data.stage
    dialogVisible.value = true
  } else if (cmd === 'delete') {
    ElMessageBox.confirm(
      `确定要删除目录 "${data.name}" 吗？`,
      '确认删除',
      { type: 'warning' }
    ).then(() => {
      ElMessage.success('删除成功')
    })
  }
}

// 提交表单
const submitForm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  
  submitLoading.value = true
  setTimeout(() => {
    ElMessage.success(dialogTitle.value === '新建目录' ? '创建成功' : '更新成功')
    dialogVisible.value = false
    submitLoading.value = false
  }, 500)
}

onMounted(() => {
  loadBanks()
})
</script>

<style scoped>
.question-bank-page {
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

.main-content {
  margin-top: 0;
}

.tree-card,
.bank-card {
  height: calc(100vh - 200px);
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

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding-right: 8px;
}

.tree-icon {
  color: #94a3b8;
}

.tree-label {
  flex: 1;
  font-size: 14px;
}

.tree-count {
  font-size: 12px;
  color: #94a3b8;
}

.tree-more {
  opacity: 0;
  transition: opacity 0.2s;
}

.tree-node:hover .tree-more {
  opacity: 1;
}

.bank-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.mr-2 {
  margin-right: 8px;
}
</style>
