/*const loading = ref(false)
const error = ref(null)

async function getItemsFromApi() {
  loading.value = true
  error.value = null

  try {
    const response = await axios.get('https://api.restful-api.dev/objects')
    items.value = response.data
  } catch (err) {
    error.value = err.message || 'Failed to fetch items'
  } finally {
    loading.value = false
  }
}

return { items, loading, error, getItemsFromApi }

*/
