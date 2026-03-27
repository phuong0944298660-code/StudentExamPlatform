import { createRouter, createWebHistory } from 'vue-router'
import adminRoutes from './modules/admin'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/admin'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../pages/login/index.vue')
    },
    // 管理员路由
    ...adminRoutes,
    // 404 页面
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../pages/404/index.vue')
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 模拟登录检查，实际项目中需要检查 token
  const isAuthenticated = localStorage.getItem('token') || true // 开发阶段默认放行
  
  if (to.path === '/login') {
    next()
  } else if (!isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
