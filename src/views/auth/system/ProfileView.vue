<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, onMounted } from 'vue'
import { supabase, formActionDefault } from '@/utils/supabase'
import { useRoute, useRouter } from 'vue-router'
import { calculateAge } from '@/utils/helper'

const route = useRoute()
const router = useRouter()
const formAction = ref({ ...formActionDefault })
const profileImage = ref(null)
const fileInput = ref(null)
const isUploading = ref(false)
const uploadError = ref('')

// User data to display
const userData = ref({
  email: '',
  fullname: '',
  age: '',
  gender: '',
  status: 'Active', // Default status
  birthday: '',
  avatar_url: '',
})

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  uploadError.value = ''

  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage.from('profiles').upload(filePath, file)

    if (error) throw error

    // Get the public URL
    const { data: urlData } = supabase.storage.from('profiles').getPublicUrl(filePath)

    if (urlData) {
      // Update user metadata with avatar URL
      const { data: userData, error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: urlData.publicUrl },
      })

      if (updateError) throw updateError

      // Update local state
      profileImage.value = urlData.publicUrl

      // Refresh user data
      getUser()
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    uploadError.value = error.message || 'Failed to upload image'
  } finally {
    isUploading.value = false
  }
}

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

const getUser = async () => {
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error getting user:', error)
    formAction.value.formProcess = false
    return
  }

  const metadata = data?.user?.user_metadata

  if (metadata) {
    userData.value.email = metadata.email || data?.user?.email || ''
    userData.value.birthday = metadata.birthday || ''

    // Calculate age if birthday exists
    if (metadata.birthday) {
      userData.value.age = calculateAge(metadata.birthday)
    } else {
      userData.value.age = metadata.age || ''
    }

    userData.value.gender = metadata.gender || ''
    userData.value.fullname = `${metadata.firstname || ''} ${metadata.lastname || ''}`.trim()

    // Set avatar URL if exists
    if (metadata.avatar_url) {
      userData.value.avatar_url = metadata.avatar_url
      profileImage.value = metadata.avatar_url
    }
  }

  formAction.value.formProcess = false
}

// Call getUser when component is mounted
onMounted(() => {
  getUser()
})
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

            <router-link to="/system/about" class="text-decoration-none" style="color: inherit">
              <v-list-item :class="{ selected: route.path === '/system/about' }" class="mb-2">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/system/about' ? '#0c3b2e' : ''" class="mr-2">
                    mdi-information
                  </v-icon>
                  <span class="font-weight-bold text-body-1"> About app </span>
                </div>
              </v-list-item>
            </router-link>

            <v-list-item @click="onLogout" class="mb-2 cursor-pointer">
              <div class="d-flex align-center pl-2">
                <v-icon class="mr-2"> mdi-logout </v-icon>
                <span class="font-weight-bold text-body-1"> Log out </span>
              </div>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Profile Information -->
        <v-col cols="12" md="9">
          <div class="profile-section d-flex flex-column align-center justify-center pa-6">
            <div class="profile-wrapper">
              <div class="d-flex justify-space-between align-center mb-6 w-100">
                <h3 class="font-weight-bold mb-0">Profile Information</h3>
              </div>

              <v-card class="pa-6 profile-card" flat>
                <v-row>
                  <!-- Avatar with Upload -->
                  <v-col cols="12" md="4" class="text-center d-flex flex-column align-center">
                    <v-avatar size="120">
                      <v-img :src="profileImage || 'https://via.placeholder.com/150'" />
                    </v-avatar>
                    <v-btn
                      color="#0c3b2e"
                      class="mt-3 text-white"
                      @click="triggerFileInput"
                      rounded
                      :loading="isUploading"
                      :disabled="isUploading"
                    >
                      <v-icon left>mdi-camera</v-icon>
                      Upload Photo
                    </v-btn>
                    <input
                      ref="fileInput"
                      type="file"
                      style="display: none"
                      accept="image/*"
                      @change="handleFileUpload"
                    />
                    <div v-if="uploadError" class="error-text mt-2">{{ uploadError }}</div>
                  </v-col>

                  <!-- Display Fields -->
                  <v-col cols="12" md="8">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="field-label">Full Name</div>
                        <div class="field-value">{{ userData.fullname }}</div>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <div class="field-label">Age</div>
                        <div class="field-value">{{ userData.age }}</div>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <div class="field-label">Email</div>
                        <div class="field-value">{{ userData.email }}</div>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <div class="field-label">Gender</div>
                        <div class="field-value">{{ userData.gender }}</div>
                      </v-col>

                      <v-col cols="12" sm="6" v-if="userData.birthday">
                        <div class="field-label">Birthday</div>
                        <div class="field-value">{{ userData.birthday }}</div>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card>
            </div>
          </div>

          <!-- Loading overlay -->
          <v-overlay :model-value="formAction.formProcess" class="align-center justify-center">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
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

.field-label {
  font-size: 0.85rem;
  color: #0c3b2e;
  font-weight: 600;
  margin-bottom: 4px;
}

.field-value {
  font-size: 1rem;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 6px;
  min-height: 45px;
  display: flex;
  align-items: center;
}

.cursor-pointer {
  cursor: pointer;
}

.error-text {
  color: #ff5252;
  font-size: 0.75rem;
}
</style>
