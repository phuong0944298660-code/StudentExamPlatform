<script setup lang="ts">
import { reactive } from 'vue'
import PanelCard from '../../components/common/PanelCard.vue'
import StatusTag from '../../components/business/StatusTag.vue'
import { useSuperAdminMockData } from '../../mock/superAdminMock'

const { activationCodes, generateActivationCode } = useSuperAdminMockData()
const form = reactive<{ targetType: 'STUDENT' | 'TEACHER'; days: number }>({ targetType: 'STUDENT', days: 30 })

// 生成动作只更新前端假数据，验收阶段用于流程演示。
const onGenerate = () => generateActivationCode({ ...form })
</script>

<template>
  <div class="grid">
    <PanelCard title="生成激活码" description="支持学生/教师激活码和有效期配置">
      <div class="form">
        <select v-model="form.targetType" class="input">
          <option value="STUDENT">学生激活码（仅题库）</option>
          <option value="TEACHER">教师激活码（题库+资源）</option>
        </select>
        <input v-model.number="form.days" type="number" class="input" min="1" />
        <button class="btn btn--primary" @click="onGenerate">生成激活码</button>
      </div>
    </PanelCard>

    <PanelCard title="激活码列表">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>编码</th>
              <th>对象</th>
              <th>权限范围</th>
              <th>有效期</th>
              <th>状态</th>
              <th>创建人</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in activationCodes" :key="item.id">
              <td>{{ item.code }}</td>
              <td>{{ item.targetType }}</td>
              <td>{{ item.scope }}</td>
              <td>{{ item.validFrom }} ~ {{ item.validTo }}</td>
              <td>
                <StatusTag
                  :tone="item.status === 'USED' ? 'success' : item.status === 'EXPIRED' ? 'danger' : 'info'"
                  :label="item.status"
                />
              </td>
              <td>{{ item.createdBy }}</td>
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
