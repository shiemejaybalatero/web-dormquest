<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SidebarLayout from '@/components/layout/SidebarLayout.vue'
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { ref } from 'vue'

const theme = useTheme()
const isDarkMode = computed(() => theme.global.name.value === 'dark')

const drawer = ref(false)

const sidebarLinks = [
  { path: '/profile', icon: 'mdi-account', title: 'Personal Information' },
  { path: '/ratings', icon: 'mdi-star', title: 'Ratings' },
  { path: '/about', icon: 'mdi-information', title: 'About App' },
]
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

          <!-- About App Section -->
          <v-col cols="12" md="9">
            <div
              class="about-section px-4 px-md-8 py-6 py-md-10"
              :class="isDarkMode ? 'about-section-dark' : 'about-section-light'"
            >
              <div class="about-wrapper">
                <!-- Header -->
                <div class="d-flex align-center justify-space-between mb-6">
                  <h1 class="font-weight-bold mb-0">
                    <span style="color: #ffba00">DORM</span>
                    <span style="color: white"> QUEST</span>
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

                <!-- Info Card -->
                <v-card
                  class="pa-5 pa-md-9 profile-card"
                  :class="isDarkMode ? 'profile-card-dark' : 'profile-card-light'"
                  flat
                >
                  <v-row>
                    <v-col cols="12" class="mb-6">
                      <div :class="['field-label', isDarkMode ? 'label-dark' : 'label-light']">
                        What is Dorm Quest?
                      </div>
                      <div :class="['field-value', isDarkMode ? 'value-dark' : 'value-light']">
                        Dorm Quest is a web-based platform that helps students and tenants around
                        Ampayon easily find and track available dormitories. With real-time updates
                        on room availability, users can explore listings that include key details
                        like pricing, room capacity, amenities, and exact location.
                      </div>
                    </v-col>

                    <v-col cols="12" class="mb-6">
                      <div :class="['field-label', isDarkMode ? 'label-dark' : 'label-light']">
                        Key Features
                      </div>
                      <div :class="['field-value', isDarkMode ? 'value-dark' : 'value-light']">
                        The platform includes a rating and review system, helping users make
                        informed decisions. Dorm owners can list and manage their properties,
                        streamlining communication with renters.
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <div :class="['field-label', isDarkMode ? 'label-dark' : 'label-light']">
                        Who is it for?
                      </div>
                      <div :class="['field-value', isDarkMode ? 'value-dark' : 'value-light']">
                        Whether you're a student looking for a convenient place to stay or a
                        property owner aiming to reach more people, Dorm Quest simplifies the
                        dorm-searching and listing process.
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
.about-wrapper {
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

/* Light Mode */
.about-section-light {
  background-color: #0c3b2e;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Dark Mode */
.about-section-dark {
  background-color: #0a2e23;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Shared Card Style */
.profile-card-light {
  background-color: #fffdf6;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  width: 100%;
}

.profile-card-dark {
  background-color: #102820;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  width: 100%;
}

/* Labels */
.label-light {
  color: #0c3b2e;
}

.label-dark {
  color: #ffba00;
}

/* Values */
.value-light {
  background-color: #f5f5f5;
  color: #0c3b2e;
}

.value-dark {
  background-color: #1d3731;
  color: #ffffff;
}

/* Shared Field Styling */
.field-label {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.field-value {
  font-size: 1rem;
  padding: 16px 24px;
  border-radius: 6px;
  line-height: 1.6;
  width: 100%;
  display: block;
  box-sizing: border-box;
}
</style>
