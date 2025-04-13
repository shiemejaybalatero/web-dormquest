import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import LandingPageView from '@/views/auth/LandingPageView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashBoardView from '@/views/auth/DashBoardView.vue'
import TgbgBoardingHouseView from '@/views/TgbgBoardingHouseView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPageView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoardView,
    },
    {
      path: '/TgbgBoardingHouse',
      name: 'TgbgBoardingHouseDetails',
      component: TgbgBoardingHouseView,
    },
  ],
})

export default router
