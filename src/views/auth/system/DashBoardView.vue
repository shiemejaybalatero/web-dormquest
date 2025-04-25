<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, computed } from 'vue'

const search = ref('')
const selectedPriceRange = ref(null)
const selectedDistanceRange = ref(null)

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
    rating: 4.3,
  },
  {
    name: 'Blue Heavens Dorm',
    address: '2.5 km away from CSU',
    availability: '900 php/month',
    image: 'BlueHeaven/bluemain.png',
    route: { name: 'blueboardinghousedetails' },
    rating: 4.1,
  },
  {
    name: 'Blissful Dormitory',
    address: '5.5 km away from CSU',
    availability: '1,000 php/month',
    image: 'Blissful/blissfulmain.png',
    route: { name: 'blissfulboardinghousedetails' },
    rating: 3.9,
  },
  {
    name: 'Licayan Boarding House',
    address: '3.2 km away from CSU',
    availability: '1,000 php/month',
    image: 'Licayan/licayanmain.png',
    route: { name: 'licayanboardinghousedetails' },
    rating: 4.0,
  },
  {
    name: 'Chelsea Boarding House',
    address: '3.2 km away from CSU',
    availability: '1,000 php/month',
    image: 'Chelsea/chelseamain.jpg',
    route: { name: 'chelseaboardinghousedetails' },
    rating: 4.5,
  },
  {
    name: 'TGBG Boarding House',
    address: '7 km away from CSU',
    availability: '7,000 php/month',
    image: '/TGBG/tgbgmain.png',
    route: { name: 'tgbgboardinghousedetails' },
    rating: 3.5,
  },
  {
    name: 'Magdura Boarding House',
    address: '0.9 km away from CSU',
    availability: '1,500 php/month',
    image: 'Magdura/magduramain.png',
    route: { name: 'magduraboardinghousedetails' },
    rating: 4.6,
  },
  {
    name: 'Karmo Boarding House',
    address: '6.2 km away from CSU',
    availability: '1,500 php/month',
    image: 'Karmo/karmomain.jpg',
    route: { name: 'karmoboardinghousedetails' },
    rating: 3.8,
  },
])

const filteringDorms = computed(() => {
  return dorms.value.filter((d) => {
    const nameMatch = d.name.toLowerCase().includes(search.value.toLowerCase())

    const cleanAvailability = d.availability.replace(/[^\d]/g, '')
    const price = parseInt(cleanAvailability)
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
  <AppLayout>
    <template #content>
      <!-- Filters -->
      <v-row class="filter-row mt-n2 mb-n5">
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
      </v-row>

      <v-row>
        <v-col
          v-for="(dorm, index) in filteringDorms"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          class="pa-4"
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
    </template>
  </AppLayout>
</template>

<style scoped>
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
  background-color: #f5fdf8;
  color: #0c3b2e;
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
</style>
