<script setup lang="ts">
import { reactive } from 'vue'
import PanelCard from '../../components/common/PanelCard.vue'
import StatusTag from '../../components/business/StatusTag.vue'
import { useSuperAdminMockData } from '../../mock/superAdminMock'

const { questionBanks, addQuestionBank, toggleQuestionBankStatus } = useSuperAdminMockData()
const form = reactive<{ name: string; stage: 'PRIMARY' | 'MIDDLE' }>({ name: '', stage: 'MIDDLE' })

// 题库新增仅用于前端流程演示，发布状态可以手动切换。
const onAdd = () => {
  if (!form.name.trim()) return
  addQuestionBank({ ...form, name: form.name.trim() })
  form.name = ''
}
</script>

<template>
  <div class="grid">
    <PanelCard title="题库搭建与录入" description="支持新建题库、发布状态切换、题量概览（演示）">
      <div class="form">
        <input v-model="form.name" class="input" placeholder="题库名称" />
        <select v-model="form.stage" class="input">
          <option value="PRIMARY">小学组</option>
          <option value="MIDDLE">初中组</option>
        </select>
        <button class="btn btn--primary" @click="onAdd">新建题库</button>
      </div>
    </PanelCard>

    <PanelCard title="题库列表">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>题库名</th>
              <th>学段</th>
              <th>套次</th>
              <th>总题数</th>
              <th>主观题数</th>
              <th>状态</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in questionBanks" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.stage }}</td>
              <td>{{ item.suiteNo }}</td>
              <td>{{ item.questionCount }}</td>
              <td>{{ item.subjectiveCount }}</td>
              <td><StatusTag :tone="item.status === 'PUBLISHED' ? 'success' : 'warning'" :label="item.status" /></td>
              <td>{{ item.updatedAt }}</td>
              <td><button class="btn" @click="toggleQuestionBankStatus(item.id)">{{ item.status === 'PUBLISHED' ? '撤回' : '发布' }}</button></td>
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
  grid-template-columns: 2fr 1fr auto;
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
  min-width: 860px;
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
