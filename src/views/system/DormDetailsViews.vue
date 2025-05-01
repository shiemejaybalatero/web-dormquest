<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBoardingHouseStore } from '@/stores/boardingHouse'
import AppLayout from '@/components/layout/AppLayout.vue'
import DormitoryReview from '@/components/system/DormitoryReview.vue'
import { supabase } from '@/utils/supabase'

const route = useRoute()
const router = useRouter()
const dormId = parseInt(route.params.id)
const showFacebook = ref(false)
const showContact = ref(false)
const showCarousel = ref(false) // Control carousel visibility
const selectedImageIndex = ref(0) // Track which image was clicked
const showReviewModal = ref(false) // Added missing declaration
const ratingStats = ref({ average: 0, count: 0 }) // Added missing declaration
const dormRatings = ref([]) // Added missing declaration

// Get the store
const boardingHouseStore = useBoardingHouseStore()

// Use a defensive approach to access store properties
const selectedBoardingHouse = computed(() => boardingHouseStore.selectedBoardingHouse)
const loading = computed(() => boardingHouseStore.loading)
const errorMessage = computed(() => boardingHouseStore.errorMessage)

// Safe computed property for dorm details
const dormDetails = computed(() => selectedBoardingHouse.value)

// Computed property for the display rating
const displayRating = computed(() => {
  const rating = ratingStats.value.average || (dormDetails.value?.rating ?? 0)
  return rating.toFixed(1)
})

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

