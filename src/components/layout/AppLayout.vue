<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineEmits } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { supabase, formActionDefault } from '@/utils/supabase'
import { userProfile, isLoadingUser, fetchUserProfile } from '@/stores/userStore'
import EditProfile from '@/components/system/EditProfile.vue'

const route = useRoute()
const router = useRouter()
const theme = useTheme()
const searchQuery = ref('')
const showScrollTop = ref(false)
const mainContent = ref(null) // Ref to the v-main element
const drawer = ref(false)
const formAction = ref({ ...formActionDefault })

// Define emits
const emit = defineEmits(['search'])

// Theme control
const isDarkMode = ref(theme.global.name.value === 'dark')

// Control the visibility of the profile edit dialog
const showProfileEditDialog = ref(false)

// Custom function to update theme colors based on mode
function updateThemeColors() {
  if (isDarkMode.value) {
    // Dark mode: Deep green colors
    theme.themes.value.dark.colors.primary = '#0C3B2E' // Deep green
    theme.themes.value.dark.colors.secondary = '#FFBA00' // Gold accent
    theme.themes.value.dark.colors.background = '#0A2E23' // Darker green background
    document.body.style.setProperty('--gradient-bg-color', '#0A2E23')
  } else {
    // Light mode: Light green colors
    theme.themes.value.light.colors.primary = '#6D9773' // Light green
    theme.themes.value.light.colors.secondary = '#FFBA00' // Keep gold accent
    theme.themes.value.light.colors.background = '#FFFDF6' // Very light green background
    document.body.style.setProperty('--gradient-bg-color', '#FFFDF6')
  }
}

// Watch for changes in the search query and emit search event
watch(searchQuery, (newValue) => {
  emit('search', newValue)
})

// Function for theme toggle
const toggleTheme = () => {
  theme.global.name.value = theme.global.name.value === 'light' ? 'dark' : 'light'
  isDarkMode.value = theme.global.name.value === 'dark'
  updateThemeColors()
}

// Watch for theme changes
watch(
  () => theme.global.name.value,
  () => {
    isDarkMode.value = theme.global.name.value === 'dark'
    updateThemeColors()
  },
)

// Fixed handleScroll function with proper element check
const handleScroll = () => {
  // First check if mainContent ref exists
  if (!mainContent.value) return

  // Check if we have access to the DOM element
  const element = mainContent.value.$el || mainContent.value

  if (element) {
    // For v-main component, use its scrollTop
    const scrollTop =
      typeof element.scrollTop !== 'undefined'
        ? element.scrollTop
        : window.pageYOffset || document.documentElement.scrollTop

    showScrollTop.value = scrollTop > 300
  }
}

// Fixed scrollToTop function
const scrollToTop = () => {
  if (mainContent.value) {
    const element = mainContent.value.$el || mainContent.value

    if (element && typeof element.scrollTo === 'function') {
      element.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}

const onLogout = async () => {
  formAction.value = { ...formActionDefault, formProcess: true }

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error during logout:', error)
      formAction.value.formProcess = false
      return
    }

    formAction.value.formProcess = false
    router.replace('/')
  } catch (err) {
    console.error('Exception during logout:', err)
    formAction.value.formProcess = false
  }
}

// Handle profile update event
const handleProfileUpdated = () => {
  // Refresh profile data after update
  fetchUserProfile()
  console.log('Profile updated successfully')
}

onMounted(async () => {
  // Load user profile data
  await fetchUserProfile()

  // Initialize theme colors first
  updateThemeColors()

  // Add scroll event listeners after a brief delay to ensure DOM is ready
  setTimeout(() => {
    // Check if mainContent.value exists and has the DOM element
    if (mainContent.value) {
      const element = mainContent.value.$el || mainContent.value

      if (element && typeof element.addEventListener === 'function') {
        element.addEventListener('scroll', handleScroll)
      }
    }

    // Always add window scroll listener as fallback
    window.addEventListener('scroll', handleScroll)

    // Check initial scroll position
    handleScroll()
  }, 100)
})

