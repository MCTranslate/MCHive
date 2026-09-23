<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import pluginIndex from '../../data/plugins.json'
import guideIndex from '../../data/guides.json'

const router = useRouter()

const totalPlugins = pluginIndex.length
const totalDownloads = pluginIndex.reduce(function(sum, p) {
  return sum + (p.downloads ? p.downloads.length : 0)
}, 0)

function goToPlugin(id) {
  router.push('/plugin/' + id)
}

function goToGuide(id) {
  router.push('/guide/' + id)
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1>MC 插件汉化教程站</h1>
      <p>不止教你开服，更教你把服务器开好。主流插件的 <strong>lang 语言文件</strong>、<strong>config 配置逐项讲解</strong>与<strong>开箱即用的汉化下载</strong>，全在这里。</p>
      <div class="stats">
        <div class="stat">
          <span class="stat-num">{{ totalPlugins }}</span>
          <span class="stat-label">已收录插件</span>
        </div>
        <div class="stat">
          <span class="stat-num">{{ guideIndex.length }}</span>
          <span class="stat-label">系列教程</span>
        </div>
        <div class="stat">
          <span class="stat-num">{{ totalDownloads }}</span>
          <span class="stat-label">可下载汉化</span>
        </div>
      </div>
    </section>

    <section class="why-us">
      <div class="why-card">
        <h2>已经在看笨蛋开服？我们也尊重它，但——</h2>
        <p>笨蛋开服教你怎么把服务器<strong>开起来</strong>，我们教你怎么<strong>开好</strong>。它的插件章节止步于「装上能用」，而这里每个插件都有逐项配置讲解和成品汉化。</p>
        <div class="why-points">
          <div class="why-point">
            <span class="point-icon">📥</span>
            <div>
              <strong>汉化开箱即用</strong>
              <span>告别网盘瞎找，每个插件页面底部一键下载与教程版本严格对应的汉化文件</span>
            </div>
          </div>
          <div class="why-point">
            <span class="point-icon">📝</span>
            <div>
              <strong>配置逐项讲人话</strong>
              <span>不丢给你一句「改这里就行」，每个参数是干嘛的、推荐值多少都写清楚</span>
            </div>
          </div>
          <div class="why-point">
            <span class="point-icon">🎁</span>
            <div>
              <strong>全家桶直接抄</strong>
              <span>生存服/RPG服/小游戏服的插件组合方案，权限模板、加载顺序全给齐</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="guides-section">
      <h2>从这篇开始</h2>
      <div class="guide-grid">
        <div
          v-for="guide in guideIndex"
          :key="guide.id"
          class="guide-entry"
          @click="goToGuide(guide.id)"
        >
          <span class="guide-entry-icon">{{ guide.icon }}</span>
          <div>
            <h3>{{ guide.name }}</h3>
            <p>{{ guide.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="popular">
      <h2>已收录插件</h2>
      <div class="plugin-grid">
        <div
          v-for="plugin in pluginIndex"
          :key="plugin.id"
          class="plugin-card"
          @click="goToPlugin(plugin.id)"
        >
          <div class="card-header">
            <span class="card-icon">{{ plugin.name[0] }}</span>
            <span class="card-category">{{ plugin.category }}</span>
          </div>
          <h3>{{ plugin.name }}</h3>
          <p>{{ plugin.description }}</p>
          <div class="card-footer">
            <span class="version">{{ plugin.version || '未知版本' }}</span>
            <span class="download-count" v-if="plugin.downloads && plugin.downloads.length">
              {{ plugin.downloads.length }} 个文件可下载
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="contribute">
      <h2>想贡献汉化？</h2>
      <p>欢迎为更多插件提交汉化和教程！直接 Fork 仓库，按 <code>content/plugins/_template/</code> 模板添加 Markdown 文件和数据，发起 Pull Request 即可。</p>
    </section>
  </div>
</template>

<style scoped>
.home {
  padding: 40px;
  max-width: 960px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 40px 0;
}

.hero h1 {
  font-size: 2.4em;
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 12px;
}

.hero p {
  font-size: 16px;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
}

.hero strong {
  color: var(--text-primary);
  font-weight: 600;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 32px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 32px;
  font-weight: 800;
  color: var(--accent);
}

.stat-label {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 4px;
}

.quick-start {
  margin-top: 48px;
}

.why-us {
  margin-top: 40px;
}

.why-card {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.06), rgba(96, 165, 250, 0.05));
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
}

.why-card h2 {
  font-size: 1.2em;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.why-card > p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 20px;
}

.why-card strong {
  color: var(--accent);
}

.why-points {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.why-point {
  display: flex;
  gap: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px;
}

.point-icon {
  font-size: 20px;
  line-height: 1;
}

.why-point > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.why-point strong {
  font-size: 13px;
  color: var(--text-primary);
}

.why-point span {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.6;
}

.guides-section {
  margin-top: 48px;
}

.guides-section h2,
.popular h2,
.contribute h2 {
  font-size: 1.4em;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}

.guide-entry {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.guide-entry:hover {
  border-color: var(--info);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.guide-entry-icon {
  font-size: 24px;
  line-height: 1;
}

.guide-entry h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.guide-entry p {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.popular {
  margin-top: 48px;
}

.plugin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

.plugin-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.plugin-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--accent-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--accent);
  font-size: 15px;
}

.card-category {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  padding: 3px 8px;
  border-radius: 10px;
}

.plugin-card h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
}

.plugin-card p {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: var(--text-muted);
}

.contribute {
  margin-top: 48px;
  padding: 28px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.contribute p {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 8px;
  line-height: 1.7;
}

.contribute code {
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

@media (max-width: 768px) {
  .home {
    padding: 20px;
  }
  .hero h1 {
    font-size: 1.8em;
  }
  .stats {
    gap: 24px;
  }
}
</style>
