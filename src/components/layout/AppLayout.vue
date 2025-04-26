<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase, formActionDefault } from '@/utils/supabase'
import { getAvatarText } from '@/utils/helper'

const route = useRoute()
const router = useRouter()

const showScrollTop = ref(false)
const mainContent = ref(null)
const drawer = ref(false)
const search = ref('')

const formAction = ref({ ...formActionDefault })

const userData = ref({
  initials: '',
  email: '',
  fullname: '',
})

const onLogout = async () => {
  formAction.value = { ...formActionDefault, formProcess: true }

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error during logout:', error)
    return
  }

  formAction.value.formProcess = false
  router.replace('/')
}

const handleScroll = () => {
  if (!mainContent.value) return
  const scrollTop = mainContent.value.$el.scrollTop
  showScrollTop.value = scrollTop > 300
}

const scrollToTop = () => {
  if (mainContent.value) {
    mainContent.value.$el.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getUser = async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error getting user:', error)
    return
  }

  const metadata = data?.user?.user_metadata

  if (metadata) {
    userData.value.email = metadata.email || ''
    userData.value.fullname = `${metadata.firstname || ''} ${metadata.lastname || ''}`.trim()
    userData.value.initials = getAvatarText(userData.value.fullname)
  }
}

onMounted(() => {
  getUser()
  if (mainContent.value) {
    mainContent.value.$el.addEventListener('scroll', handleScroll)
  }
})

onBeforeUnmount(() => {
  if (mainContent.value) {
    mainContent.value.$el.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item title="Dashboard" prepend-icon="mdi-view-dashboard" />
        <v-list-item title="Settings" prepend-icon="mdi-cog" />
        <v-list-item />
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
      <v-img src="/23.png" alt="Logo" max-width="50" class="mr-6 logo1 d-block d-lg-none" />
    </v-app-bar>

    <v-main
      ref="mainContent"
      :style="
        route.path === '/map'
          ? 'overflow: hidden; height: 100vh; padding: 0;'
          : 'overflow-y: auto; height: 100vh;'
      "
    >
      <div :class="route.path === '/map' ? '' : 'gradient-bg'">
        <template v-if="route.path !== '/map'">
          <v-container>
            <!-- Search & Buttons -->
            <div class="d-flex align-center search-wrapper mb-4">
              <v-text-field
                v-model="search"
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
                <v-btn v-if="showScrollTop" icon class="scroll-top-btn" @click="scrollToTop">
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>

                <router-link to="/dashboard">
                  <v-btn icon class="mx-1" :class="{ 'green-btn': route.path === '/dashboard' }">
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
                        <span class="text-subtitle-2">{{ userData.initials }}</span>
                      </v-avatar>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-text>
                      <div class="mx-auto text-center">
                        <v-avatar color="orange">
                          <span class="text-h5">{{ userData.initials }}</span>
                        </v-avatar>
                        <h3>{{ userData.fullName }}</h3>
                        <p class="text-caption mt-1">
                          {{ userData.email }}
                        </p>
                        <v-divider class="my-3"></v-divider>
                        <router-link to="/profile">
                          <v-btn variant="text" rounded class="mx-1 personal-info">
                            Personal Information
                          </v-btn>
                        </router-link>
                        <v-divider class="my-3"></v-divider>
                        <v-btn variant="text" rounded> Edit Account </v-btn>
                        <v-divider class="my-3"></v-divider>

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
  </v-app>
</template>

<style scoped>
.ftext {
  color: #ffba00;
  font-size: larger;
}

.stext {
  color: #0c3b2e;
  font-size: larger;
}

.gradient-bg {
  background-image: url('/public/bg-admin.jpg');
  height: 100vh;
  padding: 1rem;
  overflow-y: auto;
}

.gradient-app-bar {
  background: linear-gradient(290deg, #fffae6, #6d9773);
  color: #000;
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

.Logoname2 {
  font-size: 12px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.search-wrapper .v-btn:hover {
  background-color: rgba(0, 128, 0, 0.1); /* Light green background */
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
  background-color: #0c3b2e;
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.icon-color {
  color: #0c3b2e;
}
.green-btn {
  background-color: #0c3b2e !important;
  color: white !important;
}

.personal-info {
  color: black; /* White text */
  text-decoration: none; /* Ensures no underline */
}

.no-underline {
  text-decoration: none !important;
}

.scroll-top-btn {
  position: fixed;
  bottom: 30px;
  right: 20px;
  background-color: #0c3b2e;
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.filter-row {
  display: flex;
  gap: 16px;
  flex-wrap: nowrap;
}

@media (max-width: 600px) {
  .filter-row {
    flex-direction: row;
  }

  .filter-row > .v-col {
    flex: 1 1 0;
  }
}
</style>
