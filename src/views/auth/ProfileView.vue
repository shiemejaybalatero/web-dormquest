<template>
  <AppLayout>
    <template #content>
      <v-row>
        <!-- Sidebar -->
        <v-col cols="12" md="3">
          <v-list dense nav class="sidebar pa-4">
<<<<<<< HEAD
            <!-- Personal Information -->
            <router-link to="/profile" class="text-decoration-none" style="color: inherit">
              <v-list-item :class="{ selected: route.path === '/profile' }" class="mt-3 mb-2">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/profile' ? '#0c3b2e' : ''" class="mr-2">
                    mdi-account
                  </v-icon>
                  <span class="font-weight-bold text-body-1"> Personal Information </span>
                </div>
              </v-list-item>
            </router-link>

            <!-- Ratings -->
            <router-link to="/ratings" class="text-decoration-none" style="color: inherit">
              <v-list-item :class="{ selected: route.path === '/ratings' }" class="mb-2">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/ratings' ? '#0c3b2e' : ''" class="mr-2">
                    mdi-star
                  </v-icon>
                  <span class="font-weight-bold text-body-1"> Ratings </span>
                </div>
              </v-list-item>
            </router-link>

            <!-- About App -->

            <router-link to="/about" class="text-decoration-none" style="color: inherit">
              <v-list-item :class="{ selected: route.path === '/about' }" class="mb-2">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/about' ? '#0c3b2e' : ''" class="mr-2">
                    mdi-information
                  </v-icon>
                  <span class="font-weight-bold text-body-1"> About app </span>
                </div>
              </v-list-item>
            </router-link>

            <!-- Log Out -->

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
=======
            <!-- Sidebar content can go here -->
>>>>>>> 3a3eafe790c5880ed513e321676c8e3489afa6df
          </v-list>
        </v-col>

        <!-- Main Content -->

        <!-- Profile Form -->

        <v-col cols="12" md="9">
          <div class="profile-section d-flex flex-column align-center justify-center pa-6">
            <div class="profile-wrapper" v-if="user">
              <div class="d-flex justify-space-between align-center mb-6 w-100">
                <h3 class="font-weight-bold mb-0">Profile Information</h3>
                <v-btn color="#ffba00" class="font-weight-bold text-black account-setting" rounded>
                  Account Setting
                </v-btn>
              </div>

              <v-card class="pa-6 profile-card" flat>
                <v-form @submit.prevent="saveProfile">
                  <v-row>
                    <!-- Avatar Column -->
                    <v-col cols="12" md="4" class="text-center d-flex flex-column align-center">
                      <v-avatar size="120">
                        <v-img :src="profile.avatar_url || placeholderUrl" />
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

                    <!-- Form Fields Column -->
                    <v-col cols="12" md="8">
                      <v-row>
                        <v-col cols="12" sm="6">
                          <div class="label">First Name</div>
                          <v-text-field
                            v-model="profile.firstname"
                            placeholder="First Name"
                            density="compact"
                            variant="outlined"
                            hide-details
                          />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="label">Last Name</div>
                          <v-text-field
                            v-model="profile.lastname"
                            placeholder="Last Name"
                            density="compact"
                            variant="outlined"
                            hide-details
                          />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="label">Email</div>
                          <v-text-field
                            :model-value="userEmail"
                            placeholder="Email"
                            type="email"
                            density="compact"
                            variant="outlined"
                            hide-details
                            disabled
                          />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="label">Birthdate</div>
                          <v-text-field
                            v-model="profile.birthdate"
                            type="date"
                            density="compact"
                            variant="outlined"
                            hide-details
                          />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="label">Gender</div>
                          <v-select
                            v-model="profile.gender"
                            :items="['male', 'female', 'custom']"
                            placeholder="Gender"
                            density="compact"
                            variant="outlined"
                            hide-details
                          />
                        </v-col>
                        <v-col cols="12" class="text-right mt-4">
                          <v-btn
                            type="submit"
                            color="#0c3b2e"
                            class="white--text"
                            rounded
                            :loading="loading"
                          >
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

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, reactive, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'

// State
const user = ref(null)
const profile = reactive({
  firstname: '',
  lastname: '',
  birthdate: '',
  gender: '',
  avatar_url: '',
})

const placeholderUrl = 'https://via.placeholder.com/150'
const fileInput = ref(null)
const loading = ref(false)

// Computed to safely access email
const userEmail = computed(() => user.value?.email || '')

// Trigger file upload
const triggerFileInput = () => fileInput.value?.click()

// Handle file upload to Supabase Storage
const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file || !user.value) return

  const filePath = `${user.value.id}/${file.name}`
  loading.value = true

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (!uploadError) {
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    profile.avatar_url = urlData.publicUrl
  }

  loading.value = false
}

// Fetch user and profile metadata
const fetchProfile = async () => {
  const { data: sessionData } = await supabase.auth.getUser()
  if (!sessionData.user) return

  user.value = sessionData.user

  const md = sessionData.user.user_metadata || {}
  profile.firstname = md.firstname || ''
  profile.lastname = md.lastname || ''
  profile.birthdate = md.birthday || ''
  profile.gender = md.gender || ''
}

// Save updates to Supabase
const saveProfile = async () => {
  if (!user.value) return

  loading.value = true
  const updates = {
    id: user.value.id,
    ...profile,
    updated_at: new Date(),
  }

  const { error } = await supabase.from('profiles').upsert(updates)
  if (error) console.error('Profile update failed:', error)

  loading.value = false
}

// Load profile on mount
onMounted(fetchProfile)
</script>

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
