<template>
  <div class="resources-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">资源中心</h1>
        <p class="page-subtitle">管理学习资源，支持课件、视频等多种格式</p>
      </div>
      <el-button type="primary" @click="showUploadDialog">
        <el-icon class="mr-2"><Upload /></el-icon>
        上传资源
      </el-button>
    </div>

    <el-row :gutter="20">
      <!-- 左侧分类 -->
      <el-col :span="5">
        <el-card>
          <template #header>
            <div class="card-header">
              <span class="card-title">资源分类</span>
              <el-button link type="primary">
                <el-icon><Plus /></el-icon>
              </el-button>
            </div>
          </template>
          <el-tree
            :data="categoryTree"
            :props="{ label: 'name', children: 'children' }"
            highlight-current
            @node-click="handleCategoryClick"
          />
        </el-card>
      </el-col>

      <!-- 右侧资源列表 -->
      <el-col :span="19">
        <el-card>
          <template #header>
            <div class="card-header">
              <div class="header-filters">
                <el-select v-model="filterForm.stage" placeholder="学段" clearable style="width: 120px">
                  <el-option label="小学" value="PRIMARY" />
                  <el-option label="初中" value="MIDDLE" />
                </el-select>
                <el-select v-model="filterForm.type" placeholder="类型" clearable style="width: 120px">
                  <el-option label="视频" value="video" />
                  <el-option label="文档" value="document" />
                  <el-option label="课件" value="courseware" />
                </el-select>
                <el-input v-model="filterForm.keyword" placeholder="搜索资源" clearable style="width: 200px">
                  <template #prefix><el-icon><Search /></el-icon></template>
                </el-input>
              </div>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </div>
          </template>

          <div class="resource-grid">
            <div v-for="resource in resourceList" :key="resource.id" class="resource-card">
              <div class="resource-icon">
                <el-icon :size="40" :color="getFileColor(resource.type)">
                  <component :is="getFileIcon(resource.type)" />
                </el-icon>
              </div>
              <div class="resource-info">
                <div class="resource-name">{{ resource.name }}</div>
                <div class="resource-meta">
                  <span>{{ formatFileSize(resource.size) }}</span>
                  <span>{{ resource.uploadTime }}</span>
                </div>
              </div>
              <div class="resource-actions">
                <el-button link type="primary" @click="previewResource(resource)">预览</el-button>
                <el-dropdown trigger="click">
                  <el-button link type="primary">
                    <el-icon><MoreFilled /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="downloadResource(resource)">下载</el-dropdown-item>
                      <el-dropdown-item @click="editResource(resource)">编辑</el-dropdown-item>
                      <el-dropdown-item divided type="danger" @click="deleteResource(resource)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>

          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="pagination.page"
              v-model:page-size="pagination.pageSize"
              :total="pagination.total"
              layout="total, prev, pager, next"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 上传弹窗 -->
    <el-dialog v-model="uploadDialogVisible" title="上传资源" width="600px">
      <el-form :model="uploadForm" label-width="100px">
        <el-form-item label="资源名称">
          <el-input v-model="uploadForm.name" placeholder="请输入资源名称" />
        </el-form-item>
        <el-form-item label="所属分类">
          <el-cascader
            v-model="uploadForm.category"
            :options="categoryTree"
            :props="{ value: 'id', label: 'name', children: 'children', checkStrictly: true }"
            placeholder="选择分类"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="适用学段">
          <el-radio-group v-model="uploadForm.stage">
            <el-radio-button label="PRIMARY">小学</el-radio-button>
            <el-radio-button label="MIDDLE">初中</el-radio-button>
            <el-radio-button label="ALL">全部</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="文件上传">
          <el-upload drag action="#" :auto-upload="false" class="upload-area">
            <el-icon :size="48" class="upload-icon"><Upload /></el-icon>
            <div class="upload-text"><em>点击上传</em> 或拖拽文件到此处</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpload">上传</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, VideoPlay, Picture, Headset } from '@element-plus/icons-vue'

const filterForm = reactive({ stage: '', type: '', keyword: '' })
const pagination = reactive({ page: 1, pageSize: 12, total: 48 })

const categoryTree = ref([
  { id: 1, name: '教学课件', children: [
    { id: 11, name: '基础知识' },
    { id: 12, name: '进阶教程' },
  ]},
  { id: 2, name: '视频解析', children: [
    { id: 21, name: '真题讲解' },
    { id: 22, name: '知识点讲解' },
  ]},
  { id: 3, name: '练习题库', children: [] },
])

const resourceList = ref([
  { id: 1, name: '人工智能基础课件.pptx', type: 'courseware', size: 15240000, uploadTime: '2026-03-20' },
  { id: 2, name: '编程入门教程.mp4', type: 'video', size: 128000000, uploadTime: '2026-03-21' },
  { id: 3, name: '2025年真题解析.pdf', type: 'document', size: 5200000, uploadTime: '2026-03-22' },
  { id: 4, name: '算法思维训练.docx', type: 'document', size: 3100000, uploadTime: '2026-03-23' },
])

const uploadDialogVisible = ref(false)
const uploadForm = reactive({ name: '', category: [], stage: 'PRIMARY' })

const getFileIcon = (type: string) => {
  const map: Record<string, any> = { video: VideoPlay, image: Picture, audio: Headset }
  return map[type] || Document
}

const getFileColor = (type: string) => {
  const map: Record<string, string> = { video: '#EF4444', courseware: '#F59E0B', document: '#3B82F6', image: '#10B981' }
  return map[type] || '#64748B'
}

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
  return (size / (1024 * 1024)).toFixed(1) + ' MB'
}

const handleCategoryClick = (data: any) => { console.log('Selected category:', data) }
const handleSearch = () => { ElMessage.info('搜索资源') }
const showUploadDialog = () => { uploadDialogVisible.value = true }
const previewResource = (row: any) => { ElMessage.info(`预览: ${row.name}`) }
const downloadResource = (row: any) => { ElMessage.success(`下载: ${row.name}`) }
const editResource = (row: any) => { ElMessage.info(`编辑: ${row.name}`) }
const deleteResource = (row: any) => {
  ElMessageBox.confirm(`确定删除资源 "${row.name}" 吗？`, '确认删除', { type: 'warning' })
    .then(() => { resourceList.value = resourceList.value.filter(r => r.id !== row.id); ElMessage.success('删除成功') })
}
const submitUpload = () => { ElMessage.success('上传成功'); uploadDialogVisible.value = false }
</script>

<style scoped>
.resources-page { padding-bottom: 40px; }
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-title { font-size: 24px; font-weight: 600; color: #1E293B; margin: 0 0 8px 0; }
.page-subtitle { font-size: 14px; color: #64748B; margin: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-size: 16px; font-weight: 600; color: #1E293B; }
.header-filters { display: flex; gap: 12px; }
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.resource-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s;
}
.resource-card:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.resource-icon {
  width: 56px;
  height: 56px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.resource-info { flex: 1; min-width: 0; }
.resource-name {
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.resource-meta {
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  gap: 12px;
}
.resource-actions { display: flex; gap: 8px; }
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}
.upload-area :deep(.el-upload-dragger) { width: 100%; padding: 40px; }
.upload-icon { color: #3B82F6; margin-bottom: 16px; }
.upload-text { color: #64748B; }
.upload-text em { color: #3B82F6; font-style: normal; }
.mr-2 { margin-right: 8px; }
</style>
