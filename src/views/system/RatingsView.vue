<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SidebarLayout from '@/components/layout/SidebarLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useAuthUserStore } from '@/stores/authUser'
import { userProfile, isLoadingUser, fetchUserProfile } from '@/stores/userStore'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDarkMode = computed(() => theme.global.name.value === 'dark')

const router = useRouter()
const userStore = useAuthUserStore()

const loading = ref(false)
const errorMessage = ref('')

// User ratings
const averageRating = ref(0)
const userRatings = ref([])

// Sidebar links
const sidebarLinks = [
  { title: 'Personal Information', icon: 'mdi-account', path: '/profile' },
  { title: 'Ratings', icon: 'mdi-star', path: '/ratings' },
  { title: 'About App', icon: 'mdi-information', path: '/about' },
]

// Fetch user ratings from Supabase
const fetchUserRatings = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    // Get current user from session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const userId = session?.user?.id || userStore.user?.id

    if (!userId) {
      console.error('No user ID found')
      errorMessage.value = 'Please login to view your ratings'
      loading.value = false
      return
    }

    // Fetch user's ratings with dormitory info
    const { data, error } = await supabase
      .from('ratings')
      .select(
        `
        rating_score,
        created_at,
        comment,
        dormitory_id,
        dormitories:dormitory_id(id, name)
      `,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform data for display
    userRatings.value = data.map((rating) => ({
      name: rating.dormitories.name,
      rating: rating.rating_score,
      dormId: rating.dormitory_id,
      comment: rating.comment,
      date: new Date(rating.created_at).toLocaleDateString(),
    }))

    // Calculate average rating
    if (userRatings.value.length > 0) {
      const sum = userRatings.value.reduce((acc, item) => acc + item.rating, 0)
      averageRating.value = sum / userRatings.value.length
    }
  } catch (error) {
    console.error('Error fetching ratings:', error)
    errorMessage.value = 'Failed to load your ratings. Please try again.'
  } finally {
    loading.value = false
  }
}

// Navigate to dormitory details
const viewDormitory = (dormId) => {
  router.push({ name: 'dorm-details', params: { id: dormId } })
}

