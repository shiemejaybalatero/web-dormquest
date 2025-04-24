import { createRouter, createWebHistory } from 'vue-router'
import { useAuthUserStore } from '@/stores/authUser'

// Views
import LoginView from '@/views/auth/LoginView.vue'
import LandingPageView from '@/views/auth/LandingPageView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashBoardView from '@/views/auth/system/DashBoardView.vue'
import GoogleMapView from '@/views/auth/system/GoogleMapView.vue'
import ProfileView from '@/views/auth/system/ProfileView.vue'
import RatingsView from '@/views/auth/system/RatingsView.vue'
import AboutAppView from '@/views/auth/system/AboutAppView.vue'

// Error Views
import ForbiddenView from '@/views/error/ForbiddenView.vue'

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
      path: '/system/dashboard',
      name: 'dashboard',
      component: DashBoardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/system/map',
      name: 'map',
      component: GoogleMapView,
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
      path: '/forbidden',
      name: 'forbidden',
      component: ForbiddenView,
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
    // Add a catch-all route for undefined routes
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'forbidden' },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthUserStore()
  let isLoggedIn = false

  try {
    isLoggedIn = await authStore.isAuthenticated()
  } catch (error) {
    console.error('Authentication check failed:', error)
    isLoggedIn = false
  }

  // Home page logic - redirect to dashboard if logged in
  if (to.name === 'home' && isLoggedIn) {
    next({ name: 'dashboard' })
    return
  }

  // Prevent accessing login or register if already logged in
  if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    next({ name: 'dashboard' })
    return
  }

  // Check if user is trying to access a protected route
  if (to.meta.requiresAuth) {
    if (!isLoggedIn) {
      console.log('Access to protected route denied - redirecting to forbidden')
      next('/forbidden')
      return
    }
  }

  // If user is not logged in and tries to access any system path, redirect to login
  if (!isLoggedIn && to.path.startsWith('/system')) {
    next({ name: 'login' })
    return
  }

  // Allow access to the requested route
  next()
})

export default router
