<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import pluginIndex from '../../data/plugins.json'
import guideIndex from '../../data/guides.json'

const props = defineProps({ kind: { type: String, required: true } })
const router = useRouter()
const query = ref('')
const toolItems = [
  { title: 'Java 启动参数', description: '理解内存参数与服务端启动命令。', state: '内容规划中', tags: 'Java JVM 参数 启动' },
  { title: 'server.properties 速查', description: '快速查阅服务器基础配置项及其影响。', state: '内容规划中', tags: 'server.properties 配置' },
  { title: 'MOTD 与文本格式', description: '为服务器列表信息与游戏内文本做准备。', state: '内容规划中', tags: 'MOTD MiniMessage RGB' },
  { title: 'TPS / MSPT 与日志', description: '了解常见性能指标和日志排查入口。', state: '内容规划中', tags: 'TPS MSPT 日志 性能' }
]

const config = computed(() => {
  if (props.kind === 'plugins') return { kicker: 'PLUGIN REFERENCE', title: '插件中心', description: '从安装教程到配置说明与中文语言文件，快速找到插件资料。', items: pluginIndex.map(item => ({ ...item, to: `/plugin/${item.id}`, type: item.category || '插件', meta: `${item.version || '版本未注明'} · ${(item.sections || []).length} 项资料`, searchable: `${item.name} ${item.description} ${item.category} ${(item.tags || []).join(' ')}` })) }
  if (props.kind === 'guides') return { kicker: 'SERVER SETUP PATH', title: '从 0 开始开服', description: '沿着现有教程，一步步完成服务端选型、首次启动与基础玩法配置。', items: guideIndex.map(item => ({ ...item, to: `/guide/${item.id}`, type: item.tags?.[0] || '开服指南', meta: (item.tags || []).join(' · '), searchable: `${item.name} ${item.description} ${(item.tags || []).join(' ')}` })) }
  if (props.kind === 'tutorials') return { kicker: 'TUTORIAL LIBRARY', title: '教程中心', description: '按当前收录内容查找开服、核心选型、插件组合与故障排查教程。', items: guideIndex.map(item => ({ ...item, to: `/guide/${item.id}`, type: item.tags?.[0] || '教程', meta: (item.tags || []).join(' · '), searchable: `${item.name} ${item.description} ${(item.tags || []).join(' ')}` })) }
  return { kicker: 'SERVER OWNER TOOLKIT', title: '服主工具箱', description: '常用工具入口正在规划中。先从已有的配置与教程资料开始。', items: toolItems.map((item, index) => ({ ...item, id: index, type: '工具规划', meta: item.state, searchable: `${item.title} ${item.description} ${item.tags}` })) }
})

const filteredItems = computed(() => {
  const tokens = query.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  if (!tokens.length) return config.value.items
  return config.value.items.filter(item => {
    const haystack = item.searchable.toLocaleLowerCase()
    return tokens.every(token => haystack.includes(token))
  })
})

const isTools = computed(() => props.kind === 'tools')
</script>

<template>
  <div class="index-page content-width">
    <div class="breadcrumb"><RouterLink to="/">首页</RouterLink><span>/</span><span>{{ config.title }}</span></div>
    <header class="index-header"><div><span class="section-kicker">{{ config.kicker }}</span><h1>{{ config.title }}</h1><p>{{ config.description }}</p></div><div class="index-count" v-if="!isTools"><strong>{{ filteredItems.length.toString().padStart(2, '0') }}</strong><span>{{ kind === 'plugins' ? 'PLUGIN GUIDES' : 'LEARNING RESOURCES' }}</span></div></header>
    <div class="index-toolbar"><span>{{ isTools ? '工具规划' : '全部内容' }} <b>{{ filteredItems.length }}</b></span><label class="index-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg><input v-model="query" :placeholder="kind === 'plugins' ? '搜索插件、功能或标签' : '搜索标题或关键词'" /><button v-if="query" aria-label="清除搜索" @click="query = ''">×</button></label></div>
    <div class="resource-list" :class="{ 'tool-list': isTools }">
      <component :is="item.to ? 'RouterLink' : 'article'" v-for="item in filteredItems" :key="item.id" class="resource-row" :to="item.to">
        <span class="resource-mark">{{ item.icon || (kind === 'plugins' ? item.name.slice(0, 1) : '↗') }}</span>
        <span class="resource-main"><span class="resource-type">{{ item.type }}</span><b>{{ item.name || item.title }}</b><small>{{ item.description }}</small><span class="resource-meta">{{ item.meta }}</span></span>
        <span v-if="isTools" class="planned-label">{{ item.state }}</span><span v-else class="resource-arrow">↗</span>
      </component>
      <div v-if="!filteredItems.length" class="index-empty">没有找到匹配的内容。试试更短的关键词。</div>
    </div>
    <div v-if="isTools" class="tools-note"><span>正在逐步扩展</span><p>目前展示的是工具规划入口，还没有发布可交互工具。当前准确的配置和使用说明，请在教程与插件资料中查看。</p><RouterLink to="/tutorials">浏览已有教程 <b>→</b></RouterLink></div>
  </div>
