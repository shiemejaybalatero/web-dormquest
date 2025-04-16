<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'

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
  { name: 'Blue Heavens Dorm', rating: 4.5 },
  { name: 'Justine Boarding House', rating: 4.0 },
  { name: 'Licayan Boarding House', rating: 3.5 },
])
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <!-- Sidebar -->
        <v-col cols="12" md="3">
          <v-list dense nav class="sidebar pa-4">
            <v-list-item class="mt-3 mb-2">
              <div class="d-flex align-center pl-2">
                <v-icon color="#0c3b2e" class="mr-2">mdi-account</v-icon>
                <span>Personal Information</span>
              </div>
            </v-list-item>

            <router-link to="/profile/ratings" style="text-decoration: none">
              <v-list-item class="selected mb-2">
                <div class="d-flex align-center pl-2">
                  <v-icon class="mr-2">mdi-star</v-icon>
                  <span class="font-weight-bold text-body-1">Ratings</span>
                </div>
              </v-list-item>
            </router-link>

            <v-list-item>
              <div class="d-flex align-center pl-2">
                <v-icon class="mr-2">mdi-information</v-icon>
                <span>About app</span>
              </div>
            </v-list-item>

            <v-list-item>
              <div class="d-flex align-center pl-2">
                <v-icon class="mr-2">mdi-logout</v-icon>
                <span>Log out</span>
              </div>
            </v-list-item>
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
                <v-btn small class="mt-2" @click="triggerFileInput">
                  Upload
                </v-btn>
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
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
.sidebar {
  min-height: 40vh;
  background: linear-gradient(180deg, #dbead3, #6d9773);
  border-radius: 16px;
}

.selected {
  background-color: #ffba00 !important;
  border-radius: 20px;
  color: #0c3b2e;
}

.ratings-section {
  border-radius: 16px;
  background: linear-gradient(180deg, #dbead3, #6d9773);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.rating-card {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  min-height: 70px;
}
</style>
