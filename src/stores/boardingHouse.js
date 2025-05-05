import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'

export const useBoardingHouseStore = defineStore('boardingHouse', () => {
  const boardingHouses = ref([])
  const selectedBoardingHouse = ref(null)
  const loading = ref(false)
  const errorMessage = ref('')

  // When fetching a list of boarding houses
  const fetchBoardingHouses = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
      const { data, error } = await supabase
        .from('dormitories')
        .select('id, name, distance_to_campus, price, image')
        .order('id', { ascending: true })

      if (error) {
        console.error('Failed to fetch boarding houses:', error)
        errorMessage.value = `Failed to load boarding houses: ${error.message}`
        return
      }

      console.log('Raw data from API:', data)

      boardingHouses.value = data.map((house) => ({
        ...house,
        // Add a default distance since the column doesn't exist in the database
        distance: 1,
        // Ensure price is always present
        price: house.price !== undefined ? house.price : 0,
        availability: `₱${house.price || 'N/A'} per month`,
      }))

      console.log('Processed boarding houses:', boardingHouses.value)
    } catch (err) {
      console.error('Unexpected error:', err)
      errorMessage.value = 'An unexpected error occurred.'
    } finally {
      loading.value = false
    }
  }

  // When fetching a specific boarding house by ID
  const fetchBoardingHouseById = async (id) => {
    loading.value = true
    errorMessage.value = ''
    selectedBoardingHouse.value = null // Reset before fetching

    console.log(`Fetching boarding house with ID: ${id}`)

    try {
      const { data, error } = await supabase.from('dormitories').select('*').eq('id', id).single()

      if (error) {
        console.error(`Failed to fetch boarding house with ID ${id}:`, error)
        errorMessage.value = `Failed to load dormitory: ${error.message}`
        return
      }

      console.log('Successfully fetched boarding house:', data)
      selectedBoardingHouse.value = data
    } catch (err) {
      console.error(`Unexpected error when fetching boarding house ${id}:`, err)
      errorMessage.value = 'An unexpected error occurred while loading the dormitory details.'
    } finally {
      loading.value = false
    }
  }

  return {
    boardingHouses,
    selectedBoardingHouse,
    loading,
    errorMessage,
    fetchBoardingHouses,
    fetchBoardingHouseById,
  }
})
