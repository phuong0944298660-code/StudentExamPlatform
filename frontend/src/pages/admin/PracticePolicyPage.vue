<script setup lang="ts">
import { reactive } from 'vue'
import PanelCard from '../../components/common/PanelCard.vue'
import StatusTag from '../../components/business/StatusTag.vue'
import { useSuperAdminMockData } from '../../mock/superAdminMock'

// 表单仅用于前端演示，提交后写入假数据列表。
const form = reactive({ name: '', price: 199, durationDays: 90 })
const { practicePolicies, addPracticePolicy, togglePracticePolicyStatus } = useSuperAdminMockData()

const onSubmit = () => {
  if (!form.name.trim()) return
  addPracticePolicy({ ...form, name: form.name.trim() })
  form.name = ''
}
</script>

<template>
  <div class="grid">
    <PanelCard title="新增练习账号策略" description="支持价格与生效周期配置（快捷方案可由后端补充）">
      <div class="form">
        <input v-model="form.name" class="input" placeholder="策略名称，例如：春季冲刺 90 天" />
        <input v-model.number="form.price" class="input" type="number" min="0" />
        <input v-model.number="form.durationDays" class="input" type="number" min="1" />
        <button class="btn btn--primary" @click="onSubmit">新增策略</button>
      </div>
    </PanelCard>

    <PanelCard title="策略列表">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>策略名</th>
              <th>价格</th>
              <th>周期</th>
              <th>生效区间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in practicePolicies" :key="item.id">
              <td>{{ item.name }}</td>
              <td>¥ {{ item.price }}</td>
              <td>{{ item.durationDays }} 天</td>
              <td>{{ item.validFrom }} ~ {{ item.validTo }}</td>
              <td><StatusTag :tone="item.status === 'ACTIVE' ? 'success' : 'warning'" :label="item.status" /></td>
              <td>
                <button class="btn" @click="togglePracticePolicyStatus(item.id)">{{ item.status === 'ACTIVE' ? '停用' : '启用' }}</button>
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

.form {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 10px;
}

.input {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 8px 10px;
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
  min-width: 760px;
}

th,
td {
  border-bottom: 1px solid var(--line);
  padding: 10px 8px;
  text-align: left;
  font-size: 13px;
}

@media (max-width: 960px) {
  .form {
    grid-template-columns: 1fr;
  }
}
</style>
