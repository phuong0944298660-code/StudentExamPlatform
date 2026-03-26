<script setup lang="ts">
import type { MetricItem } from '../../types/admin'
import DefinitionTip from '../business/DefinitionTip.vue'

defineProps<{
  item: MetricItem
}>()
</script>

<template>
  <article class="metric-card">
    <header class="metric-card__header">
      <h4>{{ item.title }}</h4>
      <DefinitionTip :text="item.definition" />
    </header>
    <p class="metric-card__value">
      {{ item.value }}
      <span v-if="item.unit">{{ item.unit }}</span>
    </p>
    <p class="metric-card__trend" :class="item.trend === 'up' ? 'metric-card__trend--up' : 'metric-card__trend--down'">
      {{ item.compareText }}
    </p>
  </article>
</template>

<style scoped>
.metric-card {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: linear-gradient(140deg, #ffffff 0%, #f2f8ff 100%);
  padding: 14px;
  box-shadow: var(--panel-shadow);
}

.metric-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.metric-card__header h4 {
  margin: 0;
  color: var(--text-main);
  font-size: 14px;
}

.metric-card__value {
  margin: 12px 0 8px 0;
  font-size: 30px;
  font-weight: 700;
  color: #123f68;
}

.metric-card__value span {
  font-size: 14px;
  margin-left: 4px;
  color: var(--text-sub);
}

.metric-card__trend {
  margin: 0;
  font-size: 12px;
}

.metric-card__trend--up {
  color: #0b7a39;
}

.metric-card__trend--down {
  color: #9f1d1d;
}
</style>
