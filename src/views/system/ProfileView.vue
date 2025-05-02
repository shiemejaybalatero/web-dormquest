<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SidebarLayout from '@/components/layout/SidebarLayout.vue'
import EditProfile from '@/components/system/EditProfile.vue'
import { ref, onMounted, computed } from 'vue'
import { formActionDefault } from '@/utils/supabase'
import { userProfile, isLoadingUser, fetchUserProfile } from '@/stores/userStore'
import { useTheme } from 'vuetify'

const theme = useTheme()

const isDarkMode = computed(() => theme.global.name.value === 'dark')

const sidebarLinks = [
  { title: 'Personal Information', icon: 'mdi-account', path: '/profile' },
  { title: 'Ratings', icon: 'mdi-star', path: '/ratings' },
  { title: 'About App', icon: 'mdi-information', path: '/about' },
]

const formAction = ref({ ...formActionDefault })
const profileImage = ref(null)
const showEditDialog = ref(false)

onMounted(async () => {
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
          <div
            class="profile-section px-4 px-md-8 py-6 py-md-10"
            :class="{ 'profile-section-dark': isDarkMode, 'profile-section-light': !isDarkMode }"
          >
            <div class="profile-wrapper">
              <!-- Header (Modified) -->
              <div class="d-flex justify-left mb-6">
                <h2 class="font-weight-bold mb-0 text-center">
                  <span style="color: #ffba00">MY</span>
                  <span style="color: white"> PROFILE</span>
                </h2>
              </div>

              <v-card
                class="pa-9 profile-card"
                :class="{ 'profile-card-dark': isDarkMode, 'profile-card-light': !isDarkMode }"
                flat
              >
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
                        <div
                          class="field-label"
                          :class="{ 'label-dark': isDarkMode, 'label-light': !isDarkMode }"
                        >
                          Full Name
                        </div>
                        <div
                          class="field-value"
                          :class="{
                            'value-dark': isDarkMode,
                            'value-light': !isDarkMode,
                            'border-white': isDarkMode,
                            'border-black': !isDarkMode,
                          }"
                        >
                          {{ userProfile.fullname }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div
                          class="field-label"
                          :class="{ 'label-dark': isDarkMode, 'label-light': !isDarkMode }"
                        >
                          Age
                        </div>
                        <div
                          class="field-value"
                          :class="{
                            'value-dark': isDarkMode,
                            'value-light': !isDarkMode,
                            'border-white': isDarkMode,
                            'border-black': !isDarkMode,
                          }"
                        >
                          {{ userProfile.age }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div
                          class="field-label"
                          :class="{ 'label-dark': isDarkMode, 'label-light': !isDarkMode }"
                        >
                          Email
                        </div>
                        <div
                          class="field-value"
                          :class="{
                            'value-dark': isDarkMode,
                            'value-light': !isDarkMode,
                            'border-white': isDarkMode,
                            'border-black': !isDarkMode,
                          }"
                        >
                          {{ userProfile.email }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div
                          class="field-label"
                          :class="{ 'label-dark': isDarkMode, 'label-light': !isDarkMode }"
                        >
                          Gender
                        </div>
                        <div
                          class="field-value"
                          :class="{
                            'value-dark': isDarkMode,
                            'value-light': !isDarkMode,
                            'border-white': isDarkMode,
                            'border-black': !isDarkMode,
                          }"
                        >
                          {{ userProfile.gender }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6" v-if="userProfile.birthday">
                        <div
                          class="field-label"
                          :class="{ 'label-dark': isDarkMode, 'label-light': !isDarkMode }"
                        >
                          Birthday
                        </div>
                        <div
                          class="field-value"
                          :class="{
                            'value-dark': isDarkMode,
                            'value-light': !isDarkMode,
                            'border-white': isDarkMode,
                            'border-black': !isDarkMode,
                          }"
                        >
                          {{ userProfile.birthday }}
                        </div>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <div class="d-flex justify-end mt-4">
                  <v-btn
                    :color="isDarkMode ? '#6D9773' : '#0c3b2e'"
                    variant="outlined"
                    @click="showEditDialog = true"
                  >
                    Edit Profile
                  </v-btn>
                </div>
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
/* Light Mode Styles */
.profile-section-light {
  background-color: #0c3b2e;
  border-radius: 16px;
  min-height: 65vh;
  padding-top: 24px;
  padding-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-card-light {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  width: 100%;
}

.label-light {
  color: #0c3b2e;
}

.value-light {
  background-color: #f5f5f5;
  color: #0c3b2e;
}

.border-black {
  border: 1px solid #000000;
}

/* Dark Mode Styles */
.profile-section-dark {
  background-color: #0a2e23;
  border-radius: 16px;
  min-height: 65vh;
  padding-top: 24px;
  padding-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-card-dark {
  background-color: #102820;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  width: 100%;
}

.label-dark {
  color: #ffba00;
}

.value-dark {
  background-color: #1d3731;
  color: #ffffff;
}

/* Common Styles */
.profile-wrapper {
  width: 100%;
  max-width: 900px;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.field-value {
  font-size: 1rem;
  padding: 12px;
  border-radius: 6px;
  min-height: 45px;
  display: flex;
  align-items: center;
}

.theme-toggle-btn {
  transition: transform 0.2s ease;
}

.theme-toggle-btn:hover {
  transform: rotate(30deg);
}
</style>
