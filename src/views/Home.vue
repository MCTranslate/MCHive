<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import pluginIndex from '../../data/plugins.json'
import guideIndex from '../../data/guides.json'

const router = useRouter()
const search = ref('')
const totalDownloads = computed(() => pluginIndex.reduce((sum, plugin) => sum + (plugin.downloads || []).length, 0))

// 笨蛋开服的服主路线提炼：准备环境 → 选择核心 → 启动 → 装插件 → 开放 → 运维
const launchSteps = [
  { number: '01', title: '准备环境', detail: 'Java 与系统要求', guide: 'quick-start' },
  { number: '02', title: '选择服务端', detail: 'Paper · Purpur · Mili', guide: 'choose-core' },
  { number: '03', title: '启动服务器', detail: '首次运行与配置', guide: 'quick-start' },
  { number: '04', title: '安装插件', detail: '权限 · 经济 · 保护', guide: 'plugin-combos' },
  { number: '05', title: '性能调优', detail: 'JVM 与配置文件', guide: 'performance-tuning' },
  { number: '06', title: '运维与排错', detail: '备份 · 日志 · 故障', guide: 'faq' }
]

// 从笨蛋开服的「知识地图」提炼：按主题分类而非按功能堆砌
const categories = [
  { name: '基础入门', detail: '从第一次启动开始', icon: '01', guide: 'quick-start' },
  { name: '服务端核心', detail: '核心选型与版本对照', icon: '02', guide: 'choose-core' },
  { name: '插件与组合', detail: '按服务器类型选方案', icon: '03', guide: 'plugin-combos' },
  { name: '性能调优', detail: 'JVM 参数与配置项', icon: '04', guide: 'performance-tuning' },
  { name: '运维与排错', detail: '备份、日志与故障排查', icon: '05', guide: 'faq' },
  { name: '安全加固', detail: '防崩防爆与权限最小化', icon: '06', guide: 'security-hardening' }
]

// 整合插件分类：把插件按 category 分组
const pluginsByCategory = computed(() => {
  const groups = {}
  pluginIndex.forEach(p => {
    const cat = p.category || '其他'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(p)
  })
  return Object.entries(groups).map(([name, items]) => ({ name, items, count: items.length }))
})

function submitSearch() {
  if (search.value.trim()) router.push({ path: '/search', query: { q: search.value.trim() } })
}
</script>

