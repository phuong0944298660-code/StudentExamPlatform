import { createRouter, createWebHistory } from 'vue-router'
import adminRoutes from './modules/admin'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/admin/dashboard/overview',
    },
    adminRoutes,
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
