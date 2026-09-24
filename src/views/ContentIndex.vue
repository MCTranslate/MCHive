<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import pluginIndex from '../../data/plugins.json'
import guideIndex from '../../data/guides.json'

const props = defineProps({ kind: { type: String, required: true } })
const router = useRouter()
const query = ref('')
const activeCategory = ref('all')

const toolItems = [
  { title: 'Java 启动参数', description: '理解内存参数与服务端启动命令。', state: '内容规划中', tags: 'Java JVM 参数 启动' },
  { title: 'server.properties 速查', description: '快速查阅服务器基础配置项及其影响。', state: '内容规划中', tags: 'server.properties 配置' },
  { title: 'MOTD 与文本格式', description: '为服务器列表信息与游戏内文本做准备。', state: '内容规划中', tags: 'MOTD MiniMessage RGB' },
  { title: 'TPS / MSPT 与日志', description: '了解常见性能指标和日志排查入口。', state: '内容规划中', tags: 'TPS MSPT 日志 性能' }
]

// 获取所有唯一分类
const pluginCategories = computed(() => {
  const cats = new Set(pluginIndex.map(p => p.category || '其他'))
  return ['all', ...Array.from(cats)]
})

const config = computed(() => {
  if (props.kind === 'plugins') return {
    kicker: 'PLUGIN REFERENCE',
    title: '插件中心',
    description: '从安装教程到配置说明与中文语言文件，快速找到插件资料。',
    emptyText: '没有找到匹配的插件，试试切换分类或输入更短的关键词。'
  }
  if (props.kind === 'guides') return {
    kicker: 'SERVER SETUP PATH',
    title: '从 0 开始开服',
    description: '沿着现有教程，一步步完成服务端选型、首次启动与基础玩法配置。',
    emptyText: '没有找到匹配的教程，试试更短的关键词。'
  }
  if (props.kind === 'tutorials') return {
    kicker: 'TUTORIAL LIBRARY',
    title: '教程中心',
    description: '按当前收录内容查找开服、核心选型、插件组合与故障排查教程。',
    emptyText: '没有找到匹配的教程，试试更短的关键词。'
  }
  return {
    kicker: 'SERVER OWNER TOOLKIT',
    title: '服主工具箱',
    description: '常用工具入口正在规划中。先从已有的配置与教程资料开始。',
    emptyText: '暂无可用工具，请在教程与插件资料中查看准确的配置说明。'
  }
})

const allItems = computed(() => {
  if (props.kind === 'plugins') {
    return pluginIndex.map(item => ({
      ...item, to: `/plugin/${item.id}`,
      type: item.category || '插件',
      meta: `${item.version || '版本未注明'} · ${(item.sections || []).length} 项资料`,
      searchable: `${item.name} ${item.description} ${item.category} ${(item.tags || []).join(' ')}`
    }))
  }
  if (props.kind === 'guides' || props.kind === 'tutorials') {
    return guideIndex.map(item => ({
      ...item, to: `/guide/${item.id}`,
      type: item.tags?.[0] || '教程',
      meta: (item.tags || []).join(' · '),
      searchable: `${item.name} ${item.description} ${(item.tags || []).join(' ')}`
    }))
  }
  return toolItems.map((item, index) => ({
    ...item, id: index, type: '工具规划',
    meta: item.state,
    searchable: `${item.title} ${item.description} ${item.tags}`
  }))
})

// 按分类筛选后的 items
const filteredItems = computed(() => {
  const tokens = query.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  return allItems.value.filter(item => {
    // 分类筛选
    if (props.kind === 'plugins' && activeCategory.value !== 'all') {
      if ((item.category || '其他') !== activeCategory.value) return false
    }
    // 关键词筛选
    if (!tokens.length) return true
    const haystack = item.searchable.toLocaleLowerCase()
    return tokens.every(token => haystack.includes(token))
  })
})

const isTools = computed(() => props.kind === 'tools')

// 计算每个分类数量
const categoryCounts = computed(() => {
  const counts = { all: allItems.value.length }
  if (props.kind === 'plugins') {
    pluginIndex.forEach(p => {
      const cat = p.category || '其他'
      counts[cat] = (counts[cat] || 0) + 1
    })
  }
  return counts
})
</script>

