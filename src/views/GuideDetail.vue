<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import guideIndex from '../../data/guides.json'
import { parseMarkdown } from '../composables/markdown.js'

// 与 PluginDetail 相同：模块顶层静态扫描，构建时注册所有教程 Markdown
const mdModules = import.meta.glob('/content/guides/*.md', { query: '?raw', import: 'default' })

const route = useRoute()
const router = useRouter()

const html = ref('')
const loading = ref(false)
const error = ref(null)
let loadToken = 0

const guide = computed(function() {
  return guideIndex.find(function(g) { return g.id === route.params.id })
})

function loadGuide() {
  if (!guide.value) return

  const token = ++loadToken
  const guideId = guide.value.id

  loading.value = true
  error.value = null
  html.value = ''

  var filePath = '/content/guides/' + guideId + '.md'
  var loader = mdModules[filePath]

  if (!loader) {
    if (token !== loadToken) return
    loading.value = false
    error.value = '教程文件不存在：' + guideId + '.md'
    return
  }

  loader().then(function(raw) {
    if (token !== loadToken) return
    html.value = parseMarkdown(raw || '')
    loading.value = false
  }).catch(function(err) {
    if (token !== loadToken) return
    html.value = ''
    loading.value = false
    error.value = '加载失败：' + (err.message || '未知错误')
  })
}

watch(function() { return route.params.id }, function(newId) {
  if (!guideIndex.find(function(g) { return g.id === newId })) {
    router.replace('/')
    return
  }
  loadGuide()
}, { immediate: true })

// 同一分类下的其他教程（用于底部推荐）
const relatedGuides = computed(function() {
  return guideIndex.filter(function(g) { return g.id !== route.params.id })
})
</script>

<template>
  <div class="guide-detail" v-if="guide">
    <header class="guide-header">
      <span class="guide-icon">{{ guide.icon }}</span>
      <div>
        <h1>{{ guide.name }}</h1>
        <p class="tagline">{{ guide.description }}</p>
      </div>
    </header>

    <div class="guide-content">
      <div v-if="loading" class="empty-state">
        <span class="icon">⚙️</span>
        <h3>正在加载内容...</h3>
      </div>

      <div v-else-if="error" class="empty-state">
        <span class="icon">⚠️</span>
        <h3>{{ error }}</h3>
        <p>请检查 content/guides/ 目录下是否存在对应文件</p>
      </div>

      <div v-else class="markdown-body" v-html="html"></div>
    </div>

    <footer class="related">
      <h3>继续阅读</h3>
      <div class="related-list">
        <div
          v-for="g in relatedGuides"
          :key="g.id"
          class="related-item"
          @click="router.push('/guide/' + g.id)"
        >
          <span class="related-icon">{{ g.icon }}</span>
          <div>
            <span class="related-name">{{ g.name }}</span>
            <span class="related-desc">{{ g.description }}</span>
          </div>
        </div>
      </div>
    </footer>
  </div>

  <div v-else class="guide-detail">
    <div class="empty-state">
      <span class="icon">📖</span>
      <h3>未找到该教程</h3>
      <p>左侧导航栏选择你想阅读的教程</p>
      <button class="btn btn-primary" @click="router.push('/')">返回首页</button>
    </div>
  </div>
</template>

<style scoped>
.guide-detail {
  max-width: 880px;
  margin: 0 auto;
  padding: 32px 40px;
}

.guide-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.guide-icon {
  font-size: 36px;
  line-height: 1;
}

.guide-header h1 {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.tagline {
  font-size: 14px;
  color: var(--text-secondary);
}

.guide-content {
  margin-bottom: 40px;
  min-height: 300px;
}

.related {
  border-top: 1px solid var(--border);
  padding-top: 24px;
}

.related h3 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 14px;
  color: var(--text-primary);
}

.related-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 10px;
}

.related-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.related-item:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.related-icon {
  font-size: 20px;
}

.related-item > div {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.related-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.related-desc {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .guide-detail {
    padding: 16px;
  }
  .guide-header {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
