<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SidebarLayout from '@/components/layout/SidebarLayout.vue'

const sidebarLinks = [
  { path: '/profile', icon: 'mdi-account', title: 'Personal Information' },
  { path: '/ratings', icon: 'mdi-star', title: 'Ratings' },
  { path: '/about', icon: 'mdi-information', title: 'About App' },
]
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <!-- Sidebar using reusable layout -->
        <v-col cols="12" md="3">
          <SidebarLayout :links="sidebarLinks" />
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
.about-section {
  background: linear-gradient(180deg, #dbead3, #6d9773);
  border-radius: 16px;
  min-height: 65vh;
  padding-top: 24px;
  padding-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-box {
  background-color: rgba(255, 255, 255, 0.97);
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  width: 100%;
}
</style>