<template>
  <div class="home-page">
    <!-- ===== Hero ===== -->
    <section class="hero-band">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="hero-inner">
        <div class="hero-copy">
          <div class="eyebrow"><span class="status-dot"></span> MCHIVE / SERVER KNOWLEDGE BASE</div>
          <h1>从零开始，<br><span class="hero-highlight">学会搭建你的 Minecraft 服务器。</span></h1>
          <p class="hero-description">MCHive 是面向 Minecraft 新手服主的中文开服知识库。从服务端选择、插件安装，到配置、运维与问题排查，一步一步完成自己的服务器。</p>
          <form class="hero-search" role="search" @submit.prevent="submitSearch">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>
            <input v-model="search" aria-label="搜索教程、插件、配置" placeholder="搜索如何开服、EssentialsX、Java、权限..." />
            <button type="submit" aria-label="开始搜索"><span>搜索</span><b aria-hidden="true">→</b></button>
          </form>
          <div class="hero-actions">
            <RouterLink class="button-primary" to="/guides">开始第一次开服 <span aria-hidden="true">→</span></RouterLink>
            <RouterLink class="button-ghost" to="/tutorials">浏览知识库 <span aria-hidden="true">↗</span></RouterLink>
          </div>
          <div class="hero-metrics">
            <span><strong>{{ guideIndex.length }}</strong> 篇实用指南</span>
            <i></i>
            <span><strong>{{ pluginIndex.length }}</strong> 个插件资料</span>
            <i></i>
            <span><strong>{{ totalDownloads }}</strong> 个可用文件</span>
          </div>
        </div>
        <div class="hero-visual glass-card" aria-label="服务器搭建知识路线示意图">
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

    <!-- ===== Audience — 快速入口 ===== -->
    <section class="audience-section content-width" aria-labelledby="audience-heading">
      <div class="section-heading split-heading">
        <div>
          <span class="section-kicker">FIND YOUR NEXT STEP</span>
          <h2 id="audience-heading">你现在需要什么？</h2>
        </div>
        <p>不用猜分类，从你的当前状态直接开始。</p>
      </div>
      <div class="audience-grid">
        <RouterLink class="audience-item glass-card" to="/guides">
          <span class="audience-icon">01</span>
          <span class="audience-copy"><b>我还没有服务器</b><small>从 Java、服务端到第一次启动，一步一步开始。</small></span>
          <span class="audience-arrow">→</span>
        </RouterLink>
        <RouterLink class="audience-item glass-card" to="/tutorials">
          <span class="audience-icon">02</span>
          <span class="audience-copy"><b>我已经有服务器</b><small>继续学习插件、权限、配置与日常维护。</small></span>
          <span class="audience-arrow">→</span>
        </RouterLink>
        <RouterLink class="audience-item glass-card" to="/guide/faq">
          <span class="audience-icon">03</span>
          <span class="audience-copy"><b>服务器遇到了问题</b><small>从日志、报错、网络和性能方向快速排查。</small></span>
          <span class="audience-arrow">→</span>
        </RouterLink>
        <RouterLink class="audience-item glass-card" to="/plugins">
          <span class="audience-icon">04</span>
          <span class="audience-copy"><b>需要插件资料</b><small>安装教程、配置说明与中文语言文件。</small></span>
          <span class="audience-arrow">→</span>
        </RouterLink>
      </div>
    </section>

    <!-- ===== 学习路线 ===== -->
    <section class="path-section">
      <div class="content-width path-inner">
        <div class="section-heading path-heading">
          <div>
            <span class="section-kicker">FROM ZERO TO ONLINE</span>
            <h2>从 0 到服务器上线。</h2>
          </div>
          <RouterLink to="/guides" class="inline-link">查看完整路线 <span>→</span></RouterLink>
        </div>
        <div class="path-track">
          <RouterLink v-for="(step, index) in launchSteps" :key="step.number" class="path-step glass-card" :to="`/guide/${step.guide}`">
            <div class="step-top"><span>{{ step.number }}</span><i v-if="index < launchSteps.length - 1"></i></div>
            <b>{{ step.title }}</b>
            <small>{{ step.detail }}</small>
          </RouterLink>
        </div>
        <div class="path-foot">
          <span>路线基于真实教程内容整理</span>
          <span>读完一步，继续下一步 <b>→</b></span>
        </div>
      </div>
    </section>

    <!-- ===== 知识地图 ===== -->
    <section class="knowledge-section content-width">
      <div class="section-heading split-heading">
        <div>
          <span class="section-kicker">THE KNOWLEDGE MAP</span>
          <h2>一座服务器，需要这些知识。</h2>
        </div>
        <RouterLink to="/tutorials" class="inline-link">进入教程中心 <span>→</span></RouterLink>
      </div>
      <div class="knowledge-layout">
        <div class="knowledge-intro glass-card">
          <span class="knowledge-index">MCHIVE / LIBRARY</span>
          <h3>从基础部署，<br>到稳定运营。</h3>
          <p>把分散的配置说明、插件资料和实战经验，整理成能查找、能跟进的知识体系。</p>
          <RouterLink to="/tutorials">探索知识库 <span>↗</span></RouterLink>
        </div>
        <div class="category-list">
          <RouterLink v-for="item in categories" :key="item.name" class="category-row glass-card-inset" :to="`/guide/${item.guide}`">
            <span class="category-num">{{ item.icon }}</span>
            <span class="category-copy"><b>{{ item.name }}</b><small>{{ item.detail }}</small></span>
            <span class="category-arrow">↗</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ===== 最新内容 ===== -->
    <section class="latest-section content-width">
      <div class="section-heading split-heading">
        <div>
          <span class="section-kicker">START READING</span>
          <h2>从这些真实内容开始。</h2>
        </div>
        <RouterLink to="/tutorials" class="inline-link">所有教程 <span>→</span></RouterLink>
      </div>
      <div class="latest-list glass-card">
        <RouterLink v-for="(guide, index) in guideIndex.slice(0, 3)" :key="guide.id" class="latest-row" :to="`/guide/${guide.id}`">
          <span class="latest-number">0{{ index + 1 }}</span>
          <span class="latest-main"><b>{{ guide.name }}</b><small>{{ guide.description }}</small></span>
          <span class="latest-tags"><i v-for="tag in (guide.tags || []).slice(0, 2)" :key="tag">{{ tag }}</i></span>
          <span class="latest-arrow">↗</span>
        </RouterLink>
      </div>
    </section>

    <!-- ===== 插件中心 — 按分类整合 ===== -->
    <section class="plugins-section">
      <div class="content-width plugins-inner">
        <div class="plugin-heading">
          <div>
            <span class="section-kicker">PLUGIN REFERENCE</span>
            <h2>插件，装得上也要看得懂。</h2>
            <p>保留插件安装、配置讲解与中文语言文件，让资料真正能落地。</p>
          </div>
          <RouterLink to="/plugins" class="button-outline">浏览插件中心 <span>→</span></RouterLink>
        </div>

        <!-- 按分类展示 -->
        <div class="plugin-categories">
          <div v-for="group in pluginsByCategory" :key="group.name" class="plugin-category-group">
            <div class="plugin-category-head">
              <h3>{{ group.name }}</h3>
              <span>{{ group.count }} 个插件</span>
            </div>
            <div class="plugin-preview-list glass-card">
              <RouterLink v-for="plugin in group.items" :key="plugin.id" :to="`/plugin/${plugin.id}`" class="plugin-preview">
                <span class="plugin-monogram">{{ plugin.name.slice(0, 1) }}</span>
                <span class="plugin-preview-copy"><b>{{ plugin.name }}</b><small>{{ plugin.description }}</small></span>
                <span class="plugin-preview-arrow">↗</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 贡献 ===== -->
    <section class="contribute-section content-width glass-card">
      <div>
        <span class="section-kicker">BUILT WITH THE COMMUNITY</span>
        <h2>让开服知识，<br class="mobile-break">一起变得更好。</h2>
        <p>MCHive 是开放的社区项目。分享教程、补充配置说明，或修正文档中的错误，都能帮助下一位服主少走弯路。</p>
      </div>
      <a class="button-primary" href="https://github.com/MCTranslate/MCHive" target="_blank" rel="noreferrer">参与 MCHive <span>↗</span></a>
    </section>
  </div>
