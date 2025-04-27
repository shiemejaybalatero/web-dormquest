<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()
const router = useRouter()
const dormId = route.params.id
const parsedDormId = parseInt(dormId)

const dormDetails = ref(null)
const loading = ref(true)
const errorMessage = ref('')

const showFacebook = ref(false)
const showContact = ref(false)

// Image map for gallery images
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
    main: '/Licayan/licayanmain.png',
    gallery: [
      '/Licayan/licayan.png',
      '/Licayan/licayan1.png',
      '/Licayan/licayan2.jpg',
      '/Licayan/licayan3.jpg',
    ],
  },
  5: {
    main: '/Chelsea/chelseamain.jpg',
    gallery: [
      '/Chelsea/chelsea.jpg',
      '/Chelsea/chelsea1.jpg',
      '/Chelsea/chelsea2.jpg',
      '/Chelsea/chelsea3.jpg',
    ],
  },
  6: {
    main: '/TGBG/tgbgmain.png',
    gallery: ['/TGBG/tgbg.png', '/TGBG/tgbg1.png', '/TGBG/tgbg2.png', '/TGBG/tgbg3.png'],
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
    main: '/Karmo/karmomain.jpg',
    gallery: ['/Karmo/karmo.jpg', '/Karmo/karmo1.jpg', '/Karmo/karmo2.jpg'],
  },
}

const defaultMainImage = '/Default/default.jpg'
const defaultGallery = ['/Default/default.jpg']

const mainImage = computed(() => {
  if (!dormDetails.value) return defaultMainImage
  // Fallback to image map if Supabase image is not available
  return dormImageMap[dormDetails.value.id]?.main || defaultMainImage
})

const galleryImages = computed(() => {
  if (!dormDetails.value) return defaultGallery
  return dormImageMap[dormDetails.value.id]?.gallery || defaultGallery
})

const toggleMessenger = () => {
  showFacebook.value = !showFacebook.value
}

const toggleContact = () => {
  showContact.value = !showContact.value
}

// Fetch dormitory details from Supabase
const fetchDormDetails = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    if (!parsedDormId || isNaN(parsedDormId)) {
      errorMessage.value = 'Invalid dormitory ID'
      return
    }

    console.log('Fetching dormitory with ID:', parsedDormId)

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

    // Set dormitory details using your exact database schema
    dormDetails.value = {
      id: data.id,
      created_at: data.created_at,
      name: data.name || 'No name',
      address: data.address || 'Address not available',
      contact_number: data.contact_number || 'Not available',
      price: data.price,
      number_of_room: data.number_of_room,
      room_capacity: data.room_capacity,
      room_type: data.room_type || '',
      messenger_name: data.messenger_name || 'Not available',
      amenity: data.amenity || 'Undefinded',
      availability_status: data.availability_status !== undefined ? data.availability_status : true,
      distance_to_campus: data.distance_to_campus || 'Undefined',
      image: data.image,
      owner: data.owner || 'Not available',

      // Add default rating for UI (not in your schema but used in the UI)
      rating: '4.5',
    }

    console.log('Fetched dorm details:', dormDetails.value)
  } catch (err) {
    console.error('Unexpected error:', err)
    errorMessage.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

// Go back to dormitory listing
const goBack = () => {
  router.push({ name: 'dashboard' })
}

const refetchData = () => {
  fetchDormDetails()
}

onMounted(() => {
  fetchDormDetails()
})
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid>
        <!-- Back button -->
        <v-btn class="mb-4" variant="text" prepend-icon="mdi-arrow-left" @click="goBack">
          Back to Dashboard
        </v-btn>

        <!-- Loading state -->
        <v-row v-if="loading">
          <v-col class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <div class="mt-2">Loading dormitory details...</div>
          </v-col>
        </v-row>

        <!-- Error state -->
        <v-alert v-if="errorMessage" type="error" class="mb-4">
          {{ errorMessage }}
          <div class="mt-2">
            <v-btn @click="refetchData" variant="outlined" size="small">Try Again</v-btn>
          </div>
        </v-alert>

        <!-- Dormitory details when loaded -->
        <v-row v-if="dormDetails && !loading">
          <v-col cols="12" md="6">
            <v-img :src="mainImage" height="350" class="rounded-xl mb-4" cover />

            <h2 class="top font-weight-bold">{{ dormDetails.name }}</h2>
            <p class="down mb-5">
              {{ dormDetails.number_of_room }} rooms | {{ dormDetails.room_capacity }} beds/room | 3
              private baths | Female dorm
            </p>
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
                  <p class="mb-0 font-weight-bold">{{ dormDetails.owner }}</p>
                  <p class="mb-0">Owner</p>
                </div>
              </div>

              <!-- Right: Rating -->
              <div class="d-flex align-center pe-3">
                <v-icon color="amber" size="18">mdi-star</v-icon>
                <span class="ml-1 text-body-2">{{ dormDetails.rating }}</span>
              </div>
            </v-row>

            <br />
            <!-- Contact Information -->
            <h4 class="mb-3">Contact Details</h4>

            <v-row class="text-center">
              <!-- Messenger Section -->
              <v-col cols="6">
                <v-btn
                  class="w-100 d-flex align-center justify-center"
                  @click="toggleMessenger"
                  style="text-transform: none"
                >
                  <v-icon class="mr-2">mdi-facebook</v-icon>
                  Facebook
                </v-btn>

                <v-expand-transition>
                  <div v-show="showFacebook" class="mt-1">
                    <v-btn
                      href="https://m.me/antongranza"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="text"
                      class="text-capitalize"
                    >
                      {{ dormDetails.messenger_name }}
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
                    <v-btn
                      :href="`tel:${dormDetails.contact_number}`"
                      variant="text"
                      class="text-capitalize"
                    >
                      {{ dormDetails.contact_number }}
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
              {{ dormDetails.address }}
            </p>
            <p class="font-weight-bold mb-4 ps-7">{{ dormDetails.distance_to_campus }} away</p>
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
                  ₱{{ dormDetails.price }} <span class="text-caption">Monthly</span>
                </div>
                <br />
                <hr />
                <br />
              </v-col>

              <!-- Left column -->
              <v-col cols="12" md="5">
                <p class="my-4"><strong>Distance:</strong> {{ dormDetails.distance_to_campus }}</p>
                <hr />
                <p class="my-4"><strong>Room number:</strong> {{ dormDetails.number_of_room }}</p>
                <hr />
                <p class="my-4">
                  <strong>Amenities:</strong>
                  {{ dormDetails.amenity }}
                </p>
              </v-col>

              <!-- center column -->
              <v-col cols="12" md="2"> </v-col>

              <!-- Right column -->
              <v-col cols="12" md="5">
                <p class="my-4"><strong>Room Capacity:</strong> {{ dormDetails.room_capacity }}</p>
                <hr />
                <p class="my-4"><strong>Room Type:</strong> {{ dormDetails.room_type }}</p>
                <hr />
                <p class="my-4">
                  <strong>Availability:</strong>
                  {{ dormDetails.availability_status ? 'Yes' : 'No' }}
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
