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
const contentRef = ref(null)
const articleRef = ref(null)
const progress = ref(0)          // 0~1 阅读进度
const showBackToTop = ref(false)
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
    // 等 DOM 落地后再写标题 id，否则查不到元素
    nextTick(setHeadingIds)
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

// 阅读时间预估：中文 350 字/分钟（设计系统规范 §3.6）
const readingMinutes = computed(function() {
  const text = html.value.replace(/<[^>]*>/g, '')
  const chars = text.replace(/\s/g, '').length
  return Math.max(1, Math.round(chars / 350))
})

// 正文较长时启用更大的字号（规范 §3.2）
const isLongRead = computed(function() { return readingMinutes.value >= 9 })

const guidePosition = computed(function() {
  return guideIndex.findIndex(function(item) { return item.id === route.params.id })
})
const previousGuide = computed(function() { return guideIndex[guidePosition.value - 1] || null })
const nextGuide = computed(function() { return guideIndex[guidePosition.value + 1] || null })

// 目录项的阅读状态：已读 / 当前 / 未读
function tocState(index) {
  const activeIndex = headings.value.findIndex(function(h) { return h.id === activeHeading.value })
  if (activeIndex === -1) return 'unread'
  if (index < activeIndex) return 'read'
  if (index === activeIndex) return 'active'
  return 'unread'
}

function headingId(title, index) {
  return 'section-' + index + '-' + title.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')
}

// 正文渲染容器（模板 ref）。标题 id 必须在这一层内查找：
// 之前这里用的是 `.guide-content .markdown-body`，但模板早已改用
// `.article-column > .article-content > .markdown-body`，`.guide-content` 只剩死 CSS，
// 于是查询恒为空 → 标题从未拿到 id → 目录点击和滚动高亮全部失效。
function renderedHeadings() {
  const root = contentRef.value
  if (!root) return []
  return Array.from(root.querySelectorAll('h2, h3, h4'))
}

function updateActiveHeading() {
  const rendered = renderedHeadings()
  if (!rendered.length) { activeHeading.value = ''; return }
  const marker = 132
  const current = rendered.reduce(function(found, element) {
    return element.getBoundingClientRect().top <= marker ? element : found
  }, rendered[0])
  activeHeading.value = current.id
}

// 阅读进度：已滚过正文的高度占正文总高度的比例
function updateProgress() {
  const el = articleRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const start = window.scrollY + rect.top
  const total = el.offsetHeight - window.innerHeight * 0.4
  const passed = window.scrollY - start + window.innerHeight * 0.4
  const ratio = total > 0 ? passed / total : 0
  progress.value = Math.min(1, Math.max(0, ratio))
  showBackToTop.value = window.scrollY > window.innerHeight * 2
}

function onScroll() {
  updateActiveHeading()
  updateProgress()
}

function setHeadingIds() {
  nextTick(function() {
    renderedHeadings().forEach(function(element, index) {
      element.id = headings.value[index] ? headings.value[index].id : headingId(element.textContent, index)
      // 标题锚点：hover 浮出 # 图标，点击复制该节链接
      if (!element.querySelector('.heading-anchor')) {
        var anchor = document.createElement('a')
        anchor.className = 'heading-anchor'
        anchor.textContent = '#'
        anchor.href = '#' + element.id
        anchor.setAttribute('aria-label', '复制本节链接')
        anchor.addEventListener('click', function(e) {
          e.preventDefault()
          var url = window.location.href.split('#')[0] + '#' + element.id
          navigator.clipboard.writeText(url).catch(function() {})
          anchor.textContent = '✓'
          window.setTimeout(function() { anchor.textContent = '#' }, 1400)
        })
        element.appendChild(anchor)
      }
    })
    updateActiveHeading()
    updateProgress()
  })
}

