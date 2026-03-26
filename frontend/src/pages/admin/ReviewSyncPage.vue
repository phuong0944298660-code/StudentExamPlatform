<script setup lang="ts">
import PanelCard from '../../components/common/PanelCard.vue'
import StatusTag from '../../components/business/StatusTag.vue'
import { useSuperAdminMockData } from '../../mock/superAdminMock'

const { reviewRule, reviewProgress, setReviewRule, triggerScoreSync } = useSuperAdminMockData()

const onReviewerCountChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  setReviewRule({ reviewerCount: Number(target.value), aggregateAlgo: reviewRule.value.aggregateAlgo })
}

const onAggregateChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  setReviewRule({ reviewerCount: reviewRule.value.reviewerCount, aggregateAlgo: target.value as 'AVG' | 'MEDIAN' })
}
</script>

<template>
  <div class="grid">
    <PanelCard title="评卷规则配置" description="支持评分人数与聚合算法（平均值/中位数）">
      <div class="rule-grid">
        <label>
          评分人数
          <input
            class="input"
            type="number"
            min="1"
            max="5"
            :value="reviewRule.reviewerCount"
            @change="onReviewerCountChange($event)"
          />
        </label>
        <label>
          聚合算法
          <select
            class="input"
            :value="reviewRule.aggregateAlgo"
            @change="onAggregateChange($event)"
          >
            <option value="AVG">平均值</option>
            <option value="MEDIAN">中位数</option>
          </select>
        </label>
      </div>
    </PanelCard>

    <PanelCard title="评卷与成绩同步进度">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>场次</th>
              <th>未评</th>
              <th>评卷中</th>
              <th>已评</th>
              <th>同步状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in reviewProgress" :key="item.id">
              <td>{{ item.sessionName }}</td>
              <td>{{ item.pendingCount }}</td>
              <td>{{ item.reviewingCount }}</td>
              <td>{{ item.finishedCount }}</td>
              <td>
                <StatusTag
                  :tone="item.syncStatus === 'SYNCED' ? 'success' : item.syncStatus === 'FAILED' ? 'danger' : 'warning'"
                  :label="item.syncStatus"
                />
              </td>
              <td>
                <button class="btn" @click="triggerScoreSync(item.id)">执行同步重试</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </PanelCard>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 14px;
}

.rule-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

label {
  display: grid;
  gap: 6px;
  color: var(--text-sub);
  font-size: 13px;
}

.input {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 8px 10px;
}

.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
}

th,
td {
  border-bottom: 1px solid var(--line);
  padding: 10px 8px;
  text-align: left;
  font-size: 13px;
}

.btn {
  border: 1px solid #6b98c0;
  background: #fff;
  color: #1e4b72;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
}

@media (max-width: 900px) {
  .rule-grid {
    grid-template-columns: 1fr;
  }
}
</style>
