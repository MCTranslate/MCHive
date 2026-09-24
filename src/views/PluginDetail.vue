<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import pluginIndex from '../../data/plugins.json'
import DownloadSection from '../components/DownloadSection.vue'
import { parseMarkdown } from '../composables/markdown.js'

// 构建时静态扫描所有插件 Markdown，必须在模块顶层调用才能被 Vite 识别
const mdModules = import.meta.glob('/content/plugins/**/*.md', { query: '?raw', import: 'default' })

const route = useRoute()
const router = useRouter()

const activeTab = ref(null)
const sectionContents = ref({})
const loading = ref(false)
const error = ref(null)

// 竟态保护：快速切换插件时，丢弃过期的加载结果
let loadToken = 0

const plugin = computed(function() {
  return pluginIndex.find(function(p) { return p.id === route.params.id })
})

const tabs = computed(function() {
  if (!plugin.value) return []
  var sections = plugin.value.sections
  // 约定优于配置：frontmatter 未声明 sections 时，按插件目录下全部 .md 自动派生
  //   tutorial.md → { id: 'tutorial', name: '安装教程' }
  //   lang.md / config.md / <其它>.md → { id: '<basename>', name: '<basename> 汉化' }
  // 这样未来即使有人绕过 build-index 直接编辑 data/plugins.json 也能正常渲染。
  if (!sections || !sections.length) {
    sections = deriveSections(plugin.value.id)
  }
  return sections.filter(function(s) { return s.id && s.name && s.file })
})

function deriveSections(pluginId) {
  var prefix = '/content/plugins/' + pluginId + '/'
  var files = Object.keys(mdModules)
    .filter(function(path) { return path.startsWith(prefix) && path.endsWith('.md') })
    .map(function(path) { return path.slice(prefix.length) })
    .sort()
  // tutorial.md 始终排在第一位（默认 tab），其余保持字典序
  var tutorialIdx = files.indexOf('tutorial.md')
  if (tutorialIdx > 0) {
    files = [files[tutorialIdx]].concat(files.slice(0, tutorialIdx), files.slice(tutorialIdx + 1))
  }
  return files.map(function(file) {
    var base = file.replace(/\.md$/, '')
    if (base === 'tutorial') return { id: 'tutorial', name: '安装教程', file: file }
    return { id: base, name: base + ' 汉化', file: file }
  })
}

function findSection(id) {
  if (!tabs.value) return null
  return tabs.value.find(function(t) { return t.id === id })
}

