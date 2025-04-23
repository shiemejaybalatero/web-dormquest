import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

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
