<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBoardingHouseStore } from '@/stores/boardingHouse'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
const boardingHouseStore = useBoardingHouseStore()

const navigateToDorm = (dorm) => {
  router.push({ name: 'dorm-details', params: { id: dorm.id } })
}

onMounted(() => {
  boardingHouseStore.fetchBoardingHouses()
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
  color: #f8f8e1;
  font-family: 'Nunito', sans-serif;
}

.dorm-subtitle {
  color: #4d5106;
  font-family: 'Nunito', sans-serif;
}

.dorm-text {
  color: #f8f8e1 !important;
}
</style>
