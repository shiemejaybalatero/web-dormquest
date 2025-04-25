<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <v-list dense nav class="sidebar pa-4">
    <!-- Personal Information -->
    <router-link to="/profile" style="text-decoration: none; color: inherit">
      <v-list-item :class="{ selected: route.path === '/profile' }" class="mt-3 mb-2">
        <div class="d-flex align-center pl-2">
          <v-icon :color="route.path === '/profile' ? '#0c3b2e' : ''" class="mr-2">
            mdi-account
          </v-icon>
          <span class="font-weight-bold text-body-1">Personal Information</span>
        </div>
      </v-list-item>
    </router-link>

    <!-- Ratings -->
    <router-link to="/ratings" style="text-decoration: none; color: inherit">
      <v-list-item :class="{ selected: route.path === '/ratings' }" class="mb-2">
        <div class="d-flex align-center pl-2">
          <v-icon :color="route.path === '/ratings' ? '#0c3b2e' : ''" class="mr-2">
            mdi-star
          </v-icon>
          <span class="font-weight-bold text-body-1">Ratings</span>
        </div>
      </v-list-item>
    </router-link>

    <!-- About App -->
    <router-link to="/about" style="text-decoration: none; color: inherit">
      <v-list-item :class="{ selected: route.path === '/about' }" class="mb-2">
        <div class="d-flex align-center pl-2">
          <v-icon :color="route.path === '/about' ? '#0c3b2e' : ''" class="mr-2">
            mdi-information
          </v-icon>
          <span class="font-weight-bold text-body-1">About app</span>
        </div>
      </v-list-item>
    </router-link>

    <!-- Log out -->
    <router-link to="/" style="text-decoration: none; color: inherit">
      <v-list-item :class="{ selected: route.path === '/' }" class="mb-2">
        <div class="d-flex align-center pl-2">
          <v-icon :color="route.path === '/' ? '#0c3b2e' : ''" class="mr-2"> mdi-logout </v-icon>
          <span class="font-weight-bold text-body-1">Log out</span>
        </div>
      </v-list-item>
    </router-link>
  </v-list>
</template>

<style scoped>
.sidebar {
  min-height: 40vh;
  background: linear-gradient(180deg, #dbead3, #6d9773);
  border-radius: 16px;
}

.selected {
  background-color: #ffba00 !important;
  border-radius: 50px;
  color: #0c3b2e;
}
</style>
