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
    image: 'Amplayo/amplayomain.png',
    route: { name: 'amplayoboardinghousedetails' },
  },
  {
    name: 'Blue Heavens Dorm',
    address: '2.5 km away from CSU',
    availability: '900 php/month',
    image: 'BlueHeaven/bluemain.png',
    route: { name: 'blueboardinghousedetails' },
  },
  {
    name: 'Blissful Dormitory',
    address: '5.5 km away from CSU',
    availability: '1,000 php/month',
    image: 'Blissful/blissfulmain.png',
    route: { name: 'blissfulboardinghousedetails' },
  },
  {
    name: 'Licayan Boarding House',
    address: '3.2 km away from CSU',
    availability: '1,000 php/month',
    image: 'Licayan/licayanmain.png',
    route: { name: 'licayanboardinghousedetails' },
  },
  {
    name: 'Chelsea Boarding House',
    address: '3.2 km away from CSU',
    availability: '1,000 php/month',
    image: 'Chelsea/chelseamain.jpg',
    route: { name: 'chelseaboardinghousedetails' },
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
    image: 'Magdura/magduramain.png',
    route: { name: 'magduraboardinghousedetails' },
  },
  {
    name: 'Karmo Boarding House',
    address: '6.2 km away from CSU',
    availability: '1,500 php/month',
    image: 'Karmo/karmomain.jpg',
    route: { name: 'karmoboardinghousedetails' },
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
      <!-- Logo for large screens -->
      <router-link to="/dashboard" class="ml-6 Logoname d-none d-lg-block">
        <span class="ftext ms-10 font-weight-bold">DORM</span>
        <span class="stext font-weight-bold">QUEST</span>
      </router-link>

      <!-- Logo for mobile/small screens -->
      <router-link to="/dashboard" class="ml-4 d-flex align-center d-lg-none text-decoration-none">
        <span class="ftext font-weight-bold text-subtitle-3">DORM</span>
        <span class="stext font-weight-bold text-subtitle-3 ms-1">QUEST</span>
      </router-link>

      <v-spacer />
      <v-img src="/23.png" alt="Logo" max-width="50" class="mr-6 logo1 me-15 d-none d-lg-block" />
      <v-img src="/23.png" alt="Logo" max-width="50" class="mr-6 logo1 d-block d-lg-none" />
    </v-app-bar>

    <v-main>
      <div class="gradient-bg">
        <v-container>
          <div class="d-flex align-center search-wrapper mb-4">
            <v-text-field
              v-model="search"
              placeholder="Search for dormitories or boarding house"
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
            <v-col
              v-for="(dorm, index) in filteringDorms"
              :key="index"
              cols="12"
              sm="6"
              md="4 pa-4"
            >
              <component
                :is="dorm.route ? 'router-link' : 'div'"
                :to="dorm.route"
                style="text-decoration: none"
              >
                <v-card class="hover-card dorm-card" elevation="2">
                  <v-img :src="dorm.image" height="200px" cover />

                  <v-card-text>
                    <div class="d-flex justify-space-between align-center mb-2">
                      <span class="text-body-1 font-weight-medium dorm-title">{{ dorm.name }}</span>
                      <div class="d-flex align-center">
                        <v-icon color="amber" size="18">mdi-star</v-icon>
                        <span class="ml-1 text-body-2">{{ dorm.rating }}</span>
                      </div>
                    </div>
                    <div class="text-subtitle-2 text-grey dorm-subtitle">
                      {{ dorm.availability }}
                    </div>
                    <div class="text-body-2 text-grey dorm-text">{{ dorm.address }}</div>
                  </v-card-text>
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
  background-image: url('/public/bg-admin.jpg');
  height: 100vh;
  padding: 1rem;
  overflow-y: auto; /* allow scrolling */
}

.gradient-app-bar {
  background: linear-gradient(290deg, #fffae6, #6d9773);
  color: #000;
}

.gradient-app-bar .ftext,
.stext {
  font-size: 30px;
}

.Logoname {
  text-decoration: none;
}

.Logoname2 {
  font-size: 12px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.search-wrapper .v-btn:hover {
  background-color: rgba(0, 128, 0, 0.1); /* Light green background */
  transform: scale(1.1);
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.search-wrapper .v-btn:hover .v-icon {
  color: #2e7d32; /* Green icon on hover */
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

.hover-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    filter 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  filter: brightness(1.05);
}

.dorm-card {
  background-color: #f5fdf8; /* soft green background */
  color: #0c3b2e; /* dark green for text */
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border-radius: 16px;
}

.dorm-title {
  font-weight: 600;
  color: #1b4332;
  font-family: 'Nunito', sans-serif;
  font-size: 20px !important;
}

.dorm-subtitle {
  color: #4d5106;
  font-size: 18px !important;
  font-weight: 500;
  font-family: 'Nunito', sans-serif;
}

.dorm-text {
  color: #4e4a50 !important;
  font-size: 13px;
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
