<script setup>
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'

const props = defineProps({
  dormId: {
    type: Number,
    required: true,
  },
  onRatingSubmitted: {
    type: Function,
    default: () => {},
  },
})

const rating = ref(0)
const comment = ref('')
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Get current user ID - assuming you have authentication set up
const getUserId = async () => {
  const { data } = await supabase.auth.getUser()
  return data?.user?.id
}

const submitRating = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (rating.value === 0) {
    errorMessage.value = 'Please select a rating'
    return
  }

  submitting.value = true

  try {
    // Get the current user
    const userId = await getUserId()

    if (!userId) {
      errorMessage.value = 'You must be logged in to submit a rating'
      submitting.value = false
      return
    }

    // Check if user has already rated this dorm
    const { data: existingRating } = await supabase
      .from('ratings')
      .select('id')
      .eq('dorm_id', props.dormId)
      .eq('user_id', userId)
      .single()

    let result

    if (existingRating) {
      // Update existing rating
      result = await supabase
        .from('ratings')
        .update({
          rating: rating.value,
          comment: comment.value,
        })
        .eq('id', existingRating.id)
    } else {
      // Insert new rating
      result = await supabase.from('ratings').insert({
        dorm_id: props.dormId,
        user_id: userId,
        rating: rating.value,
        comment: comment.value,
      })
    }

    if (result.error) {
      throw new Error(result.error.message)
    }

    // Show success message and reset form
    successMessage.value = 'Your rating has been submitted!'
    comment.value = ''

    // Notify parent component
    props.onRatingSubmitted()
  } catch (error) {
    console.error('Error submitting rating:', error)
    errorMessage.value = `Failed to submit rating: ${error.message}`
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <v-card class="pa-4 rating-card">
    <v-card-title class="text-h6 font-weight-bold">Rate this Dormitory</v-card-title>

    <v-card-text>
      <v-alert v-if="errorMessage" type="error" class="mb-4" density="compact">
        {{ errorMessage }}
      </v-alert>

      <v-alert v-if="successMessage" type="success" class="mb-4" density="compact">
        {{ successMessage }}
      </v-alert>

      <div class="d-flex flex-column align-center mb-4">
        <span class="text-body-2 mb-2">Your rating:</span>
        <v-rating v-model="rating" color="amber" hover size="large"></v-rating>
      </div>

      <v-textarea
        v-model="comment"
        label="Your review (optional)"
        variant="outlined"
        rows="3"
        counter="300"
        maxlength="300"
      ></v-textarea>

      <div class="d-flex justify-end mt-4">
        <v-btn
          color="primary"
          :loading="submitting"
          :disabled="rating === 0 || submitting"
          @click="submitRating"
        >
          Submit Review
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.rating-card {
  background-color: #f9fffe;
  border: 1px solid #e0f2f1;
  border-radius: 16px;
}
</style>
