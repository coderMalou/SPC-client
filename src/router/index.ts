import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/task'
    },
    {
      path: '/task',
      name: 'task',
      component: () => import('@/views/task/index.vue'),
      children: [
        {
          path: '/task/detail',
          name: 'taskDetail',
          component: () => import('@/views/task/detail.vue'),
        }
      ]
    },
    {
      path: '/graph',
      name: 'graph',
      component: () => import('@/views/graph/index.vue'),
    }
  ],
})

export default router
