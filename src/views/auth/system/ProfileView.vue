<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'
import { supabase, formActionDefault } from '@/utils/supabase'
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
const email = ref('shiemejay@gmail.com')
const status = ref('Single')

const saveProfile = () => {
  console.log('Profile saved:', {
    name: name.value,
    age: age.value,
    email: email.value,
    status: status.value,
  })
}
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <!-- Sidebar -->
        <v-col cols="12" md="3">
          <v-list dense nav class="sidebar pa-4">
            <div class="d-flex align-center pl-2 mt-3 mb-5">
              <v-icon color="#0c3b2e" class="mr-2"> mdi-account </v-icon>
              <span class="font-weight-bold text-body-1">Personal Information</span>
            </div>

            <router-link to="/system/ratings" class="text-decoration-none" style="color: inherit">
              <v-list-item :class="{ selected: route.path === '/system/ratings' }" class="mb-2">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/system/ratings' ? '#0c3b2e' : ''" class="mr-2">
                    mdi-star
                  </v-icon>
                  <span class="font-weight-bold text-body-1"> Ratings </span>
                </div>
              </v-list-item>
            </router-link>

            <router-link to=".system/about" class="text-decoration-none" style="color: inherit">
              <v-list-item :class="{ selected: route.path === '/system/about' }" class="mb-2">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/system/about' ? '#0c3b2e' : ''" class="mr-2">
                    mdi-information
                  </v-icon>
                  <span class="font-weight-bold text-body-1"> About app </span>
                </div>
              </v-list-item>
            </router-link>

            <router-link to="/" class="text-decoration-none" style="color: inherit">
              <v-list-item :class="{ selected: route.path === '/' }" class="mb-2">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/' ? '#0c3b2e' : ''" class="mr-2">
                    mdi-logout
                  </v-icon>
                  <span class="font-weight-bold text-body-1"> Log out </span>
                </div>
              </v-list-item>
            </router-link>
          </v-list>
        </v-col>

        <!-- Profile Form -->
        <v-col cols="12" md="9">
          <div class="profile-section d-flex flex-column align-center justify-center pa-6">
            <div class="profile-wrapper">
              <div class="d-flex justify-space-between align-center mb-6 w-100">
                <h3 class="font-weight-bold mb-0">Profile Information</h3>
                <v-btn color="#ffba00" class="font-weight-bold text-black account-setting" rounded>
                  Account Setting
                </v-btn>
              </div>

              <v-card class="pa-6 profile-card" flat>
                <v-form @submit.prevent="saveProfile">
                  <v-row>
                    <!-- Avatar -->
                    <v-col cols="12" md="4" class="text-center d-flex flex-column align-center">
                      <v-avatar size="120">
                        <v-img :src="profileImage || 'https://via.placeholder.com/150'" />
                      </v-avatar>
                      <v-btn
                        color="#0c3b2e"
                        class="mt-3 text-white"
                        @click="triggerFileInput"
                        rounded
                        small
                      >
                        Upload Photo
                      </v-btn>
                      <input
                        ref="fileInput"
                        type="file"
                        style="display: none"
                        accept="image/*"
                        @change="handleFileUpload"
                      />
                    </v-col>

                    <!-- Editable Fields -->
                    <v-col cols="12" md="8">
                      <v-row>
                        <v-col cols="12" sm="6">
                          <div class="label">Name</div>
                          <v-text-field
                            v-model="name"
                            placeholder="Full Name"
                            density="compact"
                            variant="outlined"
                            hide-details
                          />
                        </v-col>

                        <v-col cols="12" sm="6">
                          <div class="label">Age</div>
                          <v-text-field
                            v-model="age"
                            placeholder="Age"
                            type="number"
                            density="compact"
                            variant="outlined"
                            hide-details
                          />
                        </v-col>

                        <v-col cols="12" sm="6">
                          <div class="label">Gmail</div>
                          <v-text-field
                            v-model="email"
                            placeholder="Email"
                            type="email"
                            density="compact"
                            variant="outlined"
                            hide-details
                          />
                        </v-col>

                        <v-col cols="12" sm="6">
                          <div class="label">Status</div>
                          <v-select
                            v-model="status"
                            :items="['Single', 'Married', 'In a relationship']"
                            placeholder="Status"
                            density="compact"
                            variant="outlined"
                            hide-details
                          />
                        </v-col>

                        <v-col cols="12" class="text-right mt-4">
                          <v-btn type="submit" color="#0c3b2e" class="white--text" rounded>
                            Save
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card>
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
  background: linear-gradient(180deg, #dbead3, #6d9773);
  border-radius: 16px;
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
  background: linear-gradient(180deg, #dbead3, #6d9773);
  border-radius: 16px;
  min-height: 65vh;
  padding-top: 24px;
  padding-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-wrapper {
  width: 100%;
  max-width: 900px;
}

.profile-card {
  background-color: rgba(255, 255, 255, 0.97);
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  width: 100%;
}

.label {
  font-size: 0.85rem;
  color: #0c3b2e;
  font-weight: 600;
  margin-bottom: 4px;
}
</style>
