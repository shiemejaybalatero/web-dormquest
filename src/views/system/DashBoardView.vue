<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useRouter } from 'vue-router'

const dorms = ref([])
const errorMessage = ref('')
const loading = ref(true)
const router = useRouter()

const fetchDorms = async () => {
  console.log('Fetching dormitories...')
  loading.value = true

  try {
    const { data, error } = await supabase
      .from('dormitories')
      .select('id, name, address, price, image')
      .order('id', { ascending: true })

    if (error) {
      console.error('Failed to fetch dormitories:', error)
      errorMessage.value = `Failed to load dormitories: ${error.message}`
      return
    }

    dorms.value = data.map((dorm) => ({
      ...dorm,
      rating: '4.5',
      availability: `₱${dorm.price || 'N/A'} per month`,
    }))

    console.log('Dormitories set:', dorms.value)
  } catch (err) {
    console.error('Unexpected error:', err)
    errorMessage.value = 'An unexpected error occurred.'
  } finally {
    loading.value = false
  }
}

// Navigate to dormitory details
const navigateToDorm = (dorm) => {
  router.push({ name: 'DormDetails', params: { id: dorm.id } })
}

onMounted(() => {
  fetchDorms()
})
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid>
        <!-- Loading -->
        <v-row v-if="loading">
          <v-col class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <div class="mt-2">Loading dormitories...</div>
          </v-col>
        </v-row>

        <!-- Error -->
        <v-alert v-if="errorMessage" type="error" class="mt-4">
          {{ errorMessage }}
        </v-alert>

        <!-- Dormitories listing -->
        <v-row v-if="!loading">
          <v-col v-for="(dorm, index) in dorms" :key="index" cols="12" sm="6" md="4" class="pa-4">
            <v-card
              class="hover-card dorm-card"
              elevation="2"
              @click="navigateToDorm(dorm)"
              style="cursor: pointer"
            >
              <v-img
                :src="dorm.image || 'https://via.placeholder.com/400x200?text=No+Image'"
                height="200px"
                cover
              />
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
          </v-col>
        </v-row>

        <!-- No data -->
        <v-row v-if="!loading && dorms.length === 0 && !errorMessage">
          <v-col class="text-center">
            <v-alert type="info">No dormitories found.</v-alert>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
/* your hover, card, title, etc. styles stay the same */
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
  color: #1b4332;
  font-family: 'Nunito', sans-serif;
}

.dorm-subtitle {
  color: #4d5106;
  font-family: 'Nunito', sans-serif;
}

.dorm-text {
  color: #4e4a50 !important;
}
</style>
