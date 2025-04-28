<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/utils/supabase'
import DormRatingForm from './DormRatingForm.vue' // Import the rating form component

const props = defineProps({
  dormId: {
    type: Number,
    required: true,
  },
})

const reviews = ref([])
const loading = ref(true)
const errorMessage = ref('')
const ratingStats = ref({
  average: 0,
  total: 0,
  distribution: {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  },
})

// Calculate percentage for rating bars
const getPercentage = (count) => {
  if (ratingStats.value.total === 0) return 0
  return (count / ratingStats.value.total) * 100
}

// Fetch all reviews for this dormitory
const fetchReviews = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    // Get all ratings for this dorm with user information
    const { data, error } = await supabase
      .from('ratings')
      .select(
        `
        id,
        rating,
        comment,
        created_at,
        user_id,
        users (id, full_name, avatar_url)
      `,
      )
      .eq('dorm_id', props.dormId)
      .order('created_at', { ascending: false })

    if (error) throw error

    reviews.value = data || []

    // Calculate statistics
    calculateRatingStats()
  } catch (err) {
    console.error('Error fetching reviews:', err)
    errorMessage.value = `Failed to load reviews: ${err.message}`
  } finally {
    loading.value = false
  }
}

// Calculate rating statistics
const calculateRatingStats = () => {
  const stats = {
    average: 0,
    total: reviews.value.length,
    distribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  }

  // Count each rating
  reviews.value.forEach((review) => {
    const rating = Math.round(review.rating)
    if (stats.distribution[rating] !== undefined) {
      stats.distribution[rating]++
    }
  })

  // Calculate average
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  stats.average = stats.total > 0 ? (sum / stats.total).toFixed(1) : 0

  ratingStats.value = stats
}

// Format date to be more readable
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Handle new rating submission
const handleRatingSubmitted = () => {
  fetchReviews()
}

// Watch for changes in dormId
watch(
  () => props.dormId,
  () => {
    fetchReviews()
  },
)

onMounted(() => {
  fetchReviews()
})
</script>

<template>
  <div class="reviews-container">
    <v-row>
      <!-- Rating statistics -->
      <v-col cols="12" md="4">
        <v-card class="pa-4 stats-card">
          <v-card-title class="text-h6 font-weight-bold mb-4">Rating Overview</v-card-title>

          <div class="d-flex align-center justify-center mb-6">
            <span class="text-h3 font-weight-bold mr-2">{{ ratingStats.average }}</span>
            <v-rating
              :model-value="parseFloat(ratingStats.average)"
              color="amber"
              density="compact"
              size="small"
              readonly
              half-increments
            ></v-rating>
            <span class="text-caption text-grey ml-1">({{ ratingStats.total }} reviews)</span>
          </div>

          <!-- Rating distribution -->
          <div v-for="i in 5" :key="i" class="d-flex align-center mb-3">
            <span class="mr-2">{{ 6 - i }}</span>
            <v-icon color="amber" size="16">mdi-star</v-icon>
            <v-progress-linear
              class="mx-3"
              color="amber"
              :model-value="getPercentage(ratingStats.distribution[6 - i])"
              height="8"
              rounded
            ></v-progress-linear>
            <span class="text-caption">{{ ratingStats.distribution[6 - i] }}</span>
          </div>
        </v-card>

        <!-- Rating form -->
        <DormRatingForm
          :dorm-id="dormId"
          :on-rating-submitted="handleRatingSubmitted"
          class="mt-6"
        />
      </v-col>

      <!-- Reviews list -->
      <v-col cols="12" md="8">
        <v-card class="pa-4 reviews-list-card">
          <v-card-title class="text-h6 font-weight-bold">
            Reviews
            <v-chip class="ml-2" color="primary" size="small">{{ ratingStats.total }}</v-chip>
          </v-card-title>

          <v-card-text>
            <!-- Loading -->
            <div v-if="loading" class="text-center py-6">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <div class="mt-2">Loading reviews...</div>
            </div>

            <!-- Error -->
            <v-alert v-if="errorMessage" type="error" class="mt-2" density="compact">
              {{ errorMessage }}
            </v-alert>

            <!-- No reviews -->
            <div v-if="!loading && reviews.length === 0" class="text-center py-6">
              <v-icon size="48" color="grey">mdi-comment-outline</v-icon>
              <div class="mt-2 text-grey">No reviews yet. Be the first to leave a review!</div>
            </div>

            <!-- Reviews list -->
            <div v-for="review in reviews" :key="review.id" class="review-item pa-4 mb-4">
              <div class="d-flex align-start mb-2">
                <v-avatar size="36" class="mr-3">
                  <v-img v-if="review.users?.avatar_url" :src="review.users.avatar_url" />
                  <span v-else class="text-caption text-uppercase">
                    {{ review.users?.full_name?.[0] || 'U' }}
                  </span>
                </v-avatar>

                <div class="flex-grow-1">
                  <div class="d-flex justify-space-between align-center">
                    <span class="font-weight-medium">{{
                      review.users?.full_name || 'Anonymous User'
                    }}</span>
                    <span class="text-caption text-grey">{{ formatDate(review.created_at) }}</span>
                  </div>

                  <v-rating
                    :model-value="review.rating"
                    color="amber"
                    density="compact"
                    size="x-small"
                    readonly
                    half-increments
                  ></v-rating>
                </div>
              </div>

              <div class="pl-12 text-body-2" v-if="review.comment">
                {{ review.comment }}
              </div>
              <div class="pl-12 text-body-2 text-grey-darken-1" v-else>
                <i>No comment provided</i>
              </div>

              <v-divider class="mt-4"></v-divider>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.stats-card,
.reviews-list-card {
  background-color: #fafff9;
  border: 1px solid #e0f2f1;
  border-radius: 16px;
}

.review-item {
  background-color: #f9fffe;
  border-radius: 8px;
}
</style>
