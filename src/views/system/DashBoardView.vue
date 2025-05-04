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
  9: {
    main: '/Banton/bantonmain.png',
    gallery: [
      '/Banton/bantonmain.png',
      '/Banton/banton.jpg',
      '/Banton/banton1.jpg',
      '/Banton/banton2.jpg',
      '/Banton/banton3.jpg',
    ],
  },
  10: {
    main: '/Collegefacade/collegemain.jpg',
    gallery: [
      '/Collegefacade/collegemain.jpg',
      '/Collegefacade/college.jpg',
      '/Collegefacade/college1.jpg',
      '/Collegefacade/college2.jpg',
      '/Collegefacade/college3.jpg',
    ],
  },
  11: {
    main: '/JP/jpmain.jpg',
    gallery: ['/JP/jpmain.jpg', '/JP/jp1.jpg', '/JP/jp2.jpg', '/JP/jp3.jpg'],
  },
  12: {
    main: '/Lagrange/lagmain.jpg',
    gallery: [
      '/Lagrange/lagmain.jpg',
      '/Lagrange/lag.jpg',
      '/Lagrange/lag1.jpg',
      '/Lagrange/lag2.jpg',
      '/Lagrange/lag3.jpg',
    ],
  },
  13: {
    main: '/MDs/mdmain.jpg',
    gallery: ['/MDs/mdmain.jpg', '/MDs/md.jpg', '/MDs/md1.jpg', '/MDs/md2.jpg', '/MDs/md3.jpg'],
  },
  14: {
    main: '/Justin/justinmain.jpg',
    gallery: [
      '/Justin/justinmain.jpg',
      '/Justin/justin.jpg',
      '/Justin/justin1.jpg',
      '/Justin/justin2.jpg',
    ],
  },
  15: {
    main: '/Camella/camellamain.jpg',
    gallery: [
      '/Camella/camellamain.jpg',
      '/Camella/camella.jpg',
      '/Camella/camella1.jpg',
      '/Camella/camella2.jpg',
      '/Camella/camella3.jpg',
    ],
  },
  16: {
    main: '/Cryshiels/crymain.jpg',
    gallery: [
      '/Cryshiels/crymain.jpg',
      '/Cryshiels/cry.jpg',
      '/Cryshiels/cry1.jpg',
      '/Cryshiels/cry2.jpg',
      '/Cryshiels/cry3.jpg',
    ],
  },
  17: {
    main: '/Manor/manormain.jpg',
    gallery: [
      '/Manor/manormain.jpg',
      '/Manor/manor.jpg',
      '/Manor/manor1.jpg',
      '/Manor/manor2.jpg',
      '/Manor/manor3.jpg',
    ],
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
  { text: '0 - 100m', value: [0, 100] },
  { text: '100 - 300m', value: [100, 300] },
  { text: '300 - 600m', value: [300, 600] },
  { text: '600 - 1000m', value: [600, 1000] },
  { text: '1000 - 5000m', value: [1000, 5000] },
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
    // Check if price exists, if not treat as 0 for filtering
    const dormPrice = dorm.price !== undefined ? dorm.price : 0

    const priceOk =
      selectedPriceRange.value === 'any' ||
      (dormPrice >= selectedPriceRange.value[0] && dormPrice <= selectedPriceRange.value[1])

    // Check if distance exists, if not treat as infinity for filtering
    const dormDistance = dorm.distance_to_campus !== undefined ? dorm.distance_to_campus : Infinity

    const distanceOk =
      selectedDistanceRange.value === 'any' ||
      (dormDistance >= selectedDistanceRange.value[0] &&
        dormDistance <= selectedDistanceRange.value[1])

    // Safe property access for search
    const dormName = dorm.name || ''
    const dormAddress = dorm.address || ''

    const searchOk =
      searchTerm.value === '' ||
      dormName.toLowerCase().includes(searchTerm.value) ||
      dormAddress.toLowerCase().includes(searchTerm.value)

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
        <!-- Loading and error alerts remain the same -->

        <!-- Filter controls - made more responsive -->
        <v-row>
          <v-col cols="12" sm="6" md="6" lg="6">
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
          <v-col cols="12" sm="6" md="6" lg="6">
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

        <!-- Dorm cards grid - improved breakpoints -->
        <v-row>
          <v-col
            v-for="(dorm, index) in filteredDorms"
            :key="dorm.id || index"
            cols="12"
            xs="12"
            sm="6"
            md="6"
            lg="4"
            xl="3"
            class="pa-2 pa-sm-3 pa-md-4"
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
                <div class="text-body-2 dorm-text">{{ dorm.distance_to_campus }} m to campus</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- No results message remains the same -->
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
  height: auto; /* Remove fixed height for better responsiveness */
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
  height: 180px; /* Default height */
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

/* Tablet-specific styles */
@media (min-width: 600px) and (max-width: 959px) {
  .dorm-card {
    height: 100%;
  }
  .responsive-img {
    height: 220px;
  }
  .dorm-title {
    font-size: 1.1rem !important;
  }
  .dorm-subtitle {
    font-size: 16px !important;
  }
}

/* Desktop styles */
@media (min-width: 960px) {
  .responsive-img {
    height: 250px;
  }
}

/* Large desktop */
@media (min-width: 1264px) {
  .responsive-img {
    height: 280px;
  }
}
</style>
