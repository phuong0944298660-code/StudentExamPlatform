<template>
  <el-tag :type="tagType" :size="size" :effect="effect">
    {{ displayText }}
  </el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: string
  size?: 'large' | 'default' | 'small'
  effect?: 'dark' | 'light' | 'plain'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'small',
  effect: 'light'
})

// 状态映射表
const statusMap: Record<string, { text: string; type: 'success' | 'warning' | 'danger' | 'info' | 'primary' }> = {
  // 账号状态
  'ENABLED': { text: '正常', type: 'success' },
  'DISABLED': { text: '已禁用', type: 'danger' },
  'LOCKED': { text: '已锁定', type: 'warning' },
  
  // 激活码状态
  'NOT_EFFECTIVE': { text: '未生效', type: 'info' },
  'ACTIVE': { text: '生效中', type: 'success' },
  'USED': { text: '已使用', type: 'info' },
  'EXPIRED': { text: '已过期', type: 'danger' },
  
  // 考试场次状态
  'DRAFT': { text: '草稿', type: 'info' },
  'PENDING': { text: '未开始', type: 'warning' },
  'OPEN': { text: '进行中', type: 'success' },
  'CLOSED': { text: '已关闭', type: 'danger' },
  'FINISHED': { text: '已完成', type: 'info' },
  
  // 导入状态
  'PROCESSING': { text: '处理中', type: 'warning' },
  'COMPLETED': { text: '已完成', type: 'success' },
  'FAILED': { text: '失败', type: 'danger' },
  
  // 题库状态
  'PUBLISHED': { text: '已发布', type: 'success' },
}

const tagType = computed(() => {
  return statusMap[props.status]?.type || 'info'
})

const displayText = computed(() => {
  return statusMap[props.status]?.text || props.status
})
</script>
