// src/stores/mapStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import L from 'leaflet'
import 'leaflet-routing-machine' // Import Leaflet Routing Machine
import { supabase } from '@/utils/supabase'

export const useMapStore = defineStore('map', () => {
  // State
  const map = ref(null)
  const currentMarker = ref(null)
  const currentPath = ref(null)
  const routingControl = ref(null) // Add routing control reference
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

  const focusOnDorm = (dormId) => {
    // Convert to number if it's a string
    const numericId = parseInt(dormId, 10)

    // Find the boarding house
    const house = boardingHouses.value.find((house) => house.id === numericId)

    if (!house) {
      console.error(`Boarding house with ID ${dormId} not found`)
      return false
    }

    // Get the marker for this boarding house
    const marker = markers.value.find((m) => m.options.houseId === numericId)

    if (!marker) {
      console.error(`Marker for boarding house ${dormId} not found`)
      return false
    }

    // Pan to the marker with animation
    map.value.setView([house.coords[0], house.coords[1]], 18, {
      animate: true,
      duration: 1,
    })

    // Open the popup
    marker.openPopup()

    // Optionally highlight the marker
    if (marker._icon) {
      marker._icon.classList.add('highlighted-marker')

      // Set a timeout to remove the highlight after a few seconds
      setTimeout(() => {
        if (marker._icon) {
          marker._icon.classList.remove('highlighted-marker')
        }
      }, 3000)
    }

    return true
  }

  const isValidCoordinates = (lat, lng) => {
    return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
  }

  // Actions
  const initializeMap = (elementId) => {
    isLoading.value = true
    error.value = null

    try {
      map.value = L.map(elementId, {
        zoomAnimation: false,
        fadeAnimation: true,
        markerZoomAnimation: false,
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

      setupMapEvents()
      return true
    } catch (err) {
      error.value = `Failed to initialize map: ${err.message || 'Unknown error'}`
      isLoading.value = false
      return false
    }
  }

  const setupMapEvents = () => {
    if (!map.value) return

    map.value.on('click', (e) => {
      const clickedCoords = [e.latlng.lat, e.latlng.lng]

      // Close any open popups before creating a new marker
      if (map.value) map.value.closePopup()

      if (currentMarker.value && map.value) {
        map.value.removeLayer(currentMarker.value)
      }

      const popupContent = `
        <div>
          <p><strong>Selected Location</strong></p>
          <p><strong>Coordinates:</strong> ${clickedCoords[0].toFixed(6)}, ${clickedCoords[1].toFixed(6)}</p>
          <p><strong>Distance from reference point:</strong> ${calculateDistance(referencePoint, clickedCoords)}</p>
          <button class="path-button" data-from="${clickedCoords[0]},${clickedCoords[1]}" data-to="${referencePoint[0]},${referencePoint[1]}" style="background-color: #0c3b2e; color: white; padding: 5px 10px; border: none; cursor: pointer; border-radius: 4px;">Draw Path to Reference</button>
        </div>
      `

      currentMarker.value = L.marker(clickedCoords).addTo(map.value).bindPopup(popupContent)

      // Open popup after a short delay to avoid animation conflicts
      setTimeout(() => {
        currentMarker.value.openPopup()
      }, 100)
    })

    map.value.on('zoomend', () => {
      currentZoom.value = map.value.getZoom()
    })
  }

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

  const clearBoardingHouseMarkers = () => {
    if (markers.value.length && map.value) {
      markers.value.forEach((marker) => {
        if (map.value.hasLayer(marker)) map.value.removeLayer(marker)
      })
      markers.value = []
    }
  }

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

          map.value.closePopup()

          const userIcon = L.divIcon({
            html: `<div style="background-color: #3b82f6; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;"><i class="mdi mdi-account-location"></i></div>`,
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          })

          currentMarker.value = L.marker(userCoords, { icon: userIcon }).addTo(map.value)
            .bindPopup(`
            <div>
              <p><strong>Your Location</strong></p>
              <p><strong>Coordinates:</strong> ${userCoords[0].toFixed(6)}, ${userCoords[1].toFixed(6)}</p>
              <p><strong>Distance from reference point:</strong> ${calculateDistance(referencePoint, userCoords)}</p>
              <button id="drawPathToReferenceBtn" class="path-button" data-from="${userCoords[0]},${userCoords[1]}" data-to="${referencePoint[0]},${referencePoint[1]}" style="background-color: #0c3b2e; color: white; padding: 5px 10px; border: none; cursor: pointer; border-radius: 4px;">Draw Path to Reference</button>
            </div>
          `)

          const bounds = L.latLngBounds([userCoords, referencePoint])
          map.value.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 15,
            animate: false,
          })

          // Open popup after a short delay to avoid animation conflicts
          setTimeout(() => {
            currentMarker.value.openPopup()
          }, 300)
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

      const marker = L.marker(house.coords, {
        icon: boardingHouseIcon,
        houseId: house.id, // Add houseId to options for easy reference
      })
        .addTo(map.value)
        .bindPopup(popupContent)

      markers.value.push(marker)
    })
  }

  // Modified drawPath function to use Leaflet Routing Machine with improved handling
  const drawPath = (fromCoords, toCoords) => {
    // Close any open popups before drawing the path
    if (map.value) map.value.closePopup()

    // Remove existing path and routing control if they exist
    clearPath()

    // Create waypoints for the routing
    const waypoints = [L.latLng(fromCoords[0], fromCoords[1]), L.latLng(toCoords[0], toCoords[1])]

    // Options for custom routing service
    // Set to true and provide API key when ready for production
    const useCustomRouter = false

    let router = null
    if (useCustomRouter) {
      // Example with GraphHopper - You need to sign up for an API key
      // Make sure to install the lrm-graphhopper package if you use this option
      // npm install lrm-graphhopper --save
      router = L.Routing.graphHopper('your-api-key-here', {
        urlParameters: {
          vehicle: 'foot', // Use 'foot' for pedestrian routing
        },
      })
    } else {
      // Fallback to OSRM with a clear warning to the user about demo limitations
      console.warn(
        'Using OSRM demo server. NOT SUITABLE FOR PRODUCTION. Please set up your own routing service.',
      )
      router = L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'walking', // Use walking profile for pedestrian routing
      })
    }

    // Create routing control
    routingControl.value = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      show: false, // Hide the routing instructions panel
      lineOptions: {
        styles: [
          { color: '#ff6b6b', opacity: 0.8, weight: 5 },
          { color: '#ffffff', opacity: 0.3, weight: 7 }, // outline
        ],
        addWaypoints: false,
      },
      createMarker: function () {
        return null
      }, // Don't create markers for waypoints
      router: router,
    }).addTo(map.value)

    // Listen for the routesfound event to handle the route data
    routingControl.value.on('routesfound', function (e) {
      const routes = e.routes
      const summary = routes[0].summary

      // Calculate total distance and estimated time
      const distance = summary.totalDistance
      const time = summary.totalTime

      // Format distance and time for display
      const formattedDistance =
        distance >= 1000 ? `${(distance / 1000).toFixed(2)} km` : `${Math.round(distance)} m`

      // Format time (convert seconds to minutes)
      const minutes = Math.round(time / 60)
      const formattedTime =
        minutes > 60 ? `${Math.floor(minutes / 60)} hr ${minutes % 60} min` : `${minutes} min`

      // Show route information in a popup on the map
      L.popup()
        .setLatLng(L.latLng((fromCoords[0] + toCoords[0]) / 2, (fromCoords[1] + toCoords[1]) / 2))
        .setContent(
          `
        <div style="text-align: center;">
          <h4 style="margin: 0 0 8px 0;">Route Information</h4>
          <p><strong>Distance:</strong> ${formattedDistance}</p>
          <p><strong>Estimated Time:</strong> ${formattedTime}</p>
        </div>
      `,
        )
        .openOn(map.value)

      // Fit the bounds with some padding
      map.value.fitBounds(L.latLngBounds(waypoints), {
        padding: [50, 50],
        maxZoom: 16,
      })
    })

    // Handle routing errors
    routingControl.value.on('routingerror', function (e) {
      console.error('Routing error:', e.error)

      // Fall back to a simple straight line if routing fails
      currentPath.value = L.polyline([fromCoords, toCoords], {
        color: '#ff6b6b',
        weight: 4,
        opacity: 0.8,
        dashArray: '10,10',
        lineJoin: 'round',
      }).addTo(map.value)

      map.value.fitBounds(L.latLngBounds([fromCoords, toCoords]), {
        padding: [50, 50],
        maxZoom: 16,
      })

      // Show error message
      error.value = 'Could not calculate a realistic path. Showing direct line instead.'
      setTimeout(() => {
        error.value = null
      }, 3000)
    })
  }

  const clearPath = () => {
    // Remove routing control if it exists
    if (routingControl.value && map.value) {
      map.value.removeControl(routingControl.value)
      routingControl.value = null
    }

    // Remove the old polyline if it exists
    if (currentPath.value && map.value) {
      map.value.removeLayer(currentPath.value)
      currentPath.value = null
    }
  }

  const zoomIn = () => {
    if (map.value) map.value.zoomIn()
  }

  const zoomOut = () => {
    if (map.value) map.value.zoomOut()
  }

  const resetView = () => {
    if (map.value) map.value.setView(referencePoint, 15)
  }

  // Getters
  const hasPath = computed(() => !!(currentPath.value || routingControl.value))

  // Global event handler to be called from component
  const handleGlobalClick = (event) => {
    if (event.target && event.target.matches('.path-button')) {
      // Close any open popups before drawing the path
      if (map.value) map.value.closePopup()

      const fromCoords = event.target.getAttribute('data-from').split(',').map(Number)
      const toCoords = event.target.getAttribute('data-to').split(',').map(Number)

      if (fromCoords.length === 2 && toCoords.length === 2) {
        drawPath(fromCoords, toCoords)
      }
    }
  }

  // Clean up function
  const cleanup = () => {
    clearPath()

    if (map.value) {
      map.value.remove()
      map.value = null
    }
    markers.value = []
    currentMarker.value = null
    referenceMarker.value = null
  }

  return {
    // State
    map,
    currentMarker,
    currentPath,
    routingControl,
    currentZoom,
    referencePoint,
    referenceMarker,
    boardingHouses,
    isLoading,
    error,
    markers,

    // Getters
    hasPath,

    // Actions
    initializeMap,
    fetchBoardingHouses,
    getUserLocation,
    clearPath,
    drawPath,
    zoomIn,
    zoomOut,
    resetView,
    handleGlobalClick,
    cleanup,
    focusOnDorm,
  }
})
