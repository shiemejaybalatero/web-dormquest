<template>
  <v-col cols="12" md="3">
    <v-list dense nav class="sidebar pa-4">
      <div class="d-flex align-center pl-2 mt-3 mb-5">
        <v-icon color="#0c3b2e" class="mr-2"> mdi-account </v-icon>
        <span class="font-weight-bold text-body-1">Personal Information</span>
      </div>

      <router-link to="/system/ratings" class="text-decoration-none" style="color: inherit">
        <v-list-item :class="{ selected: route.path === '/system/ratings' }" class="mb-2">
          <div class="d-flex align-center pl-2">
            <v-icon :color="route.path === '/system/ratings' ? '#0c3b2e' : ''" class="mr-2">
              mdi-star
            </v-icon>
            <span class="font-weight-bold text-body-1"> Ratings </span>
          </div>
        </v-list-item>
      </router-link>

      <router-link to=".system/about" class="text-decoration-none" style="color: inherit">
        <v-list-item :class="{ selected: route.path === '/system/about' }" class="mb-2">
          <div class="d-flex align-center pl-2">
            <v-icon :color="route.path === '/system/about' ? '#0c3b2e' : ''" class="mr-2">
              mdi-information
            </v-icon>
            <span class="font-weight-bold text-body-1"> About app </span>
          </div>
        </v-list-item>
      </router-link>

      <router-link to="/" class="text-decoration-none" style="color: inherit">
        <v-list-item :class="{ selected: route.path === '/' }" class="mb-2">
          <div class="d-flex align-center pl-2">
            <v-icon :color="route.path === '/' ? '#0c3b2e' : ''" class="mr-2"> mdi-logout </v-icon>
            <span class="font-weight-bold text-body-1"> Log out </span>
          </div>
        </v-list-item>
      </router-link>
    </v-list>
  </v-col>
</template>
