import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '../../layouts/AdminLayout.vue'
import DashboardPage from '../../pages/admin/dashboard/index.vue'
import AccountPage from '../../pages/admin/account/index.vue'
import ActivationPage from '../../pages/admin/activation/index.vue'
import ImportPage from '../../pages/admin/import/index.vue'
import QuestionBankPage from '../../pages/admin/question-bank/index.vue'
import SessionsPage from '../../pages/admin/sessions/index.vue'
import ResourcesPage from '../../pages/admin/resources/index.vue'
import ReviewPage from '../../pages/admin/review/index.vue'
import ScoresPage from '../../pages/admin/scores/index.vue'
import AuditPage from '../../pages/admin/audit/index.vue'

const adminRoutes: RouteRecordRaw = {
  path: '/admin',
  component: AdminLayout,
  redirect: '/admin/dashboard/overview',
  children: [
    { path: 'dashboard/overview', name: 'admin-dashboard-overview', component: DashboardPage, meta: { groupLabel: '总览看板', sectionLabel: '看板概览', sectionKey: 'overview' } },
    { path: 'dashboard/todo', name: 'admin-dashboard-todo', component: DashboardPage, meta: { groupLabel: '总览看板', sectionLabel: '待办任务', sectionKey: 'todo' } },
    { path: 'accounts/list', name: 'admin-accounts-list', component: AccountPage, meta: { groupLabel: '账号管理', sectionLabel: '账号列表', sectionKey: 'list' } },
    { path: 'accounts/policy', name: 'admin-accounts-policy', component: AccountPage, meta: { groupLabel: '账号管理', sectionLabel: '策略配置', sectionKey: 'policy' } },
    { path: 'activation/pool', name: 'admin-activation-pool', component: ActivationPage, meta: { groupLabel: '激活管理', sectionLabel: '码池管理', sectionKey: 'pool' } },
    { path: 'activation/history', name: 'admin-activation-history', component: ActivationPage, meta: { groupLabel: '激活管理', sectionLabel: '激活记录', sectionKey: 'history' } },
    { path: 'import/roster', name: 'admin-import-roster', component: ImportPage, meta: { groupLabel: '导入管理', sectionLabel: '名单导入', sectionKey: 'roster' } },
    { path: 'import/complete', name: 'admin-import-complete', component: ImportPage, meta: { groupLabel: '导入管理', sectionLabel: '名单补全', sectionKey: 'complete' } },
    { path: 'question-bank/directory', name: 'admin-question-bank-directory', component: QuestionBankPage, meta: { groupLabel: '题库管理', sectionLabel: '目录管理', sectionKey: 'directory' } },
    { path: 'question-bank/builder', name: 'admin-question-bank-builder', component: QuestionBankPage, meta: { groupLabel: '题库管理', sectionLabel: '组卷管理', sectionKey: 'builder' } },
    { path: 'question-bank/question', name: 'admin-question-bank-question', component: QuestionBankPage, meta: { groupLabel: '题库管理', sectionLabel: '题目管理', sectionKey: 'question' } },
    { path: 'sessions/config', name: 'admin-sessions-config', component: SessionsPage, meta: { groupLabel: '场次管理', sectionLabel: '场次配置', sectionKey: 'config' } },
    { path: 'sessions/monitor', name: 'admin-sessions-monitor', component: SessionsPage, meta: { groupLabel: '场次管理', sectionLabel: '考场监控', sectionKey: 'monitor' } },
    { path: 'sessions/whitelist', name: 'admin-sessions-whitelist', component: SessionsPage, meta: { groupLabel: '场次管理', sectionLabel: '白名单管理', sectionKey: 'whitelist' } },
    { path: 'resources/center', name: 'admin-resources-center', component: ResourcesPage, meta: { groupLabel: '资源管理', sectionLabel: '资源中心', sectionKey: 'center' } },
    { path: 'resources/category', name: 'admin-resources-category', component: ResourcesPage, meta: { groupLabel: '资源管理', sectionLabel: '资源分类', sectionKey: 'category' } },
    { path: 'review/tasks', name: 'admin-review-tasks', component: ReviewPage, meta: { groupLabel: '阅卷管理', sectionLabel: '阅卷任务', sectionKey: 'tasks' } },
    { path: 'review/recheck', name: 'admin-review-recheck', component: ReviewPage, meta: { groupLabel: '阅卷管理', sectionLabel: '复核管理', sectionKey: 'recheck' } },
    { path: 'review/retention', name: 'admin-review-retention', component: ReviewPage, meta: { groupLabel: '阅卷管理', sectionLabel: '凭证留存', sectionKey: 'retention' } },
    { path: 'scores/query', name: 'admin-scores-query', component: ScoresPage, meta: { groupLabel: '成绩管理', sectionLabel: '成绩查询', sectionKey: 'query' } },
    { path: 'scores/export', name: 'admin-scores-export', component: ScoresPage, meta: { groupLabel: '成绩管理', sectionLabel: '成绩导出', sectionKey: 'export' } },
    { path: 'scores/publish', name: 'admin-scores-publish', component: ScoresPage, meta: { groupLabel: '成绩管理', sectionLabel: '成绩发布', sectionKey: 'publish' } },
    { path: 'audit/log', name: 'admin-audit-log', component: AuditPage, meta: { groupLabel: '留痕管理', sectionLabel: '日志审计', sectionKey: 'log' } },
    { path: 'audit/feedback', name: 'admin-audit-feedback', component: AuditPage, meta: { groupLabel: '留痕管理', sectionLabel: '意见反馈', sectionKey: 'feedback' } },
  ],
}

export default adminRoutes
