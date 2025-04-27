<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import { supabase } from '@/utils/supabase'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()

const map = ref(null)
const currentMarker = ref(null)
const currentPath = ref(null)
const currentZoom = ref(10)
const referencePoint = [8.9555, 125.597]
const referenceMarker = ref(null)
const boardingHouses = ref([])
const isLoading = ref(true)
const error = ref(null)
const markers = ref([])

// Utility Functions
const calculateDistance = (coords1, coords2) => {
  const point1 = L.latLng(coords1[0], coords1[1])
  const point2 = L.latLng(coords2[0], coords2[1])
  const distanceInMeters = point1.distanceTo(point2)
  return distanceInMeters >= 1000
    ? `${(distanceInMeters / 1000).toFixed(2)} km`
    : `${Math.round(distanceInMeters)} m`
}

const isValidCoordinates = (lat, lng) => {
  return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

// View Boarding House Details
const viewBoardingHouseDetails = (houseId) => {
  const house = boardingHouses.value.find((h) => h.id === houseId)
  if (!house) return

  if (router.hasRoute(house.route.name)) {
    router.push(house.route)
  } else {
    alert(`Detail page for ${house.name} is not available yet.`)
  }
}

// Fetch Boarding Houses
const fetchBoardingHouses = async () => {
  isLoading.value = true
  error.value = null
  clearBoardingHouseMarkers()

  try {
    const { data, error: supabaseError } = await supabase
      .from('dormitories')
      .select(
        'id, name, latitude, longitude, price, address, contact_number, number_of_room, room_capacity, room_type, amenity, availability_status, distance_to_campus, image, owner',
      )

    if (supabaseError) throw supabaseError

    boardingHouses.value = (data || []).map((house) => {
      const lat = parseFloat(house.latitude)
      const lng = parseFloat(house.longitude)
      const isValid = isValidCoordinates(lat, lng)
      const coords = isValid ? [lat, lng] : [...referencePoint]

      return {
        id: house.id,
        name: house.name,
        coords,
        hasValidCoords: isValid,
        price: house.price || 'Price not specified',
        address: house.address || 'Address not specified',
        contact: house.contact_number,
        amenities: house.amenity,
        roomType: house.room_type,
        roomCapacity: house.room_capacity,
        availability: house.availability_status,
        image: house.image,
        route: { name: 'boarding-house-details', params: { id: house.id } },
        distance: calculateDistance(referencePoint, coords),
      }
    })

    if (map.value) {
      addBoardingHouseMarkers()
    }
  } catch (err) {
    error.value = `Failed to load boarding houses: ${err.message || 'Unknown error'}`
  } finally {
    isLoading.value = false
  }
}

// Clear Boarding House Markers
const clearBoardingHouseMarkers = () => {
  if (markers.value.length && map.value) {
    markers.value.forEach((marker) => {
      if (map.value.hasLayer(marker)) map.value.removeLayer(marker)
    })
    markers.value = []
  }
}

// Get User Location
const getUserLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser')
    return
  }

  isLoading.value = true
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userCoords = [position.coords.latitude, position.coords.longitude]

      if (map.value) {
        if (currentMarker.value) map.value.removeLayer(currentMarker.value)

        const userIcon = L.divIcon({
          html: `<div style="background-color: #3b82f6; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;"><i class="mdi mdi-account-location"></i></div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        })

        currentMarker.value = L.marker(userCoords, { icon: userIcon }).addTo(map.value).bindPopup(`
          <div>
            <p><strong>Your Location</strong></p>
            <p><strong>Coordinates:</strong> ${userCoords[0].toFixed(6)}, ${userCoords[1].toFixed(6)}</p>
            <p><strong>Distance from reference point:</strong> ${calculateDistance(referencePoint, userCoords)}</p>
            <button id="drawPathToReferenceBtn" class="path-button" data-from="${userCoords[0]},${userCoords[1]}" data-to="${referencePoint[0]},${referencePoint[1]}" style="background-color: #0c3b2e; color: white; padding: 5px 10px; border: none; cursor: pointer; border-radius: 4px;">Draw Path to Reference</button>
          </div>
        `)

        map.value.setView(userCoords, 15)
        currentMarker.value.openPopup()
      }

      isLoading.value = false
    },
    (error) => {
      isLoading.value = false
      alert(`Unable to retrieve your location: ${error.message}`)
    },
    { enableHighAccuracy: true },
  )
}

// Clear Path
const clearPath = () => {
  if (currentPath.value && map.value) {
    map.value.removeLayer(currentPath.value)
    currentPath.value = null
  }
}

// Setup Global Event Listeners
const setupGlobalEventListeners = () => {
  // Global listener for path buttons
  document.addEventListener('click', (event) => {
    if (event.target && event.target.matches('.path-button')) {
      const fromCoords = event.target.getAttribute('data-from').split(',').map(Number)
      const toCoords = event.target.getAttribute('data-to').split(',').map(Number)

      if (fromCoords.length === 2 && toCoords.length === 2) {
        drawPath(fromCoords, toCoords)
      }
    }

    // Global listener for view details buttons
    if (event.target && event.target.matches('.view-details-btn')) {
      const houseId = event.target.getAttribute('data-house-id')
      if (houseId) {
        viewBoardingHouseDetails(houseId)
      }
    }
  })
}

// OnMounted: Initialize Map
onMounted(async () => {
  await nextTick()

  try {
    map.value = L.map('map', {
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
      zoomControl: false,
    }).setView(referencePoint, currentZoom.value)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map.value)

    referenceMarker.value = L.marker(referencePoint, {
      icon: L.divIcon({
        html: `<div style="background-color: #ffba00; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;"><i class="mdi mdi-map-marker"></i></div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      }),
    })
      .addTo(map.value)
      .bindPopup('Reference Point (Distance Measurement)')

    // Set up global event listeners
    setupGlobalEventListeners()

    fetchBoardingHouses()

    map.value.on('click', (e) => {
      const clickedCoords = [e.latlng.lat, e.latlng.lng]

      if (currentMarker.value && map.value) {
        map.value.removeLayer(currentMarker.value)
      }
      if (map.value) map.value.closePopup()

      const popupContent = `
        <div>
          <p><strong>Selected Location</strong></p>
          <p><strong>Coordinates:</strong> ${clickedCoords[0].toFixed(6)}, ${clickedCoords[1].toFixed(6)}</p>
          <p><strong>Distance from reference point:</strong> ${calculateDistance(referencePoint, clickedCoords)}</p>
          <button class="path-button" data-from="${clickedCoords[0]},${clickedCoords[1]}" data-to="${referencePoint[0]},${referencePoint[1]}" style="background-color: #0c3b2e; color: white; padding: 5px 10px; border: none; cursor: pointer; border-radius: 4px;">Draw Path to Reference</button>
        </div>
      `

      currentMarker.value = L.marker(clickedCoords).addTo(map.value).bindPopup(popupContent)
      currentMarker.value.openPopup()
    })

    map.value.on('zoomend', () => {
      currentZoom.value = map.value.getZoom()
    })
  } catch (err) {
    error.value = `Failed to initialize map: ${err.message || 'Unknown error'}`
    isLoading.value = false
  }
})

