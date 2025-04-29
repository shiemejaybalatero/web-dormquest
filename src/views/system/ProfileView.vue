<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SidebarLayout from '@/components/layout/SidebarLayout.vue'
import { ref, onMounted } from 'vue'
import { supabase, formActionDefault } from '@/utils/supabase'
import { calculateAge } from '@/utils/helper'

// Sidebar links for this Profile page
const sidebarLinks = [
  { title: 'Personal Information', icon: 'mdi-account', path: '/profile' },
  { title: 'Ratings', icon: 'mdi-star', path: '/ratings' },
  { title: 'About App', icon: 'mdi-information', path: '/about' },
]

// Your userData and form states here (same as before)
const userData = ref({
  email: '',
  name: '',
  age: '',
  gender: '',
  birthday: '',
  avatar_url: '',
})
const formAction = ref({ ...formActionDefault })
const profileImage = ref(null)
const isEditing = ref(false)
const editForm = ref({
  fullname: '',
  birthday: '',
  gender: '',
})
const isSaving = ref(false)
const editError = ref('')
const avatarFile = ref(null)

// Functions for profile logic (same as before)
const handleEditFileUpload = (e) => {
  avatarFile.value = e.target.files[0]
}
const getUser = async () => {
  formAction.value.formProcess = true
  const { data, error } = await supabase.auth.getUser()
  if (!error && data?.user) {
    const metadata = data.user.user_metadata
    userData.value.email = metadata.email || data.user.email
    userData.value.birthday = metadata.birthday || ''
    userData.value.age = metadata.birthday ? calculateAge(metadata.birthday) : metadata.age || ''
    userData.value.gender = metadata.gender || ''
    userData.value.fullname = `${metadata.firstname || ''} ${metadata.lastname || ''}`.trim()
    userData.value.avatar_url = metadata.avatar_url
    profileImage.value = metadata.avatar_url
  }
  formAction.value.formProcess = false
}
const startEditing = () => {
  isEditing.value = true
  editForm.value.fullname = userData.value.fullname
  editForm.value.birthday = userData.value.birthday
  editForm.value.gender = userData.value.gender
}
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
          <SidebarLayout :links="sidebarLinks" />
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
                  <v-btn color="#0c3b2e" variant="outlined" @click="startEditing"
                    >Edit Profile</v-btn
                  >
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
            <v-progress-circular indeterminate size="64" />
          </v-overlay>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
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

.error-text {
  color: #ff5252;
  font-size: 0.75rem;
}
</style>
