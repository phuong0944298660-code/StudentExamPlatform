<template>
  <div class="activation-records-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">激活记录</h1>
        <p class="page-subtitle">查看所有激活码的使用记录和激活详情</p>
      </div>
      <el-button @click="exportRecords">
        <el-icon class="mr-2"><Download /></el-icon>
        导出记录
      </el-button>
    </div>

    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-filters">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 260px"
            />
            <el-input v-model="searchKeyword" placeholder="搜索激活码/用户" clearable style="width: 200px">
              <template #prefix><el-icon><Search /></el-icon></template>
            </el-input>
          </div>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
      </template>

      <el-table :data="records" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="code" label="激活码" min-width="180" />
        <el-table-column prop="userName" label="激活用户" width="120" />
        <el-table-column prop="stage" label="学段" width="80">
          <template #default="{ row }">
            {{ row.stage === 'PRIMARY' ? '小学' : '初中' }}
          </template>
        </el-table-column>
        <el-table-column prop="targetRole" label="角色" width="90">
          <template #default="{ row }">
            {{ row.targetRole === 'TEACHER' ? '教师' : '学生' }}
          </template>
        </el-table-column>
        <el-table-column prop="deviceId" label="设备标识" min-width="150" />
        <el-table-column prop="ipAddress" label="IP地址" width="130" />
        <el-table-column prop="activatedAt" label="激活时间" width="160" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const dateRange = ref([])
const searchKeyword = ref('')
const pagination = reactive({ page: 1, pageSize: 20, total: 892 })

const records = ref([
  { id: 1, code: 'ACT-2026-003-XYZC', userName: '陈老师', stage: 'PRIMARY', targetRole: 'TEACHER', deviceId: 'device_abc123', ipAddress: '192.168.1.100', activatedAt: '2026-03-18 14:30:00' },
  { id: 2, code: 'ACT-2026-004-XYZD', userName: '刘老师', stage: 'MIDDLE', targetRole: 'TEACHER', deviceId: 'device_def456', ipAddress: '192.168.1.101', activatedAt: '2026-03-18 14:35:00' },
  { id: 3, code: 'ACT-2026-001-XYZA', userName: '张同学', stage: 'PRIMARY', targetRole: 'STUDENT', deviceId: 'device_ghi789', ipAddress: '192.168.1.102', activatedAt: '2026-03-20 09:00:00' },
])

const handleSearch = () => { ElMessage.info('搜索激活记录') }
const exportRecords = () => { ElMessage.success('导出成功') }
</script>

<style scoped>
.activation-records-page { padding-bottom: 40px; }
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-title { font-size: 24px; font-weight: 600; color: #1E293B; margin: 0 0 8px 0; }
.page-subtitle { font-size: 14px; color: #64748B; margin: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.header-filters { display: flex; gap: 12px; }
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}
.mr-2 { margin-right: 8px; }
</style>
