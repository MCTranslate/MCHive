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

function themeIcon(mode) {
  return { system: '💻', light: '☀️', dark: '🌙' }[mode]
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

// Close theme menu when clicking outside
function onDocClick(event) {
  const ctrl = event.target.closest('.theme-control')
  if (!ctrl && themeOpen.value) themeOpen.value = false
}

watch(() => route.fullPath, () => {
  searchOpen.value = false
  menuOpen.value = false
  themeOpen.value = false
})
</script>

<template>
  <div class="app-shell" @keydown="onKeydown" @click="onDocClick">
    <!-- ===== Header ===== -->
    <header class="site-header">
      <div class="header-inner">
        <RouterLink class="brand" to="/" aria-label="MCHive 首页">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="var(--button-text)"><path d="M4 2h16l-2 5H6L4 2zm1 6h14l-1.5 14H6.5L5 8zm3 2v10h2v-3h6v3h2V10h-2v5h-6v-5H8z"/></svg>
          </span>
          <span class="brand-word">MCHive</span>
        </RouterLink>

        <nav class="primary-nav" aria-label="主导航">
          <RouterLink v-for="item in navigation" :key="item.to" :to="item.to" active-class="active">
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>

        <div class="header-actions">
          <button class="search-trigger" aria-label="搜索 MCHive" @click="openSearch">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>
            <span>搜索教程、插件、配置</span>
            <kbd>⌘ K</kbd>
          </button>

          <div class="theme-control">
            <button class="theme-trigger" type="button" :aria-label="`当前主题：${themeLabel(theme)}`" :aria-expanded="themeOpen" @click.stop="themeOpen = !themeOpen">
              <svg v-if="theme === 'dark'" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.7 15.4A8.9 8.9 0 0 1 8.6 3.3 9 9 0 1 0 20.7 15.4Z"/></svg>
              <svg v-else-if="theme === 'light'" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 20v-2M16 20v-2M8 8h8M8 12h5"/></svg>
            </button>
            <div v-if="themeOpen" class="theme-menu" role="menu">
              <button v-for="mode in themeModes" :key="mode" type="button" :class="{ active: theme === mode }" role="menuitem" @click="applyTheme(mode)">
                <span class="menu-icon" aria-hidden="true">{{ themeIcon(mode) }}</span>
                {{ themeLabel(mode) }}
              </button>
            </div>
          </div>

          <a class="github-link" href="https://github.com/MCTranslate/MCHive" target="_blank" rel="noreferrer" aria-label="在 GitHub 查看 MCHive">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.1-6-2.5M15 21v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.1-1.5 6.1-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6S17.5.2 15 2.3a13.4 13.4 0 0 0-7 0C5.5.2 4.3.5 4.3.5a4.8 4.8 0 0 0-.1 3.6 5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.1 6.4 6.1 6.7A3.4 3.4 0 0 0 8 17.1V21"/></svg>
          </a>

          <button class="menu-trigger" aria-label="打开导航菜单" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
            <svg v-if="!menuOpen" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
      </div>

      <Transition name="mobile-nav">
        <nav v-if="menuOpen" class="mobile-nav" aria-label="移动主导航">
          <RouterLink v-for="item in navigation" :key="item.to" :to="item.to" class="mobile-nav-item">
            <span>{{ item.label }}</span>
            <small aria-hidden="true">→</small>
          </RouterLink>
          <a href="https://github.com/MCTranslate/MCHive" target="_blank" rel="noreferrer" class="mobile-nav-item">
            <span>GitHub</span>
            <small aria-hidden="true">↗</small>
          </a>
          <button class="mobile-theme" type="button" @click="cycleTheme">
            <span>切换主题</span>
            <small>{{ themeLabel(theme) }} ↻</small>
          </button>
        </nav>
      </Transition>
    </header>

    <!-- ===== Main ===== -->
    <main id="main-content" class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- ===== Footer ===== -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <RouterLink class="brand" to="/">
            <span class="brand-mark">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="var(--button-text)"><path d="M4 2h16l-2 5H6L4 2zm1 6h14l-1.5 14H6.5L5 8zm3 2v10h2v-3h6v3h2V10h-2v5h-6v-5H8z"/></svg>
            </span>
            <span class="brand-word">MCHive</span>
          </RouterLink>
          <p>让每一位服主，都能把服务器搭建好。</p>
        </div>
        <div class="footer-links">
          <span class="footer-label">探索</span>
          <RouterLink to="/guides">开服指南</RouterLink>
          <RouterLink to="/tutorials">教程中心</RouterLink>
          <RouterLink to="/plugins">插件中心</RouterLink>
          <RouterLink to="/contribute">贡献指南</RouterLink>
        </div>
        <div class="footer-links">
          <span class="footer-label">社区</span>
          <a href="https://github.com/MCTranslate/MCHive" target="_blank" rel="noreferrer">GitHub 项目</a>
          <RouterLink to="/contribute">贡献指南</RouterLink>
          <a href="https://github.com/MCTranslate/MCHive/issues" target="_blank" rel="noreferrer">反馈与贡献</a>
          <span>GPL-3.0 开源许可</span>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© MCHive · Minecraft Server Knowledge Platform</span>
        <span>由社区持续维护</span>
      </div>
    </footer>

    <!-- ===== Search Dialog ===== -->
    <Transition name="search-dialog">
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
              <span class="result-type">{{ item.type }}</span>
              <span class="result-copy"><strong>{{ item.name }}</strong><small>{{ item.description }}</small></span>
              <span class="result-arrow" aria-hidden="true">↗</span>
            </button>
            <div v-if="!searchItems.length" class="search-empty">没有找到相关内容，试试插件名、关键词或问题描述。</div>
          </div>
          <div class="search-dialog-foot">
            <span>按 Enter 搜索全部内容</span>
            <button @click="submitSearch">查看全部结果 <span aria-hidden="true">→</span></button>
          </div>
        </section>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  transition: background-color .4s var(--ease-smooth);
}

