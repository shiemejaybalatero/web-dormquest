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

const drawer = ref(false)

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

const handleProfileUpdated = async () => {
  await fetchUserProfile()
  if (userProfile.value.avatar_url) {
    profileImage.value = userProfile.value.avatar_url
  }
}

const profileFields = computed(() => [
  { label: 'Full Name', value: userProfile.value.fullname },
  { label: 'Age', value: userProfile.value.age },
  { label: 'Email', value: userProfile.value.email },
  { label: 'Gender', value: userProfile.value.gender },
  ...(userProfile.value.birthday ? [{ label: 'Birthday', value: userProfile.value.birthday }] : []),
])
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid class="py-6">
        <v-row>
          <!-- Sidebar -->
          <v-col cols="12" md="3">
            <SidebarLayout :links="sidebarLinks" v-model:drawer="drawer" />
          </v-col>

          <!-- Profile Info -->
          <v-col cols="12" md="9">
            <div
              class="profile-section px-4 px-md-8 py-6 py-md-10"
              :class="isDarkMode ? 'profile-section-dark' : 'profile-section-light'"
            >
              <div class="profile-wrapper">
                <!-- Header (Modified) -->
                <div class="d-flex justify-space-between align-center mb-6">
                  <h1 class="font-weight-bold mb-0">
                    <span style="color: #ffba00">MY</span>
                    <span style="color: white"> PROFILE</span>
                  </h1>

                  <!-- Toggle button (mobile only) -->
                  <v-btn
                    v-if="$vuetify.display.smAndDown"
                    icon
                    @click="drawer = true"
                    variant="text"
                    color="white"
                  >
                    <v-icon>mdi-menu</v-icon>
                  </v-btn>
                </div>

                <!-- Profile Card -->
                <v-card
                  class="pa-5 pa-md-9 profile-card"
                  :class="isDarkMode ? 'profile-card-dark' : 'profile-card-light'"
                  flat
                >
                  <v-row>
                    <!-- Avatar -->
                    <v-col cols="12" md="4" class="text-center d-flex flex-column align-center">
                      <v-avatar class="mt-4 mb-4 mb-md-0" size="160" md="200">
                        <v-img
                          :src="
                            profileImage ||
                            'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
                          "
                          cover
                        />
                      </v-avatar>
                    </v-col>

                    <!-- Profile Fields -->
                    <v-col cols="12" md="8">
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                          v-for="(field, index) in profileFields"
                          :key="index"
                        >
                          <div :class="['field-label', isDarkMode ? 'label-dark' : 'label-light']">
                            {{ field.label }}
                          </div>
                          <div
                            :class="[
                              'field-value',
                              isDarkMode ? 'value-dark border-white' : 'value-light border-black',
                            ]"
                          >
                            {{ field.value }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <!-- Edit Button -->
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
      </v-container>
    </template>
  </AppLayout>

  <!-- Edit Dialog -->
  <EditProfile
    v-model="showEditDialog"
    :userData="userProfile"
    @profile-updated="handleProfileUpdated"
  />
</template>

<style scoped>
.profile-wrapper {
  width: 100%;
  max-width: 900px;
  margin: auto;
}

.heading-text {
  font-size: 1.8rem;
}

@media (min-width: 768px) {
  .heading-text {
    font-size: 2.4rem;
  }
}

/* Light Theme */
.profile-section-light {
  background-color: #0c3b2e;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
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

/* Dark Theme */
.profile-section-dark {
  background-color: #0a2e23;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
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

.border-white {
  border: 1px solid #ffffff;
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
</style>
