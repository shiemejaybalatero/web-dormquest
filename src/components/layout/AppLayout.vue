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
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app flat class="gradient-app-bar">
      <router-link to="/system/dashboard" class="fw-bolder ml-6 Logoname">
        <span class="ftext">DORM</span><span class="stext">QUEST</span>
      </router-link>

      <v-spacer />
      <v-img src="/23.png" alt="Logo" max-width="50" class="mr-6" />
    </v-app-bar>

    <v-main
      ref="mainContent"
      :style="
        route.path === '/system/map'
          ? 'overflow: hidden; height: 100vh; padding: 0;'
          : 'overflow-y: auto; height: 100vh;'
      "
    >
      <div :class="route.path === '/system/map' ? '' : 'gradient-bg'">
        <template v-if="route.path !== '/system/map'">
          <v-container>
            <!-- Search & Buttons -->
            <div class="d-flex align-center search-wrapper mb-4 pl-2">
              <v-text-field
                v-model="search"
                placeholder="Search for dormitories or boarding house..."
                prepend-inner-icon="mdi-magnify"
                class="search-field"
                variant="outlined"
                rounded
                hide-details
                clearable
                density="comfortable"
              />

              <v-btn v-if="showScrollTop" icon class="scroll-top-btn" @click="scrollToTop">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>

              <router-link to="/system/dashboard">
                <v-btn
                  icon
                  class="mx-1"
                  :class="{ 'green-btn': route.path === '/system/dashboard' }"
                >
                  <v-icon>mdi-home-outline</v-icon>
                </v-btn>
              </router-link>

              <router-link to="/system/map">
                <v-btn icon class="mx-1" :class="{ 'green-btn': route.path === '/system/map' }">
                  <v-icon>mdi-map-marker-outline</v-icon>
                </v-btn>
              </router-link>

              <!-- Avatar Menu -->
              <v-menu min-width="200px" location="bottom end">
                <template v-slot:activator="{ props }">
                  <v-btn icon v-bind="props">
                    <v-avatar class="avatar-btn" size="large">
                      <span class="text-subtitle-2">{{ userData.initials }}</span>
                    </v-avatar>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text>
                    <div class="mx-auto text-center">
                      <v-avatar color="brown">
                        <span class="text-h5">{{ userData.initials }}</span>
                      </v-avatar>
                      <h3>{{ userData.fullName }}</h3>
                      <p class="text-caption mt-1">
                        {{ userData.email }}
                      </p>
                      <v-divider class="my-3"></v-divider>
                      <router-link to="/system/profile">
                        <v-btn
                          variant="text"
                          rounded
                          class="mx-1"
                          :class="{
                            'green-btn':
                              route.path === '/system/profile' ||
                              route.path === '/system/ratings' ||
                              route.path === '/system/about',
                          }"
                        >
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
.full-map-wrapper {
  width: 100%;
  height: 100vh;
}

.ftext {
  color: #ffba00;
  font-size: larger;
}

.stext {
  color: #0c3b2e;
  font-size: larger;
}

.gradient-bg {
  background: linear-gradient(290deg, #6d9773, #fffae6);
  min-height: 100vh;
  padding: 1rem;
}
.green-btn {
  background-color: #0c3b2e;
  color: white;
}

.gradient-app-bar {
  background: linear-gradient(290deg, #fffae6, #6d9773);
  color: #000;
}

.avatar-btn {
  background-color: #0c3b2e;
  color: #ffffff;
}

.Logoname {
  text-decoration: none;
}

.search-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
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
