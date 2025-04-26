<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const profileImage = ref(null)
const fileInput = ref(null)
const name = ref('SHIEME JAY G. BALATERO')
const age = ref('30')
const email = ref('shiemejay@gmail.com')
const status = ref('Single')

const activeItem = ref(null)

const route = useRoute()

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

const saveProfile = () => {
  console.log('Profile saved:', {
    name: name.value,
    age: age.value,
    email: email.value,
    status: status.value,
  })
}

const setActiveItem = (item) => {
  activeItem.value = activeItem.value === item ? null : item
}
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
  min-height: 50vh;
  background: transparent;
  border-radius: 16px;
  position: relative;
}

.sidebar::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, #cfd8dc, #90a4ae);
  box-shadow: 1px 0 2px rgba(0, 0, 0, 0.3);
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
