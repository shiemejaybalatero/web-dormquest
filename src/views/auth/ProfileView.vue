<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <template #content>
      <v-card class="pa-6" elevation="2" style="border-radius: 20px">
        <h4 class="text-subtitle-1 font-weight-bold mb-4">Account Settings</h4>

        <div class="d-flex flex-column align-center mb-6">
          <v-avatar size="120">
            <img src="/23.png" alt="Profile" />
          </v-avatar>
          <h3 class="mt-4 font-weight-bold">SHIEME JAY G. BALATERO</h3>
          <v-btn class="mt-2" color="#0c3b2e" size="small" variant="tonal">Change</v-btn>
        </div>

        <v-list density="comfortable">
          <v-list-item>
            <v-list-item-title class="text-primary font-weight-medium"
              >&gt; Personal Information</v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-primary font-weight-medium"
              >&gt; Ratings</v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-primary font-weight-medium"
              >&gt; About app</v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-primary font-weight-medium"
              >&gt; Log out</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-card>
    </template>
  </AppLayout>
</template>

<style scoped>
.text-primary {
  color: #0c3b2e;
}
</style>
