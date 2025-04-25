import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useItemStore = defineStore('items', () => {
  // States
  const items = ref([])

  // Getters
  /*const sample = computed(() => count.value*2)*/

  // Action
  async function getItemsFromApi() {
    const response = await axios.get('https://api.restful-api.dev/objects')

    items.value = response.data
  }

  return { items, getItemsFromApi }
})
