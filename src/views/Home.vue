<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import pluginIndex from '../../data/plugins.json'
import guideIndex from '../../data/guides.json'

const router = useRouter()
const search = ref('')
const totalDownloads = computed(() => pluginIndex.reduce((sum, plugin) => sum + (plugin.downloads || []).length, 0))
const launchSteps = [
  { number: '01', title: '准备环境', detail: 'Java、系统与网络', guide: 'quick-start' },
  { number: '02', title: '选择服务端', detail: 'Paper、Purpur、Leaves', guide: 'choose-core' },
  { number: '03', title: '启动服务器', detail: '完成首次配置', guide: 'quick-start' },
  { number: '04', title: '安装插件', detail: '权限、经济与保护', guide: 'plugin-combos' },
  { number: '05', title: '开放服务器', detail: '端口、域名与跨服', guide: 'quick-start' },
  { number: '06', title: '开始运营', detail: '备份、日志与维护', guide: 'faq' }
]
const categories = [
  { name: '基础入门', detail: '从第一次启动开始', icon: '01', guide: 'quick-start' },
  { name: '服务端核心', detail: '理解核心与版本选择', icon: '02', guide: 'choose-core' },
  { name: '插件与权限', detail: '安装、配置和汉化', icon: '03', path: '/plugins' },
  { name: '故障排查', detail: '常见报错与冲突', icon: '04', guide: 'faq' }
]

function submitSearch() {
  if (search.value.trim()) router.push({ path: '/search', query: { q: search.value.trim() } })
}
</script>

