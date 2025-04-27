<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/utils/supabase'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()
const dormId = route.params.id
const parsedDormId = parseInt(dormId)

const dormDetails = ref(null)
const loading = ref(true)
const errorMessage = ref('')

const showMessenger = ref(false)
const showContact = ref(false)

// Image map - Fixed path casing from 'Ampalayo' to match actual folder name 'Amplayo'
const dormImageMap = {
  1: {
    main: '/Amplayo/amplayomain.png',
    gallery: [
      '/Amplayo/amplayo.png',
      '/Amplayo/amplayo1.jpg',
      '/Amplayo/amplayo2.png',
      '/Amplayo/amplayo3.png',
    ],
  },
  2: {
    main: '/BlueHeaven/bluemain.png',
    gallery: ['/BlueHeaven/blue.jpg', '/BlueHeaven/blue1.jpg', '/BlueHeaven/blue2.jpg'],
  },
  3: {
    main: '/Blissful/blissfulmain.png',
    gallery: ['/Blissful/blissful.jpg', '/Blissful/blissful1.jpg', '/Blissful/blissful2.jpg'],
  },
  4: {
    main: '/Chelsea/chelseamain.jpg',
    gallery: [
      '/Chelsea/chelsea.jpg',
      '/Chelsea/chelsea1.jpg',
      '/Chelsea/chelsea2.jpg',
      '/Chelsea/chelsea3.jpg',
    ],
  },
  5: {
    main: '/Karmo/karmomain.jpg',
    gallery: ['/Karmo/karmo.jpg', '/Karmo/karmo1.jpg', '/Karmo/karmo2.jpg'],
  },
  6: {
    main: '/Licayan/licayanmain.png',
    gallery: [
      '/Licayan/licayan.png',
      '/Licayan/licayan1.png',
      '/Licayan/licayan2.jpg',
      '/Licayan/licayan3.jpg',
    ],
  },
  7: {
    main: '/Magdura/magduramain.png',
    gallery: [
      '/Magdura/magdura.png',
      '/Magdura/magdura1.png',
      '/Magdura/magdura2.png',
      '/Magdura/magdur3.png',
    ],
  },
  8: {
    main: '/TGBG/tgbgmain.png',
    gallery: ['/TGBG/tgbg.png', '/TGBG/tgbg1.png', '/TGBG/tgbg2.png', '/TGBG/tgbg3.png'],
  },
  // Add more dorm image mappings here...
}

const defaultMainImage = '/Default/default.jpg'
const defaultGallery = ['/Default/default.jpg']

const mainImage = computed(() => {
  if (!dormDetails.value) return defaultMainImage
  return dormImageMap[dormDetails.value.id]?.main || defaultMainImage
})

const galleryImages = computed(() => {
  if (!dormDetails.value) return defaultGallery
  return dormImageMap[dormDetails.value.id]?.gallery || defaultGallery
})

const toggleMessenger = () => {
  showMessenger.value = !showMessenger.value
}

const toggleContact = () => {
  showContact.value = !showContact.value
}

