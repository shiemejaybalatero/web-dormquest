<script setup>
import { onMounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import AppLayout from '@/components/layout/AppLayout.vue'

onMounted(() => {
  nextTick(() => {
    const map = L.map('map').setView([6.9214, 122.079], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)

    L.marker([6.9214, 122.079]).addTo(map).bindPopup('Your Location').openPopup()
  })
})
</script>

<template>
  <AppLayout>
    <template #content>
      <div class="full-map-container">
        <div id="map" class="full-map"></div>
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
}

.full-map {
  width: 100%;
  height: 100%;
}
</style>
