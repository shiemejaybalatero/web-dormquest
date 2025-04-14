<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'

const mainImage = 'https://via.placeholder.com/600x300?text=Main+Image'
const images = [
  'https://via.placeholder.com/200x100?text=Photo+1',
  'https://via.placeholder.com/200x100?text=Photo+2',
  'https://via.placeholder.com/200x100?text=Photo+3',
  'https://via.placeholder.com/200x100?text=Photo+4',
  'https://via.placeholder.com/200x100?text=Photo+5',
]
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="12" md="6">
          <v-img :src="mainImage" height="300" class="rounded mb-4" cover />
          <v-row dense>
            <v-col v-for="(img, index) in images" :key="index" cols="4">
              <v-img :src="img" height="80" class="rounded" cover />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="6">
          <h3 class="font-weight-bold mb-1">TGBG Boarding House</h3>
          <p>XH6W+5W3, Infront of CSU Main Campus, Butuan City, Agusan Del Norte</p>
          <p class="font-weight-bold mb-4">120 km away</p>

          <v-btn class="mb-4 price-btn" prepend-icon="mdi-tag"> Prices included all fees </v-btn>

          <v-row class="details-card" no-gutters>
            <v-col cols="12" md="6">
              <p><strong>Distance:</strong> 500m</p>
              <p><strong>Room number:</strong> 4</p>
              <p><strong>Amenities:</strong> Wifi, Laundry, Kitchen</p>
            </v-col>
            <v-col cols="12" md="6">
              <p><strong>Room Capacity:</strong> 5</p>
              <p><strong>Room Type:</strong> Bed Spacer</p>
              <p><strong>Availability:</strong> Yes</p>
            </v-col>
          </v-row>

          <div class="mt-4 price">₱7,000 <span class="text-caption">For 10 nights</span></div>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
.price-btn {
  background-color: #ffba00;
  color: black;
  font-weight: bold;
  border-radius: 8px;
}

.details-card {
  background: #c7d2c6;
  border-radius: 12px;
  padding: 1rem;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #0c3b2e;
}

@media (max-width: 768px) {
  .price {
    font-size: 20px;
  }

  .details-card {
    font-size: 14px;
  }
}
</style>
