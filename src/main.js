import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@/css/bootstrap.css';
import '@/css/style.css';
import '@/js/bootstrap.js';
import '@/js/popper.js';

createApp(App).use(router).mount('#app')
