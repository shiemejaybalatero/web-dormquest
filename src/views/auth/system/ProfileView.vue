<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, onMounted } from 'vue'
import { supabase, formActionDefault } from '@/utils/supabase'
import { useRoute, useRouter } from 'vue-router'
import { calculateAge } from '@/utils/helper'

// Router
const route = useRoute()
const router = useRouter()

// Reactive States - User Data & Form
const userData = ref({
  email: '',
  name: '',
  age: '',
  gender: '',
  birthday: '',
  avatar_url: '',
})

const formAction = ref({ ...formActionDefault })
const isUploading = ref(false)
const isSaving = ref(false)
const isEditing = ref(false)

const uploadError = ref('')
const editError = ref('')

// Reactive States - Files & Inputs
const profileImage = ref(null)
const fileInput = ref(null)
const avatarFile = ref(null)

// Reactive States - Edit Form
const editForm = ref({
  fullname: '',
  birthday: '',
  gender: '',
})

// Trigger file input click
const triggerFileInput = () => {
  fileInput.value.click()
}

// Handle avatar file upload
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  uploadError.value = ''

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `avatar_${Date.now()}.${fileExt}`
    const filePath = `public/${fileName}`

    const { error: uploadError } = await supabase.storage.from('dormquest').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage.from('dormquest').getPublicUrl(filePath)

    if (urlData?.publicUrl) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: urlData.publicUrl },
      })
      if (updateError) throw updateError

      profileImage.value = urlData.publicUrl
      getUser()
    }
  } catch (error) {
    uploadError.value = error.message || 'Failed to upload image'
  } finally {
    isUploading.value = false
  }
}

// Handle file input for editing
const handleEditFileUpload = (event) => {
  avatarFile.value = event.target.files[0]
}

// Fetch current user data
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

    userData.value.age = metadata.birthday ? calculateAge(metadata.birthday) : metadata.age || ''

    userData.value.gender = metadata.gender || ''
    userData.value.fullname = `${metadata.firstname || ''} ${metadata.lastname || ''}`.trim()

    if (metadata.avatar_url) {
      userData.value.avatar_url = metadata.avatar_url
      profileImage.value = metadata.avatar_url
    }
  }

  formAction.value.formProcess = false
}

// Start edit mode
const startEditing = () => {
  isEditing.value = true
  editForm.value.fullname = userData.value.fullname
  editForm.value.birthday = userData.value.birthday
  editForm.value.gender = userData.value.gender
}

// Save profile changes
const saveChanges = async () => {
  isSaving.value = true
  editError.value = ''

  try {
    let avatarUrl = profileImage.value

    if (avatarFile.value) {
      const fileExt = avatarFile.value.name.split('.').pop()
      const fileName = `avatar_${Date.now()}.${fileExt}`
      const filePath = `public/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('dormquest')
        .upload(filePath, avatarFile.value, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('dormquest').getPublicUrl(filePath)
      if (urlData?.publicUrl) avatarUrl = urlData.publicUrl
    }

    const nameParts = editForm.value.fullname.split(' ')
    const firstname = nameParts[0] || ''
    const lastname = nameParts.slice(1).join(' ') || ''

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        firstname,
        lastname,
        birthday: editForm.value.birthday,
        gender: editForm.value.gender,
        avatar_url: avatarUrl,
      },
    })

    if (updateError) throw updateError

    profileImage.value = avatarUrl
    isEditing.value = false
    getUser()
  } catch (error) {
    editError.value = error.message || 'Failed to update profile'
  } finally {
    isSaving.value = false
  }
}

// Logout user
const onLogout = async () => {
  formAction.value.formProcess = true

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error during logout:', error)
  }

  formAction.value.formProcess = false
  router.replace('/')
}

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
                    <v-avatar class="mt-5" size="200">
                      <v-img
                        :src="
                          profileImage ||
                          'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
                        "
                        cover
                      />
                    </v-avatar>
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
                <div class="d-flex justify-end mt-4">
                  <v-btn color="#0c3b2e" variant="outlined" @click="startEditing">
                    Edit Profile
                  </v-btn>
                </div>

                <v-expand-transition>
                  <div v-if="isEditing" class="mt-4 w-100 text-end">
                    <v-card flat class="pa-4">
                      <v-text-field v-model="editForm.fullname" label="Full Name" />
                      <v-text-field v-model="editForm.birthday" label="Birthday" type="date" />
                      <v-select
                        v-model="editForm.gender"
                        :items="['Male', 'Female', 'Rather not to say']"
                        label="Gender"
                      />
                      <v-file-input
                        label="Upload New Avatar"
                        accept="image/*"
                        @change="handleEditFileUpload"
                      />

                      <v-btn class="mt-3" color="success" :loading="isSaving" @click="saveChanges">
                        Save Changes
                      </v-btn>

                      <div v-if="editError" class="error-text mt-2">{{ editError }}</div>
                    </v-card>
                  </div>
                </v-expand-transition>
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
