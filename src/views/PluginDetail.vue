<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import pluginIndex from '../../data/plugins.json'
import DownloadSection from '../components/DownloadSection.vue'
import { parseMarkdown } from '../composables/markdown.js'

const route = useRoute()
const router = useRouter()

const activeTab = ref(null)
const sectionContents = ref({})
const loading = ref(false)
const error = ref(null)

var mdModules

const plugin = computed(function() {
  return pluginIndex.find(function(p) { return p.id === route.params.id })
})

const tabs = computed(function() {
  if (!plugin.value) return []
  var sections = plugin.value.sections || []
  return sections.filter(function(s) { return s.id && s.name && s.file })
})

function findSection(id) {
  if (!tabs.value) return null
  return tabs.value.find(function(t) { return t.id === id })
}

onMounted(function() {
  mdModules = import.meta.glob('/content/plugins/**/*.md', { query: '?raw', import: 'default' })
})

function loadSections() {
  if (!plugin.value) return
  loading.value = true
  error.value = null
  sectionContents.value = {}

  var sections = tabs.value
  var pending = sections.length

  if (pending === 0) {
    loading.value = false
    return
  }

  sections.forEach(function(section) {
    var filePath = '/content/plugins/' + plugin.value.id + '/' + section.file

    if (mdModules && mdModules[filePath]) {
      mdModules[filePath]().then(function(raw) {
        sectionContents.value[section.id] = raw || ''
        pending--
        if (pending === 0) {
          loading.value = false
          if (!activeTab.value && sections.length > 0) {
            activeTab.value = sections[0].id
          }
        }
      }).catch(function(err) {
        error.value = '加载失败：' + (err.message || '未知错误')
        pending--
        if (pending === 0) loading.value = false
      })
    } else {
      error.value = '文件不存在：' + section.file
      pending--
      if (pending === 0) loading.value = false
    }
  })
}

watch(function() { return route.params.id }, function(newId) {
  if (!pluginIndex.find(function(p) { return p.id === newId })) {
    router.replace('/')
    return
  }
  activeTab.value = null
  sectionContents.value = {}
  loadSections()
}, { immediate: true })

var tutorialHtml = computed(function() {
  if (activeTab.value !== 'tutorial') return ''
  var raw = sectionContents.value['tutorial']
  if (!raw) return ''
  return parseMarkdown(raw)
})

function copyContent(text) {
  if (!text) return
  navigator.clipboard.writeText(text).then(function() {
    alert('已复制到剪贴板')
  }).catch(function() {
    alert('复制失败，请手动选择文本复制')
  })
}
</script>

<template>
  <div class="plugin-detail" v-if="plugin">
    <header class="detail-header">
      <div class="header-info">
        <div class="plugin-icon-lg">{{ plugin.name[0] }}</div>
        <div>
          <h1>{{ plugin.name }}</h1>
          <p class="tagline">{{ plugin.description }}</p>
          <div class="meta">
            <span class="meta-item" v-if="plugin.version">版本: {{ plugin.version }}</span>
            <span class="meta-item" v-if="plugin.category">分类: {{ plugin.category }}</span>
            <span class="meta-item" v-if="plugin.tags && plugin.tags.length">
              标签: {{ plugin.tags.join(', ') }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <nav class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </nav>

    <div class="tab-content">
      <div v-if="loading" class="empty-state">
        <span class="icon">&#9881;</span>
        <h3>正在加载内容...</h3>
      </div>

      <div v-else-if="error" class="empty-state">
        <span class="icon">&#9888;</span>
        <h3>{{ error }}</h3>
        <p>请检查 content/plugins/{{ plugin.id }}/ 目录下是否有对应文件</p>
      </div>

      <div v-else-if="activeTab === 'tutorial'">
        <div class="markdown-body" v-html="tutorialHtml"></div>
      </div>

      <section v-else-if="activeTab === 'lang'">
        <div class="section-desc">
          <h3>语言文件说明</h3>
          <p>{{ findSection('lang') && findSection('lang').description }}</p>
        </div>
        <div class="file-toolbar">
          <span class="file-name">{{ findSection('lang') && findSection('lang').file }}</span>
          <button class="btn btn-secondary" @click="copyContent(sectionContents['lang'])">
            复制内容
          </button>
        </div>
        <pre class="file-content">{{ sectionContents['lang'] }}</pre>
      </section>

      <section v-else-if="activeTab === 'config'">
        <div class="section-desc">
          <h3>配置文件说明</h3>
          <p>{{ findSection('config') && findSection('config').description }}</p>
        </div>
        <div class="file-toolbar">
          <span class="file-name">{{ findSection('config') && findSection('config').file }}</span>
          <button class="btn btn-secondary" @click="copyContent(sectionContents['config'])">
            复制内容
          </button>
        </div>
        <pre class="file-content">{{ sectionContents['config'] }}</pre>
      </section>
    </div>

    <DownloadSection
      :downloads="plugin.downloads || []"
      :plugin-id="plugin.id"
      :plugin-name="plugin.name"
    />
  </div>

  <div v-else class="plugin-detail">
    <div class="empty-state">
      <span class="icon">&#128230;</span>
      <h3>未找到该插件</h3>
      <p>左侧导航栏选择你想查看的插件</p>
      <button class="btn btn-primary" @click="router.push('/')">返回首页</button>
    </div>
  </div>
</template>

<style scoped>
.plugin-detail {
  max-width: 880px;
  margin: 0 auto;
  padding: 32px 40px;
}

.detail-header {
  margin-bottom: 24px;
}

.header-info {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.plugin-icon-lg {
  width: 64px;
  height: 64px;
  border-radius: var(--radius);
  background: var(--accent-dim);
  border: 1px solid rgba(74, 222, 128, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 800;
  color: var(--accent);
  flex-shrink: 0;
}

.header-info h1 {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.tagline {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.meta-item {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  padding: 3px 10px;
  border-radius: 12px;
}

.tab-content {
  margin-bottom: 40px;
  min-height: 300px;
}

.section-desc {
  margin-bottom: 16px;
}

.section-desc h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.section-desc p {
  font-size: 13px;
  color: var(--text-secondary);
}

.file-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.file-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--accent);
}

@media (max-width: 768px) {
  .plugin-detail {
    padding: 16px;
  }
  .header-info {
    flex-direction: column;
    gap: 12px;
  }
  .plugin-icon-lg {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
}
</style>