</template>

<style scoped>
.home-page { color: var(--text-primary); }
.content-width { width: min(1080px, calc(100% - 64px)); margin-inline: auto; }

/* ---------- Hero ---------- */
.hero-band {
  position: relative;
  overflow: hidden;
  background: var(--hero-bg);
  color: var(--hero-text);
  transition: background .4s var(--ease-smooth), color .4s var(--ease-smooth);
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, var(--hero-grid) 1px, transparent 1px),
    linear-gradient(to bottom, var(--hero-grid) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 60% 80% at 50% 40%, #000, transparent 75%);
  pointer-events: none;
  animation: gridDrift 20s ease-in-out infinite;
}
.hero-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--glass-iridescent) 0%, transparent 70%);
  top: -100px;
  right: -100px;
  pointer-events: none;
  animation: float 8s ease-in-out infinite;
}
[data-theme='dark'] .hero-glow,
:root[data-theme='system'] .hero-glow {
  background: radial-gradient(circle, rgba(110,231,183,.1) 0%, transparent 70%);
}
@keyframes gridDrift {
  0%, 100% { opacity: .35; transform: translateY(0); }
  50% { opacity: .5; transform: translateY(-8px); }
}
.hero-inner {
  position: relative;
  width: min(1080px, calc(100% - 64px));
  min-height: 520px;
  margin: auto;
  display: grid;
  grid-template-columns: 1.07fr .93fr;
  align-items: center;
  gap: 30px;
  padding: 64px 0 56px;
}
.hero-copy { max-width: 590px; }
.eyebrow, .section-kicker {
  color: var(--accent);
  font: 600 10px/1.5 var(--font-mono);
  letter-spacing: 2px;
  text-transform: uppercase;
}
.eyebrow { display: flex; align-items: center; gap: 10px; }
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-dim), 0 0 12px var(--accent);
  animation: statusPulse 2.5s ease-in-out infinite;
}
@keyframes statusPulse {
  0%, 100% { box-shadow: 0 0 0 4px var(--accent-dim), 0 0 12px var(--accent); transform: scale(1); }
  50% { box-shadow: 0 0 0 7px var(--accent-dim), 0 0 22px var(--accent-hover); transform: scale(1.1); }
}
.hero-copy h1 {
  margin-top: 24px;
  font-size: clamp(38px, 5vw, 60px);
  line-height: 1.1;
  font-weight: 750;
  letter-spacing: -1px;
}
.hero-highlight {
  background: linear-gradient(135deg, var(--accent), var(--accent-hover), var(--accent));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 6s ease infinite;
}
.hero-description {
  max-width: 520px;
  margin-top: 18px;
  color: var(--text-muted);
  font-size: 15px;
  line-height: 1.9;
}
.hero-search {
  width: min(500px, 100%);
  height: 52px;
  margin-top: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 6px 6px 16px;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  transition: all .3s var(--ease-spring);
}
.hero-search:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim), 0 8px 32px rgba(16,185,129,.08);
  transform: translateY(-1px);
}
.hero-search svg { width: 18px; height: 18px; fill: none; stroke: var(--text-muted); stroke-width: 1.8; flex: none; }
.hero-search input {
  min-width: 0; flex: 1; height: 100%;
  border: 0; outline: 0; background: transparent;
  color: var(--text-primary); font: 14px var(--font-sans);
}
.hero-search input::placeholder { color: var(--text-muted); }
.hero-search button {
  display: flex; align-items: center; gap: 10px;
  height: 40px; padding: 0 14px; border: 0; border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  color: var(--button-text); font: 600 12px var(--font-sans);
  cursor: pointer; transition: all .25s var(--ease-spring);
  box-shadow: 0 2px 12px rgba(16,185,129,.2);
}
.hero-search button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(16,185,129,.3);
}
.hero-search button b { font-size: 14px; }
.hero-actions { display: flex; align-items: center; gap: 16px; margin-top: 20px; }

