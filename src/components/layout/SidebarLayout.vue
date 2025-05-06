<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useTheme, useDisplay } from 'vuetify'

const theme = useTheme()
const display = useDisplay()
const isDarkMode = computed(() => theme.global.name.value === 'dark')
const isMobile = computed(() => display.smAndDown.value)

const formActionDefault = { formProcess: false }

defineProps({
  links: {
    type: Array,
    required: true,
  },
})

const route = useRoute()
const router = useRouter()
const formAction = ref({ ...formActionDefault })

const drawer = defineModel('drawer')

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
  <!-- Toggle Button (Mobile only) WALA NA NI
  <div v-if="isMobile" class="text-right mb-2 pr-4">
    <v-btn icon @click="drawer = true" color="white" variant="text">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </div>
  -->

  <!-- Mobile Sidebar Drawer -->
  <v-navigation-drawer
    v-if="isMobile"
    v-model="drawer"
    location="right"
    temporary
    width="240"
    :class="{ 'sidebar-dark': isDarkMode, 'sidebar-light': !isDarkMode }"
  >
    <v-list dense nav>
      <router-link
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="text-decoration-none"
        @click="drawer = false"
      >
        <v-list-item
          :class="{
            selected: route.path === link.path,
            'selected-dark': isDarkMode && route.path === link.path,
            'selected-light': !isDarkMode && route.path === link.path,
          }"
          class="mb-2"
        >
          <v-icon class="mr-2" :color="route.path === link.path ? '#0c3b2e' : '#ffffff'">
            {{ link.icon }}
          </v-icon>
          <span
            class="font-weight text-body-1"
            :class="{
              'text-dark-green': route.path === link.path,
              'text-white': route.path !== link.path,
            }"
          >
            {{ link.title }}
          </span>
        </v-list-item>
      </router-link>

      <v-list-item @click="onLogout" class="cursor-pointer mt-4" :disabled="formAction.formProcess">
        <v-icon class="mr-2" color="white">mdi-logout</v-icon>
        <span class="text-body-1 text-white">Log out</span>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- Desktop Sidebar (unchanged) -->
  <v-list
    v-else
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
          <v-icon class="mr-2" :color="route.path === link.path ? '#0c3b2e' : '#ffffff'">
            {{ link.icon }}
          </v-icon>
          <span
            class="font-weight text-body-1"
            :class="{
              'text-dark-green': route.path === link.path,
              'text-white': route.path !== link.path,
            }"
          >
            {{ link.title }}
          </span>
        </div>
      </v-list-item>
    </router-link>

    <v-list-item
      class="mt-3 mb-2 cursor-pointer"
      @click="onLogout"
      :disabled="formAction.formProcess"
    >
      <div class="d-flex align-center pl-2">
        <v-icon class="mr-2" color="#ffffff">mdi-logout</v-icon>
        <span class="font-weight text-body-1 text-white">Log out</span>
      </div>
    </v-list-item>
  </v-list>
</template>

<style scoped>
.sidebar-light {
  background: #0c3b2e;
  border-radius: 16px;
  min-height: 45vh;
}

.sidebar-dark {
  background: #0a2e23;
  border-radius: 16px;
}

.selected-light,
.selected-dark {
  background-color: #ffba00 !important;
  border-radius: 20px;
  color: #0c3b2e;
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
</style>
