<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import pluginIndex from '../../data/plugins.json'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  collapsed: Boolean
})

const emit = defineEmits(['toggle'])

const searchQuery = ref('')
const activeCategory = ref('all')

const categories = computed(() => {
  const cats = new Set(pluginIndex.map(p => p.category).filter(Boolean))
  const list = [{ key: 'all', label: '全部插件', icon: '📦' }]
  cats.forEach(cat => {
    list.push({ key: cat, label: cat, icon: '📁' })
  })
  return list
})

const filteredPlugins = computed(() => {
  let result = pluginIndex
  if (activeCategory.value !== 'all') {
    result = result.filter(p => p.category === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.includes(q))
    )
  }
  return result
})

function isActive(id) {
  return route.params.id === id
}

function goToPlugin(id) {
  router.push('/plugin/' + id)
}
</script>

<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="sidebar-header">
      <div class="logo-area" v-if="!collapsed">
        <h1 class="logo">MC 汉化站</h1>
        <span class="subtitle">插件教程 & 汉化</span>
      </div>
      <button class="toggle-btn" @click="emit('toggle')" :title="collapsed ? '展开' : '折叠'">
        <svg v-if="collapsed" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
    </div>

    <div class="sidebar-body" v-if="!collapsed">
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索插件..."
          class="search-input"
        />
      </div>

      <div class="categories">
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="cat-btn"
          :class="{ active: activeCategory === cat.key }"
          @click="activeCategory = cat.key"
        >
          <span>{{ cat.icon }}</span>
          <span>{{ cat.label }}</span>
        </button>
      </div>

      <div class="plugin-list">
        <div
          v-for="plugin in filteredPlugins"
          :key="plugin.id"
          class="plugin-item"
          :class="{ active: isActive(plugin.id) }"
          @click="goToPlugin(plugin.id)"
        >
          <div class="plugin-icon">
            <span class="default-icon">{{ plugin.name[0] }}</span>
          </div>
          <div class="plugin-info">
            <span class="plugin-name">{{ plugin.name }}</span>
            <span class="plugin-desc">{{ plugin.description }}</span>
          </div>
        </div>

        <div v-if="filteredPlugins.length === 0" class="no-result">
          没有找到匹配的插件
        </div>
      </div>
    </div>

    <div class="sidebar-icons" v-if="collapsed">
      <button
        v-for="plugin in pluginIndex"
        :key="plugin.id"
        class="icon-item"
        :class="{ active: isActive(plugin.id) }"
        :title="plugin.name"
        @click="goToPlugin(plugin.id)"
      >
        {{ plugin.name[0] }}
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 0 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.logo-area {
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 16px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1.2;
}

.subtitle {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.toggle-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}
.toggle-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.sidebar-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 12px;
  gap: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 13px;
  outline: none;
  font-family: inherit;
}
.search-input::placeholder {
  color: var(--text-muted);
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cat-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-family: inherit;
}
.cat-btn:hover {
  background: var(--bg-tertiary);
}
.cat-btn.active {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
}

.plugin-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.plugin-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
}
.plugin-item:hover {
  background: var(--bg-tertiary);
}
.plugin-item.active {
  background: var(--accent-dim);
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.plugin-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.default-icon {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
}

.plugin-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.plugin-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plugin-desc {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-result {
  text-align: center;
  padding: 20px;
  color: var(--text-muted);
  font-size: 13px;
}

.sidebar-icons {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
  overflow-y: auto;
}

.icon-item {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-family: inherit;
}
.icon-item:hover {
  background: var(--border);
}
.icon-item.active {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  .sidebar.collapsed {
    width: 100%;
  }
  .plugin-list {
    max-height: 300px;
  }
}
</style>
