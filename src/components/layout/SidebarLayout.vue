<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDarkMode = computed(() => theme.global.name.value === 'dark')

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
  <v-list
    dense
    nav
    class="sidebar pa-4 ma-0"
    :class="{ 'sidebar-dark': isDarkMode, 'sidebar-light': !isDarkMode }"
  >
    <router-link
      v-for="link in links"
      :key="link.path"
      :to="link.path"
      class="text-decoration-none side-path"
    >
      <v-list-item
        :class="{
          selected: route.path === link.path,
          'selected-dark': isDarkMode && route.path === link.path,
          'selected-light': !isDarkMode && route.path === link.path,
        }"
        class="mb-2"
      >
        <div class="d-flex align-center pl-2">
          <v-icon
            :color="isDarkMode ? '#ffffff' : route.path === link.path ? '#0c3b2e' : '#000000'"
            class="mr-2"
          >
            {{ link.icon }}
          </v-icon>
          <span
            class="font-weight text-body-1"
            :class="{
              'text-white': isDarkMode,
              'text-dark-green': !isDarkMode && route.path === link.path,
              'text-black': !isDarkMode && route.path !== link.path,
            }"
          >
            {{ link.title }}
          </span>
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
        <v-icon class="mr-2" :color="isDarkMode ? '#ffffff' : '#000000'"> mdi-logout </v-icon>
        <span class="font-weight text-body-1" :class="isDarkMode ? 'text-white' : 'text-black'">
          Log out
        </span>
      </div>
    </v-list-item>
  </v-list>
</template>

<style scoped>
/* Light Mode Styles */
.sidebar-light {
  background: white;
  border-radius: 16px;
  min-height: 65vh;
}

.selected-light {
  background-color: #ffba00 !important;
  border-radius: 20px;
  color: #0c3b2e;
}

/* Dark Mode Styles */
.sidebar-dark {
  background: #0a2e23;
  border-radius: 16px;
  min-height: 65vh;
}

.selected-dark {
  background-color: #ffba00 !important;
  border-radius: 20px;
  color: #0c3b2e;
}

/* Common Styles */
.side-path {
  color: inherit;
}

.selected {
  border-radius: 20px;
}

.cursor-pointer {
  cursor: pointer;
}

.text-dark-green {
  color: #0c3b2e;
}

.text-white {
  color: white;
}

.sidebar {
  position: sticky;
  top: 20px;
  align-self: flex-start;
  border-radius: 16px;
  padding: 16px;
  box-sizing: border-box;
}
</style>
