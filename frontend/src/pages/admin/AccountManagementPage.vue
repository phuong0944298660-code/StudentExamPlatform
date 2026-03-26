<script setup lang="ts">
import { computed, ref } from 'vue'
import PanelCard from '../../components/common/PanelCard.vue'
import StatusTag from '../../components/business/StatusTag.vue'
import { useSuperAdminMockData } from '../../mock/superAdminMock'

// 使用本地筛选模拟账号管理查询，后续可替换成真实接口参数。
const roleFilter = ref<'ALL' | 'ADMIN' | 'CONTEST_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'REVIEWER'>('ALL')
const { users, toggleUserStatus, resetUserPassword } = useSuperAdminMockData()

const filteredUsers = computed(() => (roleFilter.value === 'ALL' ? users.value : users.value.filter((item) => item.role === roleFilter.value)))
</script>

<template>
  <PanelCard title="账号管理" description="支持批量账号管理、状态启停、异常排查入口（演示）">
    <template #actions>
      <select v-model="roleFilter" class="input">
        <option value="ALL">全部角色</option>
        <option value="ADMIN">平台管理员</option>
        <option value="CONTEST_ADMIN">赛事管理员</option>
        <option value="TEACHER">教师</option>
        <option value="REVIEWER">评卷老师</option>
        <option value="STUDENT">学生</option>
        <option value="PARENT">家长</option>
      </select>
    </template>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>账号</th>
            <th>角色</th>
            <th>学校</th>
            <th>最近登录</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredUsers" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.username }}</td>
            <td>{{ item.role }}</td>
            <td>{{ item.school }}</td>
            <td>{{ item.lastLoginAt }}</td>
            <td><StatusTag :tone="item.status === 'ENABLED' ? 'success' : 'danger'" :label="item.status === 'ENABLED' ? '启用' : '禁用'" /></td>
            <td>
              <button class="btn" @click="toggleUserStatus(item.id)">{{ item.status === 'ENABLED' ? '禁用' : '启用' }}</button>
              <button class="btn" @click="resetUserPassword(item.id)">重置密码</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </PanelCard>
</template>

<style scoped>
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
  min-width: 860px;
}

th,
td {
  border-bottom: 1px solid var(--line);
  padding: 10px 8px;
  text-align: left;
  font-size: 13px;
}

th {
  color: var(--text-sub);
  font-weight: 600;
}

.btn {
  margin-right: 8px;
  border: 1px solid #6b98c0;
  background: #fff;
  color: #1e4b72;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
