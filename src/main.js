import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#6D9773', // Light green
          secondary: '#FFBA00', // Gold/yellow
          accent: '#81C784', // Another light green shade
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#E8F5E9', // Very light green background
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#0C3B2E', // Deep green
          secondary: '#FFBA00', // Gold/yellow
          accent: '#2E7D32', // Another green shade
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#0A2E23', // Darker green background
        },
      },
    },
  },
})

// Day.js & Date Adapter
import DayJsAdapter from '@date-io/dayjs'
import dayjs from 'dayjs'

import App from './App.vue'
import router from './router'
import 'leaflet/dist/leaflet.css'

const app = createApp(App)

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  components,
  directives,
  adapters: {
    date: new DayJsAdapter({ dayjs }),
  },
})

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
