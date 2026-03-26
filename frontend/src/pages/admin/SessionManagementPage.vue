<script setup lang="ts">
import PanelCard from '../../components/common/PanelCard.vue'
import StatusTag from '../../components/business/StatusTag.vue'
import { useSuperAdminMockData } from '../../mock/superAdminMock'

const { examSessions, toggleSessionStatus, extendExamDuration, toggleScorePublish } = useSuperAdminMockData()
</script>

<template>
  <PanelCard title="场次与时间管理" description="支持场次开关、统一延时、成绩发布开关（演示）">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>场次</th>
            <th>学校</th>
            <th>在线/应考</th>
            <th>已交卷</th>
            <th>风险等级</th>
            <th>状态</th>
            <th>延时</th>
            <th>成绩发布</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in examSessions" :key="item.id">
            <td>{{ item.examName }}</td>
            <td>{{ item.school }}</td>
            <td>{{ item.onlineCount }} / {{ item.totalCount }}</td>
            <td>{{ item.submitCount }}</td>
            <td><StatusTag :tone="item.riskLevel === 'HIGH' ? 'danger' : item.riskLevel === 'MEDIUM' ? 'warning' : 'success'" :label="item.riskLevel" /></td>
            <td><StatusTag :tone="item.status === 'RUNNING' ? 'info' : item.status === 'FINISHED' ? 'success' : 'warning'" :label="item.status" /></td>
            <td>+{{ item.extraMinutes }} 分钟</td>
            <td>
              <StatusTag :tone="item.scorePublish ? 'success' : 'warning'" :label="item.scorePublish ? '开启' : '关闭'" />
            </td>
            <td>
              <button class="btn" @click="toggleSessionStatus(item.id)">切换场次状态</button>
              <button class="btn" @click="extendExamDuration(item.id, 10)">+10 分钟</button>
              <button class="btn" @click="toggleScorePublish(item.id)">发布开关</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </PanelCard>
</template>

<style scoped>
.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1100px;
}

th,
td {
  border-bottom: 1px solid var(--line);
  padding: 10px 8px;
  text-align: left;
  font-size: 13px;
}

.btn {
  margin-right: 6px;
  margin-bottom: 6px;
  border: 1px solid #6b98c0;
  background: #fff;
  color: #1e4b72;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
