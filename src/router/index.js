import { createRouter, createWebHistory } from 'vue-router'
// import { isAuthenticated } from '@/utils/supabase'

// Views
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
// import NotFoundView from '@/views/error/NotFoundView.vue'

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
    },
    {
      path: '/system/map',
      name: 'map',
      component: MapView,
    },
    {
      path: '/system/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/system/ratings',
      name: 'ratings',
      component: RatingsView,
    },
    {
      path: '/system/about',
      name: 'about',
      component: AboutAppView,
    },
    {
      path: '/system/forbidden',
      name: 'forbidden',
      component: ForbiddenView,
    },
    {
      path: '/system/amplayoboardinghousedetails',
      name: 'amplayoboardinghousedetails',
      component: AmplayoBoardingHouseView,
    },
    {
      path: '/system/blissfulboardinghousedetails',
      name: 'blissfulboardinghousedetails',
      component: BlissfulBoardingHouseView,
    },
    {
      path: '/system/blueboardinghousedetails',
      name: 'blueboardinghousedetails',
      component: BlueBoardingHouseView,
    },
    {
      path: '/system/chelseaboardinghousedetails',
      name: 'chelseaboardinghousedetails',
      component: ChelseaBoardingHouseView,
    },
    {
      path: '/system/karmoboardinghousedetails',
      name: 'karmoboardinghousedetails',
      component: KarmoBoardingHouseView,
    },
    {
      path: '/system/licayanboardinghousedetails',
      name: 'licayanboardinghousedetails',
      component: LicayanBoardingHouseView,
    },
    {
      path: '/system/magduraboardinghousedetails',
      name: 'magduraboardinghousedetails',
      component: MagduraBoardingHouseView,
    },
    {
      path: '/system/tgbgboardinghousedetails',
      name: 'tgbgboardinghousedetails',
      component: TgbgBoardingHouseView,
    },
  ],
})

/*router.beforeEach(async (to) => {
  const loggedIn = await isAuthenticated()

  if (to.name === 'home') {
    return loggedIn ? { name: 'dashboard' } : true
  }

  if (loggedIn && (to.name === 'login' || to.name === 'register')) {
    return { name: 'dashboard' }
  }

  if (!loggedIn && to.path.startsWith('/system')) {
    return { name: 'login' }
  }

  return true
}) */

export default router
