<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { supabase } from '@/utils/supabase'

const props = defineProps({
  dormId: {
    type: Number,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  initialRatings: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'rating-updated', 'submit-rating'])

const newRating = ref(0)
const newComment = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const commentsLoading = ref(false)
const ratings = ref(props.initialRatings || [])
const currentUser = ref(null)

// Get current user from Supabase auth - using metadata instead of profiles table
async function getCurrentUser() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Extract user display name from metadata or use fallbacks
      const displayName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split('@')[0] ||
        'User'

      currentUser.value = {
        id: user.id,
        name: displayName,
        email: user.email,
      }
    }
  } catch (error) {
    console.error('Error getting current user:', error)
  }
}

const ratingStats = computed(() => ({
  average: calculateAverageRating(ratings.value),
  count: ratings.value.length,
}))

function calculateAverageRating(ratings) {
  if (!ratings || ratings.length === 0) return 0
  const total = ratings.reduce((sum, rating) => sum + (rating.rating_score || 0), 0)
  return Number((total / ratings.length).toFixed(1))
}

function formatDate(dateString) {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  } catch {
    return 'Unknown date'
  }
}

async function submitComment() {
  if (newRating.value === 0) {
    errorMessage.value = 'Please select a rating'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const newRatingObj = {
      dormitory_id: props.dormId,
      // Convert rating to integer to match bigint column type
      rating_score: Math.round(newRating.value),
      comment: newComment.value,
      user_id: currentUser.value.id,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('ratings').insert([newRatingObj]).select()

    if (error) throw error
    if (!data || data.length === 0) throw new Error('No data returned from insert')

    ratings.value = [data[0], ...ratings.value]
    emit('submit-rating', data[0])

    // IMPORTANT: Update the parent component with new rating stats
    emit('rating-updated', {
      average: ratingStats.value.average,
      count: ratingStats.value.count,
    })

    newComment.value = ''
    newRating.value = 0
    successMessage.value = 'Your comment has been submitted'

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    errorMessage.value = error.message || 'Failed to submit comment'
    console.error('Submission error:', error)
  } finally {
    loading.value = false
  }
}

async function loadRatings() {
  commentsLoading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('dormitory_id', props.dormId)
      .order('created_at', { ascending: false })

    if (error) throw error

    ratings.value = data || []

    // IMPORTANT: Update the parent component with new rating stats whenever ratings load
    emit('rating-updated', {
      average: ratingStats.value.average,
      count: ratingStats.value.count,
    })
  } catch (error) {
    errorMessage.value = 'Failed to load comments. ' + error.message
    console.error('Error loading ratings:', error)
  } finally {
    commentsLoading.value = false
  }
}

function closeModal() {
  emit('close')
}

watch(
  () => props.dormId,
  (newId) => {
    if (newId) loadRatings()
  },
)

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      loadRatings()
      getCurrentUser()
    }
  },
)

onMounted(() => {
  getCurrentUser()
  if (props.isOpen && props.dormId) loadRatings()
})
</script>

<template>
  <v-dialog :model-value="props.isOpen" @update:model-value="$emit('close')" width="800">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center pa-4">
        <span class="text-h5">Ratings & comments</span>
        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Summary stats -->
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="4" class="text-center">
            <div class="text-h3 primary--text">{{ ratingStats.average }}</div>
            <v-rating
              :model-value="ratingStats.average"
              color="amber"
              half-increments
              readonly
              class="justify-center"
            ></v-rating>
            <div class="text-caption">{{ ratingStats.count }} comments</div>
          </v-col>

          <v-col cols="12" md="8">
            <v-alert v-if="successMessage" type="success" class="mb-4">
              {{ successMessage }}
            </v-alert>

            <v-alert v-if="errorMessage" type="error" class="mb-4">
              {{ errorMessage }}
            </v-alert>

            <v-card class="pa-4" variant="outlined" v-if="currentUser">
              <h3 class="mb-4">Leave a comment</h3>

              <div class="d-flex align-center mb-3">
                <span class="me-2">Your Rating:</span>
                <v-rating
                  v-model="newRating"
                  color="amber"
                  hover
                  half-increments
                  class="me-2"
                ></v-rating>
                <span v-if="newRating" class="text-subtitle-2">({{ newRating }})</span>
              </div>

              <v-textarea
                v-model="newComment"
                label="Your comment"
                variant="outlined"
                rows="3"
                hide-details
                class="mb-3"
              ></v-textarea>

              <v-btn
                @click="submitComment"
                color="primary"
                :loading="loading"
                :disabled="loading"
                class="mt-2"
              >
                Submit comment
              </v-btn>
            </v-card>

            <v-card v-else class="pa-4 text-center" variant="outlined">
              <p>Please log in to leave a comment</p>
              <v-btn color="primary" to="/login">Log In</v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <!-- comments list -->
      <v-card-text class="pa-4">
        <h3 class="mb-4">All comments</h3>

        <div v-if="commentsLoading" class="text-center py-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <div class="mt-2">Loading comments...</div>
        </div>

        <div v-else-if="ratings.length === 0" class="text-center py-4">
          <p>No comments yet. Be the first to leave a comment!</p>
        </div>

        <v-list v-else>
          <v-list-item v-for="(rating, index) in ratings" :key="rating.id || index" class="mb-3">
            <template v-slot:prepend>
              <v-avatar size="40" color="grey-lighten-3">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title>
              <div class="d-flex justify-space-between align-center">
                <!-- Show the current user's name if it's their comment, otherwise show a generic username -->
                <span class="font-weight-bold">
                  {{ rating.user_id === currentUser?.id ? currentUser.name : 'User' }}
                </span>
                <span class="text-caption">{{ formatDate(rating.created_at) }}</span>
              </div>
            </v-list-item-title>

            <v-list-item-subtitle>
              <v-rating
                :model-value="rating.rating_score"
                color="amber"
                density="compact"
                readonly
                size="small"
                half-increments
              ></v-rating>
            </v-list-item-subtitle>

            <div class="mt-2">
              <p v-if="rating.comment">{{ rating.comment }}</p>
              <p v-else class="text-caption text-italic">No written comment</p>
            </div>

            <v-divider v-if="index < ratings.length - 1" class="mt-2"></v-divider>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.text-italic {
  font-style: italic;
}

.v-list-item {
  padding: 12px;
  border-radius: 8px;
}

.v-list-item:hover {
  background-color: #f5f5f5;
}
</style>
