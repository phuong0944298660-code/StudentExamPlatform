<template>
  <div class="scores-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">成绩查询</h1>
        <p class="page-subtitle">查询和查看所有考生的考试成绩</p>
      </div>
      <div class="page-actions">
        <el-button @click="$router.push('/admin/scores/export')">
          <el-icon class="mr-2"><Download /></el-icon>
          导出成绩
        </el-button>
      </div>
    </div>

    <!-- 筛选栏 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="场次">
          <el-select v-model="filterForm.sessionId" placeholder="选择场次" clearable style="width: 200px">
            <el-option v-for="s in sessions" :key="s.id" :label="s.sessionName" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="学段">
          <el-select v-model="filterForm.stage" placeholder="全部学段" clearable style="width: 140px">
            <el-option label="小学" value="PRIMARY" />
            <el-option label="初中" value="MIDDLE" />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="filterForm.name" placeholder="考生姓名" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="filterForm.idCard" placeholder="身份证号" clearable style="width: 180px" />
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

    <!-- 成绩统计 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">考生总数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value">{{ stats.avgScore }}</div>
          <div class="stat-label">平均分</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value">{{ stats.maxScore }}</div>
          <div class="stat-label">最高分</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value">{{ stats.passRate }}%</div>
          <div class="stat-label">及格率</div>
        </div>
      </el-col>
    </el-row>

    <!-- 成绩列表 -->
    <el-card>
      <el-table :data="scoreList" stripe v-loading="loading">
        <el-table-column prop="rank" label="排名" width="70" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.rank <= 3" :type="row.rank === 1 ? 'danger' : row.rank === 2 ? 'warning' : 'success'" size="small">
              {{ row.rank }}
            </el-tag>
            <span v-else>{{ row.rank }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="idCard" label="身份证号" min-width="180" />
        <el-table-column prop="school" label="学校" min-width="150" />
        <el-table-column prop="objectiveScore" label="客观题" width="90" align="center" />
        <el-table-column prop="subjectiveScore" label="主观题" width="90" align="center" />
        <el-table-column prop="totalScore" label="总分" width="100" align="center">
          <template #default="{ row }">
            <span class="total-score">{{ row.totalScore }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'warning'" size="small">
              {{ row.status === 'published' ? '已公布' : '未公布' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">查看详情</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { mockExamSessions } from '../../../mock/admin'

const loading = ref(false)
const sessions = ref(mockExamSessions)
const filterForm = reactive({ sessionId: '', stage: '', name: '', idCard: '' })
const stats = reactive({ total: 500, avgScore: 78.5, maxScore: 100, passRate: 85 })
const pagination = reactive({ page: 1, pageSize: 20, total: 500 })

const scoreList = ref([
  { rank: 1, name: '张三', idCard: '450102201201011234', school: '南宁市第一小学', objectiveScore: 50, subjectiveScore: 48, totalScore: 98, status: 'published' },
  { rank: 2, name: '李四', idCard: '450102201202021234', school: '南宁市第一小学', objectiveScore: 48, subjectiveScore: 48, totalScore: 96, status: 'published' },
  { rank: 3, name: '王五', idCard: '450102201203031234', school: '南宁市第二小学', objectiveScore: 50, subjectiveScore: 45, totalScore: 95, status: 'published' },
  { rank: 4, name: '赵六', idCard: '450102201204041234', school: '南宁市第一小学', objectiveScore: 45, subjectiveScore: 48, totalScore: 93, status: 'published' },
])

const handleSearch = () => { loading.value = true; setTimeout(() => loading.value = false, 300) }
const resetFilter = () => { filterForm.sessionId = ''; filterForm.stage = ''; filterForm.name = ''; filterForm.idCard = '' }
const viewDetail = (row: any) => { ElMessage.info(`查看 ${row.name} 的成绩详情`) }

onMounted(() => { handleSearch() })
</script>

<style scoped>
.scores-page { padding-bottom: 40px; }
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
.stats-row { margin-bottom: 24px; }
.stat-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}
.stat-value { font-size: 32px; font-weight: 700; color: #3B82F6; line-height: 1.2; margin-bottom: 8px; }
.stat-label { font-size: 14px; color: #64748B; }
.total-score { font-size: 16px; font-weight: 600; color: #3B82F6; }
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}
.mr-2 { margin-right: 8px; }
</style>
