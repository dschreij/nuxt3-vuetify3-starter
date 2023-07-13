import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import vuetify from '../config/vuetify'
export default defineNuxtPlugin((app) => {
  app.vueApp.use(vuetify)
})