<template>
  <div class="index-page content-width">
    <nav class="breadcrumb" aria-label="面包屑">
      <RouterLink to="/">首页</RouterLink><span>/</span><span>{{ config.title }}</span>
    </nav>

    <header class="index-header">
      <div>
        <span class="section-kicker">{{ config.kicker }}</span>
        <h1>{{ config.title }}</h1>
        <p>{{ config.description }}</p>
      </div>
      <div class="index-count" v-if="!isTools">
        <strong>{{ filteredItems.length.toString().padStart(2, '0') }}</strong>
        <span>{{ kind === 'plugins' ? 'PLUGIN GUIDES' : 'LEARNING RESOURCES' }}</span>
      </div>
    </header>

    <!-- 分类筛选（仅插件页） -->
    <div class="category-chips" v-if="kind === 'plugins' && pluginCategories.length > 2">
      <button
        v-for="cat in pluginCategories"
        :key="cat"
        class="category-chip"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >
        {{ cat === 'all' ? '全部' : cat }}
        <span class="chip-count">{{ categoryCounts[cat] || 0 }}</span>
      </button>
    </div>

    <!-- 工具栏 -->
    <div class="index-toolbar">
      <span>{{ isTools ? '工具规划' : '全部内容' }} <b>{{ filteredItems.length }}</b></span>
      <label class="index-search">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>
        <input v-model="query" :placeholder="kind === 'plugins' ? '搜索插件、功能或标签' : '搜索标题或关键词'" />
        <button v-if="query" aria-label="清除搜索" @click="query = ''">×</button>
      </label>
    </div>

    <!-- 内容列表 -->
    <div class="resource-list" :class="{ 'tool-list': isTools }">
      <component
        :is="item.to ? 'RouterLink' : 'article'"
        v-for="(item, index) in filteredItems"
        :key="item.id"
        class="resource-row"
        :to="item.to"
        :style="{ animationDelay: index * 50 + 'ms' }"
      >
        <span class="resource-mark">{{ item.icon || (kind === 'plugins' ? item.name.slice(0, 1) : '↗') }}</span>
        <span class="resource-main">
          <span class="resource-type">{{ item.type }}</span>
          <b>{{ item.name || item.title }}</b>
          <small>{{ item.description }}</small>
          <span class="resource-meta">{{ item.meta }}</span>
        </span>
        <span v-if="isTools" class="planned-label">{{ item.state }}</span>
        <span v-else class="resource-arrow">↗</span>
      </component>

      <div v-if="!filteredItems.length" class="index-empty">
        <span class="empty-icon">🔍</span>
        <h3>{{ config.emptyText }}</h3>
        <button v-if="activeCategory !== 'all' || query" class="btn btn-secondary" @click="activeCategory = 'all'; query = ''">
          清除筛选
        </button>
      </div>
    </div>

    <div v-if="isTools" class="tools-note">
      <span>正在逐步扩展</span>
      <p>目前展示的是工具规划入口，还没有发布可交互工具。当前准确的配置和使用说明，请在教程与插件资料中查看。</p>
      <RouterLink to="/tutorials">浏览已有教程 <b>→</b></RouterLink>
    </div>
  </div>
</template>

<style scoped>
.content-width { width: min(980px, calc(100% - 64px)); margin: auto; }
.index-page { padding-top: 28px; padding-bottom: 48px; }
.breadcrumb { display: flex; gap: 8px; color: var(--text-muted); font-size: 11px; }
.breadcrumb a { color: var(--text-muted); text-decoration: none; transition: color .2s; }
.breadcrumb a:hover { color: var(--accent); }

.index-header {
  display: flex; justify-content: space-between; align-items: end; gap: 24px;
  margin-top: 40px; padding-bottom: 24px;
  border-bottom: 1px solid var(--glass-border);
}
.section-kicker { color: var(--accent); font: 10px var(--font-mono); letter-spacing: 1.5px; text-transform: uppercase; }
.index-header h1 { margin-top: 10px; font-size: 32px; line-height: 1.25; font-weight: 700; letter-spacing: -.5px; }
.index-header p { max-width: 600px; margin-top: 10px; color: var(--text-muted); font-size: 13px; line-height: 1.8; }
.index-count { display: flex; align-items: baseline; gap: 10px; flex: none; color: var(--text-muted); font: 9px var(--font-mono); }
.index-count strong { color: var(--accent); font-size: 24px; font-weight: 600; }

