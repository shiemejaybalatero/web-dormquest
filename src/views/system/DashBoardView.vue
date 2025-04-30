<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBoardingHouseStore } from '@/stores/boardingHouse'
import AppLayout from '@/components/layout/AppLayout.vue'
import { supabase } from '@/utils/supabase'

const router = useRouter()
const boardingHouseStore = useBoardingHouseStore()

// Add reactive ratings state
const dormRatings = ref({})

const fetchAllRatings = async () => {
  const { data, error } = await supabase.from('ratings').select('dormitory_id, rating_score')

  if (error) {
    console.error('Failed to fetch ratings:', error)
    return
  }

  // Process the ratings by dormitory
  const ratingsByDorm = {}

  if (data && data.length) {
    // Group ratings by dormitory_id
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

    // Calculate average for each dormitory
    Object.keys(ratingsByDorm).forEach((dormId) => {
      const scores = ratingsByDorm[dormId].scores
      const sum = scores.reduce((acc, score) => acc + score, 0)
      ratingsByDorm[dormId].average = sum / scores.length
      ratingsByDorm[dormId].count = scores.length
    })
  }

  dormRatings.value = ratingsByDorm
  console.log('All dormitory ratings:', dormRatings.value)
}

// Improved getDormRating function
const getDormRating = (dormId) => {
  // First check if we have ratings from the ratings table
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

const navigateToDorm = (dorm) => {
  router.push({ name: 'dorm-details', params: { id: dorm.id } })
}

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

onMounted(() => {
  boardingHouseStore.fetchBoardingHouses()
  fetchAllRatings() // Fetch ratings when component mounts
})
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid>
        <!-- Loading -->
        <v-row v-if="boardingHouseStore.loading">
          <v-col class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <div class="mt-2">Loading dormitories...</div>
          </v-col>
        </v-row>

        <!-- Error -->
        <v-alert v-if="boardingHouseStore.errorMessage" type="error" class="mt-4">
          {{ boardingHouseStore.errorMessage }}
        </v-alert>

        <div class="filter-row mt-n2 mb-n5">
          <v-row>
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
        </div>

        <!-- Dormitories listing -->
        <v-row v-if="!boardingHouseStore.loading">
          <v-col
            v-for="(dorm, index) in boardingHouseStore.boardingHouses"
            :key="index"
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
                :src="dorm.image || 'https://via.placeholder.com/400x200?text=No+Image'"
                class="responsive-img"
                cover
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
                <div class="text-subtitle-2 text-grey dorm-subtitle">
                  {{ dorm.availability }}
                </div>
                <div class="text-body-2 text-grey dorm-text">{{ dorm.address }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- No data -->
        <v-row
          v-if="
            !boardingHouseStore.loading &&
            boardingHouseStore.boardingHouses.length === 0 &&
            !boardingHouseStore.errorMessage
          "
        >
          <v-col class="text-center">
            <v-alert type="info">No dormitories found.</v-alert>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
/* Keep your styles here */
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
  background-color: #2c3930;
  color: #f8f8e1;
  border-radius: 16px;
}

.dorm-title {
  color: #f8f8e1 !important;
  font-family: 'Nunito', sans-serif !important;
  font-size: 1.25rem !important; /* Or use 20px */
  font-weight: 700 !important;
}

.dorm-subtitle {
  color: #4d5106;
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
}

/* Height for medium screens and up */
@media (min-width: 960px) {
  .responsive-img {
    height: 280px;
  }
}
</style>
