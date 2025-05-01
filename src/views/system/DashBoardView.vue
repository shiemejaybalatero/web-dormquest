<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBoardingHouseStore } from '@/stores/boardingHouse'
import AppLayout from '@/components/layout/AppLayout.vue'
import { supabase } from '@/utils/supabase'

const router = useRouter()
const boardingHouseStore = useBoardingHouseStore()
const dormRatings = ref({})
const searchTerm = ref('')

// Dorm image carousel data
const dormImageMap = {
  1: {
    main: '/Amplayo/amplayomain.png',
    gallery: [
      '/Amplayo/amplayomain.png',
      '/Amplayo/amplayo.png',
      '/Amplayo/amplayo1.jpg',
      '/Amplayo/amplayo2.png',
      '/Amplayo/amplayo3.png',
    ],
  },
  2: {
    main: '/BlueHeaven/bluemain.png',
    gallery: [
      '/BlueHeaven/bluemain.png',
      '/BlueHeaven/blue.jpg',
      '/BlueHeaven/blue1.jpg',
      '/BlueHeaven/blue2.jpg',
    ],
  },
  3: {
    main: '/Blissful/blissfulmain.png',
    gallery: [
      '/Blissful/blissfulmain.png',
      '/Blissful/blissful.jpg',
      '/Blissful/blissful1.jpg',
      '/Blissful/blissful2.jpg',
    ],
  },
  4: {
    main: '/Licayan/licayanmain.png',
    gallery: [
      '/Licayan/licayanmain.png',
      '/Licayan/licayan.png',
      '/Licayan/licayan1.png',
      '/Licayan/licayan2.jpg',
      '/Licayan/licayan3.jpg',
    ],
  },
  5: {
    main: '/Chelsea/chelseamain.jpg',
    gallery: [
      '/Chelsea/chelseamain.jpg',
      '/Chelsea/chelsea.jpg',
      '/Chelsea/chelsea1.jpg',
      '/Chelsea/chelsea2.jpg',
      '/Chelsea/chelsea3.jpg',
    ],
  },
  6: {
    main: '/TGBG/tgbgmain.png',
    gallery: [
      '/TGBG/tgbgmain.png',
      '/TGBG/tgbg.png',
      '/TGBG/tgbg1.png',
      '/TGBG/tgbg2.png',
      '/TGBG/tgbg3.png',
    ],
  },
  7: {
    main: '/Magdura/magduramain.png',
    gallery: [
      '/Magdura/magduramain.png',
      '/Magdura/magdura.png',
      '/Magdura/magdura1.png',
      '/Magdura/magdura2.png',
      '/Magdura/magdura3.png',
    ],
  },
  8: {
    main: '/Karmo/karmomain.jpg',
    gallery: ['/Karmo/karmomain.jpg', '/Karmo/karmo.jpg', '/Karmo/karmo1.jpg', '/Karmo/karmo2.jpg'],
  },
}

// Carousel handling
const activeImageIndices = ref({})
const carouselIntervals = ref({})
const isHovering = ref({}) // Track hover state for each dorm

const startCarousel = (dormId) => {
  if (!activeImageIndices.value[dormId]) {
    activeImageIndices.value[dormId] = 0
  }

  isHovering.value[dormId] = true // Set hover state to true

  // Clear any existing interval
  if (carouselIntervals.value[dormId]) {
    clearInterval(carouselIntervals.value[dormId])
  }

  // Set new interval
  carouselIntervals.value[dormId] = setInterval(() => {
    if (dormImageMap[dormId]) {
      const galleryLength = dormImageMap[dormId].gallery.length
      activeImageIndices.value[dormId] = (activeImageIndices.value[dormId] + 1) % galleryLength
    }
  }, 1500)
}

const stopCarousel = (dormId) => {
  isHovering.value[dormId] = false // Set hover state to false

  if (carouselIntervals.value[dormId]) {
    clearInterval(carouselIntervals.value[dormId])
    delete carouselIntervals.value[dormId]
  }
}

const getActiveImage = (dorm) => {
  if (dormImageMap[dorm.id]) {
    if (activeImageIndices.value[dorm.id] === undefined) {
      activeImageIndices.value[dorm.id] = 0
    }
    return dormImageMap[dorm.id].gallery[activeImageIndices.value[dorm.id]]
  }
  return dorm.image || '/default-dorm-image.jpg'
}

