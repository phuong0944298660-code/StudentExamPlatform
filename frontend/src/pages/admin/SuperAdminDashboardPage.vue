<script setup lang="ts">
import { RouterLink } from 'vue-router'
import MetricCard from '../../components/dashboard/MetricCard.vue'
import PanelCard from '../../components/common/PanelCard.vue'
import StatusTag from '../../components/business/StatusTag.vue'
import { useSuperAdminMockData } from '../../mock/superAdminMock'

// 看板模块用于展示验收期关键运营指标和告警信息。
const { metrics, alerts, reviewProgress, refreshMetrics } = useSuperAdminMockData()
</script>

<template>
  <div class="page-grid">
    <PanelCard title="今日总览" description="指标口径已与需求 V1.2 对齐">
      <template #actions>
        <button class="btn btn--primary" @click="refreshMetrics">刷新指标</button>
      </template>
      <div class="metrics">
        <MetricCard v-for="item in metrics" :key="item.id" :item="item" />
      </div>
    </PanelCard>

    <PanelCard title="运行告警" description="登录异常、上传失败、自动保存失败、接口超时">
      <ul class="list">
        <li v-for="alert in alerts" :key="alert.id">
          <div class="row">
            <StatusTag :tone="alert.level === 'DANGER' ? 'danger' : alert.level === 'WARN' ? 'warning' : 'info'" :label="alert.level" />
            <strong>{{ alert.title }}</strong>
            <span>{{ alert.createdAt }}</span>
          </div>
          <p>{{ alert.content }}</p>
        </li>
      </ul>
    </PanelCard>

    <PanelCard title="评分进度概览">
      <div class="progress-list">
        <div v-for="item in reviewProgress" :key="item.id" class="progress-item">
          <h4>{{ item.sessionName }}</h4>
          <p>未评 {{ item.pendingCount }} / 评卷中 {{ item.reviewingCount }} / 已评 {{ item.finishedCount }}</p>
        </div>
      </div>
    </PanelCard>

    <PanelCard title="快速入口">
      <div class="quick-links">
        <RouterLink class="quick-link" to="/admin/sessions">进入场次开关管理</RouterLink>
        <RouterLink class="quick-link" to="/admin/review-sync">进入成绩同步管理</RouterLink>
        <RouterLink class="quick-link" to="/admin/activation-codes">进入激活码管理</RouterLink>
      </div>
    </PanelCard>
  </div>
</template>

<style scoped>
.page-grid {
  display: grid;
  gap: 14px;
}

.metrics {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.btn {
  border: 1px solid #2f6da8;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
}

.btn--primary {
  background: #2f6da8;
  color: #fff;
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.list li {
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px;
  background: #fff;
}

.row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.row span {
  margin-left: auto;
  color: var(--text-sub);
  font-size: 12px;
}

.list p {
  margin: 8px 0 0 0;
  color: var(--text-sub);
  font-size: 13px;
}

.progress-list {
  display: grid;
  gap: 10px;
}

.progress-item {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px;
}

.progress-item h4 {
  margin: 0 0 6px 0;
}

.progress-item p {
  margin: 0;
  color: var(--text-sub);
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.quick-link {
  border: 1px dashed #6295c4;
  color: #174970;
  padding: 12px;
  border-radius: 10px;
  text-decoration: none;
  background: #f2f8ff;
  text-align: center;
}

@media (max-width: 1280px) {
  .metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .metrics,
  .quick-links {
    grid-template-columns: 1fr;
  }
}
</style>