/* Buttons */
.button-primary, .button-outline, .button-ghost {
  min-height: 42px;
  display: inline-flex; align-items: center; justify-content: center;
  gap: 10px; padding: 0 18px; border-radius: var(--radius-sm);
  text-decoration: none; font-size: 13px; font-weight: 600;
  transition: all .25s var(--ease-spring); cursor: pointer;
}
.button-primary {
  border: 1px solid var(--accent);
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  color: var(--button-text);
  box-shadow: 0 2px 16px rgba(16,185,129,.2);
}
.button-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(16,185,129,.3); filter: brightness(1.05); }
.button-ghost {
  border: 1px solid var(--glass-border); background: var(--glass-bg);
  color: var(--text-secondary); backdrop-filter: blur(8px);
}
.button-ghost:hover { border-color: var(--accent); color: var(--text-primary); background: var(--surface-hover); transform: translateY(-2px); }

.hero-metrics {
  display: flex; align-items: center; gap: 14px;
  margin-top: 32px; color: var(--text-muted); font-size: 11px;
}
.hero-metrics strong { color: var(--text-primary); font: 600 14px var(--font-mono); margin-right: 4px; }
.hero-metrics i { width: 4px; height: 4px; border-radius: 50%; background: var(--text-muted); opacity: .5; }

