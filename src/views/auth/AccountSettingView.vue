<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const activeItem = ref('')

const setActiveItem = (item) => {
  activeItem.value = item
}
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container class="main-container" fluid>
        <v-row no-gutters>
          <v-col cols="12" md="3" class="sidebar-col">
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
                    <br />
                    <br />
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

              <router-link to="/accountsetting" class="text-decoration-none" style="color: inherit">
                <v-list-item
                  class="icon-container"
                  :class="{ 'active-icon': activeItem === '/accountsetting' }"
                  @click="setActiveItem('/accountsetting')"
                >
                  <div class="d-flex align-center pl-2">
                    <v-icon class="mr-2 icon">mdi-cog</v-icon>
                    <span class="icon-name">Account Settings</span>
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

          <!--profile-->
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
html,
body {
  overflow-x: hidden;
  width: 100%;
}

.v-application {
  overflow-x: hidden;
}

.sidebar-col {
  position: sticky;
  top: 80px;
  z-index: 10;
}

.sidebar {
  min-height: 50vh;
  background: transparent;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
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

.active-icon {
  background-color: rgba(255, 186, 0, 0.2);
  border-color: #ffba00;
}

.profile-container {
  overflow-x: hidden;
  max-width: 100%;
}

.profile-top {
  min-height: 70vh;
  padding-top: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #888;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.name {
  font-size: 40px;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 12px;
  color: #1b1b1b;
}

.bio {
  font-size: 18px;
  margin-bottom: 20px;
  color: #555;
}

.info-section {
  font-size: 18px;
  color: #333;
}

.info-section p {
  margin: 6px 0;
}

.profile-img {
  height: 560px;
  width: auto;
  object-fit: contain;
  align-self: flex-start;
  margin-top: 0;
}

.image-wrapper {
  margin-top: -75px;
  text-align: center;
}

@media (max-width: 1264px) {
  .profile-img {
    height: 400px;
  }
  .name {
    font-size: 36px;
  }
  .bio,
  .info-section {
    font-size: 16px;
  }
}

@media (max-width: 960px) {
  .sidebar-col {
    position: relative;
    top: 0;
  }
  .sidebar {
    flex-direction: column;
    align-items: center;
    padding: 10px 0;
  }
  .sidebar::after {
    display: none;
  }
  .icon-container {
    width: 100%;
    justify-content: center;
    margin-bottom: 10px;
  }
  .icon-name {
    opacity: 1;
    color: #0c3b2e;
    margin-left: 10px;
    font-weight: 600;
    font-size: 14px;
  }
  .icon {
    font-size: 22px;
    padding: 16px;
  }
  .profile-top {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .name {
    font-size: 32px;
  }
  .profile-img {
    height: 300px;
    margin-top: 20px;
  }
  .image-wrapper {
    margin-top: 0;
  }
}

@media (max-width: 600px) {
  .icon {
    font-size: 20px;
    padding: 12px;
  }
  .icon-name {
    font-size: 12px;
  }
  .profile-img {
    height: 250px;
  }
  .name {
    font-size: 28px;
  }
  .bio,
  .info-section {
    font-size: 14px;
  }
  .info-section p {
    margin: 4px 0;
  }
}
</style>
