<script setup>
import { ref, onMounted, nextTick } from 'vue'
import L from 'leaflet'
import AppLayout from '@/components/layout/AppLayout.vue'

// State variables
const map = ref(null)
const currentMarker = ref(null)
const currentZoom = ref(13)
const defaultCoords = [8.9557, 125.5969] // Initial map center

const referencePoint = [8.9555, 125.597] // Example: downtown or campus center

const boardingHouses = [
  {
    id: 1,
    name: 'Blue Heaven Dormitory',
    coords: [8.9536896, 125.6003645],
    price: '₱3,500/month',
  },
]

// Function to calculate distance between two coordinates in meters
const calculateDistance = (coords1, coords2) => {
  // Create Leaflet latLng objects
  const point1 = L.latLng(coords1[0], coords1[1])
  const point2 = L.latLng(coords2[0], coords2[1])

  // Calculate distance in meters
  const distanceInMeters = point1.distanceTo(point2)

  // Convert to kilometers if over 1000m
  if (distanceInMeters >= 1000) {
    return `${(distanceInMeters / 1000).toFixed(2)} km`
  } else {
    return `${Math.round(distanceInMeters)} m`
  }
}

// Initialize the map when component mounts
onMounted(async () => {
  await nextTick()

  map.value = L.map('map').setView(defaultCoords, currentZoom.value)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map.value)

  // Add marker for reference point (using a different icon to distinguish it)
  L.marker(referencePoint, {
    icon: L.divIcon({
      html: `
        <div style="
          background-color: #ffba00;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        ">
          <i class="mdi mdi-map-marker"></i>
        </div>
      `,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    }),
  })
    .addTo(map.value)
    .bindPopup('Reference Point (Distance Measurement)')
    .openPopup()

  addBoardingHouseMarkers()

  map.value.on('zoomend', () => {
    currentZoom.value = map.value.getZoom()
  })
})

const addBoardingHouseMarkers = () => {
  const boardingHouseIcon = L.divIcon({
    html: `
      <div style="
        background-color: #0c3b2e;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      ">
        <i class="mdi mdi-home-city"></i>
      </div>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

  boardingHouses.forEach((house) => {
    // Calculate distance from reference point to boarding house
    const distance = calculateDistance(referencePoint, house.coords)

    L.marker(house.coords, { icon: boardingHouseIcon }).addTo(map.value).bindPopup(`
        <div style="width: 200px">
          <h3 style="margin: 4px 0; font-weight: bold">${house.name}</h3>
          <p style="margin: 4px 0"><strong>Price:</strong> ${house.price}</p>
          <p style="margin: 4px 0"><strong>Distance from reference point:</strong> ${distance}</p>
        </div>
      `)
  })
}

const getUserLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userCoords = [position.coords.latitude, position.coords.longitude]

      map.value.setView(userCoords, currentZoom.value)

      if (currentMarker.value) {
        map.value.removeLayer(currentMarker.value)
      }

      // Calculate user's distance from reference point
      const distanceFromReference = calculateDistance(referencePoint, userCoords)

      currentMarker.value = L.marker(userCoords)
        .addTo(map.value)
        .bindPopup(
          `
          <div>
            <p><strong>You are here!</strong></p>
            <p><strong>Distance from reference point:</strong> ${distanceFromReference}</p>
          </div>
        `,
        )
        .openPopup()
    },
    (error) => {
      console.error('Geolocation error:', error)
      alert(`Error getting location: ${error.message}`)
    },
  )
}
</script>

<template>
  <AppLayout>
    <template #content>
      <div class="full-map-container">
        <div id="map" class="full-map"></div>
        <button @click="getUserLocation" class="location-button">Get Your Location</button>
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

.location-button {
  position: absolute;
  bottom: 40px;
  right: 20px;
  z-index: 1000;
  background-color: #0c3b2e;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.location-button:hover {
  background-color: #ffba00;
}
</style>
