<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import AppLayout from '@/components/layout/AppLayout.vue'

// Get the router instance
const router = useRouter()

// State variables
const map = ref(null)
const currentMarker = ref(null)
const currentPath = ref(null)
const currentZoom = ref(13)
const defaultCoords = [8.9557, 125.5969]
const referencePoint = [8.9555, 125.597]
const referenceMarker = ref(null)

const boardingHouses = [
  {
    id: 1,
    name: 'Blue Heaven Dormitory',
    coords: [8.9536896, 125.6003645],
    price: '₱3,500/month',
    route: { name: 'blueboardinghousedetails' },
  },
  {
    id: 2,
    name: 'Green Oasis Boarding',
    coords: [8.9525, 125.598],
    price: '₱4,000/month',
    route: { name: 'greenboardinghousedetails' },
  },
]

// Calculate distance between two coordinates in meters
const calculateDistance = (coords1, coords2) => {
  const point1 = L.latLng(coords1[0], coords1[1])
  const point2 = L.latLng(coords2[0], coords2[1])
  const distanceInMeters = point1.distanceTo(point2)

  if (distanceInMeters >= 1000) {
    return `${(distanceInMeters / 1000).toFixed(2)} km`
  } else {
    return `${Math.round(distanceInMeters)} m`
  }
}

// Initialize the map when component mounts
onMounted(async () => {
  await nextTick()

  map.value = L.map('map', {
    zoomAnimation: true,
    fadeAnimation: true,
    markerZoomAnimation: true,
  }).setView(defaultCoords, currentZoom.value)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map.value)

  // Add marker for reference point
  referenceMarker.value = L.marker(referencePoint, {
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

  addBoardingHouseMarkers()

  // Enable clicking on the map to place a temporary marker
  map.value.on('click', (e) => {
    const clickedCoords = [e.latlng.lat, e.latlng.lng]

    if (currentMarker.value) {
      map.value.removeLayer(currentMarker.value)
    }

    map.value.closePopup()

    const popupContent = `
      <div>
        <p><strong>Selected Location</strong></p>
        <p><strong>Distance from reference point:</strong> ${calculateDistance(referencePoint, clickedCoords)}</p>
        <button id="drawPathBtn" style="background-color: #0c3b2e; color: white; padding: 5px 10px; border: none; cursor: pointer; border-radius: 4px;">Draw Path to Reference</button>
      </div>
    `

    currentMarker.value = L.marker(clickedCoords).addTo(map.value).bindPopup(popupContent)

    setTimeout(() => {
      if (currentMarker.value) {
        currentMarker.value.openPopup()

        const button = document.getElementById('drawPathBtn')
        if (button) {
          button.addEventListener('click', () => {
            drawPath(clickedCoords, referencePoint)
          })
        }
      }
    }, 10)
  })

  // Handle zoom events carefully
  map.value.on('zoomstart', () => {
    map.value.closePopup()
  })

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
    const distance = calculateDistance(referencePoint, house.coords)

    const popupContent = `
      <div style="width: 200px">
        <h3 style="margin: 4px 0; font-weight: bold">${house.name}</h3>
        <p style="margin: 4px 0"><strong>Price:</strong> ${house.price}</p>
        <p style="margin: 4px 0"><strong>Distance from reference point:</strong> ${distance}</p>
        <div style="display: flex; gap: 5px; flex-direction: column; margin-top: 10px;">
          <button id="drawPathBtn-${house.id}" style="background-color: #0c3b2e; color: white; padding: 5px 10px; border: none; cursor: pointer; border-radius: 4px;">Draw Path</button>
          <button id="viewDetailsBtn-${house.id}" style="background-color: #2563eb; color: white; padding: 5px 10px; border: none; cursor: pointer; border-radius: 4px;">View Details</button>
        </div>
      </div>
    `

    const marker = L.marker(house.coords, { icon: boardingHouseIcon })
      .addTo(map.value)
      .bindPopup(popupContent, { autoPan: true })

    // Add click handler to the marker itself
    marker.on('click', () => {
      // Close all other popups first
      map.value.closePopup()

      // Open this popup
      marker.openPopup()

      // Add event listeners with a delay to ensure DOM is ready
      setTimeout(() => {
        // Path button event listener
        const pathButton = document.getElementById(`drawPathBtn-${house.id}`)
        if (pathButton) {
          // Remove existing event listeners to prevent duplicates
          const newPathButton = pathButton.cloneNode(true)
          pathButton.parentNode.replaceChild(newPathButton, pathButton)

          newPathButton.addEventListener('click', () => {
            drawPath(house.coords, referencePoint)
          })
        }

        // Details button event listener
        const detailsButton = document.getElementById(`viewDetailsBtn-${house.id}`)
        if (detailsButton) {
          // Remove existing event listeners to prevent duplicates
          const newDetailsButton = detailsButton.cloneNode(true)
          detailsButton.parentNode.replaceChild(newDetailsButton, detailsButton)

          newDetailsButton.addEventListener('click', () => {
            // Navigate to the boarding house details page
            router.push(house.route)
          })
        }
      }, 10)
    })
  })
}

