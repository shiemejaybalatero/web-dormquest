<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const profileImage = ref(null)
const fileInput = ref(null)

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

const name = ref('SHIEME JAY G. BALATERO')
const email = ref('Shiemejay@gmail.com')
const averageRating = ref(4.2)

const dormRatings = ref([
  { name: 'Ampalayo Boarding House', rating: 4.0 },
  { name: 'Blue Heavens Dorm', rating: 4.5 },
  { name: 'Blissful Dormitory', rating: 4.2 },
  { name: 'Licayan Boarding House', rating: 3.5 },
  { name: 'Chelsea Boarding House', rating: 4.1 },
  { name: 'TGBG Boarding House', rating: 4.6 },
  { name: 'Magdura Boarding House', rating: 3.9 },
  { name: 'Karmo Boarding House', rating: 4.3 },
])
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
            <v-row align="center">
              <v-col cols="12" md="3" class="text-center py-4">
                <v-avatar size="100">
                  <v-img
                    :src="profileImage || 'https://via.placeholder.com/100'"
                    alt="Profile Picture"
                  />
                </v-avatar>
                <v-btn small class="mt-2" @click="triggerFileInput"> Upload </v-btn>
                <input
                  ref="fileInput"
                  type="file"
                  style="display: none"
                  accept="image/*"
                  @change="handleFileUpload"
                />
              </v-col>

              <v-col cols="12" md="9" class="py-4">
                <h3 class="font-weight-bold mb-1">{{ name }}</h3>
                <div class="text-grey-darken-1 mb-2">{{ email }}</div>
                <div class="d-flex align-center">
                  <span class="mr-2 font-weight-bold">{{ averageRating }}</span>
                  <v-rating
                    v-model="averageRating"
                    half-increments
                    color="#FFD700"
                    background-color="#d0d0d0"
                    size="24"
                    readonly
                  />
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-5" />

            <h4 class="font-weight-medium mb-4">Personal Ratings</h4>
            <div class="ratings-scroll">
              <v-row>
                <v-col
                  cols="12"
                  v-for="(dorm, index) in dormRatings"
                  :key="index"
                  class="rating-card px-4 py-3 mb-3"
                >
                  <div class="d-flex justify-space-between align-center">
                    <span class="font-weight-medium text-subtitle-1">{{ dorm.name }}</span>
                    <v-rating
                      :model-value="dorm.rating"
                      half-increments
                      color="#FFD700"
                      background-color="#d0d0d0"
                      size="22"
                      readonly
                    />
                  </div>
                </v-col>
              </v-row>
            </div>
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
</style>
