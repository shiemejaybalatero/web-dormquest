<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const props = defineProps({
  links: {
    type: Array,
    required: true,
    // Example structure: [{ title: 'Profile', icon: 'mdi-account', path: '/profile' }]
  },
})

const route = useRoute()
const router = useRouter()

const onLogout = async () => {
  try {
    // You can remove the comment if you handle supabase or any auth system
    // await supabase.auth.signOut()
    router.replace('/')
  } catch (error) {
    console.error('Error during logout:', error)
  }
}
</script>

<template>
  <v-list dense nav class="sidebar pa-4">
    <router-link
      v-for="link in links"
      :key="link.path"
      :to="link.path"
      class="text-decoration-none"
      style="color: inherit"
    >
      <v-list-item :class="{ selected: route.path === link.path }" class="mb-2">
        <div class="d-flex align-center pl-2">
          <v-icon :color="route.path === link.path ? '#0c3b2e' : ''" class="mr-2">
            {{ link.icon }}
          </v-icon>
          <span class="font-weight-bold text-body-1">{{ link.title }}</span>
        </div>
      </v-list-item>
    </router-link>

    <v-list-item @click="onLogout" class="mb-2 cursor-pointer">
      <div class="d-flex align-center pl-2">
        <v-icon class="mr-2">mdi-logout</v-icon>
        <span class="font-weight-bold text-body-1">Log Out</span>
      </div>
    </v-list-item>
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
  border-radius: 20px;
  color: #0c3b2e;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
