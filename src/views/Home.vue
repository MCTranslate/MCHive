<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import pluginIndex from '../../data/plugins.json'

const router = useRouter()

const totalPlugins = pluginIndex.length
const totalDownloads = pluginIndex.reduce(function(sum, p) {
  return sum + (p.downloads ? p.downloads.length : 0)
}, 0)

function goToPlugin(id) {
  router.push('/plugin/' + id)
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1>MC 插件汉化教程站</h1>
      <p>收录主流 Minecraft 服务端插件的 <strong>lang 语言文件</strong>、<strong>config 配置讲解</strong> 与 <strong>安装使用教程</strong>，方便服主快速上手。</p>
      <div class="stats">
        <div class="stat">
          <span class="stat-num">{{ totalPlugins }}</span>
          <span class="stat-label">已收录插件</span>
        </div>
        <div class="stat">
          <span class="stat-num">{{ totalDownloads }}</span>
          <span class="stat-label">可下载文件</span>
        </div>
      </div>
    </section>

    <section class="quick-start">
      <h2>使用指南</h2>
      <div class="guide-cards">
        <div class="guide-card">
          <span class="guide-num">1</span>
          <h3>选择插件</h3>
          <p>从左侧导航栏选择你想查看的插件，支持搜索和分类筛选。</p>
        </div>
        <div class="guide-card">
          <span class="guide-num">2</span>
          <h3>阅读教程</h3>
          <p>每个插件包含教程、Lang 汉化、Config 配置讲解三个 Tab。</p>
        </div>
        <div class="guide-card">
          <span class="guide-num">3</span>
          <h3>下载使用</h3>
          <p>页面底部提供一键下载汉化文件，可直接替换使用。</p>
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

.quick-start h2,
.popular h2,
.contribute h2 {
  font-size: 1.4em;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.guide-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.guide-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  position: relative;
}

.guide-num {
  position: absolute;
  top: -12px;
  left: 16px;
  background: var(--accent);
  color: var(--bg-primary);
  font-size: 12px;
  font-weight: 700;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-card h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 8px 0 6px;
}

.guide-card p {
  font-size: 13px;
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
