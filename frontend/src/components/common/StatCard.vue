<script setup lang="ts">
import { computed } from 'vue'
import type { MetricItem } from '../../types/admin'

const props = defineProps<{
  metric: MetricItem
}>()

const toneClass = computed(() => {
  const tone = props.metric.tone ?? 'info'

  const map: Record<string, string> = {
    primary: 'from-blue-500/12 via-blue-100 to-white text-blue-600',
    success: 'from-emerald-500/12 via-emerald-100 to-white text-emerald-600',
    warning: 'from-amber-500/14 via-amber-100 to-white text-amber-600',
    danger: 'from-rose-500/12 via-rose-100 to-white text-rose-600',
    info: 'from-slate-500/10 via-slate-100 to-white text-slate-600',
  }

  return map[tone]
})
</script>

<template>
  <div class="soft-card rounded-[24px] bg-gradient-to-br p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl" :class="toneClass">
    <div class="text-sm font-medium text-slate-500">
      {{ metric.label }}
    </div>
    <div class="mt-4 flex items-end justify-between gap-3">
      <div class="text-[28px] font-semibold text-slate-900">
        {{ metric.value }}
      </div>
      <div v-if="metric.trend" class="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
        {{ metric.trend }}
      </div>
    </div>
    <div class="mt-3 text-sm leading-6 text-slate-500">
      {{ metric.hint }}
    </div>
  </div>
</template>
