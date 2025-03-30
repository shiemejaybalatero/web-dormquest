import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import LandingPageView from '@/views/auth/LandingPageView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginView,
    },
    {
      path: '/landing',
      name: 'landing',
      component: LandingPageView,
    },
    {
      path: '/landing',
      name: 'landing',
      component: RegisterView,
    },
  ],
})

export default router
