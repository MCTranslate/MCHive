#!/usr/bin/env node
// scripts/build-index.mjs
//
// Scans content/plugins/*/tutorial.md and content/guides/*.md frontmatter,
// then writes the aggregated data/plugins.json + data/guides.json files used
// by the Vue app.
//
// Run via `npm run build:index`. The predev/prebuild chain in package.json
// also calls this script before starting Vite.
//
// Conventions:
//   - Plugin id defaults to the folder name; frontmatter `id` may override.
//   - `sections` defaults to all *.md files in the plugin folder (sorted by
//     filename) with name lookup from DEFAULT_SECTION_NAMES. Frontmatter may
//     declare `sections` explicitly to override order/names/descriptions.
//   - Downloads in `public/downloads/plugins/<id>/` that aren't referenced by
//     any frontmatter trigger a warning (orphaned file); declared download
//     paths that don't resolve under public/ trigger an error.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseFrontmatter } from './parse-frontmatter.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CONTENT_PLUGINS = path.join(ROOT, 'content', 'plugins')
const CONTENT_GUIDES = path.join(ROOT, 'content', 'guides')
const PUBLIC_DIR = path.join(ROOT, 'public')
const DATA_DIR = path.join(ROOT, 'data')

const DEFAULT_SECTION_NAMES = Object.freeze({
  tutorial: '安装教程',
  lang: 'Lang 汉化',
  config: 'Config 汉化'
})

function exists(p) {
  try { return fs.existsSync(p) } catch { return false }
}

function readText(p) {
  return fs.readFileSync(p, 'utf8')
}

function listSubdirs(p) {
  if (!exists(p)) return []
  return fs.readdirSync(p, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
}

function listMdFiles(p) {
  if (!exists(p)) return []
  return fs.readdirSync(p).filter(f => f.endsWith('.md')).sort()
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

function defaultSectionName(id) {
  return DEFAULT_SECTION_NAMES[id] || id.charAt(0).toUpperCase() + id.slice(1)
}

function deriveSections(pluginDir) {
  return listMdFiles(pluginDir).map(filename => {
    const id = filename.replace(/\.md$/, '')
    return { id, name: defaultSectionName(id), file: filename }
  })
}

function buildPluginEntry(pluginId) {
  const pluginDir = path.join(CONTENT_PLUGINS, pluginId)
  const tutorialPath = path.join(pluginDir, 'tutorial.md')
  if (!exists(tutorialPath)) {
    throw new Error(`插件 ${pluginId}: 缺少 tutorial.md`)
  }

  const { frontmatter, error } = parseFrontmatter(readText(tutorialPath))
  if (error) {
    throw new Error(`插件 ${pluginId}: frontmatter 解析失败 — ${error}`)
  }
  if (!frontmatter || Object.keys(frontmatter).length === 0) {
    throw new Error(`插件 ${pluginId}: tutorial.md 缺少 frontmatter（请在文件顶部用 --- 包裹 id/name/description/category 等字段）`)
  }

  const id = frontmatter.id || pluginId
  if (id !== pluginId) {
    throw new Error(`插件 ${pluginId}: frontmatter.id='${id}' 与目录名不一致`)
  }

  const sections = Array.isArray(frontmatter.sections) && frontmatter.sections.length > 0
    ? frontmatter.sections
    : deriveSections(pluginDir)

  return {
    id,
    name: frontmatter.name || '',
    description: frontmatter.description || '',
    category: frontmatter.category || '',
    version: frontmatter.version || '',
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    sections,
    downloads: Array.isArray(frontmatter.downloads) ? frontmatter.downloads : []
  }
}

function buildGuideEntry(filename) {
  const filePath = path.join(CONTENT_GUIDES, filename)
  const { frontmatter, error } = parseFrontmatter(readText(filePath))
  if (error) {
    throw new Error(`教程 ${filename}: frontmatter 解析失败 — ${error}`)
  }
  if (!frontmatter || Object.keys(frontmatter).length === 0) {
    throw new Error(`教程 ${filename}: 缺少 frontmatter（请在文件顶部用 --- 包裹 id/title/description 等字段）`)
  }

  const id = frontmatter.id || filename.replace(/\.md$/, '')
  const expectedId = filename.replace(/\.md$/, '')
  if (id !== expectedId) {
    throw new Error(`教程 ${filename}: frontmatter.id='${id}' 与文件名不一致`)
  }

  const entry = {
    id,
    name: frontmatter.title || frontmatter.name || '',
    description: frontmatter.description || '',
    icon: frontmatter.icon || '',
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : []
  }
  if (typeof frontmatter.order === 'number') entry.order = frontmatter.order
  return entry
}

function checkDownloadsCrossRef(plugins) {
  const errors = []
  const warnings = []
  const declared = new Set()

  for (const p of plugins) {
    for (const d of (p.downloads || [])) {
      if (!d || !d.path) continue
      const rel = d.path.replace(/^\/+/, '')
      declared.add(`downloads/plugins/${p.id}/${path.basename(rel)}`)
      const abs = path.join(PUBLIC_DIR, rel)
      if (!exists(abs)) {
        errors.push(`插件 ${p.id}: downloads[].path '${d.path}' 在 public/ 下不存在`)
      }
    }
  }

  const downloadsRoot = path.join(PUBLIC_DIR, 'downloads', 'plugins')
  if (exists(downloadsRoot)) {
    for (const pluginId of listSubdirs(downloadsRoot)) {
      const dir = path.join(downloadsRoot, pluginId)
      for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!f.isFile()) continue
        const rel = `downloads/plugins/${pluginId}/${f.name}`
        if (!declared.has(rel)) {
          warnings.push(`public/${rel} 未被任何插件 frontmatter 的 downloads[].path 引用`)
        }
      }
    }
  }

  return { errors, warnings }
}

