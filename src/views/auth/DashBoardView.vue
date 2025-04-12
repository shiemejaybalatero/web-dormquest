<script setup>
import { ref } from 'vue'
</script>

<template>
  <v-app>
    <v-responsive class="border rounded" max-height="300">
      <v-app-bar class="px-3">
        <div class="d-flex align-center">
          <!-- Logo on the left -->

          <!-- DORMQUEST Text -->
          <span class="fw-bolder">
            <span class="ftext">DORM</span><span class="stext">QUEST</span>
          </span>
        </div>

        <!-- Spacer pushes the toggle button to the right -->
        <v-spacer />
        <v-img src="/23.png" alt="Logo" max-width="40" class="mr-2" />

        <!-- You can add buttons or icons here if needed -->
      </v-app-bar>

      <v-main>
        <v-container>
          <h1>Main Content</h1>
        </v-container>
      </v-main>
    </v-responsive>
  </v-app>
</template>

<style scoped>
.ftext {
  color: #ffba00;
}

.stext {
  color: #0c3b2e;
}
</style>