/* Hero Visual Network */
.hero-visual {
  position: relative; width: 100%; max-width: 455px;
  justify-self: end; height: 320px; padding: 0; overflow: hidden;
}
.visual-topline, .visual-bottomline {
  display: flex; justify-content: space-between;
  color: var(--text-muted); font: 9px var(--font-mono); letter-spacing: 1px;
}
.visual-topline {
  padding: 16px 20px; border-bottom: 1px solid var(--glass-border);
  background: var(--surface); backdrop-filter: blur(10px);
  position: relative; z-index: 3;
}
.visual-bottomline {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 14px 20px; border-top: 1px solid var(--glass-border);
  font-size: 8px; background: var(--surface); backdrop-filter: blur(10px); z-index: 3;
}
.visual-bottomline span:first-child { color: var(--text-secondary); }
.visual-bottomline b {
  display: inline-block; width: 6px; height: 6px; border-radius: 50%;
  margin-right: 6px; background: var(--accent); box-shadow: 0 0 8px var(--accent);
}
.visual-network { position: absolute; inset: 52px 24px 50px; }
.node {
  position: absolute; z-index: 2; width: 106px; height: 66px;
  border: 1px solid var(--glass-border); border-radius: var(--radius-sm);
  background: var(--glass-bg); backdrop-filter: blur(8px);
  display: flex; flex-direction: column; justify-content: center; padding: 8px 12px;
  transition: all .35s var(--ease-spring);
}
.node:hover {
  border-color: var(--accent);
  box-shadow: 0 4px 24px rgba(16,185,129,.12);
  transform: scale(1.06);
}
[data-theme='dark'] .node:hover, :root[data-theme='system'] .node:hover {
  box-shadow: 0 4px 24px rgba(110,231,183,.15);
}
.node b { font-size: 12px; font-weight: 600; color: var(--text-primary); }
.node small { margin-top: 3px; color: var(--text-muted); font: 8px var(--font-mono); letter-spacing: .5px; }
.node i {
  position: absolute; right: 10px; top: 8px; color: var(--accent);
  font: 8px var(--font-mono); font-style: normal; opacity: .6;
}
.node-core {
  width: 120px; height: 76px; left: 50%; top: 50%;
  transform: translate(-50%,-50%); border-color: var(--accent);
  background: var(--accent-dim); padding-left: 46px;
  box-shadow: 0 0 30px rgba(16,185,129,.15);
}
[data-theme='dark'] .node-core, :root[data-theme='system'] .node-core {
  box-shadow: 0 0 30px rgba(110,231,183,.2);
}
.node-core .node-glyph {
  position: absolute; left: 12px; top: 18px;
  display: grid; place-items: center;
  width: 26px; height: 30px;
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  border-radius: 6px; color: var(--button-text);
  font: 800 16px var(--font-mono);
  box-shadow: 0 2px 12px rgba(16,185,129,.3);
}
.node-java { left: 6%; top: 8%; }
.node-paper { right: 2%; top: 10%; }
.node-plugin { left: 3%; bottom: 4%; }
.node-world { right: 0; bottom: 2%; }
.route-line {
  position: absolute; z-index: 1; height: 1px;
  transform-origin: left center;
  background: repeating-linear-gradient(90deg, var(--accent) 0 4px, transparent 4px 8px);
  opacity: .35;
  animation: dashFlow 2s linear infinite;
}
@keyframes dashFlow { from { background-position: 0 0; } to { background-position: 16px 0; } }
.line-a { left: 31%; top: 30%; width: 26%; transform: rotate(31deg); }
.line-b { left: 57%; top: 42%; width: 24%; transform: rotate(-29deg); }
.line-c { left: 30%; top: 73%; width: 27%; transform: rotate(-32deg); }
.line-d { left: 58%; top: 62%; width: 25%; transform: rotate(31deg); }

.hero-edge {
  position: relative; width: min(1080px, calc(100% - 64px));
  margin: auto; padding: 0 0 16px; display: flex; justify-content: space-between;
  color: var(--text-muted); font: 9px var(--font-mono); letter-spacing: .5px;
}
.hero-edge b { color: var(--text-secondary); margin-left: 6px; }

/* ---------- Audience ---------- */
.audience-section { padding-top: 64px; padding-bottom: 72px; }
.section-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; }
.section-heading h2, .plugin-heading h2, .contribute-section h2 {
  margin-top: 10px; font-size: 26px; line-height: 1.3; font-weight: 700; letter-spacing: -.5px;
}
.split-heading > p { max-width: 330px; color: var(--text-muted); font-size: 13px; }
.audience-grid { display: grid; grid-template-columns: repeat(2, 1fr); margin-top: 28px; gap: 12px; }
.audience-item {
  min-width: 0; min-height: 92px; display: flex; align-items: center; gap: 16px;
  padding: 18px 20px; color: inherit; text-decoration: none;
  transition: all .35s var(--ease-spring);
}
.audience-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), inset 0 1px 0 var(--glass-highlight);
  border-color: var(--accent);
}
.audience-icon {
  display: grid; place-items: center; width: 38px; height: 38px; flex: none;
  border: 1px solid var(--glass-border); border-radius: 10px;
  background: var(--accent-dim); color: var(--accent);
  font: 12px var(--font-mono); font-weight: 600;
}
.audience-copy { display: flex; flex-direction: column; gap: 5px; min-width: 0; flex: 1; }
.audience-copy b { font-size: 14px; font-weight: 630; }
.audience-copy small { color: var(--text-muted); font-size: 11px; }
.audience-arrow { color: var(--accent); font-size: 18px; opacity: .5; transition: all .25s var(--ease-spring); }
.audience-item:hover .audience-arrow { opacity: 1; transform: translateX(6px); }

