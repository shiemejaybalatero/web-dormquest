import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import LandingPageView from '@/views/auth/LandingPageView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashBoardView from '@/views/auth/DashBoardView.vue'
import GoogleMapView from '@/views/auth/GoogleMapView.vue'
import ProfileView from '@/views/auth/ProfileView.vue'
import TgbgBoardingHouseView from '@/views/auth/TgbgBoardingHouseView.vue'
import AmplayoBoardingHouseView from '@/views/auth/AmplayoBoardingHouseView.vue'
import BlissfulBoardingHouseView from '@/views/auth/BlissfulBoardingHouseView.vue'
import BlueBoardingHouseView from '@/views/auth/BlueBoardingHouseView.vue'
import ChelseaBoardingHouseView from '@/views/auth/ChelseaBoardingHouseView.vue'
import KarmoBoardingHouseView from '@/views/auth/KarmoBoardingHouseView.vue'
import LicayanBoardingHouseView from '@/views/auth/LicayanBoardingHouseView.vue'
import MagduraBoardingHouseView from '@/views/auth/MagduraBoardingHouseView.vue'
import RatingsView from '@/views/auth/RatingsView.vue'
import AboutAppView from '@/views/auth/AboutAppView.vue'

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
      path: '/map',
      name: 'map',
      component: GoogleMapView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: RatingsView,
    },

    {
      path: '/about',
      name: 'about',
      component: AboutAppView,
    },

    {
      path: '/amplayoboardinghousedetails',
      name: 'amplayoboardinghousedetails',
      component: AmplayoBoardingHouseView,
    },
    {
      path: '/blissfulboardinghousedetails',
      name: 'blissfulboardinghousedetails',
      component: BlissfulBoardingHouseView,
    },
    {
      path: '/blueboardinghousedetails',
      name: 'blueboardinghousedetails',
      component: BlueBoardingHouseView,
    },
    {
      path: '/chelseaboardinghousedetails',
      name: 'chelseaboardinghousedetails',
      component: ChelseaBoardingHouseView,
    },
    {
      path: '/karmoboardinghousedetails',
      name: 'karmoboardinghousedetails',
      component: KarmoBoardingHouseView,
    },
    {
      path: '/licayanboardinghousedetails',
      name: 'licayanboardinghousedetails',
      component: LicayanBoardingHouseView,
    },
    {
      path: '/magduraboardinghousedetails',
      name: 'magduraboardinghousedetails',
      component: MagduraBoardingHouseView,
    },
    {
      path: '/tgbgboardinghousedetails',
      name: 'tgbgboardinghousedetails',
      component: TgbgBoardingHouseView,
    },
  ],
})

export default router
