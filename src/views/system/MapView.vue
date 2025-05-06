<script setup>
import { onMounted, onBeforeUnmount, nextTick, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useMapStore } from '@/stores/mapStore'
import { useTheme } from 'vuetify'

const router = useRouter()
const route = useRoute()
const mapStore = useMapStore()
const theme = useTheme()
const isDarkMode = computed(() => theme.global.name.value === 'dark')
const routeInfo = ref(null)

const viewBoardingHouseDetails = (houseId) => {
  // Convert to number if your IDs are numeric
  const numericId = parseInt(houseId, 10)

  // Log for debugging
  console.log('Looking for house with ID:', houseId)
  console.log(
    'Available house IDs:',
    mapStore.boardingHouses.map((h) => h.id),
  )

  // First check if the house exists in our store
  const house = mapStore.boardingHouses.find((h) => h.id === numericId)

  if (!house) {
    console.log('House not found with ID:', houseId)
    return
  }

  console.log('Found house:', house.name, 'navigating to details page')

  // Navigate to the dorm-details route with the house ID
  router.push({
    name: 'dorm-details',
    params: { id: numericId.toString() },
  })
}

// ORS-specific function to handle path drawing
const handlePathDrawing = async (fromCoords, toCoords) => {
  try {
    routeInfo.value = null
    await mapStore.drawPath(fromCoords, toCoords)
  } catch (err) {
    console.error('Error in handlePathDrawing:', err)
  }
}

// Setup Global Event Listeners
const setupGlobalEventListeners = () => {
  // Global listener for all map-related buttons
  document.addEventListener('click', handleDocumentClick)
}

// Handle document clicks
const handleDocumentClick = (event) => {
  // Handle path buttons
  if (event.target && event.target.matches('.path-button')) {
    // Close any open popups before drawing the path
    if (mapStore.map) mapStore.map.closePopup()

    const fromCoords = event.target.getAttribute('data-from').split(',').map(Number)
    const toCoords = event.target.getAttribute('data-to').split(',').map(Number)

    if (fromCoords.length === 2 && toCoords.length === 2) {
      handlePathDrawing(fromCoords, toCoords)
    }
  }

  // Handle view details buttons
  if (event.target && event.target.matches('.view-details-btn')) {
    const houseId = event.target.getAttribute('data-house-id')
    if (houseId) {
      // Close any open popups before navigation
      if (mapStore.map) mapStore.map.closePopup()
      console.log('View details clicked for house ID:', houseId)
      // Use setTimeout to ensure popup closure completes before navigation
      setTimeout(() => {
        viewBoardingHouseDetails(houseId)
      }, 50)
    }
  }
}

// In your map component
onMounted(async () => {
  await nextTick()

  // Initialize the map
  const mapInitialized = mapStore.initializeMap('map')

  if (mapInitialized) {
    // Fetch boarding houses first
    await mapStore.fetchBoardingHouses()

    // Then set up global event listeners after data is loaded
    setupGlobalEventListeners()

    // Check if we need to highlight a specific dorm
    if (route.query.highlight && route.query.fromDetails) {
      const dormId = route.query.highlight
      console.log('Focusing on dorm with ID:', dormId)
      // Find the dorm and focus the map on it
      const success = mapStore.focusOnDorm(dormId)
      console.log('Focus successful:', success)
    }
  }
})

onBeforeUnmount(() => {
  // Remove event listeners
  document.removeEventListener('click', handleDocumentClick)

  // Clean up map resources
  mapStore.cleanup()
})
</script>

<template>
  <AppLayout>
    <template #content>
      <div
        class="full-map-container"
        :class="{ 'dark-theme': isDarkMode, 'light-theme': !isDarkMode }"
      >
        <div
          v-if="mapStore.isLoading"
          class="loading-overlay"
          :class="{ 'dark-loading': isDarkMode }"
        >
          <div class="loading-spinner" :class="{ 'dark-spinner': isDarkMode }"></div>
          <div class="loading-text" :class="{ 'dark-text': isDarkMode }">
            {{ mapStore.currentPath ? 'Calculating route...' : 'Loading map data...' }}
          </div>
        </div>
        <div v-if="mapStore.error" class="error-message" :class="{ 'dark-error': isDarkMode }">
          {{ mapStore.error }}
          <button
            @click="mapStore.fetchBoardingHouses"
            class="retry-button"
            :class="{ 'dark-retry': isDarkMode }"
          >
            Retry
          </button>
        </div>
        <div id="map" class="full-map"></div>

        <!-- ORS Route Info Panel (only shows when available) -->
        <div v-if="routeInfo" class="route-info-panel" :class="{ 'dark-route-info': isDarkMode }">
          <h4>Route Information</h4>
          <p><strong>Distance:</strong> {{ routeInfo.distance }} km</p>
          <p><strong>Estimated Time:</strong> {{ routeInfo.duration }} min</p>
          <button @click="routeInfo = null" class="close-button">
            <i class="mdi mdi-close"></i>
          </button>
        </div>

        <div class="button-container">
          <button
            @click="mapStore.getUserLocation"
            class="map-button location-button"
            :class="{ 'dark-button': isDarkMode }"
          >
            <i class="mdi mdi-crosshairs-gps"></i> Get Your Location
          </button>
          <button
            @click="mapStore.clearPath"
            class="map-button clear-button"
            :class="{ 'dark-button': isDarkMode }"
            :disabled="!mapStore.hasPath"
          >
            <i class="mdi mdi-map-marker-path"></i> Clear Path
          </button>
        </div>

        <!-- Map controls -->
        <div class="map-controls">
          <button
            @click="mapStore.zoomIn()"
            class="control-button"
            :class="{ 'dark-control': isDarkMode }"
            title="Zoom In"
          >
            <i class="mdi mdi-plus"></i>
          </button>
          <button
            @click="mapStore.zoomOut()"
            class="control-button"
            :class="{ 'dark-control': isDarkMode }"
            title="Zoom Out"
          >
            <i class="mdi mdi-minus"></i>
          </button>
          <button
            @click="mapStore.resetView()"
            class="control-button"
            :class="{ 'dark-control': isDarkMode }"
            title="Reset View"
          >
            <i class="mdi mdi-home"></i>
          </button>
        </div>

        <!-- Map legend -->
        <div class="map-legend" :class="{ 'dark-legend': isDarkMode }">
          <h4 :class="{ 'dark-legend-title': isDarkMode }">Map Legend</h4>
          <div class="legend-item">
            <div class="legend-color reference-marker"></div>
            <span :class="{ 'dark-legend-text': isDarkMode }">Reference Point</span>
          </div>
          <div class="legend-item">
            <div class="legend-color dorm-marker"></div>
            <span :class="{ 'dark-legend-text': isDarkMode }">Dormitory</span>
          </div>
          <div class="legend-item">
            <div class="legend-color user-marker"></div>
            <span :class="{ 'dark-legend-text': isDarkMode }">Your Location</span>
          </div>
          <div class="legend-item">
            <div class="legend-color path-line"></div>
            <span :class="{ 'dark-legend-text': isDarkMode }">Walking Path</span>
          </div>
        </div>
      </div>
    </template>
  </AppLayout>
