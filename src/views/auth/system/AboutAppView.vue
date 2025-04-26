<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <!-- Sidebar -->
        <v-col cols="12" md="3">
          <v-list dense nav class="sidebar pa-4">
            <router-link to="/profile" style="text-decoration: none; color: inherit">
              <v-list-item :class="{ selected: route.path === '/profile' }" class="mt-3 mb-2">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/profile' ? '#0c3b2e' : ''" class="mr-2"
                    >mdi-account</v-icon
                  >
                  <span class="font-weight-bold text-body-1">Personal Information</span>
                </div>
              </v-list-item>
            </router-link>

            <router-link to="/ratings" style="text-decoration: none; color: inherit">
              <v-list-item :class="{ selected: route.path === '/ratings' }" class="mb-2">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/ratings' ? '#0c3b2e' : ''" class="mr-2"
                    >mdi-star</v-icon
                  >
                  <span class="font-weight-bold text-body-1">Ratings</span>
                </div>
              </v-list-item>
            </router-link>

            <router-link to="/about" style="text-decoration: none; color: inherit">
              <v-list-item :class="{ selected: route.path === '/about' }" class="mb-2">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/about' ? '#0c3b2e' : ''" class="mr-2"
                    >mdi-information</v-icon
                  >
                  <span class="font-weight-bold text-body-1">About app</span>
                </div>
              </v-list-item>
            </router-link>

            <router-link to="/" style="text-decoration: none; color: inherit">
              <v-list-item :class="{ selected: route.path === '/' }" class="mb-2">
                <div class="d-flex align-center pl-2">
                  <v-icon :color="route.path === '/' ? '#0c3b2e' : ''" class="mr-2"
                    >mdi-logout</v-icon
                  >
                  <span class="font-weight-bold text-body-1">Log out</span>
                </div>
              </v-list-item>
            </router-link>
          </v-list>
        </v-col>

        <!-- Content Section with Ratings Layout -->
        <v-col cols="12" md="9">
          <div class="about-section pa-6">
            <div class="d-flex align-center justify-between mb-6">
              <!-- Left Group (Logo + Title) -->
              <div class="d-flex align-center mb-4 mb-md-0">
                <h2 class="font-weight-bold mb-0">
                  <span style="color: #ffba00">DORM</span>
                  <span style="color: #0c3b2e"> QUEST</span>
                </h2>
              </div>

              <!-- Right Group (Chip) -->
              <v-chip class="pa-5 ml-auto">
                <v-icon icon="mdi-information" start></v-icon>
                ALL ABOUT APP
              </v-chip>
            </div>

            <v-card flat class="pa-6 about-box">
              <p class="mb-4 text-body-1">
                <strong>Dorm Quest</strong> is a web-based platform that helps students and tenants
                around Ampayon easily find and track available dormitories. With real-time updates
                on room availability, users can explore listings that include key details like
                pricing, room capacity, amenities, and exact location.
              </p>
              <p class="mb-4 text-body-1">
                The platform also features a rating and review system, giving users insights from
                previous tenants to help them make informed decisions. Dorm owners can list and
                manage their properties through the site, making it easier to connect with potential
                renters.
              </p>
              <p class="text-body-1">
                Whether you're a student looking for a convenient place to stay or a property owner
                aiming to reach more people, Dorm Quest makes the entire dorm-searching and listing
                process easier, smarter, and more reliable.
              </p>
            </v-card>
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

.about-section {
  border-radius: 16px;
  background: linear-gradient(180deg, #dbead3, #6d9773);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.about-box {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  line-height: 1.6;
}
</style>
