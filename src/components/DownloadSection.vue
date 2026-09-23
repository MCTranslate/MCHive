<script setup>
import { ref } from 'vue'

const props = defineProps({
  downloads: {
    type: Array,
    default: () => []
  },
  pluginId: String,
  pluginName: String
})

const downloading = ref(null)

function handleDownload(item, index) {
  downloading.value = index

  if (item.path) {
    const a = document.createElement('a')
    a.href = item.path
    a.download = item.name || item.path.split('/').pop()
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  setTimeout(function() {
    downloading.value = null
  }, 1500)
}
</script>

<template>
  <footer class="download-section" v-if="downloads && downloads.length > 0">
    <h3 class="download-title">下载汉化文件</h3>
    <div class="download-list">
      <div
        v-for="(item, index) in downloads"
        :key="index"
        class="download-item"
      >
        <div class="download-info">
          <span class="download-icon">&#128196;</span>
          <div>
            <span class="download-name">{{ item.name }}</span>
            <span class="download-desc">{{ item.description }}</span>
          </div>
        </div>
        <button
          class="btn btn-primary download-btn"
          :class="{ loading: downloading === index }"
          @click="handleDownload(item, index)"
        >
          <svg v-if="downloading !== index" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <svg v-else class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
          <span>{{ downloading === index ? '下载中...' : '下载' }}</span>
        </button>
      </div>
    </div>

    <div class="download-tip">
      &#11015; 下载后请将文件放入插件对应目录（通常是 <code>plugins/{{ pluginName }}/</code> 或 <code>plugins/{{ pluginId }}/</code>），然后重启服务器即可生效。
    </div>
  </footer>

  <footer class="download-section empty" v-else>
    <div class="empty-download">
      <span class="download-icon">&#128193;</span>
      <div>
        <p>暂无可下载文件</p>
        <span class="note">可在上方的 Lang / Config Tab 中直接复制内容使用</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.download-section {
  border-top: 1px solid var(--border);
  padding-top: 28px;
  margin-top: 48px;
}

.download-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.download-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.download-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 20px;
  transition: all 0.2s;
}

.download-item:hover {
  border-color: var(--accent);
}

.download-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.download-icon {
  font-size: 20px;
}

.download-info > div {
  display: flex;
  flex-direction: column;
}

.download-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.download-desc {
  font-size: 12px;
  color: var(--text-muted);
}

.download-btn {
  flex-shrink: 0;
}

.download-btn.loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.download-tip {
  margin-top: 16px;
  padding: 12px 16px;
  background: var(--accent-dim);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.download-tip code {
  background: rgba(74, 222, 128, 0.15);
  color: var(--accent);
  padding: 1px 6px;
  border-radius: 4px;
}

.download-section.empty {
  border-top: 1px solid var(--border);
}

.empty-download {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  color: var(--text-muted);
}

.empty-download p {
  font-size: 14px;
  margin-bottom: 2px;
}

.empty-download .note {
  font-size: 12px;
  color: var(--text-muted);
  opacity: 0.7;
}
</style>
