<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const formActionDefault = {
  formProcess: false,
}

defineProps({
  links: {
    type: Array,
    required: true,
  },
})

const route = useRoute()
const router = useRouter()
const formAction = ref({ ...formActionDefault })

const onLogout = async () => {
  formAction.value = { ...formActionDefault, formProcess: true }

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error during logout:', error)
    return
  }

  formAction.value.formProcess = false
  router.replace('/')
}
</script>

<template>
  <v-list dense nav class="sidebar pa-4">
    <router-link
      v-for="link in links"
      :key="link.path"
      :to="link.path"
      class="text-decoration-none side-path"
    >
      <v-list-item :class="{ selected: route.path === link.path }" class="mb-2">
        <div class="d-flex align-center pl-2">
          <v-icon :color="route.path === link.path ? '#ffffff' : '#ffffff'" class="mr-2">
            {{ link.icon }}
          </v-icon>
          <span class="font-weight text-body-1 text-white">{{ link.title }}</span>
        </div>
      </v-list-item>
    </router-link>

    <!-- Logout as list item -->
    <v-list-item
      class="mt-3 mb-2 cursor-pointer"
      @click="onLogout"
      :disabled="formAction.formProcess"
    >
      <div class="d-flex align-center pl-2">
        <v-icon class="mr-2" :color="'#ffffff'"> mdi-logout </v-icon>
        <span class="font-weight text-body-1 text-white">Log out</span>
      </div>
    </v-list-item>
  </v-list>
</template>

<style scoped>
.sidebar {
  min-height: 40vh;
  background: #0c3b2e;
  border-radius: 16px;
}

.side-path {
  color: inherit;
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
