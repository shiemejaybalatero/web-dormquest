<script setup>
import { ref } from 'vue'
</script>

<template>
  <v-app>
    <v-container
      fluid
      class="background d-flex justify-content-center align-items-center flex-column"
    >
      <v-row class="text-center ms-0 mb-0">
        <v-col cols="12" md="6">
          <img src="/public/23.png" alt="Logo" width="175px" height="175px" class="logo" />
        </v-col>
        <v-col cols="12">
          <h1 class="text-black text-center fs-2 fs-md-1">
            <b
              >Are you a CSU student on a quest <br />
              for the perfect place to stay?</b
            ><br />
            This app makes your quest quick and easy!
          </h1>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>
.background {
  position: fixed;
  width: 100%;
  height: 100%;
  background: url('/public/landing1.jpg') no-repeat center;
  background-size: cover;
  background-attachment: fixed;
}
.background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(220, 226, 219, 0.3); /* Adjust transparency here */
}

.logo {
  margin-top: 0;
  position: absolute;
  top: 70px;
  left: 49.2%;
  transform: translateX(-50%);
}
</style>
