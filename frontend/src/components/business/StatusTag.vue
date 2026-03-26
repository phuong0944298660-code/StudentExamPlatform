<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  tone: 'success' | 'warning' | 'danger' | 'info'
  label: string
}>()

const toneClass = computed(() => `status-tag--${props.tone}`)
</script>

<template>
  <span class="status-tag" :class="toneClass">{{ label }}</span>
</template>

<style scoped>
.status-tag {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-tag--success {
  color: #0f662f;
  background: #d8f3e2;
}

.status-tag--warning {
  color: #945d09;
  background: #ffeec8;
}

.status-tag--danger {
  color: #9f1d1d;
  background: #ffe1e1;
}

.status-tag--info {
  color: #1d4a8a;
  background: #dbeafe;
}
</style>
