<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 面包屑映射
const breadcrumbMap: Record<string, string> = {
  'dashboard': '看板概览',
  'accounts': '账号管理',
  'strategy': '策略配置',
  'activation': '激活管理',
  'records': '激活记录',
  'import': '导入管理',
  'completion': '名单补全',
  'question-bank': '题库管理',
  'paper': '组卷管理',
  'questions': '题目管理',
  'sessions': '场次管理',
  'monitor': '考场监控',
  'whitelist': '白名单管理',
  'resources': '资源管理',
  'review': '阅卷管理',
  'recheck': '复核管理',
  'scores': '成绩管理',
  'export': '成绩导出',
  'publish': '成绩发布',
  'audit': '留痕管理'
}

const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  // 移除 'admin'
  const relevant = paths.slice(1)
  
  return relevant.map((segment, index) => {
    const path = '/admin/' + relevant.slice(0, index + 1).join('/')
    return {
      path,
      title: breadcrumbMap[segment] || segment
    }
  })
})
</script>

<style scoped>
:deep(.el-breadcrumb__inner) {
  font-size: 14px;
}

:deep(.el-breadcrumb__inner.is-link:hover) {
  color: #3B82F6;
}
</style>
