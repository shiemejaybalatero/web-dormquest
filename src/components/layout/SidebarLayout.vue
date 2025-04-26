<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const formActionDefault = {
  formProcess: false,
}

const props = defineProps({
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
  <v-list dense nav class="sidebar pt-7">
    <router-link
      v-for="link in links"
      :key="link.path"
      :to="link.path"
      class="text-decoration-none side-path"
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

    <v-btn
      prepend-icon="mdi-logout"
      variant="plain"
      class="ml-2 font-weight-bold text-body-1"
      @click="onLogout"
      :loading="formAction.formProcess"
      :disabled="formAction.formProcess"
    >
      Logout
    </v-btn>
  </v-list>
</template>

<style scoped>
.sidebar {
  min-height: 40vh;
  background: linear-gradient(360deg, #dbead3, #6d9773);
  border-radius: 10px;
  border: 1px solid #0c3b2e;
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