/* ---------- Header ---------- */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 64px;
  border-bottom: 1px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 0 1px 0 var(--glass-highlight);
  transition: background-color .4s var(--ease-smooth), border-color .4s var(--ease-smooth);
}

.header-inner {
  width: min(1200px, calc(100% - 48px));
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 36px;
}

/* ---------- Brand ---------- */
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  text-decoration: none;
  flex: none;
  transition: transform .25s var(--ease-spring);
}
.brand:hover { transform: scale(1.03); }
.brand-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  color: var(--button-text);
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(16,185,129,.25);
  transition: all .3s var(--ease-standard);
}
[data-theme='dark'] .brand-mark,
:root[data-theme='system'] .brand-mark {
  box-shadow: 0 2px 12px rgba(110,231,183,.3);
}
.brand:hover .brand-mark { box-shadow: 0 4px 20px rgba(16,185,129,.35); transform: rotate(-3deg); }
.brand-mark svg { width: 18px; height: 18px; }
.brand-word {
  font-size: 18px;
  line-height: 1;
  font-weight: 750;
  letter-spacing: -.5px;
  background: linear-gradient(135deg, var(--text-primary) 30%, var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ---------- Navigation ---------- */
.primary-nav {
  display: flex;
  align-items: center;
  height: 100%;
  flex: 1;
}
.primary-nav a {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 18px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: color .2s var(--ease-standard);
}
.primary-nav a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 18px;
  right: 18px;
  height: 2px;
  background: var(--accent);
  border-radius: 1px;
  transform: scaleX(0);
  transition: transform .3s var(--ease-spring);
}
.primary-nav a:hover { color: var(--text-primary); }
.primary-nav a.active { color: var(--accent); }
.primary-nav a.active::after { transform: scaleX(1); }

/* ---------- Header Actions ---------- */
.header-actions { display: flex; align-items: center; gap: 10px; }

.search-trigger {
  width: 220px;
  height: 38px;
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  color: var(--text-muted);
  background: var(--glass-bg);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  text-align: left;
  font: inherit;
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition: all .25s var(--ease-standard);
}
.search-trigger:hover {
  border-color: var(--accent);
  background: var(--surface-hover);
  box-shadow: 0 2px 12px rgba(16,185,125,.1);
}
.search-trigger svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.8; flex: none; }
.search-trigger span { flex: 1; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
kbd {
  padding: 3px 6px;
  border: 1px solid var(--border);
  border-radius: 5px;
  font: 10px var(--font-mono);
  color: var(--text-muted);
  background: var(--surface);
}

.github-link {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  background: var(--glass-bg);
  transition: all .25s var(--ease-spring);
  backdrop-filter: blur(12px);
}
.github-link:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); transform: translateY(-2px); }
.github-link svg { width: 18px; height: 18px; fill: currentColor; }

.menu-trigger { display: none; width: 38px; height: 38px; place-items: center; border: 1px solid var(--glass-border); border-radius: 10px; color: var(--text-secondary); background: var(--glass-bg); cursor: pointer; transition: all .2s; }
.menu-trigger:hover { border-color: var(--accent); color: var(--accent); }
.menu-trigger svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; }

/* ---------- Mobile Nav ---------- */
.mobile-nav {
  display: none;
  position: absolute;
  top: 63px;
  left: 0;
  right: 0;
  flex-direction: column;
  padding: 8px 16px 16px;
  background: var(--bg-secondary);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: 0 12px 40px rgba(0,0,0,.1);
}
[data-theme='dark'] .mobile-nav,
:root[data-theme='system'] .mobile-nav {
  box-shadow: 0 12px 40px rgba(0,0,0,.4);
}
.mobile-nav-item, .mobile-theme {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 4px;
  border: 0;
  border-bottom: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}
.mobile-nav-item:last-child, .mobile-theme { border-bottom: 0; }
.mobile-nav-item:hover { color: var(--accent); }
.mobile-theme small { font-size: 11px; color: var(--text-muted); }

/* Mobile nav transition */
.mobile-nav-enter-active { transition: all .3s var(--ease-spring); }
.mobile-nav-leave-active { transition: all .2s ease; }
.mobile-nav-enter-from, .mobile-nav-leave-to { opacity: 0; transform: translateY(-8px); }

/* ---------- Main Content ---------- */
.main-content { flex: 1; width: 100%; }