// Add Boarding House Markers
const addBoardingHouseMarkers = () => {
  if (!map.value) return

  const boardingHouseIcon = L.divIcon({
    html: `<div style="background-color: #0c3b2e; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;"><i class="mdi mdi-home-city"></i></div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

  boardingHouses.value.forEach((house) => {
    if (!house.hasValidCoords) return

    const popupContent = `
      <div style="width: 220px">
        <h3 style="margin: 4px 0; font-weight: bold">${house.name}</h3>
        <p><strong>Price:</strong> ₱${house.price}</p>
        <p><strong>Address:</strong> ${house.address}</p>
        <p><strong>Distance to Campus:</strong> ${house.distance}</p>
        <div style="display: flex; gap: 5px; flex-direction: column; margin-top: 10px;">
          <button class="path-button" data-from="${house.coords[0]},${house.coords[1]}" data-to="${referencePoint[0]},${referencePoint[1]}" style="background-color: #0c3b2e; color: white; padding: 5px 10px; border: none; cursor: pointer; border-radius: 4px;">Draw Path</button>
          <button class="view-details-btn" data-house-id="${house.id}" style="background-color: #2563eb; color: white; padding: 5px 10px; border: none; cursor: pointer; border-radius: 4px;">View Details</button>
        </div>
      </div>
    `

    const marker = L.marker(house.coords, { icon: boardingHouseIcon })
      .addTo(map.value)
      .bindPopup(popupContent)

    markers.value.push(marker)
  })
}

// Draw Path
const drawPath = (fromCoords, toCoords) => {
  if (currentPath.value && map.value) {
    map.value.removeLayer(currentPath.value)
  }

  // First, close any open popups before starting zoom/animation operations
  if (map.value) {
    map.value.closePopup()
  }

  currentPath.value = L.polyline([fromCoords, toCoords], {
    color: '#ff6b6b',
    weight: 4,
    opacity: 0.8,
    dashArray: '10,10',
    lineJoin: 'round',
  }).addTo(map.value)

  // Use animate: false to prevent the conflict during animation
  map.value.fitBounds(currentPath.value.getBounds(), {
    padding: [50, 50],
    maxZoom: 16,
    animate: false, // This is key to preventing the error
  })
}
</script>

<template>
  <AppLayout>
    <template #content>
      <div class="full-map-container">
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <div class="loading-text">Getting your location...</div>
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
          <button @click="fetchBoardingHouses" class="retry-button">Retry</button>
        </div>
        <div id="map" class="full-map"></div>
        <div class="button-container">
          <button @click="getUserLocation" class="map-button location-button">
            <i class="mdi mdi-crosshairs-gps"></i> Get Your Location
          </button>
          <button @click="clearPath" class="map-button clear-button" :disabled="!currentPath">
            <i class="mdi mdi-map-marker-path"></i> Clear Path
          </button>
        </div>

        <!-- Added accessibility options and controls -->
        <div class="map-controls">
          <button @click="map?.zoomIn()" class="control-button" title="Zoom In">
            <i class="mdi mdi-plus"></i>
          </button>
          <button @click="map?.zoomOut()" class="control-button" title="Zoom Out">
            <i class="mdi mdi-minus"></i>
          </button>
          <button
            @click="map?.setView(referencePoint, 15)"
            class="control-button"
            title="Reset View"
          >
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

/* Added map legend */
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
