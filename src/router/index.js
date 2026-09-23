import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PluginDetail from '../views/PluginDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/plugin/:id', name: 'PluginDetail', component: PluginDetail }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
