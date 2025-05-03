<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBoardingHouseStore } from '@/stores/boardingHouse'
import { useTheme } from 'vuetify'
import AppLayout from '@/components/layout/AppLayout.vue'
import DormitoryReview from '@/components/system/DormitoryReview.vue'
import { dormImageMap } from '@/stores/dormImages'
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
const searchQuery = ref('') // Add search query ref for local handling

// Get the Vuetify theme
const theme = useTheme()

// Determine if dark mode is active
const isDarkMode = computed(() => theme.global.name.value === 'dark')

// Get the store
const boardingHouseStore = useBoardingHouseStore()

// Use a defensive approach to access store properties
const selectedBoardingHouse = computed(() => boardingHouseStore.selectedBoardingHouse)
const loading = computed(() => boardingHouseStore.loading)
const errorMessage = computed(() => boardingHouseStore.errorMessage)
const allBoardingHouses = computed(() => boardingHouseStore.boardingHouses || [])

// Safe computed property for dorm details
const dormDetails = computed(() => selectedBoardingHouse.value)

// Computed property for the display rating
const displayRating = computed(() => {
  const rating = ratingStats.value.average || (dormDetails.value?.rating ?? 0)
  return rating.toFixed(1)
})

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

// New function to handle search
const handleSearch = async (query) => {
  if (!query.trim()) return // Don't search if query is empty

  searchQuery.value = query

  // Make sure we have all boarding houses loaded
  if (!allBoardingHouses.value.length) {
    // If not already loaded, fetch all boarding houses
    await boardingHouseStore.fetchBoardingHouses()
  }

  // Search for matching dormitory
  const matchingDorm = allBoardingHouses.value.find((dorm) =>
    dorm.name.toLowerCase().includes(query.toLowerCase()),
  )

  if (matchingDorm) {
    // If we found a match, navigate to its details page
    router.push({
      name: 'dorm-details',
      params: { id: matchingDorm.id },
    })
  } else {
    // Optional: Handle no results found
    console.log('No dormitories found matching:', query)
    // Could show a notification/alert here
  }
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

    // Make sure we have all boarding houses loaded for searching
    if (!allBoardingHouses.value.length) {
      boardingHouseStore.fetchBoardingHouses()
    }
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
      fetchRatings() // Refetch ratings when dorm changes
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
  <AppLayout @search="handleSearch">
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

                <hr class="divider" />
                <br />
                <!-- Owner info moved under main image -->
                <div class="owner-detail">
                  <p class="mb-0 font-weight-bold">Hosted by {{ dormDetails.owner }}</p>
                  <p class="mb-0">Owner</p>
                </div>

                <br />
                <hr class="divider" />
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
                          class="text-capitalize contact-link"
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
                          class="text-capitalize contact-link"
                        >
                          {{ dormDetails.contact_number }}
                        </v-btn>
                      </div>
                    </v-expand-transition>
                  </v-col>
                </v-row>

                <br />
                <hr class="divider" />
                <br />
                <p class="text-body-2 d-flex align-center font-weight-bold">
                  <v-icon class="mr-2" :color="isDarkMode ? 'white' : 'black'"
                    >mdi-map-marker-outline</v-icon
                  >
                  {{ dormDetails.address }}
                </p>
                <p class="font-weight-bold mb-4 ps-7">{{ dormDetails.distance_to_campus }} away</p>
                <hr class="divider" />
                <h3 class="mt-2 mb-3">Ratings</h3>
                <v-btn
                  variant="text"
                  density="comfortable"
                  @click="openReviewModal"
                  class="ms-2 text-none mb-4"
                >
                  <v-icon size="small" class="me-1">mdi-comment-text-outline</v-icon>
                  View Ratings
                </v-btn>
                <hr class="divider" />
              </v-col>

              <!-- Right column: Price + Details Card -->
              <v-col cols="12" md="6">
                <div class="d-flex justify-center mb-4">
                  <v-btn class="price-btn">
                    <v-icon class="me-4" size="24">mdi-tag</v-icon>
                    Prices included all fees
                  </v-btn>
                </div>

                <v-row
                  class="details-card mx-sm-md-5 px-10"
                  :class="{ 'dark-details-card': isDarkMode }"
                  no-gutters
                >
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
                    <hr class="card-divider" />
                    <br />
                  </v-col>

                  <!-- Left info -->
                  <v-col cols="12" md="5">
                    <p class="my-4">
                      <strong>Distance:</strong> {{ dormDetails.distance_to_campus }}
                    </p>
                    <hr class="card-divider" />
                    <p class="my-4">
                      <strong>Room number:</strong> {{ dormDetails.number_of_room }}
                    </p>
                    <hr class="card-divider" />
                    <p class="my-4"><strong>Amenities:</strong> {{ dormDetails.amenity }}</p>
                    <hr class="card-divider" />
                  </v-col>

                  <!-- Spacer -->
                  <v-col cols="12" md="2"> </v-col>

                  <!-- Right info -->
                  <v-col cols="12" md="5">
                    <p class="my-4">
                      <strong>Room Capacity:</strong> {{ dormDetails.room_capacity }}
                    </p>
                    <hr class="card-divider" />
                    <p class="my-4"><strong>Room Type:</strong> {{ dormDetails.room_type }}</p>
                    <hr class="card-divider" />
                    <p class="my-4">
                      <strong>Availability:</strong>
                      {{ dormDetails.availability_status ? 'Yes' : 'No' }}
                    </p>
                    <hr class="card-divider" />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

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
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
  color: black;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.details-card:hover {
  border: 1px solid #0c3b2e; /* Light blue glow border */
  box-shadow: 0 0 10px #0c3b2e; /* Outer glow effect */
}

.dark-details-card {
  background: #1e453e;
  color: white;
}

.price {
  font-size: 24px;
  font-weight: bold;
}

.messenger-btn,
.phone-btn {
  background-color: #0c3b2e;
  color: white;
  height: 45px;
}

.messenger-btn:hover,
.phone-btn:hover {
  background-color: #ffba00;
}

.cursor-pointer {
  cursor: pointer;
}

/* Theme aware dividers */
.divider {
  opacity: 0.2;
}

.card-divider {
  opacity: 0.3;
}

:deep(.v-theme--dark) .contact-link {
  color: #ffba00;
}

:deep(.v-theme--light) .contact-link {
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

.text-none {
  text-transform: none;
}

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
  background-color: rgba(12, 59, 46, 0.5); /* Light white overlay */
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
