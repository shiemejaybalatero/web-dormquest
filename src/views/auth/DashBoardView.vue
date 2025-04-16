<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showScrollTop = ref(false)
const drawer = ref(false)
const search = ref('')
const selectedPriceRange = ref(null)
const selectedDistanceRange = ref(null)

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const priceRanges = [
  { label: '₱500 - ₱1,000', min: 500, max: 1000 },
  { label: '₱1,001 - ₱2,000', min: 1001, max: 2000 },
  { label: '₱3,000 - ₱4,000', min: 3000, max: 4000 },
  { label: '₱5,000 and up', min: 5000, max: Infinity },
]

const distanceRanges = [
  { label: '0 - 1 km', min: 0, max: 1 },
  { label: '2 - 5 km', min: 2, max: 5 },
  { label: '5 km and up', min: 6, max: Infinity },
]

const dorms = ref([
  {
    name: 'Ampalayo Boarding House',
    address: '0.5 km away from CSU',
    availability: '1,500 php/month',
    image: '/dorm1.jpg',
    route: { name: 'amplayoboardinghousedetails' },
  },
  {
    name: 'Blue Heavens Dorm',
    address: '2.5 km away from CSU',
    availability: '900 php/month',
    image: '/dorm2.jpg',
  },
  {
    name: 'Blissful Dormitory',
    address: '5.5 km away from CSU',
    availability: '1,000 php/month',
    image: '/dorm3.jpg',
  },
  {
    name: 'Licayan Boarding House',
    address: '3.2 km away from CSU',
    availability: '1,000 php/month',
    image: '/dorm3.jpg',
  },
  {
    name: 'Chelsea Boarding House',
    address: '3.2 km away from CSU',
    availability: '1,000 php/month',
    image: '/dorm3.jpg',
  },
  {
    name: 'TGBG Boarding House',
    address: '7 km away from CSU',
    availability: '7,000 php/month',
    image: '/TGBG/tgbgmain.png',
    route: { name: 'tgbgboardinghousedetails' },
  },
  {
    name: 'Magdura Boarding House',
    address: '0.9 km away from CSU',
    availability: '1,500 php/month',
    image: '/dorm3.jpg',
  },
  {
    name: 'Karmo Boarding House',
    address: '6.2 km away from CSU',
    availability: '1,500 php/month',
    image: '/dorm3.jpg',
  },
])

const filteringDorms = computed(() => {
  return dorms.value.filter((d) => {
    const nameMatch = d.name.toLowerCase().includes(search.value.toLowerCase())

    const price = parseInt(d.availability.replace(/[^\d]/g, ''))
    const priceMatch =
      !selectedPriceRange.value ||
      (price >= selectedPriceRange.value.min && price <= selectedPriceRange.value.max)

    const distance = parseFloat(d.address.match(/[\d.]+/g)?.[0])
    const distanceMatch =
      !selectedDistanceRange.value ||
      (distance >= selectedDistanceRange.value.min && distance <= selectedDistanceRange.value.max)

    return nameMatch && priceMatch && distanceMatch
  })
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

    <v-main>
      <div class="gradient-bg">
        <v-container>
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

            <router-link to="/dashboard">
              <v-btn icon class="mx-1" :class="{ 'green-btn': route.path === '/dashboard' }">
                <v-icon>mdi-home-outline</v-icon>
              </v-btn>
            </router-link>

            <router-link to="/map">
              <v-btn icon class="mx-1" :class="{ 'green-btn': route.path === '/map' }">
                <v-icon>mdi-map-marker-outline</v-icon>
              </v-btn>
            </router-link>

            <router-link to="/profile">
              <v-btn icon class="mx-1" :class="{ 'green-btn': route.path === '/profile' }">
                <v-icon>mdi-account-circle-outline</v-icon>
              </v-btn>
            </router-link>

            <v-app-bar-nav-icon @click="drawer = !drawer" />
          </div>

          <hr class="search-divider" />

          <!-- Filters -->
          <div class="filter-row mt-n2 mb-n5">
            <v-col cols="6">
              <v-select
                v-model="selectedPriceRange"
                :items="priceRanges"
                item-title="label"
                item-value="value"
                label="Select Price Range"
                return-object
                prepend-inner-icon="mdi-currency-php"
                class="icon-color"
                clearable
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="selectedDistanceRange"
                :items="distanceRanges"
                item-title="label"
                item-value="value"
                label="Select Distance Range"
                return-object
                prepend-inner-icon="mdi-map-marker-distance"
                class="icon-color"
                clearable
              />
            </v-col>
          </div>

          <v-row>
            <v-col v-for="(dorm, index) in filteringDorms" :key="index" cols="12" sm="6" md="4">
              <component
                :is="dorm.route ? 'router-link' : 'div'"
                :to="dorm.route"
                style="text-decoration: none"
              >
                <v-card hover>
                  <v-img :src="dorm.image" height="160px" cover />
                  <v-card-title>{{ dorm.name }}</v-card-title>
                  <v-card-subtitle>{{ dorm.availability }}</v-card-subtitle>
                  <v-card-text class="text-grey">{{ dorm.address }}</v-card-text>
                </v-card>
              </component>
            </v-col>
          </v-row>
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
.green-btn {
  background-color: #0c3b2e;
  color: white;
}

.filter-row {
  display: flex;
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
