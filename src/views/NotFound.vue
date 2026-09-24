<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <main class="not-found content-width">
    <span class="section-kicker">PAGE NOT FOUND / 404</span>
    <p class="error-code">404</p>
    <h1>这页还没有加入 MCHive。</h1>
    <p class="error-copy">地址可能已经改变，或你访问的内容还在整理中。返回知识库继续浏览。</p>
    <div class="error-actions">
      <button class="btn btn-primary" type="button" @click="router.push('/')">返回首页</button>
      <button class="btn btn-secondary" type="button" @click="router.push('/tutorials')">浏览教程</button>
    </div>
  </main>
</template>

<style scoped>
.not-found { min-height: 54vh; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding-top: 60px; padding-bottom: 60px; }
.section-kicker { color: var(--accent-strong); font: 10px var(--font-mono); letter-spacing: 1px; }
.error-code { margin-top: 18px; color: var(--accent-strong); font: 700 clamp(64px, 12vw, 132px)/.9 var(--font-mono); letter-spacing: -.06em; }
.not-found h1 { margin-top: 22px; font-size: clamp(24px, 4vw, 38px); line-height: 1.25; }
.error-copy { max-width: 480px; margin-top: 12px; color: var(--text-muted); font-size: 14px; }
.error-actions { display: flex; gap: 10px; margin-top: 25px; }
.content-width { width: min(980px, calc(100% - 64px)); margin-inline: auto; }
@media (max-width: 700px) { .content-width { width: calc(100% - 36px); } .not-found { min-height: 62vh; padding-top: 35px; } .error-actions { width: 100%; } .error-actions .btn { flex: 1; } }
</style>