function scrollToHeading(id, index) {
  // 优先按 id 找；若 id 因故未能写入，退回到「按目录顺序取第 index 个标题」，
  // 保证目录在任何情况下都点得动。
  const target = document.getElementById(id) || renderedHeadings()[index]
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

onMounted(function() {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(function() {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div class="guide-detail" v-if="guide">
    <!-- 阅读进度条 -->
    <div class="reading-progress" aria-hidden="true">
      <div class="reading-progress__bar" :style="{ width: (progress * 100) + '%' }"></div>
    </div>

    <div class="breadcrumb"><RouterLink to="/">首页</RouterLink><span>/</span><RouterLink to="/guides">开服指南</RouterLink><span>/</span><span>{{ guide.name }}</span></div>
    <header class="guide-header">
      <div>
        <span class="section-kicker">SERVER SETUP GUIDE</span>
        <h1>{{ guide.name }}</h1>
        <p class="tagline">{{ guide.description }}</p>
        <div class="guide-meta">
          <span class="reading-time">🕐 约 {{ readingMinutes }} 分钟</span>
          <span class="reading-time" v-if="headings.length">{{ headings.length }} 个小节</span>
        </div>
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
        <article class="article-content" ref="articleRef">
          <div v-if="loading" class="empty-state">
            <span class="icon">⚙️</span>
            <h3>正在加载内容...</h3>
          </div>

          <div v-else-if="error" class="empty-state">
            <span class="icon">⚠️</span>
            <h3>{{ error }}</h3>
            <p>请检查 content/guides/ 目录下是否存在对应文件</p>
          </div>

          <div
            v-else
            class="markdown-body"
            ref="contentRef"
            :data-reading-length="isLongRead ? 'long' : 'normal'"
            v-html="html"
            @click="copyCode"
          ></div>
        </article>
      </main>

      <aside class="guide-toc" v-if="headings.length" aria-label="本页目录">
        <span class="toc-title">本页目录</span>
        <a
          v-for="(heading, index) in headings"
          :key="heading.id"
          :href="`#${heading.id}`"
          :class="['toc-item', 'toc-level-' + heading.level, 'is-' + tocState(index)]"
          :aria-current="tocState(index) === 'active' ? 'location' : undefined"
          @click.prevent="scrollToHeading(heading.id, index)"
        >
          <span class="toc-item__dot" aria-hidden="true"></span>
          <span>{{ heading.title }}</span>
        </a>
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
        <RouterLink
          v-for="g in relatedGuides"
          :key="g.id"
          :to="'/guide/' + g.id"
          class="related-item"
        >
          <span class="related-icon" aria-hidden="true">{{ g.icon }}</span>
          <div>
            <span class="related-name">{{ g.name }}</span>
            <span class="related-desc">{{ g.description }}</span>
          </div>
        </RouterLink>
      </div>
    </footer>

    <button class="back-to-top" :class="{ 'is-visible': showBackToTop }" aria-label="回到顶部" @click="scrollToTop">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
    </button>
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
.breadcrumb { display: flex; gap: 8px; margin-bottom: 32px; color: var(--text-muted); font-size: 11px; }
.breadcrumb a { color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
.breadcrumb a:hover { color: var(--accent-strong); }
.section-kicker { color: var(--accent-strong); font: 10px var(--font-mono); letter-spacing: 1.5px; }

.guide-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--glass-border);
}

.guide-header h1 {
  font-size: 26px;
  font-weight: 750;
  color: var(--text-primary);
  margin-top: 8px;
  margin-bottom: 6px;
  letter-spacing: -0.5px;
}

.tagline {
  font-size: var(--fs-body);
  color: var(--text-secondary);
}

.guide-meta { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-3); }

/* TOC 基础样式（三态 .toc-item 定义见 main.css）
   布局相关（grid 列、sticky）在下方的文档布局段统一声明，
   这里只定义外观，避免出现两处互相覆盖的 .guide-toc 规则。 */
.guide-toc {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  padding: 16px 12px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--shadow), inset 0 1px 0 var(--glass-highlight);
}
.toc-title { margin: 0 0 8px; padding: 0 10px; color: var(--text-primary); font-size: 14px; font-weight: 650; }
.guide-toc .toc-level-3 { padding-left: 22px; font-size: 12px; }
.guide-toc .toc-level-4 { padding-left: 32px; font-size: 12px; }

/* Related */
.related {
  border-top: 1px solid var(--glass-border);
  padding-top: 28px;
  margin-top: 48px;
}
/* grid 子项默认 min-width:auto，长标题会把列撑爆并溢出页面；
   用 minmax(0,1fr) + 子项 min-width:0 双保险（移动端溢出根因）。 */
.guide-sequence { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 28px; }
.sequence-item {
  min-width: 0;
  min-height: 68px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 14px 16px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s var(--ease-standard);
  backdrop-filter: blur(8px);
}
.sequence-item:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}
.sequence-item span { color: var(--text-muted); font-size: 9px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
.sequence-item b { min-width: 0; font-size: 12px; font-weight: 600; overflow-wrap: anywhere; }
.sequence-item.next { text-align: right; }

.related h3 { font-size: 15px; font-weight: 650; margin-bottom: 14px; color: var(--text-primary); }

/* min(240px,100%) 兜底：容器窄于 240px 时列宽跟随容器，不再溢出 */
.related-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(240px, 100%), 1fr)); gap: 12px; }
.related-item {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  color: inherit;
  text-decoration: none;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  transition: all 0.3s var(--ease-standard);
  backdrop-filter: blur(8px);
}
.related-item:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}
.related-item:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.related-icon { font-size: 20px; }
.related-item > div { display: flex; flex-direction: column; min-width: 0; gap: 3px; }
.related-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.related-desc { font-size: 11px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

@media (max-width: 768px) {
  .related-desc { font-size: 11px; }
}

/* ============================================================
   文档布局：基础样式定义为桌面三列，媒体查询按 max-width 降序排列。
   ⚠ 顺序很关键：媒体查询不增加特异性，若把「桌面规则」写在
   「移动端规则」之后，移动端会被桌面规则覆盖（历史 bug：
   390px 屏上误用三列 grid 导致正文横向溢出）。
   ============================================================ */
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
  top: 88px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 16px 12px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow), inset 0 1px 0 var(--glass-highlight);
}
.sidebar-title { margin: 0 0 8px; padding: 0 10px; color: var(--text-primary); font-size: 14px; font-weight: 650; }
.guide-sidebar a {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px;
  line-height: 1.55;
  transition: all 0.18s var(--ease-standard);
}
.guide-sidebar a span { min-width: 0; overflow-wrap: anywhere; }
.guide-sidebar a small { flex: none; color: var(--text-muted); font-size: 11px; }
.guide-sidebar a:hover { color: var(--accent-strong); background: var(--surface-hover); }
.guide-sidebar a.active { color: var(--accent-strong); background: var(--accent-dim); font-weight: 600; }

