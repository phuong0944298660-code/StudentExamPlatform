import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '../../layouts/AdminLayout.vue'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    children: [
      // 总览看板
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../../pages/admin/dashboard/index.vue'),
        meta: { title: '看板概览', icon: 'Odometer' }
      },
      // 账号管理
      {
        path: 'accounts',
        name: 'AdminAccounts',
        component: () => import('../../pages/admin/accounts/index.vue'),
        meta: { title: '账号列表', icon: 'UserFilled' }
      },
      {
        path: 'accounts/strategy',
        name: 'AdminAccountStrategy',
        component: () => import('../../pages/admin/accounts/strategy.vue'),
        meta: { title: '策略配置', icon: 'Setting' }
      },
      // 激活管理
      {
        path: 'activation',
        name: 'AdminActivation',
        component: () => import('../../pages/admin/activation/index.vue'),
        meta: { title: '码池管理', icon: 'Key' }
      },
      {
        path: 'activation/records',
        name: 'AdminActivationRecords',
        component: () => import('../../pages/admin/activation/records.vue'),
        meta: { title: '激活记录', icon: 'DocumentChecked' }
      },
      // 导入管理
      {
        path: 'import',
        name: 'AdminImport',
        component: () => import('../../pages/admin/import/index.vue'),
        meta: { title: '名单导入', icon: 'Upload' }
      },
      {
        path: 'import/completion',
        name: 'AdminImportCompletion',
        component: () => import('../../pages/admin/import/completion.vue'),
        meta: { title: '名单补全', icon: 'Edit' }
      },
      // 关联管理
      {
        path: 'import/relation',
        name: 'AdminRelation',
        component: () => import('../../pages/admin/import/relation/index.vue'),
        meta: { title: '关联列表', icon: 'Connection' }
      },
      {
        path: 'import/relation/batch',
        name: 'AdminRelationBatch',
        component: () => import('../../pages/admin/import/relation/batch.vue'),
        meta: { title: '批量关联', icon: 'DocumentAdd' }
      },
      {
        path: 'import/relation/adjust',
        name: 'AdminRelationAdjust',
        component: () => import('../../pages/admin/import/relation/adjust.vue'),
        meta: { title: '关联调整', icon: 'Switch' }
      },
      // 题库管理
      {
        path: 'question-bank',
        name: 'AdminQuestionBank',
        component: () => import('../../pages/admin/question-bank/index.vue'),
        meta: { title: '目录管理', icon: 'FolderOpened' }
      },
      {
        path: 'question-bank/paper',
        name: 'AdminPaper',
        component: () => import('../../pages/admin/question-bank/paper.vue'),
        meta: { title: '组卷管理', icon: 'DocumentCopy' }
      },
      {
        path: 'question-bank/questions',
        name: 'AdminQuestions',
        component: () => import('../../pages/admin/question-bank/questions.vue'),
        meta: { title: '题目管理', icon: 'EditPen' }
      },
      // 场次管理
      {
        path: 'sessions',
        name: 'AdminSessions',
        component: () => import('../../pages/admin/sessions/index.vue'),
        meta: { title: '场次配置', icon: 'Calendar' }
      },
      {
        path: 'sessions/monitor',
        name: 'AdminSessionMonitor',
        component: () => import('../../pages/admin/sessions/monitor.vue'),
        meta: { title: '考场监控', icon: 'VideoCamera' }
      },
      {
        path: 'sessions/whitelist',
        name: 'AdminSessionWhitelist',
        component: () => import('../../pages/admin/sessions/whitelist.vue'),
        meta: { title: '白名单管理', icon: 'List' }
      },
      // 资源管理
      {
        path: 'resources',
        name: 'AdminResources',
        component: () => import('../../pages/admin/resources/index.vue'),
        meta: { title: '资源中心', icon: 'Collection' }
      },
      // 阅卷管理
      {
        path: 'review',
        name: 'AdminReview',
        component: () => import('../../pages/admin/review/index.vue'),
        meta: { title: '阅卷任务', icon: 'Reading' }
      },
      {
        path: 'review/recheck',
        name: 'AdminRecheck',
        component: () => import('../../pages/admin/review/recheck.vue'),
        meta: { title: '复核管理', icon: 'CircleCheck' }
      },
      // 成绩管理
      {
        path: 'scores',
        name: 'AdminScores',
        component: () => import('../../pages/admin/scores/index.vue'),
        meta: { title: '成绩查询', icon: 'TrendCharts' }
      },
      {
        path: 'scores/export',
        name: 'AdminScoreExport',
        component: () => import('../../pages/admin/scores/export.vue'),
        meta: { title: '成绩导出', icon: 'Download' }
      },
      {
        path: 'scores/publish',
        name: 'AdminScorePublish',
        component: () => import('../../pages/admin/scores/publish.vue'),
        meta: { title: '成绩发布', icon: 'Bell' }
      },
      // 留痕管理
      {
        path: 'audit',
        name: 'AdminAudit',
        component: () => import('../../pages/admin/audit/index.vue'),
        meta: { title: '日志审计', icon: 'Clock' }
      }
    ]
  }
]

export default adminRoutes