/* ---------- Path ---------- */
.path-section {
  padding: 56px 0; background: var(--bg-secondary);
  border-top: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);
  transition: background-color .4s var(--ease-smooth);
}
.path-heading { align-items: center; }
.inline-link {
  color: var(--accent-strong); font-size: 12px; text-decoration: none;
  white-space: nowrap; transition: color .2s;
}
.inline-link:hover { color: var(--accent-hover); }
.inline-link span { margin-left: 8px; transition: transform .25s var(--ease-spring); display: inline-block; }
.inline-link:hover span { transform: translateX(4px); }
.path-track {
  display: flex; flex-wrap: wrap; gap: 10px; margin-top: 32px; padding: 14px;
}
.path-step {
  flex: 1; min-width: 140px; position: relative; display: flex; flex-direction: column;
  padding: 16px 14px; text-decoration: none; color: inherit;
  transition: all .35s var(--ease-spring); cursor: pointer;
}
.path-step:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), inset 0 1px 0 var(--glass-highlight);
  border-color: var(--accent);
}
.step-top { height: 28px; position: relative; margin-bottom: 8px; }
.step-top span {
  display: grid; place-items: center; width: 28px; height: 28px;
  border: 1px solid var(--accent); border-radius: 50%;
  background: var(--accent-dim); color: var(--accent);
  font: 10px var(--font-mono); font-weight: 600;
  box-shadow: 0 2px 10px rgba(16,185,129,.12);
}
.step-top i {
  position: absolute; top: 14px; left: 34px;
  width: calc(100% - 34px); border-top: 1px dashed var(--border); opacity: .4;
}
.path-step b { font-size: 13px; font-weight: 630; }
.path-step small { margin-top: 5px; color: var(--text-muted); font-size: 11px; }
.path-step:hover b { color: var(--accent); }
.path-foot {
  display: flex; justify-content: space-between;
  margin-top: 24px; color: var(--text-muted); font-size: 10px;
}
.path-foot b { margin-left: 6px; color: var(--accent); }

/* ---------- Knowledge ---------- */
.knowledge-section { padding-top: 72px; padding-bottom: 72px; }
.knowledge-layout {
  display: grid; grid-template-columns: .78fr 1.22fr;
  gap: 24px; margin-top: 28px;
}
.knowledge-intro { padding: 28px; display: flex; flex-direction: column; }
.knowledge-index { color: var(--accent); font: 9px var(--font-mono); letter-spacing: 1px; text-transform: uppercase; }
.knowledge-intro h3 { margin-top: 18px; font-size: 22px; line-height: 1.4; font-weight: 680; }
.knowledge-intro p { max-width: 280px; margin-top: 14px; color: var(--text-muted); font-size: 12px; line-height: 1.8; }
.knowledge-intro > a {
  display: inline-flex; align-items: center; gap: 4px;
  margin-top: auto; padding-top: 16px; color: var(--accent);
  font-size: 12px; text-decoration: none; transition: gap .25s var(--ease-standard);
}
.knowledge-intro > a:hover { gap: 10px; }
.category-list { display: flex; flex-direction: column; gap: 8px; }
.category-row {
  min-height: 72px; display: flex; align-items: center; gap: 14px;
  padding: 14px 18px; text-decoration: none; color: inherit;
  transition: all .25s var(--ease-standard);
  border: 1px solid transparent; border-radius: var(--radius);
}
.category-row:hover {
  border-color: var(--glass-border); background: var(--glass-bg);
  backdrop-filter: blur(12px); transform: translateX(6px);
}
.category-num { color: var(--accent); font: 11px var(--font-mono); opacity: .6; }
.category-copy { display: flex; flex: 1; flex-direction: column; gap: 4px; }
.category-copy b { font-size: 13px; font-weight: 620; }
.category-copy small { color: var(--text-muted); font-size: 10px; }
.category-arrow { color: var(--text-muted); font-size: 14px; transition: transform .25s var(--ease-spring); }
.category-row:hover .category-arrow { transform: translateX(4px); color: var(--accent); }