function loadSections() {
  if (!plugin.value) return

  // 递增 token，使之前未完成的加载结果作废
  const token = ++loadToken
  const pluginId = plugin.value.id

  loading.value = true
  error.value = null
  sectionContents.value = {}

  var sections = tabs.value
  var pending = sections.length

  const finish = function() {
    // 只有最新一次加载才能收尾，避免旧请求覆盖新状态
    if (token !== loadToken) return
    if (pending === 0) {
      loading.value = false
      if (!activeTab.value && sections.length > 0) {
        activeTab.value = sections[0].id
      }
    }
  }

  if (pending === 0) {
    finish()
    return
  }

  sections.forEach(function(section) {
    var filePath = '/content/plugins/' + pluginId + '/' + section.file
    var loader = mdModules[filePath]

    if (loader) {
      loader().then(function(raw) {
        if (token !== loadToken) return
        sectionContents.value[section.id] = raw || ''
        pending--
        finish()
      }).catch(function(err) {
        if (token !== loadToken) return
        error.value = '加载失败：' + (err.message || '未知错误')
        pending--
        finish()
      })
    } else {
      if (token !== loadToken) return
      error.value = '文件不存在：' + section.file
      pending--
      finish()
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
    copied.value = true
    window.setTimeout(function() { copied.value = false }, 1400)
  }).catch(function() {
    copied.value = false
  })
}

const copied = ref(false)

function copyCode(event) {
  const button = event.target.closest('[data-copy-code]')
  if (!button) return
  const code = button.closest('pre')?.querySelector('code')?.textContent || ''
  navigator.clipboard.writeText(code).then(function() {
    button.textContent = '已复制'
    window.setTimeout(function() { button.textContent = '复制' }, 1400)
  }).catch(function() {
    button.textContent = '复制失败'
    window.setTimeout(function() { button.textContent = '复制' }, 1400)
  })
}

const relatedPlugins = computed(function() {
  return pluginIndex.filter(function(item) { return item.id !== route.params.id })
})
</script>

<template>
  <div class="plugin-detail" v-if="plugin">
    <div class="breadcrumb"><RouterLink to="/">首页</RouterLink><span>/</span><RouterLink to="/plugins">插件中心</RouterLink><span>/</span><span>{{ plugin.name }}</span></div>
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
        <div class="markdown-body" v-html="tutorialHtml" @click="copyCode"></div>
      </div>

      <section v-else-if="activeTab === 'lang'">
        <div class="section-desc">
          <h3>语言文件说明</h3>
          <p>{{ findSection('lang') && findSection('lang').description }}</p>
        </div>
        <div class="file-toolbar">
          <span class="file-name">{{ findSection('lang') && findSection('lang').file }}</span>
          <button class="btn btn-secondary" @click="copyContent(sectionContents['lang'])">
            {{ copied ? '已复制' : '复制内容' }}
          </button>
        </div>
        <pre class="file-content"><code>{{ sectionContents['lang'] }}</code></pre>
      </section>

      <section v-else-if="activeTab === 'config'">
        <div class="section-desc">
          <h3>配置文件说明</h3>
          <p>{{ findSection('config') && findSection('config').description }}</p>
        </div>
        <div class="file-toolbar">
          <span class="file-name">{{ findSection('config') && findSection('config').file }}</span>
          <button class="btn btn-secondary" @click="copyContent(sectionContents['config'])">
            {{ copied ? '已复制' : '复制内容' }}
          </button>
        </div>
        <pre class="file-content"><code>{{ sectionContents['config'] }}</code></pre>
      </section>
    </div>

    <DownloadSection
      :downloads="plugin.downloads || []"
      :plugin-id="plugin.id"
      :plugin-name="plugin.name"
    />
    <section class="related-plugins" v-if="relatedPlugins.length">
      <h2>更多插件资料</h2>
      <div><RouterLink v-for="item in relatedPlugins" :key="item.id" :to="`/plugin/${item.id}`"><span>{{ item.category }}</span><b>{{ item.name }}</b><small>{{ item.description }}</small></RouterLink></div>
    </section>
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
.breadcrumb { display: flex; gap: 8px; margin-bottom: 28px; color: var(--text-muted); font-size: 11px; }
.breadcrumb a { color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
.breadcrumb a:hover { color: var(--accent); }

.detail-header {
  margin-bottom: 28px;
  padding: 28px;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-amount)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--blur-amount)) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow), inset 0 1px 0 var(--glass-highlight);
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
  background: linear-gradient(135deg, var(--accent-dim), rgba(110, 231, 183, 0.15));
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  color: var(--accent);
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(110, 231, 183, 0.15);
}

.header-info h1 {
  font-size: 28px;
  font-weight: 750;
  color: var(--text-primary);
  margin-bottom: 6px;
  letter-spacing: -0.5px;
}

.tagline {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-item {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--surface);
  border: 1px solid var(--glass-border);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(8px);
}

.tab-content {
  margin-bottom: 40px;
  min-height: 300px;
}

.section-desc {
  margin-bottom: 18px;
  padding: 20px;
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--glass-border);
}

.section-desc h3 {
  font-size: 16px;
  font-weight: 650;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.section-desc p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.file-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px 14px;
  background: var(--surface);
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
}

.file-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--accent);
  font-weight: 500;
}

.file-content {
  padding: 16px 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  white-space: pre;
}

.related-plugins {
  padding-top: 28px;
  margin-top: 40px;
  border-top: 1px solid var(--glass-border);
}
.related-plugins h2 {
  margin-bottom: 14px;
  font-size: 15px;
  font-weight: 650;
}
.related-plugins > div {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.related-plugins a {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  text-decoration: none;
  transition: all 0.3s var(--ease-standard);
  backdrop-filter: blur(8px);
}
.related-plugins a:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow), inset 0 1px 0 var(--glass-highlight);
}
.related-plugins a span {
  color: var(--accent);
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.related-plugins a b { color: var(--text-primary); font-size: 12px; font-weight: 600; }
.related-plugins a small {
  overflow: hidden;
  color: var(--text-muted);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tabs {
  position: sticky;
  top: 64px;
  z-index: 10;
  padding: 6px 0;
  background: rgba(8, 9, 11, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  margin-inline: -8px;
  padding-inline: 8px;
}

@media (max-width: 768px) {
  .plugin-detail { padding: 18px; }
  .breadcrumb { margin-bottom: 24px; flex-wrap: wrap; }
  .header-info { flex-direction: column; gap: 14px; }
  .plugin-icon-lg { width: 52px; height: 52px; font-size: 20px; }
  .related-plugins > div { grid-template-columns: 1fr; }
}

@media (max-width: 700px) {
  .plugin-detail { width: 100%; overflow: hidden; }
  .detail-header { padding: 20px; }
  .header-info h1 { font-size: 24px; }
  .tabs { top: 56px; margin-inline: -18px; padding-inline: 18px; }
  .meta { gap: 6px; }
  .meta-item { max-width: 100%; overflow-wrap: anywhere; }
}
</style>
