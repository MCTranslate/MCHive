<script setup>
import Sidebar from './components/Sidebar.vue'
import { ref } from 'vue'

const sidebarCollapsed = ref(false)
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<template>
  <div class="layout" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <Sidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.sidebar-collapsed .main-content {
  margin-left: 60px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
  }
}
</style>
