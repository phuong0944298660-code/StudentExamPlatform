<script setup lang="ts">
import { reactive } from 'vue'
import PanelCard from '../../components/common/PanelCard.vue'
import StatusTag from '../../components/business/StatusTag.vue'
import { useSuperAdminMockData } from '../../mock/superAdminMock'

const { feedbacks, operationLogs, submitFeedback, advanceFeedbackStatus } = useSuperAdminMockData()
const form = reactive({ title: '', content: '' })

// 反馈录入仅在前端内存中维护，用于展示闭环流转。
const onSubmit = () => {
  if (!form.title.trim() || !form.content.trim()) return
  submitFeedback({ title: form.title.trim(), content: form.content.trim() })
  form.title = ''
  form.content = ''
}
</script>

<template>
  <div class="grid">
    <PanelCard title="数据留存与优化反馈" description="记录操作日志、反馈问题、处理进度（演示）">
      <div class="form">
        <input v-model="form.title" class="input" placeholder="反馈标题" />
        <textarea v-model="form.content" class="input" placeholder="反馈内容" rows="3" />
        <button class="btn btn--primary" @click="onSubmit">提交反馈</button>
      </div>
    </PanelCard>

    <PanelCard title="反馈列表">
      <ul class="feedback-list">
        <li v-for="item in feedbacks" :key="item.id">
          <div class="row">
            <strong>{{ item.title }}</strong>
            <StatusTag :tone="item.status === 'DONE' ? 'success' : item.status === 'IN_PROGRESS' ? 'warning' : 'info'" :label="item.status" />
          </div>
          <p>{{ item.content }}</p>
          <div class="row">
            <span>{{ item.createdAt }}</span>
            <button class="btn" @click="advanceFeedbackStatus(item.id)">推进状态</button>
          </div>
        </li>
      </ul>
    </PanelCard>

    <PanelCard title="操作日志审计">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th>动作</th>
              <th>详情</th>
              <th>操作人</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in operationLogs" :key="item.id">
              <td>{{ item.createdAt }}</td>
              <td>{{ item.action }}</td>
              <td>{{ item.detail }}</td>
              <td>{{ item.operator }}</td>
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
  gap: 10px;
}

.input {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 8px 10px;
}

.btn {
  width: fit-content;
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

.feedback-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.feedback-list li {
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #fff;
  padding: 10px;
}

.feedback-list p {
  margin: 8px 0;
  color: var(--text-sub);
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.row span {
  color: var(--text-sub);
  font-size: 12px;
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
</style>