/* TOC 布局：桌面固定在第三列右侧，跟随滚动 */
.guide-toc {
  grid-column: 3;
  min-width: 0;
  position: sticky;
  top: 88px;
  max-height: calc(100vh - 120px);
}

/* Article column —— v3：正文宽度由 tokens 的 --measure-guide 统一封顶，
   宽屏靠留白而非加长行（设计系统规范 §3.1）。 */
.article-column { min-width: 0; width: 100%; grid-column: 2; grid-row: 1; }
.article-content { min-width: 0; width: 100%; margin: 0; }
.article-content .markdown-body {
  min-width: 0;
  width: 100%;
  max-width: var(--measure-guide);
}

/* 平板 / 窄桌面：TOC 移到顶部，双列 */
@media (max-width: 1199px) {
  .guide-detail { width: min(1120px, calc(100% - 48px)); }
  .guide-layout { grid-template-columns: 220px minmax(0, 1fr); column-gap: 28px; }
  .guide-toc { grid-column: 1 / -1; grid-row: 1; position: static; max-height: none; margin-bottom: 24px; }
  .guide-sidebar { grid-column: 1; grid-row: 2; }
  .article-column { grid-column: 2; grid-row: 2; }
  .article-content, .article-content .markdown-body { width: 100%; max-width: none; }
}

/* 移动端：单列，隐藏侧栏 */
@media (max-width: 768px) {
  .guide-detail { width: 100%; padding: 18px; }
  .guide-layout { display: block; }
  .guide-sidebar { display: none; }
  .guide-toc { position: static; max-height: none; margin: 0 0 24px; }
  .article-column { display: block; width: 100%; }
  .article-content, .article-content .markdown-body { width: 100%; max-width: none; }
  .guide-sequence, .related-list { grid-template-columns: minmax(0, 1fr); }
  .sequence-item.next { text-align: left; }
}
</style>