// After - Updated to handle "Any" as a special case
const priceRanges = [
  { text: 'Any Price', value: 'any' },
  { text: '₱0 - ₱2,000', value: [0, 2000] },
  { text: '₱2,000 - ₱4,000', value: [2000, 4000] },
  { text: '₱4,000 - ₱6,000', value: [4000, 6000] },
  { text: '₱6,000 - ₱8,000', value: [6000, 8000] },
  { text: '₱8,000 - ₱10,000', value: [8000, 10000] },
]

const distanceRanges = [
  { text: 'Any Distance', value: 'any' },
  { text: '0 - 1km', value: [0, 1] },
  { text: '1 - 2km', value: [1, 2] },
  { text: '2 - 3km', value: [2, 3] },
  { text: '3 - 5km', value: [3, 5] },
  { text: '5 - 10km', value: [5, 10] },
]

// Selected values (default to "Any")
const selectedPriceRange = ref(priceRanges[0].value)
const selectedDistanceRange = ref(distanceRanges[0].value)

// Updated search handler that properly handles empty search input
const handleSearch = (value) => {
  // Check if value is null, undefined, or empty string
  if (value === null || value === undefined || value === '') {
    searchTerm.value = '' // Reset search term when cleared
  } else {
    searchTerm.value = value.toLowerCase()
  }
}

const filteredDorms = computed(() => {
  return boardingHouseStore.boardingHouses.filter((dorm) => {
    const priceOk =
      selectedPriceRange.value === 'any' ||
      (dorm.price >= selectedPriceRange.value[0] && dorm.price <= selectedPriceRange.value[1])

    const distanceOk =
      selectedDistanceRange.value === 'any' ||
      (dorm.distance_to_campus !== undefined &&
        dorm.distance_to_campus >= selectedDistanceRange.value[0] &&
        dorm.distance_to_campus <= selectedDistanceRange.value[1])

    const searchOk =
      searchTerm.value === '' ||
      dorm.name.toLowerCase().includes(searchTerm.value) ||
      dorm.address.toLowerCase().includes(searchTerm.value)

    return priceOk && distanceOk && searchOk
  })
})

const navigateToDorm = (dorm) => {
  router.push({ name: 'dorm-details', params: { id: dorm.id } })
}

const fetchAllRatings = async () => {
  try {
    const { data, error } = await supabase.from('ratings').select('dormitory_id, rating_score')

    if (error) {
      console.error('Failed to fetch ratings:', error)
      return
    }

    const ratingsByDorm = {}

    if (data && data.length) {
      data.forEach((rating) => {
        const dormId = rating.dormitory_id

        if (!ratingsByDorm[dormId]) {
          ratingsByDorm[dormId] = {
            scores: [],
            average: 0,
            count: 0,
          }
        }

        ratingsByDorm[dormId].scores.push(rating.rating_score)
      })

      Object.keys(ratingsByDorm).forEach((dormId) => {
        const scores = ratingsByDorm[dormId].scores
        const sum = scores.reduce((acc, score) => acc + score, 0)
        ratingsByDorm[dormId].average = sum / scores.length
        ratingsByDorm[dormId].count = scores.length
      })
    }

    dormRatings.value = ratingsByDorm
  } catch (err) {
    console.error('Error in fetchAllRatings:', err)
  }
}

const getDormRating = (dormId) => {
  const dormRating = dormRatings.value[dormId]

  if (dormRating && dormRating.count > 0) {
    return {
      average: dormRating.average.toFixed(1),
      count: dormRating.count,
      hasRating: true,
    }
  }

  return {
    average: '0.0',
    count: 0,
    hasRating: false,
  }
}

onMounted(async () => {
  try {
    await boardingHouseStore.fetchBoardingHouses()
    await fetchAllRatings()
  } catch (err) {
    console.error('Error during component initialization:', err)
  }
})
</script>

