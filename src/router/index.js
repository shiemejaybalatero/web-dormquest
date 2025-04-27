import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/utils/supabase'

// Auth Views
import LoginView from '@/views/auth/LoginView.vue'
import LandingPageView from '@/views/auth/LandingPageView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'

// System Views
import DashBoardView from '@/views/system/DashBoardView.vue'
import MapView from '@/views/system/MapView.vue'
import ProfileView from '@/views/system/ProfileView.vue'
import RatingsView from '@/views/system/RatingsView.vue'
import AboutAppView from '@/views/system/AboutAppView.vue'
// Boarding House Details Views
import AmplayoBoardingHouseView from '@/views/system/AmplayoBoardingHouseView.vue'
import DormDetailsViews from '@/views/system/DormDetailsViews.vue'

// Error Views
import ForbiddenView from '@/views/error/ForbiddenView.vue'
import NotFoundView from '@/views/error/NotFoundView.vue'

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
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: RatingsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
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
      path: '/amplayoboardinghousedetails',
      name: 'amplayoboardinghousedetails',
      component: AmplayoBoardingHouseView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dorm-details/:id',
      name: 'DormDetails',
      component: DormDetailsViews,
      meta: { requiresAuth: true },
      props: true,
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