.index-toolbar {
  min-height: 60px; display: flex; align-items: center;
  justify-content: space-between; gap: 16px; color: var(--text-secondary); font-size: 11px;
}
.index-toolbar b { margin-left: 6px; color: var(--text-muted); font: 10px var(--font-mono); }
.index-search {
  width: min(300px, 55%); height: 36px; display: flex; align-items: center;
  gap: 10px; padding: 0 12px; border: 1px solid var(--glass-border);
  border-radius: var(--radius); background: var(--glass-bg); color: var(--text-muted);
  backdrop-filter: blur(8px); transition: all .25s var(--ease-standard);
}
.index-search:focus-within {
  border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim);
}
.index-search svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.8; flex: none; }
.index-search input { flex: 1; min-width: 0; border: 0; outline: 0; color: var(--text-primary); background: transparent; font: 12px var(--font-sans); }
.index-search button { border: 0; background: transparent; color: var(--text-muted); font-size: 18px; cursor: pointer; }

.resource-list { display: flex; flex-direction: column; gap: 8px; }
.resource-row {
  display: flex; align-items: center; min-height: 100px; gap: 18px; padding: 16px;
  text-decoration: none; color: inherit;
  transition: all .3s var(--ease-spring);
  border: 1px solid transparent; border-radius: var(--radius);
  animation: fadeInUp .5s var(--ease-spring) both;
}
.resource-row:hover {
  background: var(--glass-bg); border-color: var(--glass-border);
  backdrop-filter: blur(12px); transform: translateX(4px);
  box-shadow: var(--shadow), inset 0 1px 0 var(--glass-highlight);
}
.resource-mark {
  display: grid; place-items: center; width: 40px; height: 40px; flex: none;
  border: 1px solid var(--glass-border); border-radius: var(--radius-sm);
  background: var(--accent-dim); color: var(--accent); font-size: 16px; font-weight: 600;
}
.resource-main { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 5px; flex: 1; }
.resource-type { color: var(--accent); font: 9px var(--font-mono); text-transform: uppercase; letter-spacing: .5px; }
.resource-main b { font-size: 14px; font-weight: 630; }
.resource-main small { color: var(--text-muted); font-size: 11px; line-height: 1.6; }
.resource-meta { margin-top: 4px; color: var(--text-muted); font: 9px var(--font-mono); }
.resource-arrow { align-self: flex-start; padding-top: 8px; color: var(--text-muted); font-size: 15px; transition: transform .2s var(--ease-spring); }
.resource-row:hover .resource-arrow { color: var(--accent); transform: translateX(4px); }
.index-empty { padding: 48px 20px; text-align: center; color: var(--text-muted); font-size: 13px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.empty-icon { font-size: 32px; }
.index-empty h3 { font-size: 14px; font-weight: 500; color: var(--text-secondary); }

.tool-list .resource-row { min-height: 96px; }
.planned-label {
  align-self: flex-start; margin-top: 8px; padding: 5px 10px;
  border: 1px solid var(--glass-border); border-radius: var(--radius-full);
  color: var(--text-muted); font-size: 9px; white-space: nowrap; background: var(--surface);
}
.tools-note { margin-top: 28px; padding: 20px; border-top: 1px solid var(--glass-border); }
.tools-note > span { color: var(--text-primary); font-size: 12px; font-weight: 650; }
.tools-note p { margin-top: 8px; color: var(--text-muted); font-size: 11px; line-height: 1.7; }
.tools-note a { display: inline-block; margin-top: 12px; color: var(--accent); font-size: 11px; text-decoration: none; transition: color .2s; }
.tools-note a:hover { color: var(--accent-hover); }
.tools-note b { margin-left: 6px; }

@media (max-width: 700px) {
  .content-width { width: calc(100% - 36px); }
  .index-page { padding-top: 20px; }
  .index-header { align-items: flex-start; margin-top: 32px; padding-bottom: 18px; }
  .index-header h1 { font-size: 28px; }
  .index-header p { max-width: 100%; font-size: 12px; }
  .index-count { display: none; }
  .index-toolbar { min-height: 58px; }
  .index-search { width: min(200px, 60%); }
  .resource-row { min-height: 96px; gap: 12px; padding: 14px 12px; }
  .resource-mark { width: 34px; height: 34px; }
  .resource-main b { font-size: 13px; }
  .resource-main small { font-size: 10px; }
  .planned-label { font-size: 8px; }
  .resource-arrow { font-size: 13px; }
}
@media (max-width: 380px) {
  .content-width { width: calc(100% - 30px); }
  .index-search { width: 60%; }
  .index-toolbar { font-size: 10px; }
  .resource-row { gap: 8px; }
  .resource-mark { width: 30px; height: 30px; }
}
</style>
