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
        <!-- Sidebar -->
        <v-col cols="12" md="3">
          <SidebarLayout :links="sidebarLinks" />
        </v-col>

        <!-- About App Section -->
        <v-col cols="12" md="9">
          <div class="about-section px-4 px-md-8 py-6 py-md-10">
            <!-- Header (Modified) -->
            <div class="d-flex justify-center mb-6">
              <h2 class="font-weight-bold mb-0 text-center">
                <span style="color: #ffba00">DORM</span>
                <span style="color: white"> QUEST</span>
              </h2>
            </div>

            <!-- Profile-like Card Layout (No Avatar) -->
            <v-card class="pa-6 profile-card" flat>
              <v-row>
                <!-- Full Width Content -->
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" class="mb-6">
                      <div class="field-label">What is Dorm Quest?</div>
                      <div class="field-value">
                        Dorm Quest is a web-based platform that helps students and tenants around
                        Ampayon easily find and track available dormitories. With real-time updates
                        on room availability, users can explore listings that include key details
                        like pricing, room capacity, amenities, and exact location.
                      </div>
                    </v-col>

                    <v-col cols="12" class="mb-6">
                      <div class="field-label">Key Features</div>
                      <div class="field-value">
                        The platform includes a rating and review system, helping users make
                        informed decisions. Dorm owners can list and manage their properties,
                        streamlining communication with renters.
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <div class="field-label">Who is it for?</div>
                      <div class="field-value">
                        Whether you're a student looking for a convenient place to stay or a
                        property owner aiming to reach more people, Dorm Quest simplifies the
                        dorm-searching and listing process.
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
.about-section {
  background: #0c3b2e;
  border-radius: 16px;
  min-height: 65vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  padding: 16px 24px;
  background-color: #f5f5f5;
  border-radius: 6px;
  line-height: 1.6;
  width: 100%;
  display: block;
  box-sizing: border-box;
}
</style>
