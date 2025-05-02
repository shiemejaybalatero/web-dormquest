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
          <v-col cols="12" sm="6">
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
          <v-col cols="12" sm="6">
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
              elevation="2"
              @click="navigateToDorm(dorm)"
              style="cursor: pointer"
            >
              <v-img
                :src="dorm.image || '/default-dorm-image.jpg'"
                class="responsive-img"
                cover
                :alt="dorm.name"
              />
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
}

.dorm-title {
  color: #f8f8e1 !important;
  font-family: 'Nunito', sans-serif !important;
  font-size: 1.25rem !important;
  font-weight: 700 !important;
}

.dorm-subtitle {
  color: #c0c2a1;
  font-family: 'Nunito', sans-serif;
}

.dorm-text {
  color: #f8f8e1 !important;
}

.responsive-img {
  height: 200px;
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