/* ---------- Footer ---------- */
.site-footer {
  margin-top: 80px;
  border-top: 1px solid var(--glass-border);
  background: var(--bg-secondary);
  backdrop-filter: blur(20px);
  transition: background-color .4s var(--ease-smooth);
}
.footer-inner, .footer-bottom { width: min(1200px, calc(100% - 48px)); margin: auto; }
.footer-inner {
  min-height: 180px;
  padding: 44px 0;
  display: grid;
  grid-template-columns: 1fr 160px 180px;
  gap: 40px;
}
.footer-brand p { margin-top: 14px; color: var(--text-muted); font-size: 13px; line-height: 1.7; }
.footer-links { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; color: var(--text-muted); font-size: 12px; }
.footer-links a { color: var(--text-secondary); text-decoration: none; transition: color .2s; }
.footer-links a:hover { color: var(--accent); }
.footer-label { color: var(--text-primary); font-weight: 650; margin-bottom: 4px; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; }
.footer-bottom {
  min-height: 48px;
  padding: 14px 0;
  border-top: 1px solid var(--glass-border);
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: var(--text-muted);
  font-size: 11px;
}

/* ---------- Search Dialog ---------- */
.search-backdrop {
  animation: fadeIn .2s ease-out;
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: min(18vh, 150px) 20px 24px;
  background: rgba(0,0,0,.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
[data-theme='dark'] .search-backdrop,
:root[data-theme='system'] .search-backdrop {
  background: rgba(0,0,0,.65);
}
.search-dialog {
  animation: dialog-in .3s var(--ease-spring);
  width: min(600px, 100%);
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg), inset 0 1px 0 var(--glass-highlight);
  overflow: hidden;
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
}
.search-dialog-head {
  height: 58px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  gap: 12px;
  border-bottom: 1px solid var(--glass-border);
  color: var(--text-muted);
}
.search-dialog-head svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; flex: none; }
.search-dialog-head input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
  font: 15px var(--font-sans);
}
.close-search {
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-muted);
  padding: 4px 8px;
  border-radius: 6px;
  font: 11px var(--font-mono);
  cursor: pointer;
  transition: all .2s;
}
.close-search:hover { border-color: var(--accent); color: var(--accent); }
.search-results { max-height: min(440px, 56vh); overflow-y: auto; padding: 10px 12px; }
.search-caption { padding: 4px 10px 10px; color: var(--text-muted); font-size: 11px; font-weight: 500; }
.search-result {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 10px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  text-align: left;
  color: inherit;
  cursor: pointer;
  transition: all .18s var(--ease-standard);
}
.search-result:hover { background: var(--surface-hover); transform: translateX(4px); }
.result-type { width: 48px; color: var(--accent); font-size: 10px; font-weight: 600; flex: none; text-transform: uppercase; letter-spacing: .5px; }
.result-copy { display: flex; min-width: 0; flex-direction: column; gap: 3px; flex: 1; }
.result-copy strong { font-size: 13px; font-weight: 600; }
.result-copy small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-muted); font-size: 11px; }
.result-arrow { color: var(--text-muted); transition: transform .18s; }
.search-result:hover .result-arrow { transform: translateX(3px); }
.search-empty { padding: 36px 20px; text-align: center; color: var(--text-muted); font-size: 13px; }
.search-dialog-foot {
  border-top: 1px solid var(--glass-border);
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: 11px;
}
.search-dialog-foot button {
  border: 0;
  background: transparent;
  color: var(--accent);
  font: inherit;
  cursor: pointer;
  transition: color .18s;
}
.search-dialog-foot button:hover { color: var(--accent-hover); }

/* Search dialog transition */
.search-dialog-enter-active { transition: all .3s var(--ease-spring); }
.search-dialog-leave-active { transition: all .2s ease; }
.search-dialog-enter-from, .search-dialog-leave-to { opacity: 0; transform: translateY(-12px) scale(.97); }

/* Theme menu icon */
.menu-icon { margin-right: 6px; }

/* ---------- Keyframe ---------- */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  .header-inner { gap: 20px; }
  .search-trigger { width: 160px; }
}
@media (max-width: 700px) {
  .site-header { height: 56px; }
  .header-inner { width: calc(100% - 28px); justify-content: space-between; gap: 8px; }
  .primary-nav, .github-link { display: none; }
  .search-trigger { width: 38px; height: 38px; justify-content: center; padding: 0; }
  .search-trigger span, .search-trigger kbd { display: none; }
  .menu-trigger { display: grid; }
  .mobile-nav { display: flex; }
  .footer-inner, .footer-bottom { width: calc(100% - 28px); }
  .footer-inner { grid-template-columns: 1fr 1fr; gap: 24px; padding: 28px 0; }
  .footer-brand { grid-column: 1 / -1; }
  .footer-bottom { flex-direction: column; gap: 4px; }
  .site-footer { margin-top: 48px; }
  .search-backdrop { padding: 12px; }
  .search-dialog { margin-top: 48px; max-height: calc(100dvh - 72px); display: flex; flex-direction: column; }
  .search-results { max-height: none; }
}
</style>