onBeforeUnmount(() => {
  // Clean up event listeners when component is unmounted
  if (mainContent.value) {
    const element = mainContent.value.$el || mainContent.value

    if (element && typeof element.removeEventListener === 'function') {
      element.removeEventListener('scroll', handleScroll)
    }
  }

  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <v-app :theme="isDarkMode ? 'dark' : 'light'">
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item
          title="Dashboard"
          prepend-icon="mdi-view-dashboard"
          :to="{ path: '/dashboard' }"
          router
          exact
        />
        <v-list-item title="Ratings" prepend-icon="mdi-star" :to="{ path: '/ratings' }" router />
        <v-list-item
          title="About App"
          prepend-icon="mdi-information"
          :to="{ path: '/about' }"
          router
        />

        <v-divider class="my-3"></v-divider>

        <!-- Theme toggle in navigation drawer -->
        <v-list-item
          :prepend-icon="isDarkMode ? 'mdi-weather-night' : 'mdi-weather-sunny'"
          @click="toggleTheme"
        >
          <v-list-item-title>{{ isDarkMode ? 'Dark' : 'Light' }} Mode</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app flat class="gradient-app-bar">
      <!-- Logo for large screens -->
      <router-link to="/dashboard" class="ml-6 Logoname d-none d-lg-block">
        <span class="ftext ms-10 font-weight-bold">DORM</span>
        <span class="stext font-weight-bold">QUEST</span>
      </router-link>

      <!-- Logo for mobile/small screens -->
      <router-link to="/dashboard" class="ml-4 d-flex align-center d-lg-none text-decoration-none">
        <span class="ftext font-weight-bold text-subtitle-3">DORM</span>
        <span class="stext font-weight-bold text-subtitle-3 ms-1">QUEST</span>
      </router-link>

      <v-spacer />
      <v-img src="/23.png" alt="Logo" max-width="50" class="mr-6 logo1 me-15 d-none d-lg-block" />
      <v-img src="/23.png" alt="Logo" max-width="40" class="mr-4 logo1 d-block d-lg-none" />
    </v-app-bar>

    <v-main
      ref="mainContent"
      class="main-no-gap"
      :style="
        route.path === '/map'
          ? 'overflow: hidden; height: 100vh; padding: 0;'
          : 'overflow-y: auto; height: 100vh;'
      "
    >
      <div :class="route.path === '/map' ? '' : 'gradient-bg'">
        <template v-if="route.path !== '/map'">
          <v-container fluid>
            <!-- Search & Buttons -->
            <div class="search-wrapper mt-3 mb-4">
              <v-text-field
                v-model="searchQuery"
                placeholder="Search for dormitories or boarding house"
                prepend-inner-icon="mdi-magnify"
                class="search-field me-2"
                variant="outlined"
                rounded
                hide-details
                clearable
                density="comfortable"
              />

              <div class="action-buttons">
                <!-- Scroll to top button -->
                <v-fade-transition>
                  <v-btn
                    v-if="showScrollTop"
                    icon
                    class="scroll-top-btn"
                    @click="scrollToTop"
                    elevation="4"
                    color="#0c3b2e"
                  >
                    <v-icon>mdi-arrow-up</v-icon>
                  </v-btn>
                </v-fade-transition>

                <router-link to="/dashboard">
                  <v-btn
                    icon
                    class="mx-1"
                    :class="{
                      'green-btn':
                        route.path === '/dashboard' || route.path.startsWith('/dorm-details'),
                    }"
                  >
                    <v-icon>mdi-home-outline</v-icon>
                  </v-btn>
                </router-link>

                <router-link to="/map">
                  <v-btn icon class="mx-1" :class="{ 'green-btn': route.path === '/map' }">
                    <v-icon>mdi-map-marker-outline</v-icon>
                  </v-btn>
                </router-link>

                <!-- Avatar Menu -->
                <v-menu min-width="200px">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      class="mx-1"
                      :class="{ 'green-btn': route.path === '/personal' }"
                      icon
                      v-bind="props"
                    >
                      <v-avatar
                        class="avatar-btn"
                        :class="{
                          'green-btn': ['/profile', '/ratings', '/about'].includes(route.path),
                        }"
                        size="large"
                      >
                        <template v-if="isLoadingUser">
                          <v-progress-circular indeterminate size="24" color="primary" />
                        </template>
                        <v-img
                          v-else-if="userProfile.avatar_url"
                          :src="userProfile.avatar_url"
                          alt="User Avatar"
                        />
                        <span v-else class="text-subtitle-2">{{ userProfile.initials }}</span>
                      </v-avatar>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-text>
                      <div class="mx-auto text-center">
                        <v-avatar color="orange">
                          <template v-if="isLoadingUser">
                            <v-progress-circular indeterminate size="24" color="white" />
                          </template>
                          <v-img
                            v-else-if="userProfile.avatar_url"
                            :src="userProfile.avatar_url"
                            alt="User Avatar"
                          />
                          <span v-else class="text-h5">{{ userProfile.initials }}</span>
                        </v-avatar>
                        <h3>{{ userProfile.fullname }}</h3>
                        <p class="text-caption mt-1">{{ userProfile.email }}</p>
                        <v-divider class="my-3" />
                        <v-btn
                          variant="text"
                          rounded
                          class="mx-1 text-btn"
                          @click="$router.push('/profile')"
                        >
                          Personal Information
                        </v-btn>
                        <v-divider class="my-3" />
                        <v-btn variant="text" rounded @click="showProfileEditDialog = true">
                          Edit Account
                        </v-btn>
                        <v-divider class="my-3" />
                        <v-btn
                          prepend-icon="mdi-logout"
                          variant="plain"
                          @click="onLogout"
                          :loading="formAction.formProcess"
                          :disabled="formAction.formProcess"
                        >
                          Logout
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-menu>

                <v-app-bar-nav-icon @click="drawer = !drawer" />
              </div>
            </div>
            <hr class="search-divider" />
            <v-row>
              <slot name="content"></slot>
            </v-row>
          </v-container>
        </template>

        <template v-else>
          <div class="full-map-wrapper">
            <slot name="content"></slot>
          </div>
        </template>
      </div>
    </v-main>

    <!-- EditProfile component -->
    <EditProfile
      v-model="showProfileEditDialog"
      :userData="userProfile"
      @profile-updated="handleProfileUpdated"
    />
  </v-app>
