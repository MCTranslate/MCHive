import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// GitHub Actions 自动注入 GITHUB_REPOSITORY = "owner/repo"
// 在 GitHub Pages 上会用 /repo/ 作为子路径；本地开发直接用 /
const githubRepo = process.env.GITHUB_REPOSITORY
const base = githubRepo ? '/' + githubRepo.split('/')[1] + '/' : '/'

export default defineConfig({
  plugins: [vue()],
  base,
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@content': resolve(__dirname, 'content'),
      '@data': resolve(__dirname, 'data')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    port: 5173,
    open: false
  }
})
