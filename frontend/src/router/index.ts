import { createRouter, createWebHashHistory } from 'vue-router'

// 管理端采用统一布局 + 子路由模块，保证验收时可直接切换页面。
const routes = [
  {
    path: '/',
    redirect: '/admin/dashboard',
  },
  {
    path: '/admin',
    component: () => import('../pages/admin/SuperAdminLayout.vue'),
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('../pages/admin/SuperAdminDashboardPage.vue'), meta: { title: '首页看板' } },
      { path: 'accounts', name: 'admin-accounts', component: () => import('../pages/admin/AccountManagementPage.vue'), meta: { title: '账号管理' } },
      { path: 'practice-policy', name: 'admin-practice-policy', component: () => import('../pages/admin/PracticePolicyPage.vue'), meta: { title: '练习账号价格与生效周期' } },
      { path: 'activation-codes', name: 'admin-activation-codes', component: () => import('../pages/admin/ActivationCodePage.vue'), meta: { title: '激活码管理' } },
      { path: 'enrollment', name: 'admin-enrollment', component: () => import('../pages/admin/EnrollmentManagementPage.vue'), meta: { title: '报名名单导入与信息补全' } },
      { path: 'question-bank', name: 'admin-question-bank', component: () => import('../pages/admin/QuestionBankPage.vue'), meta: { title: '题库搭建与录入' } },
      { path: 'sessions', name: 'admin-sessions', component: () => import('../pages/admin/SessionManagementPage.vue'), meta: { title: '场次与时间管理' } },
      { path: 'resources', name: 'admin-resources', component: () => import('../pages/admin/ResourceCenterPage.vue'), meta: { title: '资源中心管理' } },
      { path: 'exam-control', name: 'admin-exam-control', component: () => import('../pages/admin/ExamControlPage.vue'), meta: { title: '考试过程与提交控制' } },
      { path: 'review-sync', name: 'admin-review-sync', component: () => import('../pages/admin/ReviewSyncPage.vue'), meta: { title: '评卷与成绩同步管理' } },
      { path: 'score-query', name: 'admin-score-query', component: () => import('../pages/admin/ScoreQueryPage.vue'), meta: { title: '成绩导出、查询与审分' } },
      { path: 'data-retention', name: 'admin-data-retention', component: () => import('../pages/admin/DataRetentionPage.vue'), meta: { title: '数据留存与优化反馈' } },
    ],
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