<template>
  <div class="home-page">
    <section class="hero-band">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-inner">
        <div class="hero-copy">
          <div class="eyebrow"><span class="status-dot"></span> MCHIVE / SERVER KNOWLEDGE BASE</div>
          <h1>从零开始，<br /><span>学会搭建你的 Minecraft 服务器。</span></h1>
          <p class="hero-description">MCHive 是面向 Minecraft 新手服主的中文开服知识库。从服务端选择、插件安装，到配置、运维与问题排查，一步一步完成自己的服务器。</p>
          <form class="hero-search" role="search" @submit.prevent="submitSearch">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>
            <input v-model="search" aria-label="搜索教程、插件、配置" placeholder="搜索“如何开服”、EssentialsX、Java、权限..." />
            <button type="submit" aria-label="开始搜索"><span>搜索</span><b aria-hidden="true">→</b></button>
          </form>
          <div class="hero-actions">
            <RouterLink class="button-primary" to="/guides">开始第一次开服 <span aria-hidden="true">→</span></RouterLink>
            <RouterLink class="button-text" to="/tutorials">浏览知识库 <span aria-hidden="true">↗</span></RouterLink>
          </div>
          <div class="hero-metrics">
            <span><strong>{{ guideIndex.length }}</strong> 篇实用指南</span><i></i><span><strong>{{ pluginIndex.length }}</strong> 个插件资料</span><i></i><span><strong>{{ totalDownloads }}</strong> 个可用文件</span>
          </div>
        </div>
        <div class="hero-visual" aria-label="服务器搭建知识路线示意图">
          <div class="visual-topline"><span>SERVER BLUEPRINT</span><span>ROUTE 001</span></div>
          <div class="visual-network">
            <div class="route-line line-a"></div><div class="route-line line-b"></div><div class="route-line line-c"></div><div class="route-line line-d"></div>
            <div class="node node-core"><span class="node-glyph">M</span><b>MCHive</b><small>KNOWLEDGE BASE</small></div>
            <div class="node node-java"><i>01</i><b>Java</b><small>RUNTIME</small></div>
            <div class="node node-paper"><i>02</i><b>Paper</b><small>SERVER CORE</small></div>
            <div class="node node-plugin"><i>03</i><b>Plugins</b><small>ECOSYSTEM</small></div>
            <div class="node node-world"><i>04</i><b>Your World</b><small>LIVE SERVER</small></div>
          </div>
          <div class="visual-bottomline"><span><b></b> LEARNING PATH</span><span>BUILD · CONFIGURE · MAINTAIN</span></div>
        </div>
      </div>
      <div class="hero-edge"><span>01 / START HERE</span><span>为每一位服主而建 <b>↓</b></span></div>
    </section>

    <section class="audience-section content-width" aria-labelledby="audience-heading">
      <div class="section-heading split-heading"><div><span class="section-kicker">FIND YOUR NEXT STEP</span><h2 id="audience-heading">你现在需要什么？</h2></div><p>不用猜分类，从你的当前状态直接开始。</p></div>
      <div class="audience-grid">
        <RouterLink class="audience-item beginner" to="/guides"><span class="audience-icon">01</span><span class="audience-copy"><b>我还没有服务器</b><small>从 Java、服务端到第一次启动，一步一步开始。</small></span><span class="audience-arrow">→</span></RouterLink>
        <RouterLink class="audience-item" to="/tutorials"><span class="audience-icon">02</span><span class="audience-copy"><b>我已经有服务器</b><small>继续学习插件、权限、配置与日常维护。</small></span><span class="audience-arrow">→</span></RouterLink>
        <RouterLink class="audience-item" to="/plugins"><span class="audience-icon">03</span><span class="audience-copy"><b>我的服务器遇到了问题</b><small>从日志、报错、网络和性能方向快速排查。</small></span><span class="audience-arrow">→</span></RouterLink>
        <RouterLink class="audience-item" to="/tools"><span class="audience-icon">04</span><span class="audience-copy"><b>浏览知识库</b><small>教程、插件资料与常见问题都在这里。</small></span><span class="audience-arrow">→</span></RouterLink>
      </div>
    </section>

    <section class="path-section">
      <div class="content-width path-inner">
        <div class="section-heading path-heading"><div><span class="section-kicker">FROM ZERO TO ONLINE</span><h2>从 0 到服务器上线。</h2></div><RouterLink to="/guides" class="inline-link">查看完整路线 <span>→</span></RouterLink></div>
        <div class="path-track">
          <RouterLink v-for="(step, index) in launchSteps" :key="step.number" class="path-step" :to="`/guide/${step.guide}`">
            <div class="step-top"><span>{{ step.number }}</span><i v-if="index < launchSteps.length - 1"></i></div><b>{{ step.title }}</b><small>{{ step.detail }}</small>
          </RouterLink>
        </div>
        <div class="path-foot"><span>路线基于仓库中的真实教程内容整理</span><span>读完一步，继续下一步 <b>→</b></span></div>
      </div>
    </section>

    <section class="knowledge-section content-width">
      <div class="section-heading split-heading"><div><span class="section-kicker">THE KNOWLEDGE MAP</span><h2>一座服务器，需要这些知识。</h2></div><RouterLink to="/tutorials" class="inline-link">进入教程中心 <span>→</span></RouterLink></div>
      <div class="knowledge-layout">
        <div class="knowledge-intro"><span class="knowledge-index">MCHIVE / LIBRARY</span><h3>从基础部署，<br />到稳定运营。</h3><p>把分散的配置说明、插件资料和实战经验，整理成能查找、能跟进的知识体系。</p><RouterLink to="/tutorials">探索知识库 <span>↗</span></RouterLink></div>
        <div class="category-list"><RouterLink v-for="item in categories" :key="item.name" class="category-row" :to="item.path || `/guide/${item.guide}`"><span class="category-num">{{ item.icon }}</span><span class="category-copy"><b>{{ item.name }}</b><small>{{ item.detail }}</small></span><span class="category-count">{{ item.path ? `${pluginIndex.length} 个资料` : '查看指南' }}</span><span class="category-arrow">↗</span></RouterLink></div>
      </div>
    </section>

    <section class="latest-section content-width">
      <div class="section-heading split-heading"><div><span class="section-kicker">START READING</span><h2>从这些真实内容开始。</h2></div><RouterLink to="/tutorials" class="inline-link">所有教程 <span>→</span></RouterLink></div>
      <div class="latest-list"><RouterLink v-for="(guide, index) in guideIndex.slice(0, 3)" :key="guide.id" class="latest-row" :to="`/guide/${guide.id}`"><span class="latest-number">0{{ index + 1 }}</span><span class="latest-main"><b>{{ guide.name }}</b><small>{{ guide.description }}</small></span><span class="latest-tags"><i v-for="tag in (guide.tags || []).slice(0, 2)" :key="tag">{{ tag }}</i></span><span class="latest-arrow">↗</span></RouterLink></div>
    </section>

    <section class="plugins-section">
      <div class="content-width plugins-inner">
        <div class="plugin-heading"><div><span class="section-kicker">PLUGIN REFERENCE</span><h2>插件，装得上也要看得懂。</h2><p>保留插件安装、配置讲解与中文语言文件，让资料真正能落地。</p></div><RouterLink to="/plugins" class="button-outline">浏览插件中心 <span>→</span></RouterLink></div>
        <div class="plugin-preview-list"><RouterLink v-for="plugin in pluginIndex" :key="plugin.id" :to="`/plugin/${plugin.id}`" class="plugin-preview"><span class="plugin-monogram">{{ plugin.name.slice(0, 1) }}</span><span class="plugin-preview-copy"><b>{{ plugin.name }}</b><small>{{ plugin.category }} · {{ plugin.version }}</small></span><span class="plugin-preview-arrow">↗</span></RouterLink></div>
      </div>
    </section>

    <section class="contribute-section content-width"><div><span class="section-kicker">BUILT WITH THE COMMUNITY</span><h2>让开服知识，<br class="mobile-break" />一起变得更好。</h2><p>MCHive 是开放的社区项目。分享教程、补充配置说明，或修正文档中的错误，都能帮助下一位服主少走弯路。</p></div><a class="button-primary" href="https://github.com/MCTranslate/MCHive" target="_blank" rel="noreferrer">参与 MCHive <span>↗</span></a></section>
  </div>
