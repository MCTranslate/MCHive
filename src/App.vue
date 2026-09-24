<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchContent } from './data/content.js'

const themeModes = ['system', 'light', 'dark']
const theme = ref('system')
const themeOpen = ref(false)

function applyTheme(value) {
  theme.value = value
  const root = document.documentElement
  root.dataset.theme = value
  root.style.colorScheme = value === 'system' ? '' : value
  window.localStorage.setItem('mchive-theme', value)
  themeOpen.value = false
}

function cycleTheme() {
  const index = themeModes.indexOf(theme.value)
  applyTheme(themeModes[(index + 1) % themeModes.length])
}

function themeLabel(value) {
  return { system: '跟随系统', light: '浅色模式', dark: '深色模式' }[value]
}

onMounted(() => {
  applyTheme(window.localStorage.getItem('mchive-theme') || 'system')
})

const route = useRoute()
const router = useRouter()
const searchOpen = ref(false)
const menuOpen = ref(false)
const query = ref('')

const navigation = [
  { label: '开始开服', to: '/guides' },
  { label: '知识库', to: '/tutorials' },
  { label: '插件', to: '/plugins' },
  { label: '贡献', to: '/contribute' }
]

const searchItems = computed(() => searchContent(query.value).slice(0, query.value.trim() ? 8 : 6))

function openSearch() {
  searchOpen.value = true
  menuOpen.value = false
}

function go(path) {
  router.push(path)
  searchOpen.value = false
  menuOpen.value = false
  query.value = ''
}

function submitSearch() {
  if (query.value.trim()) go({ path: '/search', query: { q: query.value.trim() } })
}

function onKeydown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openSearch()
  }
  if (event.key === 'Escape') {
    searchOpen.value = false
    menuOpen.value = false
  }
}

watch(() => route.fullPath, () => {
  searchOpen.value = false
  menuOpen.value = false
  themeOpen.value = false
})
</script>

<template>
  <div class="app-shell" @keydown="onKeydown">
    <header class="site-header">
      <div class="header-inner">
        <RouterLink class="brand" to="/" aria-label="MCHive 首页">
          <span class="brand-mark" aria-hidden="true">M</span>
          <span class="brand-word">MCHive</span>
        </RouterLink>
        <nav class="primary-nav" aria-label="主导航">
          <RouterLink v-for="item in navigation" :key="item.to" :to="item.to" active-class="active">{{ item.label }}</RouterLink>
        </nav>
        <div class="header-actions">
          <button class="search-trigger" aria-label="搜索 MCHive" @click="openSearch">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>
            <span>搜索教程、插件、配置</span><kbd>⌘ K</kbd>
          </button>
          <div class="theme-control">
            <button class="theme-trigger" type="button" :aria-label="`当前主题：${themeLabel(theme)}`" :aria-expanded="themeOpen" @click="themeOpen = !themeOpen">
              <svg v-if="theme === 'dark'" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.7 15.4A8.9 8.9 0 0 1 8.6 3.3 9 9 0 1 0 20.7 15.4Z"/></svg>
              <svg v-else-if="theme === 'light'" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 20v-2M16 20v-2M8 8h8M8 12h5"/></svg>
            </button>
            <div v-if="themeOpen" class="theme-menu" role="menu">
              <button v-for="mode in themeModes" :key="mode" type="button" :class="{ active: theme === mode }" role="menuitem" @click="applyTheme(mode)">{{ themeLabel(mode) }}</button>
            </div>
          </div>
          <a class="github-link" href="https://github.com/MCTranslate/MCHive" target="_blank" rel="noreferrer" aria-label="在 GitHub 查看 MCHive">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.1-6-2.5M15 21v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.1-1.5 6.1-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6S17.5.2 15 2.3a13.4 13.4 0 0 0-7 0C5.5.2 4.3.5 4.3.5a4.8 4.8 0 0 0-.1 3.6 5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.1 6.4 6.1 6.7A3.4 3.4 0 0 0 8 17.1V21"/></svg>
          </a>
          <button class="menu-trigger" aria-label="打开导航菜单" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
        </div>
      </div>
      <nav v-if="menuOpen" class="mobile-nav" aria-label="移动主导航">
        <RouterLink v-for="item in navigation" :key="item.to" :to="item.to">{{ item.label }}<span aria-hidden="true">→</span></RouterLink>
        <button class="mobile-theme" type="button" @click="cycleTheme">主题：{{ themeLabel(theme) }}<span aria-hidden="true">↻</span></button>
        <a href="https://github.com/MCTranslate/MCHive" target="_blank" rel="noreferrer">GitHub<span aria-hidden="true">↗</span></a>
      </nav>
    </header>

    <main id="main-content" class="main-content"><Transition name="page" mode="out-in"><RouterView /></Transition></main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand"><RouterLink class="brand" to="/"><span class="brand-mark">M</span><span class="brand-word">MCHive</span></RouterLink><p>让每一位服主，都能把服务器搭建好。</p></div>
        <div class="footer-links"><span class="footer-label">探索</span><RouterLink to="/guides">开服指南</RouterLink><RouterLink to="/tutorials">教程中心</RouterLink><RouterLink to="/plugins">插件中心</RouterLink><RouterLink to="/contribute">贡献指南</RouterLink></div>
        <div class="footer-links"><span class="footer-label">社区</span><a href="https://github.com/MCTranslate/MCHive" target="_blank" rel="noreferrer">GitHub 项目</a><RouterLink to="/contribute">贡献指南</RouterLink><a href="https://github.com/MCTranslate/MCHive/issues" target="_blank" rel="noreferrer">反馈与贡献</a><span>GPL-3.0 开源许可</span></div>
      </div>
      <div class="footer-bottom"><span>© MCHive · Minecraft Server Knowledge Platform</span><span>由社区持续维护</span></div>
    </footer>

    <div v-if="searchOpen" class="search-backdrop" @click.self="searchOpen = false">
      <section class="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title">
        <div class="search-dialog-head">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>
          <label id="search-title" class="sr-only" for="global-search">搜索 MCHive</label>
          <input id="global-search" v-model="query" autofocus placeholder="搜索教程、插件、关键词..." @keydown.enter="submitSearch" />
          <button class="close-search" aria-label="关闭搜索" @click="searchOpen = false">Esc</button>
        </div>
        <div class="search-results">
          <p class="search-caption">{{ query ? '匹配内容' : '快速访问' }}</p>
          <button v-for="item in searchItems" :key="item.type + item.id" class="search-result" @click="go(item.to)">
            <span class="result-type">{{ item.type }}</span><span class="result-copy"><strong>{{ item.name }}</strong><small>{{ item.description }}</small></span><span class="result-arrow" aria-hidden="true">↗</span>
          </button>
          <div v-if="!searchItems.length" class="search-empty">没有找到相关内容，试试插件名、关键词或问题描述。</div>
        </div>
        <div class="search-dialog-foot"><span>按 Enter 搜索全部内容</span><button @click="submitSearch">查看全部结果 <span aria-hidden="true">→</span></button></div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.app-shell { min-height: 100vh; display: flex; flex-direction: column; }
