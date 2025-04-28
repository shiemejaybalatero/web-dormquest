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

        <!-- Content Section -->
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