</template>

<style scoped>
.home-page { color: var(--text-primary); }
.content-width { width: min(1080px, calc(100% - 64px)); margin-inline: auto; }
.hero-band { position: relative; overflow: hidden; background: var(--hero-bg); color: var(--hero-text); }
.hero-grid { position: absolute; inset: 0; opacity: .2; background-image: linear-gradient(to right, var(--hero-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--hero-grid) 1px, transparent 1px); background-size: 56px 56px; mask-image: linear-gradient(90deg, #000, transparent 85%); pointer-events: none; }
.hero-inner { position: relative; width: min(1080px, calc(100% - 64px)); min-height: 488px; margin: auto; display: grid; grid-template-columns: 1.07fr .93fr; align-items: center; gap: 30px; padding: 58px 0 52px; }
.hero-copy { max-width: 590px; }
.eyebrow, .section-kicker { color: var(--accent-strong); font: 650 10px/1.5 var(--font-mono); letter-spacing: 1.25px; }
.eyebrow { display: flex; align-items: center; gap: 9px; color: #a8c5af; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; background: #78bc88; box-shadow: 0 0 0 4px rgba(120,188,136,.12); }
.hero-copy h1 { margin-top: 25px; font-size: clamp(39px, 5.2vw, 62px); line-height: 1.12; font-weight: 720; letter-spacing: 0; }
.hero-copy h1 span { color: #b2d9bc; }
.hero-description { max-width: 510px; margin-top: 19px; color: #c2cbc4; font-size: 15px; line-height: 1.9; }
.hero-search { width: min(520px, 100%); height: 50px; margin-top: 28px; display: flex; align-items: center; gap: 11px; padding: 5px 5px 5px 15px; border: 1px solid rgba(229,241,232,.22); border-radius: 6px; background: rgba(255,255,255,.075); }
.hero-search svg { width: 18px; height: 18px; fill: none; stroke: #aabbb0; stroke-width: 1.8; flex: none; }
.hero-search input { min-width: 0; flex: 1; height: 100%; border: 0; outline: 0; background: transparent; color: white; font: 13px var(--font-sans); }
.hero-search input::placeholder { color: #a4afa7; }
.hero-search button { display: flex; align-items: center; gap: 13px; height: 38px; padding: 0 13px; border: 0; border-radius: 4px; background: #b5d7be; color: #153321; font: 650 12px var(--font-sans); cursor: pointer; }
.hero-search button b { font-size: 15px; }
.hero-actions { display: flex; align-items: center; gap: 24px; margin-top: 17px; }
.button-primary, .button-outline { min-height: 42px; display: inline-flex; align-items: center; justify-content: center; gap: 18px; padding: 0 16px; border: 1px solid var(--accent); border-radius: 5px; background: var(--accent); color: var(--button-text); text-decoration: none; font-size: 13px; font-weight: 650; transition: background .18s, color .18s, border-color .18s; }
.button-primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
.hero-actions .button-primary { color: #142b1c; background: #b5d7be; border-color: #b5d7be; }
.button-text { color: #d0d8d1; font-size: 13px; text-decoration: none; }
.button-text span { margin-left: 7px; }
.hero-metrics { display: flex; align-items: center; gap: 13px; margin-top: 34px; color: #aeb9b1; font-size: 11px; }
.hero-metrics strong { color: #f3f6f3; font: 650 13px var(--font-mono); margin-right: 3px; }
.hero-metrics i { width: 3px; height: 3px; border-radius: 50%; background: #68776d; }
.hero-visual { position: relative; width: 100%; max-width: 455px; justify-self: end; height: 300px; border: 1px solid rgba(218,235,222,.18); border-radius: 7px; background: rgba(7,18,12,.16); }
.visual-topline, .visual-bottomline { display: flex; justify-content: space-between; color: #85988a; font: 9px var(--font-mono); letter-spacing: .8px; }
.visual-topline { padding: 14px 16px; border-bottom: 1px solid rgba(218,235,222,.12); }
.visual-bottomline { position: absolute; bottom: 0; left: 0; right: 0; padding: 13px 16px; border-top: 1px solid rgba(218,235,222,.12); font-size: 8px; }
.visual-bottomline span:first-child { color: #b5c9ba; }.visual-bottomline b { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 5px; background: #80b790; }
.visual-network { position: absolute; inset: 47px 20px 44px; }
.node { position: absolute; z-index: 2; width: 106px; height: 65px; border: 1px solid rgba(218,235,222,.19); border-radius: 5px; background: #1b2a20; display: flex; flex-direction: column; justify-content: center; padding: 8px 10px; }
.node b { font-size: 12px; font-weight: 600; color: #ecf3ed; }.node small { margin-top: 4px; color: #8fa496; font: 8px var(--font-mono); letter-spacing: .4px; }.node i { position: absolute; right: 8px; top: 7px; color: #78927e; font: 8px var(--font-mono); font-style: normal; }
.node-core { width: 120px; height: 74px; left: 50%; top: 50%; transform: translate(-50%,-50%); border-color: rgba(174,215,184,.55); background: #223a2a; padding-left: 44px; }.node-core .node-glyph { position: absolute; left: 11px; top: 16px; display: grid; place-items: center; width: 24px; height: 28px; background: #afd2b7; border-radius: 3px; color: #183221; font: 800 16px var(--font-mono); }
.node-java { left: 6%; top: 7%; }.node-paper { right: 1%; top: 9%; }.node-plugin { left: 3%; bottom: 2%; }.node-world { right: 0; bottom: 0; }
.route-line { position: absolute; z-index: 1; height: 1px; transform-origin: left center; background: repeating-linear-gradient(90deg, rgba(139,186,149,.6) 0 4px, transparent 4px 8px); }.line-a { left: 31%; top: 29%; width: 26%; transform: rotate(31deg); }.line-b { left: 57%; top: 41%; width: 24%; transform: rotate(-29deg); }.line-c { left: 30%; top: 72%; width: 27%; transform: rotate(-32deg); }.line-d { left: 58%; top: 61%; width: 25%; transform: rotate(31deg); }
.hero-edge { position: relative; width: min(1080px, calc(100% - 64px)); margin: auto; padding: 0 0 15px; display: flex; justify-content: space-between; color: #819087; font: 9px var(--font-mono); letter-spacing: .4px; }.hero-edge b { color: #c1d6c7; margin-left: 5px; }
.audience-section { padding-top: 62px; padding-bottom: 72px; }
.section-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; }
.section-heading h2, .plugin-heading h2, .contribute-section h2 { margin-top: 8px; font-size: 27px; line-height: 1.35; font-weight: 680; letter-spacing: 0; }
.split-heading > p { max-width: 330px; color: var(--text-muted); font-size: 13px; }
.audience-grid { display: grid; grid-template-columns: repeat(2, 1fr); margin-top: 24px; border-top: 1px solid var(--border); border-left: 1px solid var(--border); }
.audience-item { min-width: 0; min-height: 88px; display: flex; align-items: center; gap: 15px; padding: 15px 18px; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); color: inherit; text-decoration: none; transition: background .18s; }
.audience-item:hover { background: var(--surface); }.audience-item.beginner { background: var(--surface-accent); }
.audience-icon { display: grid; place-items: center; width: 34px; height: 34px; flex: none; border: 1px solid var(--border-strong); border-radius: 4px; color: var(--accent-strong); font: 11px var(--font-mono); }
.audience-copy { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1; }.audience-copy b { font-size: 14px; font-weight: 630; }.audience-copy small { color: var(--text-muted); font-size: 11px; }.audience-arrow { color: var(--accent-strong); font-size: 18px; }
.path-section { padding: 54px 0 48px; background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.path-heading { align-items: center; }.inline-link { color: var(--accent-strong); font-size: 12px; text-decoration: none; white-space: nowrap; }.inline-link span { margin-left: 8px; font-size: 16px; }
.path-track { display: grid; grid-template-columns: repeat(5, 1fr); margin-top: 38px; border-top: 1px solid var(--border-strong); }
.path-step { min-width: 0; position: relative; display: flex; flex-direction: column; padding-top: 17px; text-decoration: none; color: inherit; }.step-top { height: 25px; position: relative; }.step-top span { position: absolute; top: -25px; display: grid; place-items: center; width: 24px; height: 24px; border: 1px solid var(--border-strong); border-radius: 50%; background: var(--surface); color: var(--accent-strong); font: 9px var(--font-mono); }.step-top i { position: absolute; top: -16px; left: 24px; width: calc(100% - 24px); border-top: 1px dashed var(--border-strong); }.path-step b { font-size: 13px; font-weight: 640; }.path-step small { margin-top: 5px; color: var(--text-muted); font-size: 11px; }.path-step:hover b { color: var(--accent-strong); }.path-foot { display: flex; justify-content: space-between; margin-top: 30px; color: var(--text-muted); font-size: 10px; }.path-foot b { margin-left: 6px; color: var(--accent-strong); }
.knowledge-section { padding-top: 72px; padding-bottom: 68px; }.knowledge-layout { display: grid; grid-template-columns: .78fr 1.22fr; gap: 48px; margin-top: 25px; padding-top: 24px; border-top: 1px solid var(--border); }.knowledge-intro { padding: 5px 0; }.knowledge-index { color: var(--text-muted); font: 9px var(--font-mono); letter-spacing: .8px; }.knowledge-intro h3 { margin-top: 20px; font-size: 23px; line-height: 1.5; font-weight: 650; }.knowledge-intro p { max-width: 280px; margin-top: 12px; color: var(--text-muted); font-size: 12px; line-height: 1.8; }.knowledge-intro > a { display: inline-block; margin-top: 17px; color: var(--accent-strong); font-size: 12px; text-decoration: none; }.knowledge-intro > a span { margin-left: 8px; }.category-list { border-top: 1px solid var(--border); }.category-row { min-height: 67px; display: flex; align-items: center; gap: 14px; border-bottom: 1px solid var(--border); text-decoration: none; color: inherit; }.category-row:hover .category-copy b, .category-row:hover .category-arrow { color: var(--accent-strong); }.category-num { color: var(--text-muted); font: 10px var(--font-mono); }.category-copy { display: flex; flex: 1; flex-direction: column; gap: 4px; }.category-copy b { font-size: 13px; font-weight: 620; }.category-copy small, .category-count { color: var(--text-muted); font-size: 10px; }.category-arrow { color: var(--text-muted); font-size: 14px; }
.latest-section { padding-bottom: 70px; }.latest-list { margin-top: 22px; border-top: 1px solid var(--border); }.latest-row { min-height: 69px; display: flex; align-items: center; gap: 18px; border-bottom: 1px solid var(--border); color: inherit; text-decoration: none; }.latest-row:hover .latest-main b, .latest-row:hover .latest-arrow { color: var(--accent-strong); }.latest-number { color: var(--text-muted); font: 10px var(--font-mono); }.latest-main { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }.latest-main b { font-size: 13px; font-weight: 620; }.latest-main small { color: var(--text-muted); font-size: 11px; }.latest-tags { display: flex; gap: 6px; }.latest-tags i { padding: 3px 6px; border: 1px solid var(--border); border-radius: 3px; color: var(--text-muted); font-size: 9px; font-style: normal; }.latest-arrow { color: var(--text-muted); }
.plugins-section { padding: 43px 0 48px; background: var(--surface); border-block: 1px solid var(--border); }.plugins-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 42px; align-items: center; }.plugin-heading h2 { font-size: 23px; }.plugin-heading p { margin-top: 9px; color: var(--text-muted); font-size: 12px; line-height: 1.7; }.plugin-heading .button-outline { min-height: 37px; margin-top: 17px; background: transparent; color: var(--accent-strong); font-size: 11px; }.plugin-heading .button-outline:hover { background: var(--surface-accent); }.plugin-preview-list { border-top: 1px solid var(--border-strong); }.plugin-preview { min-height: 56px; display: flex; align-items: center; gap: 11px; border-bottom: 1px solid var(--border); text-decoration: none; color: inherit; }.plugin-monogram { display: grid; place-items: center; width: 29px; height: 29px; border: 1px solid var(--border-strong); border-radius: 4px; color: var(--accent-strong); font: 12px var(--font-mono); }.plugin-preview-copy { display: flex; flex: 1; flex-direction: column; gap: 3px; }.plugin-preview-copy b { font-size: 12px; font-weight: 620; }.plugin-preview-copy small { color: var(--text-muted); font-size: 10px; }.plugin-preview-arrow { color: var(--text-muted); }.plugin-preview:hover .plugin-preview-copy b { color: var(--accent-strong); }
.contribute-section { min-height: 205px; display: flex; align-items: center; justify-content: space-between; gap: 28px; padding-top: 42px; padding-bottom: 42px; }.contribute-section h2 { font-size: 24px; }.contribute-section p { max-width: 550px; margin-top: 9px; color: var(--text-muted); font-size: 12px; line-height: 1.8; }.contribute-section .button-primary { flex: none; }.mobile-break { display: none; }
@media (min-width: 1200px) { .hero-inner { min-height: 500px; } }
@media (max-width: 900px) { .hero-inner { grid-template-columns: 1fr .8fr; gap: 20px; }.hero-visual { transform: scale(.92); transform-origin: right center; }.hero-copy h1 { font-size: 47px; }.hero-metrics { gap: 8px; font-size: 10px; }.knowledge-layout { gap: 28px; } }
@media (max-width: 700px) {
  .content-width, .hero-inner, .hero-edge { width: calc(100% - 36px); }
  .hero-inner { min-height: auto; display: block; padding: 52px 0 28px; }
  .eyebrow { font-size: 8px; letter-spacing: .9px; }
  .hero-copy h1 { margin-top: 22px; font-size: 42px; line-height: 1.18; }
  .hero-description { margin-top: 14px; font-size: 13px; line-height: 1.8; }
  .hero-search { height: 48px; margin-top: 21px; gap: 8px; padding-left: 11px; }.hero-search input { font-size: 12px; }.hero-search button { gap: 8px; padding: 0 10px; }
  .hero-actions { gap: 17px; }.hero-metrics { gap: 8px; margin-top: 25px; font-size: 9px; }.hero-metrics strong { font-size: 11px; }
  .hero-visual { width: 100%; max-width: none; height: 233px; margin-top: 30px; transform: none; }.visual-network { inset: 43px 12px 40px; }.node { width: 90px; height: 54px; padding: 7px; }.node b { font-size: 10px; }.node small { font-size: 7px; }.node-core { width: 104px; height: 65px; padding-left: 40px; }.node-core .node-glyph { left: 8px; top: 17px; width: 24px; height: 26px; }.node-java { left: 0; top: 5%; }.node-paper { right: 0; top: 5%; }.node-plugin { left: 0; bottom: 0; }.node-world { right: 0; bottom: 0; }.line-a { left: 27%; top: 26%; width: 25%; }.line-b { left: 57%; top: 39%; width: 26%; }.line-c { left: 27%; top: 69%; width: 26%; }.line-d { left: 57%; top: 58%; width: 27%; }
  .visual-topline, .visual-bottomline { font-size: 7px; padding-inline: 10px; }.hero-edge { padding-bottom: 12px; font-size: 7px; }
  .audience-section { padding-top: 43px; padding-bottom: 48px; }.section-heading { align-items: flex-start; }.section-heading h2, .plugin-heading h2 { font-size: 22px; }.section-kicker { font-size: 9px; }.split-heading > p { display: none; }.audience-grid { grid-template-columns: 1fr; margin-top: 18px; }.audience-item { min-height: 72px; padding: 11px 12px; }.audience-copy b { font-size: 13px; }.audience-copy small { font-size: 10px; }
  .path-section { padding: 39px 0 31px; }.path-heading { display: block; }.path-heading .inline-link { display: inline-block; margin-top: 12px; }.path-track { grid-template-columns: 1fr; margin: 30px 0 0 11px; border-top: 0; border-left: 1px solid var(--border-strong); }.path-step { min-height: 59px; padding: 0 0 13px 25px; }.step-top { position: absolute; left: -12px; top: 5px; height: 0; }.step-top span { position: static; width: 23px; height: 23px; background: var(--surface); }.step-top i { display: none; }.path-step b { font-size: 12px; }.path-step small { margin-top: 2px; }.path-foot { margin-top: 12px; font-size: 9px; }
  .knowledge-section { padding-top: 47px; padding-bottom: 47px; }.knowledge-layout { grid-template-columns: 1fr; gap: 20px; margin-top: 17px; padding-top: 17px; }.knowledge-intro h3 { margin-top: 12px; font-size: 21px; }.knowledge-intro p { max-width: 100%; }.knowledge-intro > a { margin-top: 10px; }.category-row { min-height: 62px; gap: 10px; }.category-count { font-size: 9px; }
  .latest-section { padding-bottom: 48px; }.latest-section .section-heading { align-items: end; }.latest-list { margin-top: 16px; }.latest-row { min-height: 70px; gap: 10px; }.latest-number { align-self: flex-start; padding-top: 17px; }.latest-main b { font-size: 12px; }.latest-main small { display: -webkit-box; overflow: hidden; -webkit-line-clamp: 1; -webkit-box-orient: vertical; font-size: 10px; }.latest-tags { display: none; }
  .plugins-section { padding: 35px 0; }.plugins-inner { grid-template-columns: 1fr; gap: 24px; }.plugin-heading h2 { font-size: 21px; }.plugin-heading p { font-size: 11px; }.plugin-heading .button-outline { margin-top: 12px; }
  .contribute-section { min-height: auto; display: block; padding-top: 38px; padding-bottom: 38px; }.contribute-section h2 { font-size: 22px; }.contribute-section p { font-size: 11px; }.contribute-section .button-primary { margin-top: 18px; }.mobile-break { display: initial; }
}
@media (max-width: 380px) { .content-width, .hero-inner, .hero-edge { width: calc(100% - 30px); }.hero-copy h1 { font-size: 38px; }.hero-metrics { gap: 5px; font-size: 8px; }.hero-metrics strong { font-size: 10px; }.hero-search input { font-size: 11px; }.hero-search button { padding: 0 8px; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; } }
</style>
