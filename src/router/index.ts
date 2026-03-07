import { createRouter, createWebHistory } from 'vue-router'
import { userStore } from '@/stores/user'
import storage from '@/utils/storage'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login.vue'),
      meta: {requireGuest: true},
    },
    {
      path: '/task',
      name: 'task',
      component: () => import('@/views/task/index.vue'),
      meta: {requireAuth: true},
      children: [
        {
          path: '/task/detail',
          name: 'taskDetail',
          component: () => import('@/views/task/detail.vue'),
          meta: {requireAuth: true},
        }
      ]
    },
    {
      path: '/graph',
      name: 'graph',
      component: () => import('@/views/graph/index.vue'),
      meta: {requireAuth: true},
    }
  ],
})

router.beforeEach((to, from, next) => {
  const user = userStore()

  if (to.meta.requireAuth) {
    if (!user.isLoggedIn) {
      const savedUser = storage.get('user_info', 'session');
      if (savedUser) {
        user.login(savedUser)
        next()
      } else {
        next('/login')
      }
    } else {
      next()
    }
  } else if (to.meta.requireGuest) {
    if (!user.isLoggedIn) {
      next()
    } else next('/task')
  } else next()
})

export default router
