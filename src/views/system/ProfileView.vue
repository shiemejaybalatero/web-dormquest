<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SidebarLayout from '@/components/layout/SidebarLayout.vue'
import EditProfile from '@/components/system/EditProfile.vue'
import { ref, onMounted } from 'vue'
import { formActionDefault } from '@/utils/supabase'
import { userProfile, isLoadingUser, fetchUserProfile } from '@/stores/userStore'

const sidebarLinks = [
  { title: 'Personal Information', icon: 'mdi-account', path: '/profile' },
  { title: 'Ratings', icon: 'mdi-star', path: '/ratings' },
  { title: 'About App', icon: 'mdi-information', path: '/about' },
]

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
const triggerFileInput = () => {}
const handleEditFileUpload = (e) => {
  avatarFile.value = e.target.files[0]
}
const getUser = async () => {
  formAction.value.formProcess = true
  await fetchUserProfile()
  profileImage.value = userProfile.value.avatar_url
  formAction.value.formProcess = false
})

// Function to handle profile update completion
const handleProfileUpdated = async () => {
  // Refresh user profile data
  await fetchUserProfile()

  // Update profile image preview
  if (userProfile.value.avatar_url) {
    profileImage.value = userProfile.value.avatar_url
  }
}
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
                <h3 class="font-weight-bold mb-0 text-white">Profile Information</h3>
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
                        <div class="field-value">{{ userProfile.fullname }}</div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="field-label">Age</div>
                        <div class="field-value">{{ userProfile.age }}</div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="field-label">Email</div>
                        <div class="field-value">{{ userProfile.email }}</div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="field-label">Gender</div>
                        <div class="field-value">{{ userProfile.gender }}</div>
                      </v-col>
                      <v-col cols="12" sm="6" v-if="userProfile.birthday">
                        <div class="field-label">Birthday</div>
                        <div class="field-value">{{ userProfile.birthday }}</div>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <div class="d-flex justify-end mt-4">
                  <v-btn color="#0c3b2e" variant="outlined" @click="showEditDialog = true">
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
          <v-overlay
            :model-value="formAction.formProcess || isLoadingUser"
            class="align-center justify-center"
          >
            <v-progress-circular indeterminate size="64" />
          </v-overlay>
        </v-col>
      </v-row>
    </template>
  </AppLayout>

  <!-- Profile Edit Dialog Component -->
  <EditProfile
    v-model="showEditDialog"
    :userData="userProfile"
    @profile-updated="handleProfileUpdated"
  />
</template>

<style scoped>
.profile-section {
  /*
  background: linear-gradient(180deg, #dbead3, #6d9773);
  */
  background-color: #0c3b2e;
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
  background-color: #fffdf6;
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
</style>
