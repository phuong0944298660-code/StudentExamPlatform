<script setup lang="ts">
import PanelCard from '../../components/common/PanelCard.vue'
import StatusTag from '../../components/business/StatusTag.vue'
import { useSuperAdminMockData } from '../../mock/superAdminMock'

const { examSessions, alerts, systemSettings, resolveAlert, updateSetting, saveSettings } = useSuperAdminMockData()

const onSwitchChange = (key: string, event: Event) => {
  const target = event.target as HTMLInputElement
  updateSetting(key, target.checked)
}

const onNumberChange = (key: string, event: Event) => {
  const target = event.target as HTMLInputElement
  updateSetting(key, Number(target.value))
}

const onSelectChange = (key: string, event: Event) => {
  const target = event.target as HTMLSelectElement
  updateSetting(key, target.value)
}
</script>

<template>
  <div class="grid">
    <PanelCard title="考试过程控制" description="自动保存、上传状态、异常恢复策略开关（演示）">
      <div class="setting-grid">
        <label v-for="item in systemSettings" :key="item.key" class="setting-item">
          <span>{{ item.title }}</span>
          <input
            v-if="item.type === 'switch'"
            type="checkbox"
            :checked="Boolean(item.value)"
            @change="onSwitchChange(item.key, $event)"
          />
          <input
            v-else-if="item.type === 'number'"
            type="number"
            class="input"
            :value="Number(item.value)"
            @change="onNumberChange(item.key, $event)"
          />
          <select
            v-else
            class="input"
            :value="String(item.value)"
            @change="onSelectChange(item.key, $event)"
          >
            <option v-for="opt in item.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </label>
      </div>
      <button class="btn btn--primary" @click="saveSettings">保存配置</button>
    </PanelCard>

    <PanelCard title="进行中场次监控">
      <ul class="session-list">
        <li v-for="item in examSessions" :key="item.id">
          <h4>{{ item.examName }}</h4>
          <p>在线 {{ item.onlineCount }} 人，已交卷 {{ item.submitCount }} 份，延时 +{{ item.extraMinutes }} 分钟</p>
        </li>
      </ul>
    </PanelCard>

    <PanelCard title="告警处理">
      <ul class="alert-list">
        <li v-for="item in alerts" :key="item.id">
          <div class="row">
            <StatusTag :tone="item.level === 'DANGER' ? 'danger' : item.level === 'WARN' ? 'warning' : 'info'" :label="item.level" />
            <strong>{{ item.title }}</strong>
            <span>{{ item.createdAt }}</span>
          </div>
          <p>{{ item.content }}</p>
          <button class="btn" @click="resolveAlert(item.id)">标记已处理</button>
        </li>
      </ul>
    </PanelCard>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 14px;
}

.setting-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.setting-item {
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.input {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 6px 8px;
}

.session-list,
.alert-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.session-list li,
.alert-list li {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 10px;
  padding: 10px;
}

.session-list h4 {
  margin: 0 0 6px 0;
}

.session-list p,
.alert-list p {
  margin: 0;
  color: var(--text-sub);
}

.row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.row span {
  margin-left: auto;
  color: var(--text-sub);
  font-size: 12px;
}

.btn {
  margin-top: 10px;
  border: 1px solid #6b98c0;
  background: #fff;
  color: #1e4b72;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.btn--primary {
  margin-top: 0;
  background: #2f6da8;
  border-color: #2f6da8;
  color: #fff;
}

@media (max-width: 960px) {
  .setting-grid {
    grid-template-columns: 1fr;
  }
}
</style>
