<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useAuthUserStore } from '@/stores/authUser'

const route = useRoute()
const router = useRouter()
const userStore = useAuthUserStore()

const profileImage = ref(null)
const fileInput = ref(null)
const loading = ref(false)
const errorMessage = ref('')

// User data
const name = ref('')
const email = ref('')
const averageRating = ref(0)

// User's ratings
const userRatings = ref([])

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Function to set active sidebar item
const activeItem = ref(route.path)
const setActiveItem = (path) => {
  activeItem.value = path
}

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

// Load user data
const fetchUserProfile = async () => {
  try {
    // First try to get user from current session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const user = session?.user || userStore.user

    if (user) {
      name.value = user.user_metadata?.full_name || user.email || 'User'
      email.value = user.email || ''
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}

onMounted(async () => {
  await fetchUserProfile()
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
          <v-list dense nav class="sidebar pa-4">
            <router-link to="/profile" class="text-decoration-none" style="color: inherit">
              <v-list-item class="icon-container" @mouseover="setActiveItem('/profile')">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/profile' ? '#fff' : '#fff'" class="mr-2 icon">
                    mdi-account
                  </v-icon>
                  <span class="icon-name">Personal Information</span>
                </div>
              </v-list-item>
            </router-link>

            <router-link to="/ratings" class="text-decoration-none" style="color: inherit">
              <v-list-item class="icon-container" @mouseover="setActiveItem('/ratings')">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/ratings' ? '#fff' : '#fff'" class="mr-2 icon">
                    mdi-star
                  </v-icon>
                  <span class="icon-name">Ratings</span>
                </div>
              </v-list-item>
            </router-link>

            <router-link to="/about" class="text-decoration-none" style="color: inherit">
              <v-list-item class="icon-container" @mouseover="setActiveItem('/about')">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/about' ? '#fff' : '#fff'" class="mr-2 icon">
                    mdi-information
                  </v-icon>
                  <span class="icon-name">About App</span>
                </div>
              </v-list-item>
            </router-link>

            <router-link to="/" class="text-decoration-none" style="color: inherit">
              <v-list-item class="icon-container" @mouseover="setActiveItem('/')">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/' ? '#fff' : '#fff'" class="mr-2 icon">
                    mdi-logout
                  </v-icon>
                  <span class="icon-name">Log Out</span>
                </div>
              </v-list-item>
            </router-link>
          </v-list>
        </v-col>

        <!-- Ratings Section -->
        <v-col cols="12" md="9">
          <div class="ratings-section pa-6">
            <!-- Profile header -->
            <v-row align="center">
              <v-col cols="12" md="3" class="text-center py-4">
                <v-avatar size="100">
                  <v-img
                    :src="profileImage || 'https://via.placeholder.com/100'"
                    alt="Profile Picture"
                  />
                </v-avatar>
                <v-btn small class="mt-2" @click="triggerFileInput">Upload</v-btn>
                <input
                  ref="fileInput"
                  type="file"
                  style="display: none"
                  accept="image/*"
                  @change="handleFileUpload"
                />
              </v-col>

              <v-col cols="12" md="9">
                <h3 class="font-weight-bold mb-1">{{ name }}</h3>
                <div class="text-grey-darken-1 mb-2">{{ email }}</div>
                <div class="d-flex align-center">
                  <span class="mr-2 font-weight-bold">{{ averageRating.toFixed(1) }}</span>
                  <v-rating
                    :model-value="averageRating"
                    half-increments
                    color="#FFD700"
                    background-color="#d0d0d0"
                    size="24"
                    readonly
                  />
                  <span class="ml-2 text-grey-darken-1">({{ userRatings.length }} ratings)</span>
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-5" />

            <!-- Loading state -->
            <div v-if="loading" class="text-center py-5">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <div class="mt-2">Loading your ratings...</div>
            </div>

            <!-- Error message -->
            <v-alert v-if="errorMessage" type="error" class="mb-4">
              {{ errorMessage }}
              <div class="mt-2">
                <v-btn @click="fetchUserRatings" variant="outlined" size="small">Try Again</v-btn>
              </div>
            </v-alert>

            <!-- No ratings message -->
            <div
              v-if="!loading && !errorMessage && userRatings.length === 0"
              class="text-center py-5"
            >
              <v-icon size="64" color="grey-lighten-1">mdi-star-outline</v-icon>
              <h4 class="mt-3 text-grey-darken-1">You haven't rated any dormitories yet</h4>
              <v-btn color="primary" class="mt-3" @click="router.push({ name: 'dashboard' })">
                Browse Dormitories
              </v-btn>
            </div>

            <!-- Ratings list -->
            <template v-if="!loading && !errorMessage && userRatings.length > 0">
              <h4 class="font-weight-medium mb-4">Your Ratings ({{ userRatings.length }})</h4>
              <div class="ratings-scroll">
                <v-row>
                  <v-col cols="12" v-for="(dorm, index) in userRatings" :key="index">
                    <div class="rating-card px-4 py-3" @click="viewDormitory(dorm.dormId)">
                      <div class="d-flex justify-space-between align-center">
                        <div>
                          <div class="font-weight-medium text-subtitle-1">{{ dorm.name }}</div>
                          <div class="text-caption text-grey-darken-1">
                            Rated on {{ dorm.date }}
                          </div>
                          <div v-if="dorm.comment" class="text-body-2 mt-1">{{ dorm.comment }}</div>
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
          </div>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
.sidebar {
  min-height: 40vh;
  background: transparent;
  border-radius: 16px;
}

.icon-container {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 8px;
  border-radius: 12px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

.icon-name {
  margin-left: 10px;
  font-size: 14px;
  color: #fff;
  opacity: 0;
  transition:
    opacity 0.3s ease,
    color 0.3s ease;
  font-weight: bolder;
}

.icon-container:hover .icon-name {
  opacity: 1;
  font-weight: 700;
  color: #0c3b2e;
}

.icon {
  font-size: 25px;
  border-radius: 100%;
  background-color: #0c3b2e;
  padding: 20px;
  color: white;
  transition:
    background-color 0.5s ease,
    box-shadow 0.5s ease;
  cursor: pointer;
}

.icon-container:hover .icon {
  background-color: #ffba00;
  box-shadow: 0 1px 5px rgba(249, 241, 3, 0.3);
}

.icon-container {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 8px;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.icon-container:hover {
  background-color: rgba(255, 186, 0, 0.1);
  border-color: #ffba00;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.ratings-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.rating-card {
  background: #f5f5f5;
  border-radius: 12px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
  position: relative;
}

.rating-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f0f0f0;
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

.ratings-scroll {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}
</style>