// Fetch details
const fetchDormDetails = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    if (!parsedDormId || isNaN(parsedDormId)) {
      errorMessage.value = 'Invalid dormitory ID'
      return
    }

    const { data, error } = await supabase
      .from('dormitories')
      .select('*')
      .eq('id', parsedDormId)
      .single()

    if (error) {
      console.error('Error fetching dormitory details:', error)
      errorMessage.value = `Failed to load dormitory details: ${error.message}`
      return
    }

    if (!data) {
      errorMessage.value = 'Dormitory not found'
      return
    }

    dormDetails.value = data
    console.log('Fetched dorm details:', data)
  } catch (err) {
    console.error('Unexpected error:', err)
    errorMessage.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDormDetails()
})
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6">
            <v-img :src="mainImage" height="350" class="rounded-xl mb-4" cover />

            <h2 class="top font-weight-bold">{{ dormDetails?.name || 'TGBG Boarding House' }}</h2>
            <p class="down mb-5">5 rooms | 4 beds/room | 3 private baths | Female dorm</p>
            <br />
            <v-row
              class="details-card d-flex align-center justify-space-between pa-3"
              style="background-color: #c8d6c5; border-radius: 12px; min-height: 80px"
            >
              <!-- Left: Profile Image + Name -->
              <div class="d-flex align-center ps-3">
                <v-img
                  src="/account-icon.jpg"
                  alt="Profile Image"
                  width="36"
                  height="36"
                  class="mr-3"
                  style="border-radius: 50%"
                />
                <div class="owner-detail ps-4">
                  <p class="mb-0 font-weight-bold">Antonio Granza</p>
                  <p class="mb-0">Owner</p>
                </div>
              </div>

              <!-- Right: Rating -->
              <div class="owner-detail d-flex align-center pe-3">
                <v-icon color="amber" size="18">mdi-star</v-icon>
                <span class="ml-1 font-weight-medium">4.93</span>
              </div>
            </v-row>

            <br />
            <!-- Contact Informations -->
            <h4 class="mb-3">Contact Details</h4>

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
                    <v-btn
                      href="https://m.me/antongranza"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="text"
                      class="text-capitalize"
                    >
                      Anton Granza
                    </v-btn>
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
                  Phone Number
                </v-btn>

                <v-expand-transition>
                  <div v-show="showContact" class="mt-1">
                    <v-btn href="tel:09514564348" variant="text" class="text-capitalize">
                      0951 456 4348
                    </v-btn>
                  </div>
                </v-expand-transition>
              </v-col>
            </v-row>
            <br />
            <hr />
            <br />
            <p class="text-body-2 d-flex align-center font-weight-bold">
              <v-icon class="mr-2" color="black">mdi-map-marker-outline</v-icon>
              {{
                dormDetails?.address ||
                'XH6W+5W3, Infront of CSU Main Campus, Butuan City, Agusan Del Norte'
              }}
            </p>
            <p class="font-weight-bold mb-4 ps-7">{{ dormDetails?.distance || '120 km' }} away</p>
            <hr />
          </v-col>

          <v-col cols="12" md="6">
            <v-row dense class="mb-4">
              <v-col v-for="(img, index) in galleryImages" :key="index" cols="6" md="6">
                <v-img :src="img" height="170" class="rounded" cover />
              </v-col>
            </v-row>

            <div class="d-flex justify-center mb-4">
              <v-btn class="price-btn" prepend-icon="mdi-tag">Prices included all fees</v-btn>
            </div>

            <v-row class="details-card ms-5 px-10" no-gutters>
              <v-col cols="12">
                <div class="price mb-3">
                  ₱{{ dormDetails?.price || '2,000' }} <span class="text-caption">Monthly</span>
                </div>
                <br />
                <hr />
                <br />
              </v-col>

              <!-- Left column -->
              <v-col cols="12" md="5">
                <p class="my-4">
                  <strong>Distance:</strong> {{ dormDetails?.distance || '500 meter' }}
                </p>
                <hr />
                <p class="my-4">
                  <strong>Room number:</strong> {{ dormDetails?.room_number || '5' }}
                </p>
                <hr />
                <p class="my-4">
                  <strong>Amenities:</strong>
                  {{ dormDetails?.amenities || 'Wifi, Laundry, Kitchen' }}
                </p>
              </v-col>

              <!-- center column -->
              <v-col cols="12" md="2"> </v-col>

              <!-- Right column -->
              <v-col cols="12" md="5">
                <p class="my-4">
                  <strong>Room Capacity:</strong> {{ dormDetails?.capacity || '4' }}
                </p>
                <hr />
                <p class="my-4">
                  <strong>Room Type:</strong> {{ dormDetails?.room_type || 'Bed Spacer' }}
                </p>
                <hr />
                <p class="my-4">
                  <strong>Availability:</strong> {{ dormDetails?.availability ? 'Yes' : 'No' }}
                </p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
.owner-detail {
  font-size: 16px;
}

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

.top {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.down {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
</style>
