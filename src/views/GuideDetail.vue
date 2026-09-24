<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
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
const activeHeading = ref('')
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

const headings = computed(function() {
  const raw = html.value
  const result = []
  raw.replace(/<h([2-4])>([\s\S]*?)<\/h\1>/g, function(_, level, title) {
    const cleanTitle = title.replace(/<[^>]*>/g, '')
    result.push({ level: Number(level), title: cleanTitle, id: headingId(cleanTitle, result.length) })
    return _
  })
  return result
})

const guidePosition = computed(function() {
  return guideIndex.findIndex(function(item) { return item.id === route.params.id })
})
const previousGuide = computed(function() { return guideIndex[guidePosition.value - 1] || null })
const nextGuide = computed(function() { return guideIndex[guidePosition.value + 1] || null })

function headingId(title, index) {
  return 'section-' + index + '-' + title.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')
}

function updateActiveHeading() {
  const rendered = Array.from(document.querySelectorAll('.guide-content .markdown-body h2, .guide-content .markdown-body h3, .guide-content .markdown-body h4'))
  if (!rendered.length) { activeHeading.value = ''; return }
  const marker = 132
  const current = rendered.reduce(function(found, element) {
    return element.getBoundingClientRect().top <= marker ? element : found
  }, rendered[0])
  activeHeading.value = current.id
}

function setHeadingIds() {
  nextTick(function() {
    const rendered = document.querySelectorAll('.guide-content .markdown-body h2, .guide-content .markdown-body h3, .guide-content .markdown-body h4')
    rendered.forEach(function(element, index) {
      element.id = headings.value[index] ? headings.value[index].id : headingId(element.textContent, index)
    })
    updateActiveHeading()
  })
}

function scrollToHeading(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

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

watch(html, setHeadingIds)

onMounted(function() {
  window.addEventListener('scroll', updateActiveHeading, { passive: true })
})

onBeforeUnmount(function() {
  window.removeEventListener('scroll', updateActiveHeading)
})
</script>

<template>
  <div class="guide-detail" v-if="guide">
    <div class="breadcrumb"><RouterLink to="/">首页</RouterLink><span>/</span><RouterLink to="/guides">开服指南</RouterLink><span>/</span><span>{{ guide.name }}</span></div>
    <header class="guide-header">
      <div>
        <span class="section-kicker">SERVER SETUP GUIDE</span>
        <h1>{{ guide.name }}</h1>
        <p class="tagline">{{ guide.description }}</p>
      </div>
    </header>

    <div class="guide-layout">
      <aside class="guide-sidebar" aria-label="教程导航">
        <span class="sidebar-title">开服指南</span>
        <RouterLink v-for="item in guideIndex" :key="item.id" :to="'/guide/' + item.id" :class="{ active: item.id === guide.id }">
          <span>{{ item.name }}</span>
          <small>{{ item.tags && item.tags[0] || '指南' }}</small>
        </RouterLink>
      </aside>

      <main class="article-column">
        <article class="article-content">
          <div v-if="loading" class="empty-state">
            <span class="icon">⚙️</span>
            <h3>正在加载内容...</h3>
          </div>

          <div v-else-if="error" class="empty-state">
            <span class="icon">⚠️</span>
            <h3>{{ error }}</h3>
            <p>请检查 content/guides/ 目录下是否存在对应文件</p>
          </div>

          <div v-else class="markdown-body" v-html="html" @click="copyCode"></div>
        </article>
      </main>

      <aside class="guide-toc" v-if="headings.length">
        <span class="toc-title">本页目录</span>
        <a v-for="heading in headings" :key="heading.id" :href="`#${heading.id}`" :class="['toc-level-' + heading.level, { active: activeHeading === heading.id }]" @click.prevent="scrollToHeading(heading.id)">{{ heading.title }}</a>
      </aside>
    </div>

    <footer class="related">
      <h3>沿着开服路线继续</h3>
      <div class="guide-sequence" v-if="previousGuide || nextGuide">
        <RouterLink v-if="previousGuide" :to="`/guide/${previousGuide.id}`" class="sequence-item"><span>上一步</span><b>← {{ previousGuide.name }}</b></RouterLink>
        <span v-else></span>
        <RouterLink v-if="nextGuide" :to="`/guide/${nextGuide.id}`" class="sequence-item next"><span>下一步</span><b>{{ nextGuide.name }} →</b></RouterLink>
        <span v-else></span>
      </div>
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
.breadcrumb { display: flex; gap: 9px; margin-bottom: 37px; color: var(--text-muted); font-size: 11px; }
.breadcrumb a { color: var(--text-muted); text-decoration: none; }
.breadcrumb a:hover { color: var(--accent-strong); }
.section-kicker { color: var(--accent-strong); font: 10px var(--font-mono); letter-spacing: 1px; }

.guide-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.guide-header h1 {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
  margin-top: 8px;
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

.guide-layout { display: grid; grid-template-columns: 240px minmax(0, 720px); gap: 44px; align-items: start; }
.guide-toc { position: sticky; top: 92px; display: flex; flex-direction: column; gap: 3px; max-height: calc(100vh - 120px); overflow-y: auto; padding: 14px 10px 14px 12px; border: 1px solid var(--border); border-radius: 12px; background: color-mix(in srgb, var(--surface) 72%, transparent); }
.toc-title { margin: 0 0 7px; padding: 0 10px; color: var(--text-primary); font-size: 15px; font-weight: 650; line-height: 1.5; }
.guide-toc a { position: relative; display: block; padding: 6px 10px; border-radius: 8px; color: var(--text-secondary); text-decoration: none; font-size: 14px; line-height: 1.75; overflow-wrap: anywhere; transition: color .18s ease, background .18s ease, padding-left .18s ease; }
.guide-toc a:hover { color: var(--accent-strong); background: var(--surface-accent); }
.guide-toc a.active { color: var(--accent-strong); background: var(--accent-dim); font-weight: 600; }
.guide-toc a.active::before { content: ''; position: absolute; top: 6px; bottom: 6px; left: 0; width: 3px; border-radius: 3px; background: var(--accent-strong); }
.guide-toc .toc-level-3 { padding-left: 22px; }
.guide-toc .toc-level-4 { padding-left: 32px; font-size: 13px; }

.related {
  border-top: 1px solid var(--border);
  padding-top: 24px;
}
.guide-sequence { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px; }
.sequence-item { min-height: 66px; display: flex; flex-direction: column; justify-content: center; gap: 5px; padding: 10px 13px; border: 1px solid var(--border); border-radius: 4px; text-decoration: none; color: inherit; }
.sequence-item span { color: var(--text-muted); font-size: 9px; }
.sequence-item b { font-size: 11px; font-weight: 600; }
.sequence-item:hover { border-color: var(--accent-strong); }
.sequence-item.next { text-align: right; }

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
    padding: 18px;
  }
  .breadcrumb { margin-bottom: 29px; flex-wrap: wrap; }
  .guide-header {
    flex-direction: column;
    gap: 8px;
  }
  .guide-layout { display: block; }
  .guide-toc { position: static; max-height: none; margin: 0 0 24px; padding: 12px 10px; border: 1px solid var(--border); border-radius: 12px; }
  .guide-sequence { gap: 8px; }
  .sequence-item { padding: 9px; }
}

