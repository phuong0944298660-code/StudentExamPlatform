<script setup lang="ts">
import { ref } from 'vue'
import PanelCard from '../../components/common/PanelCard.vue'
import StatusTag from '../../components/business/StatusTag.vue'
import { useSuperAdminMockData } from '../../mock/superAdminMock'

const { scoreRecords, exportTasks, createExportTask } = useSuperAdminMockData()
const stage = ref<'PRIMARY' | 'MIDDLE'>('MIDDLE')
</script>

<template>
  <div class="grid">
    <PanelCard title="成绩导出与查询" description="支持按学段导出，结果按总分优先、提交时间排序（演示）">
      <template #actions>
        <select v-model="stage" class="input">
          <option value="MIDDLE">初中组</option>
          <option value="PRIMARY">小学组</option>
        </select>
        <button class="btn btn--primary" @click="createExportTask(stage)">发起导出</button>
      </template>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>学生</th>
              <th>身份证号</th>
              <th>学段</th>
              <th>场次</th>
              <th>客观题</th>
              <th>主观题</th>
              <th>总分</th>
              <th>提交时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in scoreRecords" :key="item.id">
              <td>{{ item.studentName }}</td>
              <td>{{ item.idCard }}</td>
              <td>{{ item.stage }}</td>
              <td>{{ item.sessionName }}</td>
              <td>{{ item.objectiveScore }}</td>
              <td>{{ item.subjectiveScore }}</td>
              <td>{{ item.totalScore }}</td>
              <td>{{ item.submitTime }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </PanelCard>

    <PanelCard title="导出任务历史">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>文件名</th>
              <th>状态</th>
              <th>创建时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in exportTasks" :key="task.id">
              <td>{{ task.fileName }}</td>
              <td><StatusTag :tone="task.status === 'SUCCESS' ? 'success' : task.status === 'FAILED' ? 'danger' : 'warning'" :label="task.status" /></td>
              <td>{{ task.createdAt }}</td>
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

.input {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 6px 8px;
}

.btn {
  border: 1px solid #6b98c0;
  background: #fff;
  color: #1e4b72;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.btn--primary {
  background: #2f6da8;
  border-color: #2f6da8;
  color: #fff;
}

.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;
}

th,
td {
  border-bottom: 1px solid var(--line);
  padding: 10px 8px;
  text-align: left;
  font-size: 13px;
}
</style>
