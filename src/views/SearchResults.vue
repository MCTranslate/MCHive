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
.content-width { width: min(980px, calc(100% - 64px)); margin: auto; }
.search-page { padding-top: 28px; padding-bottom: 48px; }
.breadcrumb { display: flex; gap: 8px; color: var(--text-muted); font-size: 11px; }
.breadcrumb a { color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
.breadcrumb a:hover { color: var(--accent); }
.search-page header { margin-top: 40px; padding-bottom: 24px; border-bottom: 1px solid var(--glass-border); }
.section-kicker { color: var(--accent); font: 10px var(--font-mono); letter-spacing: 1.5px; text-transform: uppercase; }
.search-page h1 { margin-top: 10px; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; }
.search-page header p { margin-top: 10px; color: var(--text-muted); font-size: 13px; }
.results-list { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
.result-row {
  display: flex;
  align-items: center;
  min-height: 88px;
  gap: 18px;
  padding: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.25s var(--ease-standard);
  border: 1px solid transparent;
  border-radius: var(--radius);
}
.result-row:hover {
  background: var(--glass-bg);
  border-color: var(--glass-border);
  backdrop-filter: blur(12px);
  transform: translateX(4px);
  box-shadow: var(--shadow), inset 0 1px 0 var(--glass-highlight);
}
.result-type { width: 44px; flex: none; color: var(--accent); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.result-copy { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 5px; }
.result-copy b { font-size: 14px; font-weight: 630; }
.result-copy small { color: var(--text-muted); font-size: 11px; }
.result-copy i { color: var(--text-muted); font: 9px var(--font-mono); font-style: normal; opacity: 0.6; }
.result-arrow { color: var(--text-muted); transition: transform 0.2s; }
.result-row:hover .result-arrow { transform: translateX(4px); }

.search-empty { padding: 80px 20px; text-align: center; }
.search-empty > span { color: var(--accent); font: 10px var(--font-mono); letter-spacing: 1.5px; text-transform: uppercase; }
.search-empty h2 { margin-top: 14px; font-size: 20px; font-weight: 650; }
.search-empty p { max-width: 440px; margin: 10px auto 0; color: var(--text-muted); font-size: 12px; line-height: 1.7; }
.search-empty a { display: inline-block; margin-top: 24px; color: var(--accent); text-decoration: none; font-size: 12px; transition: color 0.2s; }
.search-empty a:hover { color: var(--accent-hover); }
.search-empty b { margin-left: 6px; }

@media (max-width: 700px) {
  .content-width { width: calc(100% - 36px); }
  .search-page { padding-top: 20px; }
  .search-page header { margin-top: 32px; padding-bottom: 18px; }
  .search-page h1 { font-size: 28px; }
  .result-row { min-height: 84px; gap: 12px; padding: 14px 12px; }
  .result-copy b { font-size: 13px; }
  .result-copy small { font-size: 10px; }
  .result-copy i { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 65vw; }
}
</style>