<template>
  <AppLayout @search="handleSearch">
    <template #content>
      <v-container fluid>
        <v-row v-if="boardingHouseStore.loading">
          <v-col class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <div class="mt-2">Loading dormitories...</div>
          </v-col>
        </v-row>

        <v-alert v-if="boardingHouseStore.errorMessage" type="error" class="mt-4">
          {{ boardingHouseStore.errorMessage }}
        </v-alert>

        <v-row>
          <v-col cols="6" xs="6" sm="6">
            <v-select
              v-model="selectedPriceRange"
              :items="priceRanges"
              item-title="text"
              item-value="value"
              label="Price Range"
              variant="outlined"
              class="mt-4"
              density="comfortable"
            ></v-select>
          </v-col>
          <v-col cols="6" xs="6" sm="6">
            <v-select
              v-model="selectedDistanceRange"
              :items="distanceRanges"
              item-title="text"
              item-value="value"
              label="Distance Range"
              variant="outlined"
              class="mt-4"
              density="comfortable"
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="(dorm, index) in filteredDorms"
            :key="dorm.id || index"
            cols="12"
            sm="6"
            md="4"
            class="pa-4"
          >
            <v-card
              class="hover-card dorm-card"
              :class="{ 'light-card-darkmode': isDarkMode }"
              elevation="2"
              @click="navigateToDorm(dorm)"
              style="cursor: pointer"
            >
              <div
                class="image-container"
                @mouseenter="dormImageMap[dorm.id] && startCarousel(dorm.id)"
                @mouseleave="stopCarousel(dorm.id)"
              >
                <v-img
                  :src="
                    dormImageMap[dorm.id]
                      ? getActiveImage(dorm)
                      : dorm.image || '/default-dorm-image.jpg'
                  "
                  class="responsive-img"
                  cover
                  :alt="dorm.name"
                >
                  <template v-if="dormImageMap[dorm.id]">
                    <div class="carousel-indicator" :class="{ visible: isHovering[dorm.id] }">
                      <span
                        v-for="(_, i) in dormImageMap[dorm.id].gallery"
                        :key="i"
                        class="dot"
                        :class="{ active: activeImageIndices[dorm.id] === i }"
                      ></span>
                    </div>
                  </template>
                </v-img>
              </div>
              <v-card-text>
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-1 font-weight-medium dorm-title">{{ dorm.name }}</span>
                  <div class="d-flex align-center">
                    <v-icon color="amber" size="18">mdi-star</v-icon>
                    <span class="ml-1 text-body-2">
                      <template v-if="getDormRating(dorm.id).hasRating">
                        {{ getDormRating(dorm.id).average }}
                        <span class="text-caption"> ({{ getDormRating(dorm.id).count }}) </span>
                      </template>
                      <template v-else>
                        <span class="text-caption">No ratings</span>
                      </template>
                    </span>
                  </div>
                </div>
                <div class="text-subtitle-2 dorm-subtitle">
                  {{ dorm.availability }}
                </div>
                <div class="text-body-2 dorm-text">{{ dorm.distance_to_campus }} km to campus</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="!boardingHouseStore.loading && filteredDorms.length === 0">
          <v-col class="text-center">
            <v-alert type="info"> No dormitories found matching your filters. </v-alert>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
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
  background-color: #0d3a2e;
  color: #f8f8e1;
  border-radius: 16px;
  overflow: hidden;
}

.light-card-darkmode {
  background-color: #fbfbfb !important;
  color: #000000 !important;
}

.light-card-darkmode .dorm-title,
.light-card-darkmode .dorm-subtitle,
.light-card-darkmode .dorm-text {
  color: #000000 !important;
}

.dorm-title {
  color: #f8f8e1 !important;
  font-family: 'Nunito', sans-serif !important;
  font-size: 1.25rem !important;
  font-weight: 700 !important;
}

.dorm-subtitle {
  color: #fe4f2d;
  font-family: 'Nunito', sans-serif;
  font-size: 18px !important;
}

.dorm-text {
  color: #f8f8e1 !important;
}

.responsive-img {
  height: 200px;
  transition: opacity 0.5s ease;
}

.image-container {
  position: relative;
  overflow: hidden;
}

.carousel-indicator {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.carousel-indicator.visible {
  opacity: 1;
}

.dot {
  height: 6px;
  width: 6px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  display: inline-block;
}

.dot.active {
  background-color: #0d3a2e;
  width: 10px;
  border-radius: 3px;
}

@media (min-width: 960px) {
  .dorm-card {
    height: 400px;
  }
  .responsive-img {
    height: 280px;
  }
}
</style>
