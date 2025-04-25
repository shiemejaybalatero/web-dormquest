import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore('items', () => {
  // States
  const items = ref([])

  // Getters
  /*const sample = computed(() => count.value*2)*/

  // Action
  async function getItemsFromApi() {
    await axios.get('https://api.restful-api.dev/objects')
  }

  return { items, getItemsFromApi }
})