</template>

<style scoped>
.full-map-container {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.full-map {
  width: 100%;
  height: 100%;
}

.light-theme {
  background-color: #ffffff;
}

.dark-theme {
  background-color: #121212;
}

.button-container {
  position: absolute;
  bottom: 40px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.map-button {
  background-color: #0c3b2e;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.map-button:hover {
  background-color: #ffba00;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.map-button:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.dark-button {
  background-color: #0a2e23;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dark-button:hover {
  background-color: #ffba00;
}

.map-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

.map-button:disabled:hover {
  background-color: #9ca3af;
  transform: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.location-button {
  background-color: #3b82f6;
}

.location-button:hover {
  background-color: #2563eb;
}

.clear-button {
  background-color: #d64545;
}

.clear-button:hover {
  background-color: #f05252;
}

.route-info-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: white;
  border-radius: 4px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 250px;
  border-left: 4px solid #ff6b6b;
}

.dark-route-info {
  background-color: #1d3731;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.route-info-panel h4 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  color: #0c3b2e;
}

.dark-route-info h4 {
  color: #ffba00;
}

.route-info-panel p {
  margin: 5px 0;
  font-size: 14px;
}

.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #666;
}

.dark-route-info .close-button {
  color: #aaa;
}

.close-button:hover {
  color: #ff6b6b;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.dark-loading {
  background-color: rgba(18, 18, 18, 0.8);
}

.loading-spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #0c3b2e;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.dark-spinner {
  border: 5px solid #333333;
  border-top: 5px solid #ffba00;
}

.loading-text {
  margin-top: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #0c3b2e;
}

.dark-text {
  color: #ffba00;
}

.error-message {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fee2e2;
  border: 1px solid #f87171;
  padding: 12px 20px;
  border-radius: 4px;
  color: #b91c1c;
  font-weight: bold;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark-error {
  background-color: #4c1d1d;
  border: 1px solid #b91c1c;
  color: #fca5a5;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.retry-button {
  background-color: #b91c1c;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dark-retry {
  background-color: #ef4444;
}

.retry-button:hover {
  background-color: #dc2626;
}

.warning-icon {
  color: #b91c1c;
  margin-left: 5px;
}

.map-controls {
  position: absolute;
  top: 80px;
  left: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.control-button {
  background-color: white;
  color: #0c3b2e;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.dark-control {
  background-color: #1d3731;
  color: #ffba00;
  border: 1px solid #2d4f47;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.control-button:hover {
  background-color: #f3f4f6;
  transform: translateY(-1px);
}

.dark-control:hover {
  background-color: #2d4f47;
}

.map-legend {
  position: absolute;
  bottom: 40px;
  left: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 180px;
}

.dark-legend {
  background-color: rgba(29, 55, 49, 0.9);
  border: 1px solid #2d4f47;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.map-legend h4 {
  margin-top: 0;
  margin-bottom: 8px;
  text-align: center;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 5px;
}

.dark-legend-title {
  color: #ffba00;
  border-bottom: 1px solid #2d4f47;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 12px;
}

.dark-legend-text {
  color: #ffffff;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
}

.reference-marker {
  background-color: #ffba00;
}

.dorm-marker {
  background-color: #0c3b2e;
}

.user-marker {
  background-color: #3b82f6;
}

.path-line {
  background-color: #ff6b6b;
  border-radius: 0;
  height: 3px;
}

@media (max-width: 768px) {
  .button-container {
    bottom: 20px;
    right: 10px;
  }

  .map-button {
    padding: 10px 15px;
    font-size: 14px;
  }

  .route-info-panel {
    top: 10px;
    right: 10px;
    max-width: 200px;
    padding: 10px;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
