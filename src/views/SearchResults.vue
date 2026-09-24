<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { searchContent } from '../data/content.js'

const route = useRoute()
const query = computed(() => String(route.query.q || '').trim())
const results = computed(() => searchContent(query.value))
</script>

<template>
  <div class="search-page content-width">
    <div class="breadcrumb"><RouterLink to="/">首页</RouterLink><span>/</span><span>搜索</span></div>
    <header><span class="section-kicker">SEARCH THE KNOWLEDGE BASE</span><h1>搜索结果</h1><p v-if="query">“{{ query }}” 找到 {{ results.length }} 条相关内容</p><p v-else>输入教程名称、插件或遇到的问题。</p></header>
    <div v-if="results.length" class="results-list">
      <RouterLink v-for="item in results" :key="item.type + item.id" :to="item.to" class="result-row"><span class="result-type">{{ item.type }}</span><span class="result-copy"><b>{{ item.name }}</b><small>{{ item.description }}</small><i>{{ item.keywords }}</i></span><span class="result-arrow">↗</span></RouterLink>
    </div>
    <div v-else class="search-empty"><span>{{ query ? 'NO RESULTS' : 'SEARCH MCHIVE' }}</span><h2>{{ query ? '暂时没有找到匹配内容。' : '这里可以找到什么？' }}</h2><p>{{ query ? '可以尝试缩短关键词，或使用插件名、配置项和问题中的核心词语。' : '教程、插件资料、配置说明和常见问题都可以从顶部搜索。' }}</p><RouterLink to="/tutorials">浏览全部教程 <b>→</b></RouterLink></div>
  </div>
</template>

<style scoped>
.content-width { width: min(980px, calc(100% - 64px)); margin: auto; }.search-page { padding-top: 28px; padding-bottom: 45px; }.breadcrumb { display: flex; gap: 9px; color: var(--text-muted); font-size: 11px; }.breadcrumb a { color: var(--text-muted); text-decoration: none; }.search-page header { margin-top: 42px; padding-bottom: 26px; border-bottom: 1px solid var(--border); }.section-kicker { color: var(--accent-strong); font: 10px var(--font-mono); letter-spacing: 1px; }.search-page h1 { margin-top: 8px; font-size: 34px; font-weight: 690; }.search-page header p { margin-top: 8px; color: var(--text-muted); font-size: 13px; }.results-list { border-top: 1px solid var(--border-strong); }.result-row { display: flex; align-items: center; min-height: 91px; gap: 18px; padding: 15px 10px; border-bottom: 1px solid var(--border); text-decoration: none; color: inherit; }.result-row:hover { background: var(--surface); }.result-type { width: 42px; flex: none; color: var(--accent-strong); font-size: 11px; }.result-copy { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 4px; }.result-copy b { font-size: 14px; font-weight: 630; }.result-copy small { color: var(--text-muted); font-size: 11px; }.result-copy i { color: var(--text-muted); font: 9px var(--font-mono); font-style: normal; }.result-arrow { color: var(--text-muted); }.result-row:hover .result-arrow { color: var(--accent-strong); }.search-empty { padding: 76px 16px; text-align: center; }.search-empty > span { color: var(--accent-strong); font: 9px var(--font-mono); letter-spacing: 1px; }.search-empty h2 { margin-top: 13px; font-size: 20px; font-weight: 650; }.search-empty p { max-width: 420px; margin: 9px auto 0; color: var(--text-muted); font-size: 12px; line-height: 1.7; }.search-empty a { display: inline-block; margin-top: 21px; color: var(--accent-strong); text-decoration: none; font-size: 12px; }.search-empty b { margin-left: 6px; }
@media (max-width: 700px) { .content-width { width: calc(100% - 36px); }.search-page { padding-top: 19px; }.search-page header { margin-top: 33px; padding-bottom: 20px; }.search-page h1 { font-size: 29px; }.result-row { min-height: 88px; gap: 11px; padding-inline: 2px; }.result-copy b { font-size: 13px; }.result-copy small { font-size: 10px; }.result-copy i { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 65vw; } }
</style>
