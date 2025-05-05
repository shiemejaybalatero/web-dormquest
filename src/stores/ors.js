export const getRoute = async (fromCoords, toCoords, profile = 'foot-walking', options = {}) => {
  const apiKey =
    import.meta.env.VITE_ORS_API_KEY || '5b3ce3597851110001cf62483570601917a940dc9755c816006c72ba'
  const endpoint = 'https://api.openrouteservice.org/v2/directions/'

  // Format coordinates for the API (longitude, latitude)
  const fromLngLat = [fromCoords[1], fromCoords[0]]
  const toLngLat = [toCoords[1], toCoords[0]]

  try {
    // Set up request body with options for improved routing
    const requestBody = {
      coordinates: [fromLngLat, toLngLat],
      preference: options.preference || 'shortest',
      instructions: options.instructions !== undefined ? options.instructions : false,
      continue_straight: options.continue_straight !== undefined ? options.continue_straight : true,
      units: 'km',
      geometry_simplify: true,
      elevation: false,
    }

    // Add alternative routes if requested
    if (options.alternative_routes) {
      requestBody.alternative_routes = options.alternative_routes
    }

    // Make request to OpenRouteService
    const response = await fetch(`${endpoint}${profile}/geojson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error.message || 'Error fetching route')
    }

    return await response.json()
  } catch (error) {
    console.error('Error in getRoute:', error)
    throw error
  }
}

// Extract route coordinates from GeoJSON response
export const extractRouteCoordinates = (routeData) => {
  if (!routeData || !routeData.features || routeData.features.length === 0) {
    return []
  }

  try {
    // Get the first feature (route)
    const route = routeData.features[0]

    // Get coordinates from the LineString geometry

    return route.geometry.coordinates.map((coord) => [coord[1], coord[0]])
  } catch (error) {
    console.error('Error extracting route coordinates:', error)
    return []
  }
}

// Get route information (distance and duration)
export const getRouteInfo = (routeData) => {
  if (!routeData || !routeData.features || routeData.features.length === 0) {
    return { distance: 0, duration: 0, distanceText: '0 m', isKilometers: false }
  }

  try {
    // Get route properties
    const routeProperties = routeData.features[0].properties.summary

    // Extract distance in kilometers and duration in seconds
    const distanceKm = routeProperties.distance
    const durationSeconds = routeProperties.duration

    // Format distance
    let distanceText
    let isKilometers = false

    if (distanceKm >= 1) {
      distanceText = `${distanceKm.toFixed(2)} km`
      isKilometers = true
    } else {
      distanceText = `${Math.round(distanceKm * 1000)} m`
    }

    // Format duration in minutes
    const durationMinutes = Math.ceil(durationSeconds / 60)

    return {
      distance: distanceKm,
      duration: durationMinutes,
      distanceText,
      isKilometers,
    }
  } catch (error) {
    console.error('Error extracting route info:', error)
    return { distance: 0, duration: 0, distanceText: '0 m', isKilometers: false }
  }
}
