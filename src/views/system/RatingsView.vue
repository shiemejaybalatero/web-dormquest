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

const averageRating = ref(0)
const userRatings = ref([])

const drawer = ref(false)

const sidebarLinks = [
  { title: 'Personal Information', icon: 'mdi-account', path: '/profile' },
  { title: 'Ratings', icon: 'mdi-star', path: '/ratings' },
  { title: 'About App', icon: 'mdi-information', path: '/about' },
]

const fetchUserRatings = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
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

    userRatings.value = data.map((rating) => ({
      name: rating.dormitories.name,
      rating: rating.rating_score,
      dormId: rating.dormitory_id,
      comment: rating.comment,
      date: new Date(rating.created_at).toLocaleDateString(),
    }))

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

const viewDormitory = (dormId) => {
  router.push({ name: 'dorm-details', params: { id: dormId } })
}

onMounted(async () => {
  if (!userProfile.id) {
    await fetchUserProfile()
  }

  if (userStore.user || (await supabase.auth.getSession()).data.session?.user) {
    fetchUserRatings()
  }
})
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid class="py-6">
        <v-row>
          <v-col cols="12" md="3">
            <SidebarLayout :links="sidebarLinks" v-model:drawer="drawer" />
          </v-col>

          <v-col cols="12" md="9">
            <div
              class="ratings-section px-4 px-md-8 py-6 py-md-10"
              :class="isDarkMode ? 'ratings-section-dark' : 'ratings-section-light'"
            >
              <div class="ratings-wrapper">
                <div class="d-flex justify-space-between align-center mb-6">
                  <h1 class="font-weight-bold mb-0 text-center">
                    <span style="color: #ffba00">MY</span>
                    <span style="color: white"> RATINGS</span>
                  </h1>

                  <!-- Toggle button (mobile only) -->
                  <v-btn
                    v-if="$vuetify.display.smAndDown"
                    icon
                    @click="drawer = true"
                    variant="text"
                    class="ml-2"
                    color="white"
                  >
                    <v-icon>mdi-menu</v-icon>
                  </v-btn>
                </div>

                <v-card
                  class="pa-5 pa-md-9 ratings-card"
                  :class="isDarkMode ? 'ratings-card-dark' : 'ratings-card-light'"
                  flat
                >
                  <v-row align="center">
                    <v-col cols="12" md="3" class="text-center py-4">
                      <v-avatar size="100" color="grey-lighten-2">
                        <template v-if="isLoadingUser">
                          <v-progress-circular indeterminate size="50" color="primary" />
                        </template>
                        <v-img
                          v-else-if="userProfile.avatar_url"
                          :src="userProfile.avatar_url"
                          alt="Profile Picture"
                        />
                        <span v-else class="text-h4">{{ userProfile.initials }}</span>
                      </v-avatar>
                    </v-col>

                    <v-col cols="12" md="9">
                      <div v-if="isLoadingUser" class="d-flex align-center">
                        <v-skeleton-loader
                          type="text"
                          width="200px"
                          class="mb-2"
                        ></v-skeleton-loader>
                      </div>
                      <template v-else>
                        <h3
                          class="font-weight-bold mb-1"
                          :class="isDarkMode ? 'text-white' : 'text-dark-green'"
                        >
                          {{ userProfile.fullname }}
                        </h3>
                        <div
                          class="mb-2"
                          :class="isDarkMode ? 'text-grey-lighten-1' : 'text-grey-darken-1'"
                        >
                          {{ userProfile.email }}
                        </div>
                      </template>

                      <div class="d-flex align-center">
                        <span
                          class="mr-2 font-weight-bold"
                          :class="isDarkMode ? 'text-white' : 'text-dark-green'"
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
                          :class="isDarkMode ? 'text-grey-lighten-1' : 'text-grey-darken-1'"
                        >
                          ({{ userRatings.length }} ratings)
                        </span>
                      </div>
                    </v-col>
                  </v-row>

                  <v-divider class="my-5" :color="isDarkMode ? '#2c4c43' : '#d0d0d0'" />

                  <div v-if="loading" class="text-center py-5">
                    <v-progress-circular
                      indeterminate
                      :color="isDarkMode ? '#6D9773' : '#0c3b2e'"
                    />
                    <div class="mt-2" :class="isDarkMode ? 'text-white' : 'text-dark-green'">
                      Loading your ratings...
                    </div>
                  </div>

                  <v-alert v-if="errorMessage" type="error" class="mb-4">
                    {{ errorMessage }}
                    <div class="mt-2">
                      <v-btn @click="fetchUserRatings" variant="outlined" size="small"
                        >Try Again</v-btn
                      >
                    </div>
                  </v-alert>

                  <div
                    v-if="!loading && !errorMessage && userRatings.length === 0"
                    class="text-center py-5"
                  >
                    <v-icon size="64" :color="isDarkMode ? 'grey-lighten-2' : 'grey-lighten-1'"
                      >mdi-star-outline</v-icon
                    >
                    <h4
                      class="mt-3"
                      :class="isDarkMode ? 'text-grey-lighten-1' : 'text-grey-darken-1'"
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

                  <template v-if="!loading && !errorMessage && userRatings.length > 0">
                    <h4
                      class="font-weight-medium mb-4"
                      :class="isDarkMode ? 'text-white' : 'text-dark-green'"
                    >
                      Ratings ({{ userRatings.length }})
                    </h4>
                    <div class="ratings-scroll">
                      <v-row>
                        <v-col cols="12" v-for="(dorm, index) in userRatings" :key="index">
                          <div
                            class="rating-card"
                            :class="isDarkMode ? 'rating-card-dark' : 'rating-card-light'"
                            @click="viewDormitory(dorm.dormId)"
                          >
                            <div class="d-flex justify-space-between align-center">
                              <div>
                                <div
                                  class="font-weight-medium text-subtitle-1"
                                  :class="isDarkMode ? 'text-white' : 'text-dark-green'"
                                >
                                  {{ dorm.name }}
                                </div>
                                <div
                                  class="text-caption"
                                  :class="isDarkMode ? 'text-grey-lighten-1' : 'text-grey-darken-1'"
                                >
                                  Rated on {{ dorm.date }}
                                </div>
                                <div
                                  v-if="dorm.comment"
                                  class="text-body-2 mt-1"
                                  :class="isDarkMode ? 'text-grey-lighten-1' : 'text-grey-darken-1'"
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
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
.ratings-wrapper {
  width: 100%;
  max-width: 900px;
  margin: auto;
}

.ratings-section-light {
  background-color: #0c3b2e;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ratings-section-dark {
  background-color: #0a2e23;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ratings-card-light {
  background-color: #fffdf6;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  width: 100%;
}

.ratings-card-dark {
  background-color: #102820;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  width: 100%;
}

.rating-card-light {
  background: #f5f5f5;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  padding: 16px;
}

.rating-card-dark {
  background: #1d3731;
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

.rating-card-dark:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #2c4c43;
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

.ratings-scroll {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}
</style>