/* ---------- Latest ---------- */
.latest-section { padding-bottom: 72px; }
.latest-list { margin-top: 24px; padding: 8px 16px; }
.latest-row {
  min-height: 72px; display: flex; align-items: center; gap: 18px;
  padding: 14px 8px; border-bottom: 1px solid var(--glass-border);
  color: inherit; text-decoration: none; transition: all .2s var(--ease-standard);
}
.latest-row:last-child { border-bottom: 0; }
.latest-row:hover { background: var(--surface); border-radius: var(--radius-sm); }
.latest-number { color: var(--accent); font: 11px var(--font-mono); opacity: .6; }
.latest-main { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
.latest-main b { font-size: 13px; font-weight: 630; }
.latest-main small { color: var(--text-muted); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.latest-tags { display: flex; gap: 6px; }
.latest-tags i {
  padding: 3px 8px; border: 1px solid var(--glass-border); border-radius: var(--radius-full);
  color: var(--text-muted); font-size: 9px; font-style: normal; background: var(--surface);
}
.latest-arrow { color: var(--text-muted); transition: transform .2s var(--ease-spring); }
.latest-row:hover .latest-arrow { transform: translateX(4px); color: var(--accent); }

/* ---------- Plugins ---------- */
.plugins-section {
  padding: 48px 0; background: var(--bg-secondary);
  border-block: 1px solid var(--glass-border);
  transition: background-color .4s var(--ease-smooth);
}
.plugins-inner { display: flex; flex-direction: column; gap: 32px; }
.plugin-heading { display: flex; justify-content: space-between; align-items: center; gap: 24px; }
.plugin-heading h2 { font-size: 22px; }
.plugin-heading p { margin-top: 10px; color: var(--text-muted); font-size: 12px; line-height: 1.7; }
.plugin-heading .button-outline {
  min-height: 40px; flex: none; margin-top: 18px;
  background: transparent; border: 1px solid var(--glass-border);
  color: var(--accent-strong); box-shadow: none;
  transition: all .25s var(--ease-standard);
}
.plugin-heading .button-outline:hover { background: var(--accent-dim); border-color: var(--accent); transform: translateY(-1px); }

/* Plugin categories grouped */
.plugin-categories { display: flex; flex-direction: column; gap: 24px; }
.plugin-category-group { display: flex; flex-direction: column; gap: 12px; }
.plugin-category-head { display: flex; align-items: baseline; gap: 12px; }
.plugin-category-head h3 { font-size: 14px; font-weight: 650; color: var(--text-primary); }
.plugin-category-head span { color: var(--text-muted); font-size: 10px; font-family: var(--font-mono); }
.plugin-preview-list { padding: 8px 16px; }
.plugin-preview {
  min-height: 58px; display: flex; align-items: center; gap: 12px;
  padding: 12px 8px; border-bottom: 1px solid var(--glass-border);
  text-decoration: none; color: inherit; transition: all .2s var(--ease-standard);
  border-radius: var(--radius-sm);
}
.plugin-preview:last-child { border-bottom: 0; }
.plugin-preview:hover { background: var(--surface); }
.plugin-monogram {
  display: grid; place-items: center; width: 32px; height: 32px;
  border: 1px solid var(--glass-border); border-radius: 8px;
  background: var(--accent-dim); color: var(--accent);
  font: 12px var(--font-mono); font-weight: 600;
}
.plugin-preview-copy { display: flex; flex: 1; flex-direction: column; gap: 3px; }
.plugin-preview-copy b { font-size: 12px; font-weight: 600; }
.plugin-preview-copy small { color: var(--text-muted); font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.plugin-preview-arrow { color: var(--text-muted); transition: transform .2s var(--ease-spring); }
.plugin-preview:hover .plugin-preview-arrow { transform: translateX(4px); color: var(--accent); }

/* ---------- Contribute ---------- */
.contribute-section {
  min-height: 200px; display: flex; align-items: center;
  justify-content: space-between; gap: 28px; padding: 36px; margin: 64px auto;
}
.contribute-section .button-primary { flex: none; }
.mobile-break { display: none; }

/* ---------- Glass card inset ---------- */
.glass-card-inset { background: transparent; backdrop-filter: none; border: 1px solid transparent; border-radius: var(--radius); }

/* ---------- Responsive ---------- */
@media (min-width: 1200px) { .hero-inner { min-height: 540px; } }
@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr .8fr; gap: 20px; }
  .hero-visual { transform: scale(.9); transform-origin: right center; }
  .hero-copy h1 { font-size: 46px; }
  .hero-metrics { gap: 8px; font-size: 10px; }
}
@media (max-width: 700px) {
  .content-width, .hero-inner, .hero-edge { width: calc(100% - 36px); }
  .hero-inner { min-height: auto; display: block; padding: 48px 0 28px; }
  .eyebrow { font-size: 9px; letter-spacing: 1px; }
  .hero-copy h1 { margin-top: 20px; font-size: 40px; line-height: 1.15; }
  .hero-description { margin-top: 14px; font-size: 13px; line-height: 1.8; }
  .hero-search { height: 48px; margin-top: 20px; padding-left: 12px; }
  .hero-search input { font-size: 13px; }
  .hero-search button { gap: 8px; padding: 0 12px; }
  .hero-actions { gap: 14px; }
  .hero-metrics { gap: 8px; margin-top: 24px; font-size: 9px; }
  .hero-metrics strong { font-size: 12px; }
  .hero-visual { width: 100%; max-width: none; height: 240px; margin-top: 28px; transform: none; }
  .visual-network { inset: 46px 14px 44px; }
  .node { width: 88px; height: 54px; padding: 7px 8px; }
  .node b { font-size: 10px; }
  .node small { font-size: 7px; }
  .node-core { width: 100px; height: 64px; padding-left: 38px; }
  .node-core .node-glyph { left: 8px; top: 16px; width: 22px; height: 24px; font-size: 14px; }
  .node-java { left: 0; top: 5%; } .node-paper { right: 0; top: 5%; }
  .node-plugin { left: 0; bottom: 0; } .node-world { right: 0; bottom: 0; }
  .line-a { left: 27%; top: 27%; width: 24%; }
  .line-b { left: 56%; top: 39%; width: 26%; }
  .line-c { left: 27%; top: 69%; width: 26%; }
  .line-d { left: 56%; top: 58%; width: 27%; }
  .visual-topline, .visual-bottomline { font-size: 7px; padding-inline: 10px; }
  .hero-edge { padding-bottom: 12px; font-size: 7px; }

  .audience-section { padding-top: 44px; padding-bottom: 52px; }
  .section-heading { align-items: flex-start; }
  .section-heading h2, .plugin-heading h2 { font-size: 22px; }
  .section-kicker { font-size: 9px; }
  .split-heading > p { display: none; }
  .audience-grid { grid-template-columns: 1fr; margin-top: 18px; gap: 8px; }
  .audience-item { min-height: 72px; padding: 14px 16px; }
  .audience-copy b { font-size: 13px; } .audience-copy small { font-size: 10px; }

  .path-section { padding: 40px 0; }
  .path-heading { display: block; }
  .path-heading .inline-link { display: inline-block; margin-top: 12px; }
  .path-track { flex-direction: column; gap: 8px; margin-top: 24px; }
  .path-step { min-height: auto; padding: 14px 12px; flex-direction: row; align-items: center; gap: 14px; }
  .step-top { margin-bottom: 0; height: auto; }
  .step-top span { width: 26px; height: 26px; position: static; }
  .step-top i { display: none; }
  .path-step b { font-size: 13px; }
  .path-step small { margin-top: 2px; }
  .path-foot { margin-top: 12px; font-size: 9px; }

  .knowledge-section { padding-top: 48px; padding-bottom: 48px; }
  .knowledge-layout { grid-template-columns: 1fr; gap: 16px; margin-top: 18px; }
  .knowledge-intro h3 { margin-top: 14px; font-size: 20px; }
  .knowledge-intro p { max-width: 100%; }
  .knowledge-intro > a { margin-top: 12px; }

  .latest-section { padding-bottom: 52px; }
  .latest-section .section-heading { align-items: end; }
  .latest-list { margin-top: 18px; padding: 6px 12px; }
  .latest-row { min-height: 72px; gap: 12px; }
  .latest-number { align-self: flex-start; padding-top: 18px; }
  .latest-main b { font-size: 12px; }
  .latest-main small { display: -webkit-box; overflow: hidden; -webkit-line-clamp: 1; -webkit-box-orient: vertical; font-size: 10px; }
  .latest-tags { display: none; }

  .plugins-section { padding: 36px 0; }
  .plugin-heading { display: block; }
  .plugin-heading h2 { font-size: 20px; }
  .plugin-heading p { font-size: 11px; }
  .plugin-heading .button-outline { margin-top: 14px; }
  .plugin-preview-list { padding: 6px 12px; }
  .plugin-category-group { gap: 8px; }
  .plugin-category-head h3 { font-size: 13px; }

  .contribute-section { min-height: auto; display: block; padding: 28px; margin: 40px auto; }
  .contribute-section h2 { font-size: 22px; }
  .contribute-section p { font-size: 11px; }
  .contribute-section .button-primary { margin-top: 18px; }
  .mobile-break { display: initial; }
}
@media (max-width: 380px) {
  .content-width, .hero-inner, .hero-edge { width: calc(100% - 30px); }
  .hero-copy h1 { font-size: 36px; }
  .hero-metrics { gap: 5px; font-size: 8px; }
  .hero-metrics strong { font-size: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; }
}
</style>