/* The reading column remains narrow while the navigation stays visible on wide screens. */
.markdown-body { max-width: 720px; }
.guide-content { padding: 0 0 8px; }
@media (max-width: 768px) {
  .guide-detail { width: 100%; overflow: hidden; }
  .guide-content { margin-bottom: 28px; }
  .markdown-body { max-width: none; }
  .guide-toc a { min-height: 40px; display: flex; align-items: center; font-size: 14px; line-height: 1.7; }
  .toc-title { font-size: 15px; }
  .guide-toc .toc-level-3 { padding-left: 22px; }
  .guide-toc .toc-level-4 { padding-left: 32px; font-size: 13px; }
  .guide-sequence { grid-template-columns: 1fr; }
  .sequence-item.next { text-align: left; }
  .related-list { grid-template-columns: 1fr; }
}

/* Desktop docs shell: use the viewport while keeping the reading measure comfortable. */
.guide-detail {
  width: min(1440px, calc(100% - 64px));
  max-width: none;
  margin: 0 auto;
  padding: 32px 0 48px;
}
.guide-header, .guide-detail > .breadcrumb { width: 100%; }
.guide-layout {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr) 260px;
  column-gap: 32px;
  align-items: start;
}
.guide-sidebar {
  position: sticky;
  top: 92px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 14px 10px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: color-mix(in srgb, var(--surface) 72%, transparent);
}
.sidebar-title {
  margin: 0 0 7px;
  padding: 0 10px;
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 650;
  line-height: 1.5;
}
.guide-sidebar a {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  padding: 9px 10px;
  border-radius: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px;
  line-height: 1.55;
  transition: color .18s ease, background .18s ease;
}
.guide-sidebar a span { min-width: 0; overflow-wrap: anywhere; }
.guide-sidebar a small { flex: none; color: var(--text-muted); font-size: 10px; }
.guide-sidebar a:hover { color: var(--accent-strong); background: var(--surface-accent); }
.guide-sidebar a.active { color: var(--accent-strong); background: var(--accent-dim); font-weight: 600; }
.guide-content { min-width: 0; margin-bottom: 40px; }
.guide-content .markdown-body { width: 100%; max-width: 820px; }
.guide-toc { grid-column: 3; min-width: 0; }
@media (max-width: 1199px) {
  .guide-detail { width: min(1120px, calc(100% - 48px)); }
  .guide-layout { grid-template-columns: 220px minmax(0, 1fr); column-gap: 28px; }
  .guide-toc { grid-column: 1 / -1; grid-row: 1; position: static; max-height: none; margin-bottom: 24px; }
  .guide-sidebar { grid-column: 1; grid-row: 2; }
  .guide-content { grid-column: 2; grid-row: 2; }
}
@media (max-width: 768px) {
  .guide-detail { width: 100%; padding: 18px; }
  .guide-layout { display: block; }
  .guide-sidebar { display: none; }
  .guide-toc { margin: 0 0 24px; }
  .guide-content .markdown-body { max-width: none; }
}

/* Keep the grid item and the readable article measure as separate layers. */
.article-column {
  min-width: 0;
  width: 100%;
  grid-column: 2;
  grid-row: 1;
}
.article-content {
  min-width: 0;
  width: 100%;
  margin: 0;
}
.article-content .markdown-body {
  min-width: 0;
  width: min(100%, 820px);
  max-width: 820px;
}
@media (max-width: 1199px) {
  .article-column { grid-column: 2; grid-row: 2; }
  .article-content, .article-content .markdown-body { width: 100%; max-width: none; }
}
@media (max-width: 768px) {
  .article-column { display: block; width: 100%; }
  .article-content, .article-content .markdown-body { width: 100%; max-width: none; }
}
</style>
