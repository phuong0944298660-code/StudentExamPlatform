<template>
  <div class="audit-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">日志审计</h1>
        <p class="page-subtitle">查看系统操作日志，追踪关键业务变更</p>
      </div>
      <el-button @click="exportLogs">
        <el-icon class="mr-2"><Download /></el-icon>
        导出日志
      </el-button>
    </div>

    <!-- 筛选栏 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 320px"
          />
        </el-form-item>
        <el-form-item label="操作人">
          <el-input v-model="filterForm.operator" placeholder="用户名" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="操作模块">
          <el-select v-model="filterForm.module" placeholder="全部模块" clearable style="width: 140px">
            <el-option label="账号管理" value="account" />
            <el-option label="题库管理" value="question" />
            <el-option label="场次管理" value="session" />
            <el-option label="阅卷管理" value="review" />
            <el-option label="成绩管理" value="score" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="filterForm.action" placeholder="全部类型" clearable style="width: 140px">
            <el-option label="创建" value="CREATE" />
            <el-option label="修改" value="UPDATE" />
            <el-option label="删除" value="DELETE" />
            <el-option label="查询" value="QUERY" />
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

    <!-- 日志列表 -->
    <el-card>
      <el-table :data="logList" stripe v-loading="loading">
        <el-table-column prop="traceId" label="Trace ID" width="160">
          <template #default="{ row }">
            <el-tooltip :content="row.traceId" placement="top">
              <span class="trace-id">{{ row.traceId.substring(0, 16) }}...</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="timestamp" label="操作时间" width="160" />
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="module" label="模块" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ getModuleText(row.module) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作" width="80">
          <template #default="{ row }">
            <el-tag :type="getActionType(row.action)" size="small">
              {{ getActionText(row.action) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="target" label="操作对象" min-width="150" />
        <el-table-column prop="result" label="结果" width="80">
          <template #default="{ row }">
            <el-icon v-if="row.result === 'SUCCESS'" color="#10B981"><CircleCheck /></el-icon>
            <el-icon v-else color="#EF4444"><CircleClose /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP地址" width="130" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 日志详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="日志详情" width="600px">
      <el-descriptions :column="1" border v-if="selectedLog">
        <el-descriptions-item label="Trace ID">{{ selectedLog.traceId }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ selectedLog.timestamp }}</el-descriptions-item>
        <el-descriptions-item label="操作人">{{ selectedLog.operator }}</el-descriptions-item>
        <el-descriptions-item label="操作模块">{{ getModuleText(selectedLog.module) }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">{{ getActionText(selectedLog.action) }}</el-descriptions-item>
        <el-descriptions-item label="操作对象">{{ selectedLog.target }}</el-descriptions-item>
        <el-descriptions-item label="操作原因">{{ selectedLog.reason || '-' }}</el-descriptions-item>
        <el-descriptions-item label="执行结果">
          <el-tag :type="selectedLog.result === 'SUCCESS' ? 'success' : 'danger'">
            {{ selectedLog.result === 'SUCCESS' ? '成功' : '失败' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ selectedLog.ip }}</el-descriptions-item>
        <el-descriptions-item label="请求参数">
          <pre class="json-content">{{ JSON.stringify(selectedLog.params, null, 2) }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const filterForm = reactive({ dateRange: [], operator: '', module: '', action: '' })
const pagination = reactive({ page: 1, pageSize: 20, total: 1523 })

const logList = ref([
  { traceId: 'trace-20260327-001', timestamp: '2026-03-27 16:30:25', operator: 'admin', module: 'session', action: 'CREATE', target: '场次:2026年小学组初赛', result: 'SUCCESS', ip: '192.168.1.100', reason: '创建新的考试场次', params: { name: '2026年小学组初赛', stage: 'PRIMARY' } },
  { traceId: 'trace-20260327-002', timestamp: '2026-03-27 16:25:10', operator: 'admin', module: 'account', action: 'IMPORT', target: '导入学生名单', result: 'SUCCESS', ip: '192.168.1.100', reason: '批量导入参赛学生', params: { count: 500, file: '小学组名单.xlsx' } },
  { traceId: 'trace-20260327-003', timestamp: '2026-03-27 16:20:00', operator: '陈老师', module: 'review', action: 'UPDATE', target: '试卷:张三-小学组初赛', result: 'SUCCESS', ip: '192.168.1.105', reason: '修改主观题评分', params: { paperId: 123, score: 85 } },
  { traceId: 'trace-20260327-004', timestamp: '2026-03-27 16:15:30', operator: 'admin', module: 'activation', action: 'CREATE', target: '生成激活码100个', result: 'SUCCESS', ip: '192.168.1.100', params: { count: 100, stage: 'PRIMARY' } },
  { traceId: 'trace-20260327-005', timestamp: '2026-03-27 16:10:15', operator: '刘老师', module: 'score', action: 'PUBLISH', target: '发布:小学组模拟赛成绩', result: 'SUCCESS', ip: '192.168.1.106', reason: '阅卷完成，发布成绩', params: { sessionId: 3, publishTime: '2026-03-27 16:00' } },
])

const detailDialogVisible = ref(false)
const selectedLog = ref<any>(null)

const getModuleText = (module: string) => {
  const map: Record<string, string> = {
    account: '账号管理', question: '题库管理', session: '场次管理',
    review: '阅卷管理', score: '成绩管理', activation: '激活管理', resource: '资源管理'
  }
  return map[module] || module
}

const getActionText = (action: string) => {
  const map: Record<string, string> = {
    CREATE: '创建', UPDATE: '修改', DELETE: '删除', QUERY: '查询',
    IMPORT: '导入', EXPORT: '导出', PUBLISH: '发布', LOGIN: '登录'
  }
  return map[action] || action
}

const getActionType = (action: string) => {
  const map: Record<string, any> = {
    CREATE: 'success', UPDATE: 'warning', DELETE: 'danger', QUERY: 'info',
    IMPORT: 'primary', EXPORT: 'primary', PUBLISH: 'success'
  }
  return map[action] || 'info'
}

const handleSearch = () => { loading.value = true; setTimeout(() => loading.value = false, 300) }
const resetFilter = () => { filterForm.dateRange = []; filterForm.operator = ''; filterForm.module = ''; filterForm.action = '' }
const handleSizeChange = (size: number) => { pagination.pageSize = size }
const handlePageChange = (page: number) => { pagination.page = page }
const viewDetail = (row: any) => { selectedLog.value = row; detailDialogVisible.value = true }
const exportLogs = () => { ElMessage.success('日志导出成功') }

onMounted(() => { handleSearch() })
</script>

<style scoped>
.audit-page { padding-bottom: 40px; }
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-title { font-size: 24px; font-weight: 600; color: #1E293B; margin: 0 0 8px 0; }
.page-subtitle { font-size: 14px; color: #64748B; margin: 0; }
.filter-card { margin-bottom: 20px; }
.filter-form { display: flex; flex-wrap: wrap; gap: 8px; }
.trace-id { font-family: monospace; font-size: 12px; color: #64748B; }
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}
.json-content {
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 12px;
  color: #334155;
  max-height: 200px;
  overflow: auto;
  margin: 0;
}
.mr-2 { margin-right: 8px; }
</style>
