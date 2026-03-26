<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 左侧菜单与路由保持一一对应，覆盖管理员全部功能模块。
const menus = [
  { path: '/admin/dashboard', label: '首页看板' },
  { path: '/admin/accounts', label: '账号管理' },
  { path: '/admin/practice-policy', label: '练习账号价格与生效周期' },
  { path: '/admin/activation-codes', label: '激活码管理' },
  { path: '/admin/enrollment', label: '报名名单导入与信息补全' },
  { path: '/admin/question-bank', label: '题库搭建与录入' },
  { path: '/admin/sessions', label: '场次与时间管理' },
  { path: '/admin/resources', label: '资源中心管理' },
  { path: '/admin/exam-control', label: '考试过程与提交控制' },
  { path: '/admin/review-sync', label: '评卷与成绩同步管理' },
  { path: '/admin/score-query', label: '成绩导出、查询与审分' },
  { path: '/admin/data-retention', label: '数据留存与优化反馈' },
]

const title = computed(() => (route.meta.title as string) ?? '平台管理员')
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <h1>超管工作台</h1>
      <p>考试培训平台</p>
      <nav>
        <RouterLink v-for="item in menus" :key="item.path" :to="item.path" class="menu" active-class="menu--active">
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>
    <main class="content">
      <header class="content__header">
        <h2>{{ title }}</h2>
        <span>当前角色：平台管理员</span>
      </header>
      <section class="content__body">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 290px 1fr;
  background:
    radial-gradient(circle at 20% 0%, rgba(44, 148, 255, 0.18) 0%, transparent 34%),
    radial-gradient(circle at 90% 90%, rgba(10, 173, 150, 0.14) 0%, transparent 32%),
    #f1f7fd;
}

.sidebar {
  border-right: 1px solid #d4e5f6;
  background: linear-gradient(180deg, #123a63 0%, #164f7f 100%);
  padding: 20px 16px;
  color: #eef7ff;
}

.sidebar h1 {
  margin: 0;
  font-size: 22px;
}

.sidebar p {
  margin: 6px 0 14px 0;
  color: #cde7ff;
  font-size: 12px;
}

nav {
  display: grid;
  gap: 6px;
  max-height: calc(100vh - 110px);
  overflow: auto;
  padding-right: 4px;
}

.menu {
  text-decoration: none;
  color: #e6f3ff;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 9px 10px;
  font-size: 13px;
  line-height: 1.3;
  transition: 0.2s ease;
}

.menu:hover {
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.08);
}

.menu--active {
  border-color: #9ad2ff;
  background: rgba(255, 255, 255, 0.18);
  font-weight: 600;
}

.content {
  display: grid;
  grid-template-rows: auto 1fr;
}

.content__header {
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content__header h2 {
  margin: 0;
  color: #143e65;
}

.content__header span {
  font-size: 13px;
  color: #4c6f8e;
}

.content__body {
  padding: 0 20px 18px 20px;
}

@media (max-width: 1100px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: 0;
    border-bottom: 1px solid #d4e5f6;
  }

  nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-height: none;
  }
}

@media (max-width: 720px) {
  nav {
    grid-template-columns: 1fr;
  }

  .content__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
