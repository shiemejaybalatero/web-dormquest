<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const showMessenger = ref(false)
const showContact = ref(false)

const toggleMessenger = () => {
  showMessenger.value = !showMessenger.value
}

const toggleContact = () => {
  showContact.value = !showContact.value
}
const mainImage = '/Karmo/karmomain.jpg'
const images = ['/Karmo/karmo1.jpg', '/Karmo/karmo2.jpg', '/Karmo/karmo.jpg']
</script>

<template>
  <AppLayout>
    <template #content>
      <v-col cols="12" md="6">
        <v-img :src="mainImage" height="350" class="rounded-xl mb-4" cover />

        <h3 class="font-weight-bold mb-1">TGBG Boarding House</h3>
        <p class="text-body-2">
          XH6W+5W3, Infront of CSU Main Campus, Butuan City, Agusan Del Norte
        </p>
        <p class="font-weight-bold mb-4 text-green-darken-4">120 km away</p>
        <v-row class="text-center">
          <!-- Messenger Section -->
          <v-col cols="6">
            <v-btn
              class="w-100 d-flex align-center justify-center"
              @click="toggleMessenger"
              style="text-transform: none"
            >
              <v-icon class="mr-2">mdi-facebook-messenger</v-icon>
              Messenger
            </v-btn>

            <v-expand-transition>
              <div v-show="showMessenger" class="mt-1">
                <v-card class="smallcardone" flat>
                  <v-card-text>Shella Licayan</v-card-text>
                </v-card>
              </div>
            </v-expand-transition>
          </v-col>

          <!-- Contact Section -->
          <v-col cols="6">
            <v-btn
              class="w-100 d-flex align-center justify-center"
              @click="toggleContact"
              style="text-transform: none"
            >
              <v-icon class="mr-2">mdi-phone</v-icon>
              Contact
            </v-btn>

            <v-expand-transition>
              <div v-show="showContact" class="mt-1">
                <v-card class="smallcardtwo" flat>
                  <v-card-text>090923123</v-card-text>
                </v-card>
              </div>
            </v-expand-transition>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="6">
        <v-row dense class="mb-4">
          <v-col v-for="(img, index) in images" :key="index" cols="6" md="6">
            <v-img :src="img" height="130" class="rounded" cover />
          </v-col>
        </v-row>

        <div class="d-flex justify-center mb-4">
          <v-btn class="price-btn" prepend-icon="mdi-tag">Prices included all fees</v-btn>
        </div>

        <v-row class="details-card" no-gutters>
          <v-col cols="12">
            <div class="price mb-3">₱7,000 <span class="text-caption">For 10 nights</span></div>
          </v-col>

          <!-- Left column -->
          <v-col cols="12" md="6">
            <p><strong>Distance:</strong> 500m</p>
            <p><strong>Room number:</strong> 4</p>
            <p><strong>Amenities:</strong> Wifi, Laundry, Kitchen</p>
          </v-col>

          <!-- Right column -->
          <v-col cols="12" md="6">
            <p><strong>Room Capacity:</strong> 5</p>
            <p><strong>Room Type:</strong> Bed Spacer</p>
            <p><strong>Availability:</strong> Yes</p>
          </v-col>
        </v-row>
      </v-col>
    </template>
  </AppLayout>
</template>

<style scoped>
.price-btn {
  background-color: #ffba00;
  color: black;
  font-weight: bold;
  border-radius: 20px;
  padding: 25px 20%;
  padding-bottom: 40px;
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
.smallcardone {
  color: #0c3b2e;
  font-weight: bold;
  background-color: #e0f2f1;
  border-radius: 8px;
}
</style>
