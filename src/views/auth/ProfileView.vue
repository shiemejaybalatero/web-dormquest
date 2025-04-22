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
const age = ref('30')
const email = ref('Shiemejay@gmail.com')
const status = ref('Single')
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="12" md="3">
          <v-list dense nav class="sidebar pa-4">
            <router-link to="/profile" style="text-decoration: none; color: inherit">
              <v-list-item :class="{ selected: route.path === '/profile' }" class="mt-3 mb-2">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/profile' ? '#0c3b2e' : ''" class="mr-2"
                    >mdi-account</v-icon
                  >
                  <span class="font-weight-bold text-body-1">Personal Information</span>
                </div>
              </v-list-item>
            </router-link>

            <router-link to="/ratings" style="text-decoration: none; color: inherit">
              <v-list-item :class="{ selected: route.path === '/ratings' }" class="mb-2">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/ratings' ? '#0c3b2e' : ''" class="mr-2"
                    >mdi-star</v-icon
                  >
                  <span class="font-weight-bold text-body-1">Ratings</span>
                </div>
              </v-list-item>
            </router-link>

            <router-link to="/about" style="text-decoration: none; color: inherit">
              <v-list-item :class="{ selected: route.path === '/about' }" class="mb-2">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/about' ? '#0c3b2e' : ''" class="mr-2"
                    >mdi-information</v-icon
                  >
                  <span class="font-weight-bold text-body-1">About app</span>
                </div>
              </v-list-item>
            </router-link>

            <v-list-item>
              <div class="d-flex align-center pl-2">
                <v-icon class="mr-2">mdi-logout</v-icon>
                <span>Log out</span>
              </div>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="12" md="9">
          <div class="profile-section pa-6">
            <div class="text-right">
              <v-btn class="text-black font-weight-bold account-setting"> Account Setting </v-btn>
            </div>

            <v-divider class="my-6" />

            <div class="d-flex justify-space-between align-center mb-4">
              <div>
                <h3 class="font-weight-bold mb-1">{{ name }}</h3>
                <span class="text-grey-darken-1">Information</span>
              </div>

              <v-btn small color="#0c3b2e" class="white--text">CHANGE</v-btn>
            </div>

            <v-row>
              <v-col cols="12" md="4" class="d-flex justify-center flex-column align-center">
                <v-avatar size="150">
                  <v-img
                    :src="profileImage || 'https://via.placeholder.com/150'"
                    alt="Profile Picture"
                  >
                    <template v-slot:placeholder>
                      <v-row align="center" justify="center" class="fill-height">
                        <v-icon>mdi-account</v-icon>
                      </v-row>
                    </template>
                  </v-img>
                </v-avatar>

                <v-btn class="mt-3" @click="triggerFileInput">Upload Profile Picture</v-btn>

                <input
                  ref="fileInput"
                  type="file"
                  style="display: none"
                  accept="image/*"
                  @change="handleFileUpload"
                />
              </v-col>

              <v-col cols="12" md="8">
                <v-row>
                  <v-col cols="6">
                    <div class="label">Name:</div>
                    <v-chip class="mt-1 font-weight-bold" color="black" label>{{ name }}</v-chip>
                  </v-col>

                  <v-col cols="6">
                    <div class="label">Age:</div>
                    <v-chip class="mt-1" color="black" label>{{ age }}</v-chip>
                  </v-col>

                  <v-col cols="6">
                    <div class="label">Gmail:</div>
                    <v-chip class="mt-1 font-weight-bold" color="black" label>{{ email }}</v-chip>
                  </v-col>

                  <v-col cols="6">
                    <div class="label">Status:</div>
                    <v-chip class="mt-1 font-weight-bold" color="black" label>{{ status }}</v-chip>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
.profile-layout {
  min-height: 50vh;
  align-items: stretch;
}

.sidebar {
  min-height: 40vh;
  background: linear-gradient(180deg, #dbead3, #6d9773);
  border-radius: 16px;
}

.label {
  font-weight: bold;
  color: #0c3b2e;
}

.selected {
  background-color: #ffba00 !important;
  border-radius: 20px;
  color: #0c3b2e;
}

.account-setting {
  border-radius: 20px;
  background-color: #ffba00 !important;
}

.profile-section {
  border-radius: 16px;
  background: linear-gradient(180deg, #dbead3, #6d9773);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  min-height: 65vh;
  align-items: stretch;
}
</style>
