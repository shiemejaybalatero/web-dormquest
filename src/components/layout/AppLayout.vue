<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showScrollTop = ref(false)
const mainContent = ref(null)
const drawer = ref(false)
const search = ref('')

const handleScroll = () => {
  if (!mainContent.value) return
  const scrollTop = mainContent.value.$el.scrollTop
  showScrollTop.value = scrollTop > 300
}

const scrollToTop = () => {
  if (mainContent.value) {
    mainContent.value.$el.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  if (mainContent.value) {
    mainContent.value.$el.addEventListener('scroll', handleScroll)
  }
})

onBeforeUnmount(() => {
  if (mainContent.value) {
    mainContent.value.$el.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item title="Dashboard" prepend-icon="mdi-view-dashboard" />
        <v-list-item title="Settings" prepend-icon="mdi-cog" />
        <v-list-item
          @click="toggleLogin"
          :title="isLoggedIn ? 'Logout' : 'Login'"
          prepend-icon="mdi-logout"
        />
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app flat class="gradient-app-bar">
      <router-link to="/dashboard" class="fw-bolder ml-6" style="text-decoration: none">
        <span class="ftext">DORM</span><span class="stext">QUEST</span>
      </router-link>

      <v-spacer />
      <v-img src="/23.png" alt="Logo" max-width="50" class="mr-6" />
    </v-app-bar>

    <v-main ref="mainContent" style="overflow-y: auto; height: 100vh">
      <div class="gradient-bg">
        <v-container>
          <!-- Search & Buttons -->
          <div class="d-flex align-center search-wrapper mb-4">
            <v-text-field
              v-model="search"
              placeholder="Search for dormitories or boarding house..."
              prepend-inner-icon="mdi-magnify"
              class="search-field"
              variant="outlined"
              rounded
              hide-details
              clearable
              density="comfortable"
            />

            <v-btn v-if="showScrollTop" icon class="scroll-top-btn" @click="scrollToTop">
              <v-icon>mdi-arrow-up</v-icon>
            </v-btn>

            <v-btn icon class="mx-1 green-btn">
              <v-icon>mdi-home-outline</v-icon>
            </v-btn>
            <v-btn icon class="mx-1">
              <v-icon>mdi-map-marker-outline</v-icon>
            </v-btn>
            <v-btn icon class="mx-1">
              <v-icon>mdi-account-circle-outline</v-icon>
            </v-btn>
            <v-app-bar-nav-icon @click="drawer = !drawer" />
          </div>

          <hr class="search-divider" />
          <v-row> <slot name="content"></slot> </v-row>
        </v-container>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.ftext {
  color: #ffba00;
  font-size: larger;
}

.stext {
  color: #0c3b2e;
  font-size: larger;
}

.gradient-bg {
  background: linear-gradient(290deg, #6d9773, #fffae6);
  min-height: 100vh;
  padding: 1rem;
}

.gradient-app-bar {
  background: linear-gradient(290deg, #fffae6, #6d9773);
  color: #000;
}

.search-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.search-field {
  flex: 2;
  max-width: 500px;
}

.search-divider {
  border: none;
  border-top: 1px solid #727070;
  margin: 10px 0 30px;
}

.scroll-top-btn {
  position: fixed;
  bottom: 30px;
  right: 20px;
  background-color: #0c3b2e;
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.icon-color {
  color: #0c3b2e;
}

.filter-row {
  display: flex;
  gap: 16px;
  flex-wrap: nowrap;
}

@media (max-width: 600px) {
  .filter-row {
    flex-direction: row;
  }

  .filter-row > .v-col {
    flex: 1 1 0;
  }
}
</style>
