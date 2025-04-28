<script setup>
import { onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useMapStore } from '@/stores/mapStore'

const router = useRouter()
const route = useRoute()
const mapStore = useMapStore()

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

// Setup Global Event Listeners
const setupGlobalEventListeners = () => {
  // Global listener for all map-related buttons
  document.addEventListener('click', handleDocumentClick)
}

// Handle document clicks
const handleDocumentClick = (event) => {
  // Handle path buttons
  mapStore.handleGlobalClick(event)

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
      <div class="full-map-container">
        <div v-if="mapStore.isLoading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <div class="loading-text">Getting your location...</div>
        </div>
        <div v-if="mapStore.error" class="error-message">
          {{ mapStore.error }}
          <button @click="mapStore.fetchBoardingHouses" class="retry-button">Retry</button>
        </div>
        <div id="map" class="full-map"></div>
        <div class="button-container">
          <button @click="mapStore.getUserLocation" class="map-button location-button">
            <i class="mdi mdi-crosshairs-gps"></i> Get Your Location
          </button>
          <button
            @click="mapStore.clearPath"
            class="map-button clear-button"
            :disabled="!mapStore.hasPath"
          >
            <i class="mdi mdi-map-marker-path"></i> Clear Path
          </button>
        </div>

        <!-- Added accessibility options and controls -->
        <div class="map-controls">
          <button @click="mapStore.zoomIn()" class="control-button" title="Zoom In">
            <i class="mdi mdi-plus"></i>
          </button>
          <button @click="mapStore.zoomOut()" class="control-button" title="Zoom Out">
            <i class="mdi mdi-minus"></i>
          </button>
          <button @click="mapStore.resetView()" class="control-button" title="Reset View">
            <i class="mdi mdi-home"></i>
          </button>
        </div>

        <!-- Added a legend -->
        <div class="map-legend">
          <h4>Map Legend</h4>
          <div class="legend-item">
            <div class="legend-color reference-marker"></div>
            <span>Reference Point</span>
          </div>
          <div class="legend-item">
            <div class="legend-color dorm-marker"></div>
            <span>Dormitory</span>
          </div>
          <div class="legend-item">
            <div class="legend-color user-marker"></div>
            <span>Your Location</span>
          </div>
          <div class="legend-item">
            <div class="legend-color path-line"></div>
            <span>Path</span>
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

.loading-spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #0c3b2e;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #0c3b2e;
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

.retry-button {
  background-color: #b91c1c;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #dc2626;
}

.warning-icon {
  color: #b91c1c;
  margin-left: 5px;
}

/* Added map controls */
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

.control-button:hover {
  background-color: #f3f4f6;
  transform: translateY(-1px);
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

.map-legend h4 {
  margin-top: 0;
  margin-bottom: 8px;
  text-align: center;
  font-size: 14px;
  color: #0c3b2e;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 5px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 12px;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .button-container {
    bottom: 20px;
    right: 10px;
  }

  .map-button {
    padding: 10px 15px;
    font-size: 14px;
  }

  .map-legend {
    bottom: 20px;
    left: 10px;
    width: 150px;
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