.site-header { position: sticky; top: 0; z-index: 50; height: 68px; border-bottom: 1px solid var(--border); background: color-mix(in srgb, var(--bg-primary) 94%, transparent); backdrop-filter: blur(14px); }
.header-inner { width: min(1200px, calc(100% - 64px)); height: 100%; margin: 0 auto; display: flex; align-items: center; gap: 44px; }
.brand { display: inline-flex; align-items: center; gap: 10px; color: var(--text-primary); text-decoration: none; flex: none; }
.brand-mark { display: grid; place-items: center; width: 30px; height: 30px; background: var(--accent); color: #102318; font: 800 17px/1 ui-monospace, monospace; border-radius: 6px 6px 6px 2px; }
.brand-word { font-size: 17px; line-height: 1; font-weight: 750; letter-spacing: 0; }
.primary-nav { display: flex; align-items: center; gap: 30px; height: 100%; flex: 1; }
.primary-nav a, .mobile-nav a { color: var(--text-secondary); text-decoration: none; font-size: 14px; transition: color .18s; }
.primary-nav a:hover, .primary-nav a.active { color: var(--text-primary); }
.primary-nav a.active { box-shadow: inset 0 -2px var(--accent); height: 100%; display: inline-flex; align-items: center; }
.header-actions { display: flex; align-items: center; gap: 16px; }
.search-trigger { width: 250px; height: 36px; border: 1px solid var(--border); border-radius: 6px; color: var(--text-muted); background: var(--surface); display: flex; align-items: center; gap: 9px; padding: 0 10px; text-align: left; font: inherit; cursor: pointer; }
.search-trigger svg, .github-link svg, .menu-trigger svg, .search-dialog-head svg { width: 17px; height: 17px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; flex: none; }
.search-trigger span { flex: 1; font-size: 12px; white-space: nowrap; overflow: hidden; }
kbd { padding: 2px 5px; border: 1px solid var(--border); border-radius: 3px; font: 10px var(--font-mono); color: var(--text-muted); }
.github-link { color: var(--text-secondary); display: grid; place-items: center; }
.github-link svg { width: 19px; height: 19px; }
.menu-trigger, .mobile-nav { display: none; }
.main-content { flex: 1; width: 100%; }
.site-footer { border-top: 1px solid var(--border); margin-top: 72px; background: var(--surface); }
.footer-inner, .footer-bottom { width: min(1200px, calc(100% - 64px)); margin: auto; }
.footer-inner { min-height: 182px; padding: 38px 0; display: grid; grid-template-columns: 1fr 170px 190px; gap: 36px; }
.footer-brand p { margin-top: 12px; color: var(--text-muted); font-size: 13px; }
.footer-links { display: flex; flex-direction: column; align-items: flex-start; gap: 9px; color: var(--text-muted); font-size: 12px; }
.footer-links a { color: var(--text-secondary); text-decoration: none; }
.footer-links a:hover { color: var(--accent-strong); }
.footer-label { color: var(--text-primary); font-weight: 650; margin-bottom: 3px; }
.footer-bottom { min-height: 48px; padding: 12px 0; border-top: 1px solid var(--border); display: flex; justify-content: space-between; gap: 16px; color: var(--text-muted); font-size: 11px; }
.search-backdrop { animation: backdrop-in .18s ease-out; position: fixed; inset: 0; z-index: 100; display: flex; align-items: flex-start; justify-content: center; padding: min(18vh, 150px) 20px 24px; background: rgba(13, 20, 17, .56); backdrop-filter: blur(5px); }
.search-dialog { animation: dialog-in .22s var(--ease-standard); width: min(600px, 100%); background: var(--bg-primary); border: 1px solid var(--border-strong); border-radius: 9px; box-shadow: 0 24px 90px rgba(0,0,0,.28); overflow: hidden; }
.search-dialog-head { height: 58px; display: flex; align-items: center; padding: 0 18px; gap: 12px; border-bottom: 1px solid var(--border); color: var(--text-muted); }
.search-dialog-head input { min-width: 0; flex: 1; border: 0; outline: 0; background: transparent; color: var(--text-primary); font: 15px var(--font-sans); }
.close-search { border: 1px solid var(--border); background: var(--surface); color: var(--text-muted); padding: 3px 7px; border-radius: 4px; font: 11px var(--font-mono); cursor: pointer; }
.search-results { max-height: min(440px, 56vh); overflow-y: auto; padding: 12px; }
.search-caption { padding: 5px 8px 8px; color: var(--text-muted); font-size: 11px; }
.search-result { width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 9px; border: 0; border-radius: 5px; background: transparent; text-align: left; color: inherit; cursor: pointer; }
.search-result:hover { background: var(--surface); transform: translateX(3px); }
.result-type { width: 48px; color: var(--accent-strong); font-size: 11px; flex: none; }
.result-copy { display: flex; min-width: 0; flex-direction: column; gap: 2px; flex: 1; }
.result-copy strong { font-size: 13px; font-weight: 600; }
.result-copy small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-muted); font-size: 11px; }
.result-arrow { color: var(--text-muted); }
.search-empty { padding: 36px 20px; text-align: center; color: var(--text-muted); font-size: 13px; }
.search-dialog-foot { border-top: 1px solid var(--border); padding: 10px 16px; display: flex; justify-content: space-between; color: var(--text-muted); font-size: 11px; }
.search-dialog-foot button { border: 0; background: transparent; color: var(--accent-strong); font: inherit; cursor: pointer; }
@keyframes backdrop-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes dialog-in { from { opacity: 0; transform: translateY(-8px) scale(.985); } to { opacity: 1; transform: translateY(0) scale(1); } }
.page-enter-active, .page-leave-active { transition: opacity .22s var(--ease-standard), transform .22s var(--ease-standard); }
.page-enter-from { opacity: 0; transform: translateY(7px); }
.page-leave-to { opacity: 0; transform: translateY(-3px); }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
@media (max-width: 900px) { .header-inner { gap: 26px; } .primary-nav { gap: 20px; } .search-trigger { width: 190px; } }
@media (max-width: 700px) {
  .site-header { height: 58px; }
  .header-inner { width: calc(100% - 32px); justify-content: space-between; gap: 10px; }
  .primary-nav, .github-link { display: none; }
  .header-actions { gap: 12px; }
  .search-trigger { width: 36px; height: 36px; justify-content: center; padding: 0; }
  .search-trigger span, .search-trigger kbd { display: none; }
  .menu-trigger { width: 36px; height: 36px; display: grid; place-items: center; border: 1px solid var(--border); border-radius: 5px; color: var(--text-secondary); background: transparent; }
  .mobile-nav { display: flex; position: absolute; top: 57px; left: 0; right: 0; flex-direction: column; padding: 8px 16px 14px; background: var(--bg-primary); border-bottom: 1px solid var(--border); box-shadow: 0 12px 24px rgba(0,0,0,.08); }
  .mobile-nav a { display: flex; justify-content: space-between; padding: 12px 4px; border-bottom: 1px solid var(--border); }
  .mobile-nav a:last-child { border-bottom: 0; }
  .footer-inner, .footer-bottom { width: calc(100% - 32px); }
  .footer-inner { grid-template-columns: 1fr 1fr; gap: 26px 14px; padding: 28px 0; }
  .footer-brand { grid-column: 1 / -1; }
  .footer-bottom { flex-direction: column; gap: 4px; }
  .site-footer { margin-top: 48px; }
  .search-backdrop { padding: 12px; align-items: flex-start; }
  .search-dialog { margin-top: 58px; max-height: calc(100dvh - 82px); display: flex; flex-direction: column; }
  .search-results { max-height: none; }
}
</style>
