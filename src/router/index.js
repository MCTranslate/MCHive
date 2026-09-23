import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PluginDetail from '../views/PluginDetail.vue'
import GuideDetail from '../views/GuideDetail.vue'
import ContentIndex from '../views/ContentIndex.vue'
import SearchResults from '../views/SearchResults.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/guides', name: 'Guides', component: ContentIndex, props: { kind: 'guides' } },
  { path: '/tutorials', name: 'Tutorials', component: ContentIndex, props: { kind: 'tutorials' } },
  { path: '/plugins', name: 'Plugins', component: ContentIndex, props: { kind: 'plugins' } },
  { path: '/tools', name: 'Tools', component: ContentIndex, props: { kind: 'tools' } },
  { path: '/search', name: 'Search', component: SearchResults },
  { path: '/plugin/:id', name: 'PluginDetail', component: PluginDetail },
  { path: '/guide/:id', name: 'GuideDetail', component: GuideDetail }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
