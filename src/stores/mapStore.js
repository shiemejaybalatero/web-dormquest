import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import L from 'leaflet'
import 'leaflet-routing-machine'
import { supabase } from '@/utils/supabase'
import { getRoute, extractRouteCoordinates, getRouteInfo } from './ors'

export const useMapStore = defineStore('map', () => {
  // State
  const map = ref(null)
  const currentMarker = ref(null)
  const currentPath = ref(null)
  const routingControl = ref(null)
  const currentZoom = ref(10)
  const referencePoint = [8.957136, 125.598628]
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

  // Updated drawPath function to create more realistic paths
  const drawPath = async (fromCoords, toCoords) => {
    // Close any open popups before drawing the path
    if (map.value) map.value.closePopup()

    // Remove existing path and routing control
    clearPath()

    // Show loading indicator
    isLoading.value = true

    try {
      // Set the profile to 'foot-walking' for more realistic pedestrian paths
      // You can also use 'driving-car' for vehicle routes if needed
      const routeData = await getRoute(fromCoords, toCoords, 'foot-walking', {
        // Add parameters to improve path quality
        preference: 'shortest', // Use 'shortest' instead of 'recommended' for simpler paths
        instructions: false, // We don't need turn-by-turn instructions
        continue_straight: true, // Try to avoid unnecessary turns
      })

      // Extract coordinates from the response
      const routeCoordinates = extractRouteCoordinates(routeData)

      // Get route information (distance and duration)
      const { duration, distanceText } = getRouteInfo(routeData)

      if (routeCoordinates.length === 0) {
        throw new Error('No route found')
      }

      // Simplify route coordinates to make the path less complex
      const simplifiedCoordinates = simplifyPath(routeCoordinates, 0.0001)

      // Create a polyline from the simplified route coordinates
      currentPath.value = L.polyline(simplifiedCoordinates, {
        color: '#ff6b6b',
        weight: 5,
        opacity: 0.8,
        lineJoin: 'round',
        lineCap: 'round',
      }).addTo(map.value)

      // Calculate center point for popup
      const centerIndex = Math.floor(simplifiedCoordinates.length / 2)
      const centerPoint = simplifiedCoordinates[centerIndex]

      // Show route information in a popup with distance in appropriate units
      L.popup()
        .setLatLng(L.latLng(centerPoint[0], centerPoint[1]))
        .setContent(
          `
          <div style="text-align: center;">
            <h4 style="margin: 0 0 8px 0;">Route Information</h4>
            <p><strong>Distance:</strong> ${distanceText}</p>
            <p><strong>Estimated Time:</strong> ${duration} min</p>
          </div>
        `,
        )
        .openOn(map.value)

      // Add arrow decorations to indicate direction
      addPathDirectionMarkers(simplifiedCoordinates)

      // Fit the bounds with some padding
      const bounds = L.latLngBounds(simplifiedCoordinates)
      map.value.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 16,
      })

      isLoading.value = false

      // Return route info for potential use elsewhere
      return {
        distance: distanceText,
        duration: duration,
      }
    } catch (err) {
      console.error('Error getting route:', err)
      isLoading.value = false
      error.value = `Could not calculate route: ${err.message || 'Unknown error'}`

      // Fall back to a simple direct path if routing fails
      fallbackToDirectPath(fromCoords, toCoords)

      // Show error message for 3 seconds
      setTimeout(() => {
        error.value = null
      }, 3000)

      return null
    }
  }

  // Helper function to simplify path coordinates using the Douglas-Peucker algorithm
  const simplifyPath = (points, tolerance) => {
    if (points.length <= 2) return points

    // Calculate the perpendicular distance from a point to a line
    const perpendicularDistance = (p, p1, p2) => {
      const [x, y] = p
      const [x1, y1] = p1
      const [x2, y2] = p2

      // Line equation: ax + by + c = 0
      const a = y1 - y2
      const b = x2 - x1
      const c = x1 * y2 - x2 * y1

      // Distance = |ax + by + c| / sqrt(a² + b²)
      return Math.abs(a * x + b * y + c) / Math.sqrt(a * a + b * b)
    }

    // Find the point with the maximum distance
    let maxDistance = 0
    let index = 0

    for (let i = 1; i < points.length - 1; i++) {
      const distance = perpendicularDistance(points[i], points[0], points[points.length - 1])
      if (distance > maxDistance) {
        maxDistance = distance
        index = i
      }
    }

    // If max distance is greater than tolerance, recursively simplify
    if (maxDistance > tolerance) {
      const firstPath = simplifyPath(points.slice(0, index + 1), tolerance)
      const secondPath = simplifyPath(points.slice(index), tolerance)

      // Combine results (avoiding duplicate points)
      return [...firstPath.slice(0, -1), ...secondPath]
    } else {
      // If all points are below tolerance, return just the endpoints
      return [points[0], points[points.length - 1]]
    }
  }

  // Add direction markers to show path direction
  const addPathDirectionMarkers = (coordinates) => {
    if (coordinates.length < 2 || !map.value || !currentPath.value) return

    // Add an arrowhead in the middle of the path
    if (coordinates.length >= 3) {
      const midIndex = Math.floor(coordinates.length / 2)
      const point1 = L.latLng(coordinates[midIndex - 1][0], coordinates[midIndex - 1][1])
      const point2 = L.latLng(coordinates[midIndex][0], coordinates[midIndex][1])

      // Get bearing between points
      const bearing = getBearing(point1, point2)

      // Create arrow marker
      const arrowIcon = L.divIcon({
        html: `<div style="transform: rotate(${bearing}deg); font-size: 24px; color: #ff6b6b;">→</div>`,
        className: 'path-direction-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      // Add marker to map
      L.marker(point2, { icon: arrowIcon }).addTo(map.value)
    }
  }

  // Calculate bearing between two points (for arrow direction)
  const getBearing = (point1, point2) => {
    const lat1 = (point1.lat * Math.PI) / 180
    const lat2 = (point2.lat * Math.PI) / 180
    const lng1 = (point1.lng * Math.PI) / 180
    const lng2 = (point2.lng * Math.PI) / 180

    const y = Math.sin(lng2 - lng1) * Math.cos(lat2)
    const x =
      Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1)

    const bearing = (Math.atan2(y, x) * 180) / Math.PI
    return (bearing + 360) % 360
  }

  // Fallback to a simpler path when routing fails
  const fallbackToDirectPath = (fromCoords, toCoords) => {
    // Create a dashed line between the two points
    currentPath.value = L.polyline([fromCoords, toCoords], {
      color: '#ff6b6b',
      weight: 4,
      opacity: 0.8,
      dashArray: '10,10',
      lineJoin: 'round',
    }).addTo(map.value)

    // Add a simple popup with straight-line distance
    const distance = calculateDistance(fromCoords, toCoords)

    // Place popup in the middle of the line
    const midLat = (fromCoords[0] + toCoords[0]) / 2
    const midLng = (fromCoords[1] + toCoords[1]) / 2

    L.popup()
      .setLatLng([midLat, midLng])
      .setContent(
        `
        <div style="text-align: center;">
          <h4 style="margin: 0 0 8px 0;">Direct Distance</h4>
          <p><strong>Distance:</strong> ${distance}</p>
          <p><small>(Detailed routing unavailable)</small></p>
        </div>
        `,
      )
      .openOn(map.value)

    // Fit the bounds
    map.value.fitBounds(L.latLngBounds([fromCoords, toCoords]), {
      padding: [50, 50],
      maxZoom: 16,
    })
  }

  const clearPath = () => {
    // Remove routing control if it exists (keeping for compatibility)
    if (routingControl.value && map.value) {
      map.value.removeControl(routingControl.value)
      routingControl.value = null
    }

    // Remove the old polyline if it exists
    if (currentPath.value && map.value) {
      map.value.removeLayer(currentPath.value)
      currentPath.value = null
    }

    // Remove any direction markers
    document.querySelectorAll('.path-direction-marker').forEach((marker) => {
      if (marker._leaflet_id && map.value) {
        const layer = map.value._layers[marker._leaflet_id]
        if (layer) map.value.removeLayer(layer)
      }
    })
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
  const hasPath = computed(() => !!currentPath.value)

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