onMounted(async () => {
  // Load user profile data if not already loaded
  if (!userProfile.id) {
    await fetchUserProfile()
  }

  // Only fetch ratings if we're not using dummy data (real user is logged in)
  if (userStore.user || (await supabase.auth.getSession()).data.session?.user) {
    fetchUserRatings()
  }
})
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <!-- Sidebar -->
        <v-col cols="12" md="3">
          <SidebarLayout :links="sidebarLinks" />
        </v-col>

        <!-- Ratings Section -->
        <v-col cols="12" md="9">
          <div
            class="ratings-section d-flex flex-column align-center justify-center pa-6"
            :class="{ 'ratings-section-dark': isDarkMode, 'ratings-section-light': !isDarkMode }"
          >
            <div class="ratings-wrapper">
              <div class="d-flex justify-space-between align-center mb-6 w-100">
                <h3 class="font-weight-bold mb-0 text-white">Your Ratings</h3>
              </div>

              <v-card
                class="pa-6 ratings-card"
                :class="{ 'ratings-card-dark': isDarkMode, 'ratings-card-light': !isDarkMode }"
                flat
              >
                <!-- Profile header -->
                <v-row align="center">
                  <v-col cols="12" md="3" class="text-center py-4">
                    <v-avatar size="100" color="grey-lighten-2">
                      <!-- Show loading indicator while user data is being fetched -->
                      <template v-if="isLoadingUser">
                        <v-progress-circular indeterminate size="50" color="primary" />
                      </template>

                      <!-- Show avatar if available -->
                      <v-img
                        v-else-if="userProfile.avatar_url"
                        :src="userProfile.avatar_url"
                        alt="Profile Picture"
                      />

                      <!-- Show initials if no avatar -->
                      <span v-else class="text-h4">{{ userProfile.initials }}</span>
                    </v-avatar>
                  </v-col>

                  <v-col cols="12" md="9">
                    <!-- User details -->
                    <div v-if="isLoadingUser" class="d-flex align-center">
                      <v-skeleton-loader type="text" width="200px" class="mb-2"></v-skeleton-loader>
                    </div>
                    <template v-else>
                      <h3
                        class="font-weight-bold mb-1"
                        :class="{ 'text-white': isDarkMode, 'text-dark-green': !isDarkMode }"
                      >
                        {{ userProfile.fullname }}
                      </h3>
                      <div
                        class="mb-2"
                        :class="{
                          'text-grey-lighten-1': isDarkMode,
                          'text-grey-darken-1': !isDarkMode,
                        }"
                      >
                        {{ userProfile.email }}
                      </div>
                    </template>

                    <!-- Ratings section -->
                    <div class="d-flex align-center">
                      <span
                        class="mr-2 font-weight-bold"
                        :class="{ 'text-white': isDarkMode, 'text-dark-green': !isDarkMode }"
                      >
                        {{ averageRating.toFixed(1) }}
                      </span>
                      <v-rating
                        :model-value="averageRating"
                        half-increments
                        color="#FFD700"
                        background-color="#d0d0d0"
                        size="24"
                        readonly
                      />
                      <span
                        class="ml-2"
                        :class="{
                          'text-grey-lighten-1': isDarkMode,
                          'text-grey-darken-1': !isDarkMode,
                        }"
                      >
                        ({{ userRatings.length }} ratings)
                      </span>
                    </div>
                  </v-col>
                </v-row>

                <v-divider class="my-5" :color="isDarkMode ? '#2c4c43' : '#d0d0d0'" />

                <!-- Loading state -->
                <div v-if="loading" class="text-center py-5">
                  <v-progress-circular
                    indeterminate
                    :color="isDarkMode ? '#6D9773' : '#0c3b2e'"
                  ></v-progress-circular>
                  <div
                    class="mt-2"
                    :class="{ 'text-white': isDarkMode, 'text-dark-green': !isDarkMode }"
                  >
                    Loading your ratings...
                  </div>
                </div>

                <!-- Error message -->
                <v-alert v-if="errorMessage" type="error" class="mb-4">
                  {{ errorMessage }}
                  <div class="mt-2">
                    <v-btn @click="fetchUserRatings" variant="outlined" size="small"
                      >Try Again</v-btn
                    >
                  </div>
                </v-alert>

                <!-- No ratings message -->
                <div
                  v-if="!loading && !errorMessage && userRatings.length === 0"
                  class="text-center py-5"
                >
                  <v-icon size="64" :color="isDarkMode ? 'grey-lighten-2' : 'grey-lighten-1'">
                    mdi-star-outline
                  </v-icon>
                  <h4
                    class="mt-3"
                    :class="{
                      'text-grey-lighten-1': isDarkMode,
                      'text-grey-darken-1': !isDarkMode,
                    }"
                  >
                    You haven't rated any dormitories yet
                  </h4>
                  <v-btn
                    :color="isDarkMode ? '#6D9773' : '#0c3b2e'"
                    class="mt-3"
                    @click="router.push({ name: 'dashboard' })"
                  >
                    Browse Dormitories
                  </v-btn>
                </div>

                <!-- Ratings list -->
                <template v-if="!loading && !errorMessage && userRatings.length > 0">
                  <h4
                    class="font-weight-medium mb-4"
                    :class="{ 'text-white': isDarkMode, 'text-dark-green': !isDarkMode }"
                  >
                    Your Ratings ({{ userRatings.length }})
                  </h4>
                  <div class="ratings-scroll">
                    <v-row>
                      <v-col cols="12" v-for="(dorm, index) in userRatings" :key="index">
                        <div
                          class="rating-card"
                          :class="{
                            'rating-card-dark': isDarkMode,
                            'rating-card-light': !isDarkMode,
                          }"
                          @click="viewDormitory(dorm.dormId)"
                        >
                          <div class="d-flex justify-space-between align-center">
                            <div>
                              <div
                                class="font-weight-medium text-subtitle-1"
                                :class="{
                                  'text-white': isDarkMode,
                                  'text-dark-green': !isDarkMode,
                                }"
                              >
                                {{ dorm.name }}
                              </div>
                              <div
                                class="text-caption"
                                :class="{
                                  'text-grey-lighten-1': isDarkMode,
                                  'text-grey-darken-1': !isDarkMode,
                                }"
                              >
                                Rated on {{ dorm.date }}
                              </div>
                              <div
                                v-if="dorm.comment"
                                class="text-body-2 mt-1"
                                :class="{
                                  'text-grey-lighten-1': isDarkMode,
                                  'text-grey-darken-1': !isDarkMode,
                                }"
                              >
                                {{ dorm.comment }}
                              </div>
                            </div>
                            <div class="text-right">
                              <v-rating
                                :model-value="dorm.rating"
                                half-increments
                                color="#FFD700"
                                background-color="#d0d0d0"
                                size="22"
                                readonly
                              />
                            </div>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </template>
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
/* Light Mode Styles */
.ratings-section-light {
  background-color: #6d9773;
  border-radius: 16px;
  min-height: 65vh;
  padding-top: 24px;
  padding-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ratings-card-light {
  background-color: #fffdf6;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  width: 100%;
}

.rating-card-light {
  background: #f5f5f5;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  padding: 16px;
}

.rating-card-light:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f0f0f0;
}

/* Dark Mode Styles */
.ratings-section-dark {
  background-color: #0a2e23;
  border-radius: 16px;
  min-height: 65vh;
  padding-top: 24px;
  padding-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ratings-card-dark {
  background-color: #102820;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  width: 100%;
}

.rating-card-dark {
  background: #1d3731;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  padding: 16px;
}

.rating-card-dark:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #2c4c43;
}

/* Common Styles */
.ratings-wrapper {
  width: 100%;
  max-width: 900px;
}

.ratings-scroll {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

.rating-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.rating-card::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  opacity: 0;
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230c3b2e'%3E%3Cpath d='M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z'/%3E%3C/svg%3E");
  background-size: contain;
  transition: opacity 0.2s;
}

.rating-card:hover::after {
  opacity: 0.5;
}

.text-dark-green {
  color: #0c3b2e;
}
</style>