function main() {
  ensureDir(DATA_DIR)

  const errors = []

  const pluginIds = listSubdirs(CONTENT_PLUGINS).filter(id => id !== '_template')
  const plugins = []
  for (const id of pluginIds) {
    try {
      plugins.push(buildPluginEntry(id))
    } catch (err) {
      errors.push(err.message)
    }
  }

  const guideFiles = listMdFiles(CONTENT_GUIDES)
  const guides = []
  for (const filename of guideFiles) {
    try {
      guides.push(buildGuideEntry(filename))
    } catch (err) {
      errors.push(err.message)
    }
  }

  plugins.sort((a, b) => a.id.localeCompare(b.id))
  guides.sort((a, b) => {
    const ao = typeof a.order === 'number' ? a.order : null
    const bo = typeof b.order === 'number' ? b.order : null
    if (ao !== null && bo !== null) return ao - bo
    if (ao !== null) return -1
    if (bo !== null) return 1
    return a.id.localeCompare(b.id)
  })

  if (errors.length) {
    for (const e of errors) console.error(`[build-index] error: ${e}`)
    process.exit(1)
  }

  const { errors: refErrors, warnings } = checkDownloadsCrossRef(plugins)
  if (refErrors.length) {
    for (const e of refErrors) console.error(`[build-index] error: ${e}`)
    process.exit(1)
  }
  for (const w of warnings) console.warn(`[build-index] warning: ${w}`)

  // Write clean JSON; data/README.md explains the auto-generated nature.
  const pluginsPath = path.join(DATA_DIR, 'plugins.json')
  const guidesPath = path.join(DATA_DIR, 'guides.json')
  fs.writeFileSync(pluginsPath, JSON.stringify(plugins, null, 2) + '\n')
  fs.writeFileSync(guidesPath, JSON.stringify(guides, null, 2) + '\n')

  console.log(`[build-index] wrote ${plugins.length} plugin(s) → ${path.relative(ROOT, pluginsPath)}`)
  console.log(`[build-index] wrote ${guides.length} guide(s) → ${path.relative(ROOT, guidesPath)}`)
}

main()