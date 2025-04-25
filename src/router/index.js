import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/utils/supabase'

import LoginView from '@/views/auth/LoginView.vue'
import LandingPageView from '@/views/auth/LandingPageView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashBoardView from '@/views/auth/system/DashBoardView.vue'
import MapView from '@/views/auth/system/MapView.vue'
import ProfileView from '@/views/auth/system/ProfileView.vue'
import RatingsView from '@/views/auth/system/RatingsView.vue'
import AboutAppView from '@/views/auth/system/AboutAppView.vue'

// Error Views
import ForbiddenView from '@/views/error/ForbiddenView.vue'
import NotFoundView from '@/views/error/NotFoundView.vue'

// Boarding House Details Views
import AmplayoBoardingHouseView from '@/views/auth/system/AmplayoBoardingHouseView.vue'
import BlissfulBoardingHouseView from '@/views/auth/system/BlissfulBoardingHouseView.vue'
import BlueBoardingHouseView from '@/views/auth/system/BlueBoardingHouseView.vue'
import ChelseaBoardingHouseView from '@/views/auth/system/ChelseaBoardingHouseView.vue'
import KarmoBoardingHouseView from '@/views/auth/system/KarmoBoardingHouseView.vue'
import LicayanBoardingHouseView from '@/views/auth/system/LicayanBoardingHouseView.vue'
import MagduraBoardingHouseView from '@/views/auth/system/MagduraBoardingHouseView.vue'
import TgbgBoardingHouseView from '@/views/auth/system/TgbgBoardingHouseView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPageView,
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false },
    },
    {
      path: '/system/dashboard',
      name: 'dashboard',
      component: DashBoardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/system/map',
      name: 'map',
      component: MapView,
      meta: { requiresAuth: true },
    },
    {
      path: '/system/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/system/ratings',
      name: 'ratings',
      component: RatingsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/system/about',
      name: 'about',
      component: AboutAppView,
      meta: { requiresAuth: true },
    },
    {
      path: '/error/forbidden',
      name: 'forbidden',
      component: ForbiddenView,
    },
    {
      path: '/error/not-found',
      name: 'not-found',
      component: NotFoundView,
    },
    {
      path: '/system/amplayoboardinghousedetails',
      name: 'amplayoboardinghousedetails',
      component: AmplayoBoardingHouseView,
      meta: { requiresAuth: true },
    },
    {
      path: '/system/blissfulboardinghousedetails',
      name: 'blissfulboardinghousedetails',
      component: BlissfulBoardingHouseView,
      meta: { requiresAuth: true },
    },
    {
      path: '/system/blueboardinghousedetails',
      name: 'blueboardinghousedetails',
      component: BlueBoardingHouseView,
      meta: { requiresAuth: true },
    },
    {
      path: '/system/chelseaboardinghousedetails',
      name: 'chelseaboardinghousedetails',
      component: ChelseaBoardingHouseView,
      meta: { requiresAuth: true },
    },
    {
      path: '/system/karmoboardinghousedetails',
      name: 'karmoboardinghousedetails',
      component: KarmoBoardingHouseView,
      meta: { requiresAuth: true },
    },
    {
      path: '/system/licayanboardinghousedetails',
      name: 'licayanboardinghousedetails',
      component: LicayanBoardingHouseView,
      meta: { requiresAuth: true },
    },
    {
      path: '/system/magduraboardinghousedetails',
      name: 'magduraboardinghousedetails',
      component: MagduraBoardingHouseView,
      meta: { requiresAuth: true },
    },
    {
      path: '/system/tgbgboardinghousedetails',
      name: 'tgbgboardinghousedetails',
      component: TgbgBoardingHouseView,
      meta: { requiresAuth: true },
    },
    {
      path: '/:catchAll(.*)',
      component: NotFoundView,
    },
  ],
})

router.beforeEach(async (to) => {
  const loggedIn = await isAuthenticated()

  // Redirect to login or dashboard when accessing home
  if (to.name === 'home') {
    return loggedIn ? { name: 'dashboard' } : { name: 'login' }
  }

  // Redirect logged-in users from public pages to dashboard
  if (loggedIn && !to.meta.requiresAuth) {
    return { name: 'dashboard' }
  }

  // Redirect guests from protected pages to home
  if (!loggedIn && to.meta.requiresAuth) {
    return { name: 'home' }
  }

  // No redirection needed
  return true
})

export default router
