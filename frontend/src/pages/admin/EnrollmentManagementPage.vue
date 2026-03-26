<script setup lang="ts">
import { ref, computed } from 'vue'
import PanelCard from '../../components/common/PanelCard.vue'
import StatusTag from '../../components/business/StatusTag.vue'
import { useSuperAdminMockData } from '../../mock/superAdminMock'

const { enrollments, simulateEnrollmentImport } = useSuperAdminMockData()
const statusFilter = ref<'ALL' | 'VALID' | 'INVALID' | 'PENDING'>('ALL')

// 筛选逻辑用于模拟导入校验后的人工复核流程。
const filteredList = computed(() =>
  statusFilter.value === 'ALL' ? enrollments.value : enrollments.value.filter((item) => item.status === statusFilter.value),
)
</script>

<template>
  <PanelCard title="报名名单导入与信息补全" description="支持 Excel 导入、异常行识别、学生补全入口（演示）">
    <template #actions>
      <button class="btn" @click="simulateEnrollmentImport">模拟导入一批</button>
      <select v-model="statusFilter" class="input">
        <option value="ALL">全部状态</option>
        <option value="VALID">校验通过</option>
        <option value="PENDING">待复核</option>
        <option value="INVALID">校验失败</option>
      </select>
    </template>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>地区</th>
            <th>项目</th>
            <th>组别</th>
            <th>学生</th>
            <th>身份证号</th>
            <th>学校</th>
            <th>指导老师</th>
            <th>联系方式</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredList" :key="item.id">
            <td>{{ item.area }}</td>
            <td>{{ item.projectName }}</td>
            <td>{{ item.groupName }}</td>
            <td>{{ item.studentName }}</td>
            <td>{{ item.idCard }}</td>
            <td>{{ item.school }}</td>
            <td>{{ item.teacherName }}</td>
            <td>{{ item.contact }}</td>
            <td>
              <StatusTag
                :tone="item.status === 'VALID' ? 'success' : item.status === 'INVALID' ? 'danger' : 'warning'"
                :label="item.status"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </PanelCard>
</template>

<style scoped>
.btn {
  border: 1px solid #6b98c0;
  background: #fff;
  color: #1e4b72;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.input {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 6px 8px;
}

.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

th,
td {
  border-bottom: 1px solid var(--line);
  padding: 10px 8px;
  text-align: left;
  font-size: 13px;
}
</style>