</template>

<style scoped>
.content-width { width: min(980px, calc(100% - 64px)); margin: auto; }
.index-page { padding-top: 28px; padding-bottom: 36px; }
.breadcrumb { display: flex; gap: 9px; color: var(--text-muted); font-size: 11px; }.breadcrumb a { color: var(--text-muted); text-decoration: none; }.breadcrumb a:hover { color: var(--accent-strong); }
.index-header { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-top: 41px; padding-bottom: 26px; border-bottom: 1px solid var(--border); }.section-kicker { color: var(--accent-strong); font: 10px var(--font-mono); letter-spacing: 1px; }.index-header h1 { margin-top: 8px; font-size: 34px; line-height: 1.25; font-weight: 690; }.index-header p { max-width: 600px; margin-top: 10px; color: var(--text-muted); font-size: 13px; line-height: 1.8; }.index-count { display: flex; align-items: baseline; gap: 9px; flex: none; color: var(--text-muted); font: 9px var(--font-mono); }.index-count strong { color: var(--accent-strong); font-size: 23px; font-weight: 550; }
.index-toolbar { min-height: 58px; display: flex; align-items: center; justify-content: space-between; gap: 16px; color: var(--text-secondary); font-size: 11px; }.index-toolbar b { margin-left: 5px; color: var(--text-muted); font: 10px var(--font-mono); }.index-search { width: min(300px, 55%); height: 34px; display: flex; align-items: center; gap: 8px; padding: 0 9px; border: 1px solid var(--border); border-radius: 4px; background: var(--surface); color: var(--text-muted); }.index-search svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.8; flex: none; }.index-search input { flex: 1; min-width: 0; border: 0; outline: 0; color: var(--text-primary); background: transparent; font: 11px var(--font-sans); }.index-search button { border: 0; background: transparent; color: var(--text-muted); font-size: 17px; cursor: pointer; }
.resource-list { border-top: 1px solid var(--border-strong); }.resource-row { display: flex; align-items: center; min-height: 112px; gap: 17px; padding: 17px 10px; border-bottom: 1px solid var(--border); text-decoration: none; color: inherit; transition: background .16s; }.resource-row:hover { background: var(--surface); }.resource-mark { display: grid; place-items: center; width: 38px; height: 38px; flex: none; border: 1px solid var(--border-strong); border-radius: 5px; color: var(--accent-strong); font-size: 17px; }.resource-main { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; flex: 1; }.resource-type { color: var(--accent-strong); font: 9px var(--font-mono); }.resource-main b { font-size: 14px; font-weight: 630; }.resource-main small { color: var(--text-muted); font-size: 11px; line-height: 1.6; }.resource-meta { margin-top: 3px; color: var(--text-muted); font: 9px var(--font-mono); }.resource-arrow { align-self: flex-start; padding-top: 8px; color: var(--text-muted); font-size: 15px; }.resource-row:hover .resource-arrow { color: var(--accent-strong); }.index-empty { padding: 45px 20px; text-align: center; color: var(--text-muted); font-size: 13px; }
.tool-list .resource-row { min-height: 106px; }.planned-label { align-self: flex-start; margin-top: 7px; padding: 4px 7px; border: 1px solid var(--border); border-radius: 3px; color: var(--text-muted); font-size: 9px; white-space: nowrap; }.tools-note { margin-top: 27px; padding: 18px 0; border-top: 1px solid var(--border); }.tools-note > span { color: var(--text-primary); font-size: 12px; font-weight: 650; }.tools-note p { margin-top: 7px; color: var(--text-muted); font-size: 11px; line-height: 1.7; }.tools-note a { display: inline-block; margin-top: 11px; color: var(--accent-strong); font-size: 11px; text-decoration: none; }.tools-note b { margin-left: 6px; }
@media (max-width: 700px) { .content-width { width: calc(100% - 36px); }.index-page { padding-top: 19px; }.index-header { align-items: flex-start; margin-top: 31px; padding-bottom: 19px; }.index-header h1 { font-size: 29px; }.index-header p { max-width: 100%; font-size: 12px; }.index-count { display: none; }.index-toolbar { min-height: 67px; }.index-search { width: min(225px, 66%); }.resource-row { min-height: 107px; gap: 11px; padding: 14px 3px; }.resource-mark { width: 33px; height: 33px; }.resource-main b { font-size: 13px; }.resource-main small { font-size: 10px; }.planned-label { font-size: 8px; }.resource-arrow { font-size: 13px; } }
@media (max-width: 380px) { .content-width { width: calc(100% - 30px); }.index-search { width: 62%; }.index-toolbar { font-size: 10px; }.resource-row { gap: 8px; }.resource-mark { width: 30px; height: 30px; }.planned-label { padding: 3px 4px; } }
</style>