// Defensive computed properties with null checks
const mainImage = computed(() => {
  if (!dormDetails.value) return defaultMainImage
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

const openReviewModal = () => {
  showReviewModal.value = true
}

const closeReviewModal = () => {
  showReviewModal.value = false
}

const goBack = () => {
  router.push({ name: 'dashboard' })
}

const fetchRatings = async () => {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('rating_score')
      .eq('dormitory_id', dormId)

    if (error) {
      console.error('Failed to fetch ratings:', error)
      return
    }

    if (data && data.length) {
      const sum = data.reduce((acc, r) => acc + r.rating_score, 0)
      ratingStats.value = {
        average: sum / data.length,
        count: data.length,
      }
    } else {
      ratingStats.value = { average: 0, count: 0 }
    }
  } catch (err) {
    console.error('Error in fetchRatings:', err)
    ratingStats.value = { average: 0, count: 0 }
  }
}

const refetchData = () => {
  if (!isNaN(dormId)) {
    boardingHouseStore.fetchBoardingHouseById(dormId)
  }
}

const viewOnMap = () => {
  // Navigate to the map page with query parameters to highlight this dorm
  router.push({
    name: 'map', // The name of your map route in your router configuration
    query: {
      highlight: dormId, // Pass the dormitory ID as a query parameter
      fromDetails: true, // Flag to indicate we're coming from details page
    },
  })
}

// Handle rating updates from the rating component
const handleRatingUpdated = (stats) => {
  ratingStats.value = stats
}

// Handle a new rating submission
const handleSubmitRating = (newRating) => {
  console.log('New rating submitted:', newRating)
  dormRatings.value = [newRating, ...dormRatings.value]
  // You might want to update the boarding house store with the new average rating
  // boardingHouseStore.updateDormRating(dormId, ratingStats.value.average)
}

onMounted(() => {
  if (!isNaN(dormId)) {
    console.log(`Mounting DormDetails with ID: ${dormId}`)
    refetchData()
    fetchRatings() // fetch ratings on load
  }
})

// Watch for route changes
watch(
  () => route.params.id,
  (newId) => {
    const newDormId = parseInt(newId)
    if (!isNaN(newDormId)) {
      console.log(`Route changed to dorm ID: ${newDormId}`)
      boardingHouseStore.fetchBoardingHouseById(newDormId)
    }
  },
)

const carouselSection = ref(null)

// Open carousel with main image
const openCarouselWithMainImage = () => {
  selectedImageIndex.value = 0 // Main image is usually first
  showCarousel.value = true
  // Prevent scrolling on the body when modal is open
  document.body.style.overflow = 'hidden'
}

// Open carousel with gallery image
const openCarouselWithGalleryImage = (index) => {
  selectedImageIndex.value = index
  showCarousel.value = true
  // Prevent scrolling on the body when modal is open
  document.body.style.overflow = 'hidden'
}

// Close carousel
const closeCarousel = () => {
  showCarousel.value = false
  // Restore scrolling when modal is closed
  document.body.style.overflow = 'auto'
}
</script>

<template>
  <AppLayout>
    <template #content>
      <!-- Modal Carousel Overlay - only visible when showCarousel is true -->
      <div v-if="showCarousel" class="carousel-overlay">
        <div class="carousel-modal">
          <div class="d-flex justify-end pa-2">
            <v-btn icon @click="closeCarousel" class="close-btn">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <v-carousel :model-value="selectedImageIndex" height="80vh" hide-delimiters>
            <v-carousel-item
              v-for="(img, index) in galleryImages"
              :key="index"
              :src="img"
              contain
            />
          </v-carousel>
        </div>
      </div>
      <v-container>
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
          <!-- First row: main image and gallery images -->
          <v-col cols="12">
            <v-row>
              <!-- Main Image -->
              <v-col cols="12" md="6">
                <v-img
                  :src="mainImage"
                  height="350"
                  class="rounded-xl cursor-pointer hover-effect"
                  cover
                  @click="openCarouselWithMainImage()"
                />
              </v-col>

              <!-- Gallery Images -->
              <v-col cols="12" md="6">
                <v-row dense>
                  <v-col v-for="(img, index) in galleryImages" :key="index" cols="6" md="6">
                    <v-img
                      :src="img"
                      height="170"
                      class="rounded cursor-pointer hover-effect d-none d-sm-flex"
                      cover
                      @click="openCarouselWithGalleryImage(index)"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>

          <!-- Second row: dorm details (left), price + info card (right) -->
          <v-col cols="12">
            <v-row>
              <!-- Dorm Details Left -->
              <v-col cols="12" md="6">
                <div ref="carouselSection"></div>

                <!-- Modified section - Title and Rating in the same line -->
                <div class="d-flex align-center justify-space-between mt-sm-0">
                  <h2 class="top font-weight-bold">
                    {{ dormDetails.name }}
                  </h2>

                  <!-- Rating display moved from gallery section to here -->
                  <div class="d-flex align-center">
                    <v-rating
                      :model-value="ratingStats.average || dormDetails.rating || 0"
                      color="amber"
                      size="small"
                      half-increments
                      readonly
                      density="compact"
                    ></v-rating>
                    <span class="ml-1 text-body-2">
                      {{ displayRating }}
                      <span class="text-caption">({{ ratingStats.count || 0 }})</span>
                    </span>
                  </div>
                </div>
                <!-- End modified section -->

                <p class="down mb-5">
                  {{ dormDetails.number_of_room }} rooms | {{ dormDetails.room_capacity }} beds/room
                  | 3 private baths | Female dorm
                </p>

                <hr />
                <br />
                <!-- Owner info moved under main image -->
                <div class="owner-detail">
                  <p class="mb-0 font-weight-bold">Hosted by {{ dormDetails.owner }}</p>
                  <p class="mb-0">Owner</p>
                </div>

                <br />
                <hr />
                <br />
                <h4 class="mb-3 contact-details">Contact Details</h4>

                <v-row class="text-center">
                  <!-- Messenger - Consistent event handling with toggle functions -->
                  <v-col cols="6">
                    <v-btn
                      class="w-100 d-flex align-center justify-center messenger-btn"
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

                  <!-- Phone - Consistent event handling with toggle functions -->
                  <v-col cols="6">
                    <v-btn
                      class="w-100 d-flex align-center justify-center phone-btn"
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
                <h3 class="mt-2 mb-3">Ratings</h3>
                <v-btn
                  variant="text"
                  color="primary"
                  density="comfortable"
                  @click="openReviewModal"
                  class="ms-2 text-none"
                >
                  <v-icon size="small" class="me-1">mdi-comment-text-outline</v-icon>
                  View Ratings
                </v-btn>
              </v-col>

              <!-- Right column: Price + Details Card -->
              <v-col cols="12" md="6">
                <div class="d-flex justify-center mb-4">
                  <v-btn class="price-btn">
                    <v-icon class="me-4" size="24">mdi-tag</v-icon>
                    Prices included all fees
                  </v-btn>
                </div>

                <v-row class="details-card mx-sm-md-5 px-10" no-gutters>
                  <v-col cols="12">
                    <div class="d-flex justify-content-between align-items-center mt-3">
                      <span class="price"
                        >₱{{ dormDetails.price }} <span class="text-caption">Monthly</span></span
                      >
                      <v-btn
                        variant="outlined"
                        prepend-icon="mdi-map-marker"
                        @click="viewOnMap"
                        class="view-map-btn ms-auto"
                      >
                        View in Map
                      </v-btn>
                    </div>
                    <br />
                    <hr />
                    <br />
                  </v-col>

                  <!-- Left info -->
                  <v-col cols="12" md="5">
                    <p class="my-4">
                      <strong>Distance:</strong> {{ dormDetails.distance_to_campus }}
                    </p>
                    <hr />
                    <p class="my-4">
                      <strong>Room number:</strong> {{ dormDetails.number_of_room }}
                    </p>
                    <hr />
                    <p class="my-4"><strong>Amenities:</strong> {{ dormDetails.amenity }}</p>
                    <hr />
                  </v-col>

                  <!-- Spacer -->
                  <v-col cols="12" md="2"> </v-col>

                  <!-- Right info -->
                  <v-col cols="12" md="5">
                    <p class="my-4">
                      <strong>Room Capacity:</strong> {{ dormDetails.room_capacity }}
                    </p>
                    <hr />
                    <p class="my-4"><strong>Room Type:</strong> {{ dormDetails.room_type }}</p>
                    <hr />
                    <p class="my-4">
                      <strong>Availability:</strong>
                      {{ dormDetails.availability_status ? 'Yes' : 'No' }}
                    </p>
                    <hr />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- DormitoryReview Modal Component -->
        <DormitoryReview
          :dorm-id="dormId"
          :is-open="showReviewModal"
          :initial-ratings="dormRatings"
          @close="closeReviewModal"
          @rating-updated="handleRatingUpdated"
          @submit-rating="handleSubmitRating"
        />
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
  margin-bottom: 10px;
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

.messenger-btn,
.phone-btn {
  background-color: #0c3b2e; /* Facebook Blue */
  color: white;
}

.messenger-btn:hover {
  background-color: #b19470;
}

.phone-btn:hover {
  background-color: #b19470;
}

.cursor-pointer {
  cursor: pointer;
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

.text-none {
  text-transform: none;
}

/* Modal Carousel Overlay Styles */
.carousel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.carousel-modal {
  width: 90%;
  max-width: 1200px;
  background-color: transparent;
  border-radius: 8px;
  position: relative;
  max-height: 90vh;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1001;
  background-color: rgba(255, 255, 255, 0.7) !important;
}

.hover-effect {
  position: relative;
}

.hover-effect::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.3); /* Light white overlay */
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1;
}

.hover-effect:hover::after {
  opacity: 1;
}

.owner-detail {
  font-size: 18px;
}

.contact-details {
  font-size: 18px;
}
</style>