// Draw a path between two coordinates
const drawPath = (fromCoords, toCoords) => {
  // Remove existing path if there is one
  if (currentPath.value) {
    map.value.removeLayer(currentPath.value)
  }

  // Create a line between the two points
  currentPath.value = L.polyline([fromCoords, toCoords], {
    color: '#ff6b6b',
    weight: 4,
    opacity: 0.8,
    dashArray: '10, 10',
    lineJoin: 'round',
  }).addTo(map.value)

  // Fit the map bounds to show the entire path
  map.value.fitBounds(currentPath.value.getBounds(), {
    padding: [50, 50],
    maxZoom: 16,
  })

  return currentPath.value
}

const getUserLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userCoords = [position.coords.latitude, position.coords.longitude]

      map.value.closePopup()
      map.value.setView(userCoords, currentZoom.value)

      if (currentMarker.value) {
        map.value.removeLayer(currentMarker.value)
      }

      const distanceFromReference = calculateDistance(referencePoint, userCoords)

      const popupContent = `
        <div>
          <p><strong>You are here!</strong></p>
          <p><strong>Distance from reference point:</strong> ${distanceFromReference}</p>
          <button id="userLocationPathBtn" style="background-color: #0c3b2e; color: white; padding: 5px 10px; border: none; cursor: pointer; border-radius: 4px; margin-top: 5px;">Draw Path to Reference</button>
        </div>
      `

      currentMarker.value = L.marker(userCoords).addTo(map.value).bindPopup(popupContent)

      setTimeout(() => {
        if (currentMarker.value) {
          currentMarker.value.openPopup()

          const pathButton = document.getElementById('userLocationPathBtn')
          if (pathButton) {
            pathButton.addEventListener('click', () => {
              drawPath(userCoords, referencePoint)
            })
          }
        }
      }, 100)
    },
    (error) => {
      console.error('Geolocation error:', error)
      alert(`Error getting location: ${error.message}`)
    },
  )
}

// Clear the path
const clearPath = () => {
  if (currentPath.value) {
    map.value.removeLayer(currentPath.value)
    currentPath.value = null
  }
}
</script>

<template>
  <AppLayout>
    <template #content>
      <div class="full-map-container">
        <div id="map" class="full-map"></div>
        <div class="button-container">
          <button @click="getUserLocation" class="map-button">Get Your Location</button>
          <button @click="clearPath" class="map-button clear-button">Clear Path</button>
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
  transition: background-color 0.3s;
  border: none;
  border-radius: 4px;
}

.map-button:hover {
  background-color: #ffba00;
}

.clear-button {
  background-color: #d64545;
}

.clear-button:hover {
  background-color: #f05252;
}
</style>
