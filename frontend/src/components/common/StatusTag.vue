<script setup lang="ts">
import { computed } from 'vue'
import type { Tone } from '../../types/admin'

const props = withDefaults(
  defineProps<{
    label: string
    tone?: Tone
  }>(),
  {
    tone: 'info',
  },
)

const tagType = computed(() => {
  if (props.tone === 'primary') return ''
  if (props.tone === 'danger') return 'danger'
  if (props.tone === 'warning') return 'warning'
  if (props.tone === 'success') return 'success'
  return 'info'
})
</script>

<template>
  <el-tag :type="tagType" effect="light" size="small">
    {{ label }}
  </el-tag>
</template>
