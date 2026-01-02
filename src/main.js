import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// CSS custom
import './assets/form.css'

import BootstrapVue3 from 'bootstrap-vue-3'

const app = createApp(App)
app.use(router)
app.use(BootstrapVue3)
app.mount('#app')