</template>

<style scoped>
.ftext {
  color: #ffba00;
  font-size: larger;
}

.stext {
  font-size: larger;
  color: white;
}

.gradient-bg {
  background-color: var(--gradient-bg-color, #fffdf6);
  min-height: 100vh;
  padding: 1rem;
  overflow-y: auto;
  padding-bottom: 2rem;
}

.gradient-app-bar {
  background: #0c3b2e;
  color: #000;
}

.main-no-gap {
  overflow-y: auto;
  position: relative;
}

.avatar-btn {
  color: #000;
}

.gradient-app-bar .ftext,
.stext {
  font-size: 30px;
}

.Logoname {
  text-decoration: none;
}

.search-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 40px;
}

.search-wrapper .v-btn:hover {
  background-color: rgba(0, 128, 0, 0.1);
  transform: scale(1.1);
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.search-wrapper .v-btn:hover .v-icon {
  color: #2e7d32; /* Green icon on hover */
}

.search-field {
  flex: 2;
  max-width: 500px;
}

.search-divider {
  border: none;
  border-top: 1px solid #727070;
  margin: 10px 0 30px;
}

.scroll-top-btn {
  position: fixed;
  bottom: 30px;
  right: 20px;
  color: white !important;
  z-index: 9999;
  transition: opacity 0.3s ease;
}

.icon-color {
  color: #0c3b2e;
}

.green-btn {
  background-color: #0c3b2e !important;
  color: white !important;
}

.personal-info {
  text-decoration: none;
  color: inherit;
}

.text-btn {
  color: inherit !important;
}

.no-underline {
  text-decoration: none !important;
}

.filter-row {
  display: flex;
  gap: 16px;
  flex-wrap: nowrap;
}

.action-buttons {
  display: flex;
  align-items: center;
}

@media (max-width: 600px) {
  .filter-row {
    flex-direction: row;
  }

  .filter-row > .v-col {
    flex: 1 1 0;
  }

  .scroll-top-btn {
    bottom: 70px;
    right: 15px;
  }

  .search-wrapper {
    flex-direction: column-reverse;
  }

  .search-field {
    width: 100%;
    max-width: 100%;
    margin-bottom: 8px;
  }

  .action-buttons {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}

@media (min-width: 768px) {
  .search-wrapper {
    justify-content: center;
    text-align: center;
  }
}
</style>
