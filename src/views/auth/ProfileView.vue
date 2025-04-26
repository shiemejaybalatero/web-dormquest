<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

// Profile Data
const name = ref('SHIEME JAY G. BALATERO')
const age = ref('30')
const email = ref('shiemejay@gmail.com')
const status = ref('Student')

// Sidebar active item
const activeItem = ref('')

// Methods
const setActiveItem = (item) => {
  activeItem.value = item
}
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <!-- Sidebar -->
        <v-col cols="12" md="3">
          <v-list dense nav class="sidebar pa-4">
            <router-link to="/profile" class="text-decoration-none" style="color: inherit">
              <v-list-item
                class="icon-container"
                :class="{ 'active-icon': activeItem === '/profile' }"
                @click="setActiveItem('/profile')"
              >
                <div class="d-flex align-center pl-2">
                  <v-icon class="mr-2 icon">mdi-account</v-icon>
                  <span class="icon-name">Personal Information</span>
                </div>
              </v-list-item>
            </router-link>

            <router-link to="/ratings" class="text-decoration-none" style="color: inherit">
              <v-list-item
                class="icon-container"
                :class="{ 'active-icon': activeItem === '/ratings' }"
                @click="setActiveItem('/ratings')"
              >
                <div class="d-flex align-center pl-2">
                  <v-icon class="mr-2 icon">mdi-star</v-icon>
                  <span class="icon-name">Ratings</span>
                </div>
              </v-list-item>
            </router-link>

            <router-link to="/about" class="text-decoration-none" style="color: inherit">
              <v-list-item
                class="icon-container"
                :class="{ 'active-icon': activeItem === '/about' }"
                @click="setActiveItem('/about')"
              >
                <div class="d-flex align-center pl-2">
                  <v-icon class="mr-2 icon">mdi-information</v-icon>
                  <span class="icon-name">About App</span>
                </div>
              </v-list-item>
            </router-link>

            <router-link to="/" class="text-decoration-none" style="color: inherit">
              <v-list-item
                class="icon-container"
                :class="{ 'active-icon': activeItem === '/' }"
                @click="setActiveItem('/')"
              >
                <div class="d-flex align-center pl-2">
                  <v-icon class="mr-2 icon">mdi-logout</v-icon>
                  <span class="icon-name">Log Out</span>
                </div>
              </v-list-item>
            </router-link>
          </v-list>
        </v-col>

        <!-- Profile Section -->
        <v-col cols="12" md="9">
          <v-container class="profile-container">
            <v-row align="start" justify="space-between" class="profile-top" no-gutters>
              <!-- Left Personal Info -->
              <v-col cols="12" md="7" class="d-flex flex-column justify-start">
                <div>
                  <p class="section-title">Personal Information</p>
                  <br />

                  <h1 class="name">{{ name }}</h1>

                  <!-- BIO -->
                  <p class="bio">
                    I am Shieme Jay, a student of Caraga State University. I'm currently looking for
                    dormitories near the CSU Main Campus and Ampayon area to continue my academic
                    journey comfortably.
                  </p>

                  <!-- INFO -->
                  <div class="info-section">
                    <p><strong>Age:</strong> {{ age }}</p>
                    <p><strong>Email:</strong> {{ email }}</p>
                    <p><strong>Status:</strong> {{ status }}</p>
                  </div>
                </div>
              </v-col>

              <!-- Right Profile Image -->
              <v-col cols="12" md="5" class="d-flex align-start justify-center">
                <div class="image-wrapper">
                  <img src="/user1.png" alt="Profile Image" class="profile-img" />
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
/* Sidebar */
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
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
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

.icon-container:hover {
  background-color: rgba(255, 186, 0, 0.1);
  border-color: #ffba00;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

/* Active sidebar highlight */
.active-icon {
  background-color: rgba(255, 186, 0, 0.2);
  border-color: #ffba00;
}

/* Profile Layout */
.profile-container {
  overflow-x: hidden;
}

.profile-top {
  min-height: 70vh;
  padding-top: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #888;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.name {
  font-size: 48px;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 12px;
  color: #1b1b1b;
}

/* BIO Text */
.bio {
  font-size: 18px;
  margin-bottom: 20px;
  color: #555;
}

/* Info Section */
.info-section {
  font-size: 18px;
  color: #333;
}

.info-section p {
  margin: 6px 0;
}

/* Profile Image */
.profile-img {
  height: 560px;
  width: auto;
  object-fit: contain;
  align-self: flex-start;
  margin-top: 0;
}

.image-wrapper {
  margin-top: -50px;
}
</style>
