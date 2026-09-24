#!/usr/bin/env node
// scripts/validate-content.mjs
//
// Validates every content/plugins/*/tutorial.md and content/guides/*.md
// against the JSON schemas under schemas/, plus a set of cross-reference
// checks (id matches folder/file name, ids unique, section files exist,
// download paths resolve under public/, etc.).
//
// Exits 0 if everything is valid, 1 otherwise. Designed to be called via
// `npm run validate` (also wired into the dev/build chain in package.json).
//
// Implementation note: a minimal hand-rolled JSON Schema validator is used
// to avoid adding an external dependency (ajv). It supports the subset
// required by our schemas: $ref (relative file), type, required, properties,
// items, pattern, minLength, additionalProperties.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseFrontmatter } from './parse-frontmatter.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SCHEMAS_DIR = path.join(ROOT, 'schemas')
const CONTENT_PLUGINS = path.join(ROOT, 'content', 'plugins')
const CONTENT_GUIDES = path.join(ROOT, 'content', 'guides')
const PUBLIC_DIR = path.join(ROOT, 'public')

const SCHEMA_FILES = {
  plugin: 'plugin.schema.json',
  guide: 'guide.schema.json',
  section: 'section.schema.json'
}

const schemaCache = new Map()

function loadSchema(file) {
  if (!schemaCache.has(file)) {
    schemaCache.set(file, JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, file), 'utf8')))
  }
  return schemaCache.get(file)
}

function resolveSchemaFile(ref) {
  // "./section.schema.json" -> "section.schema.json"; bare filename also accepted.
  const file = ref.replace(/^\.\//, '')
  return loadSchema(file)
}

function jsonType(v) {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  if (typeof v === 'number' && Number.isInteger(v)) return 'integer'
  return typeof v
}

function checkValue(value, schema, originFile, errs, dotPath) {
  if (schema.$ref) {
    const refFile = schema.$ref.replace(/^\.\//, '')
    const resolved = loadSchema(refFile)
    checkValue(value, resolved, refFile, errs, dotPath)
    return
  }

  if (schema.type !== undefined) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type]
    const actual = jsonType(value)
    const ok = types.some(t => {
      if (t === actual) return true
      if (t === 'number' && actual === 'integer') return true
      return false
    })
    if (!ok) {
      errs.push({ path: dotPath || '(根)', message: `类型不符 (期望 ${types.join('/')}, 实际 ${actual})` })
      return
    }
  }

  if (schema.required && typeof value === 'object' && value !== null && !Array.isArray(value)) {
    for (const k of schema.required) {
      if (!(k in value) || value[k] === undefined) {
        errs.push({ path: dotPath ? `${dotPath}.${k}` : k, message: '必填字段缺失' })
      }
    }
  }

  if (schema.properties && typeof value === 'object' && value !== null && !Array.isArray(value)) {
    for (const [k, sub] of Object.entries(schema.properties)) {
      if (k in value && value[k] !== undefined) {
        checkValue(value[k], sub, originFile, errs, dotPath ? `${dotPath}.${k}` : k)
      }
    }
  }

  if (schema.items && Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      checkValue(value[i], schema.items, originFile, errs, `${dotPath}[${i}]`)
    }
  }

  if (typeof value === 'string') {
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      errs.push({ path: dotPath || '(根)', message: `不匹配模式 /${schema.pattern}/` })
    }
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errs.push({ path: dotPath || '(根)', message: `长度不足 (期望 >= ${schema.minLength}, 实际 ${value.length})` })
    }
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errs.push({ path: dotPath || '(根)', message: `数值过小 (期望 >= ${schema.minimum}, 实际 ${value})` })
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errs.push({ path: dotPath || '(根)', message: `数值过大 (期望 <= ${schema.maximum}, 实际 ${value})` })
    }
  }

  if (schema.additionalProperties === false && typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const allowed = new Set(Object.keys(schema.properties || {}))
    for (const k of Object.keys(value)) {
      if (!allowed.has(k)) {
        errs.push({ path: dotPath ? `${dotPath}.${k}` : k, message: '未声明的字段' })
      }
    }
  }
}

function exists(p) {
  try { return fs.existsSync(p) } catch { return false }
}

function readText(p) { return fs.readFileSync(p, 'utf8') }

function listSubdirs(p) {
  if (!exists(p)) return []
  return fs.readdirSync(p, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
}

function listMdFiles(p) {
  if (!exists(p)) return []
  return fs.readdirSync(p).filter(f => f.endsWith('.md'))
}

const findings = []  // { file, errors: [{path, message}] }

function reportFile(relFile, errs) {
  if (!errs.length) return
  findings.push({ file: relFile, errors: errs })
}

function validatePlugin(pluginId) {
  const pluginDir = path.join(CONTENT_PLUGINS, pluginId)
  const tutorialPath = path.join(pluginDir, 'tutorial.md')
  const relFile = path.relative(ROOT, tutorialPath)

  if (!exists(tutorialPath)) {
    reportFile(relFile, [{ path: '', message: 'tutorial.md 缺失' }])
    return
  }

  const { frontmatter, error } = parseFrontmatter(readText(tutorialPath))
  if (error) {
    reportFile(relFile, [{ path: '', message: `frontmatter 解析失败 — ${error}` }])
    return
  }
  if (!frontmatter || Object.keys(frontmatter).length === 0) {
    reportFile(relFile, [{ path: '', message: '缺少 frontmatter（请用 --- 包裹元数据）' }])
    return
  }

  const errs = []
  checkValue(frontmatter, loadSchema(SCHEMA_FILES.plugin), SCHEMA_FILES.plugin, errs, '')

  // Cross-ref: id matches folder name
  if (frontmatter.id !== undefined && frontmatter.id !== pluginId) {
    errs.push({ path: 'id', message: `id '${frontmatter.id}' 与目录名 '${pluginId}' 不一致` })
  }

  // Cross-ref: sections[].file exists
  if (Array.isArray(frontmatter.sections)) {
    frontmatter.sections.forEach((s, i) => {
      if (s && typeof s === 'object' && s.file) {
        const f = path.join(pluginDir, s.file)
        if (!exists(f)) {
          errs.push({ path: `sections[${i}].file`, message: `文件不存在: ${s.file}` })
        }
      }
    })
  }

  // Cross-ref: downloads[].path exists under public/
  if (Array.isArray(frontmatter.downloads)) {
    frontmatter.downloads.forEach((d, i) => {
      if (d && typeof d === 'object' && d.path) {
        const rel = d.path.replace(/^\/+/, '')
        const abs = path.join(PUBLIC_DIR, rel)
        if (!exists(abs)) {
          errs.push({ path: `downloads[${i}].path`, message: `public/${rel} 不存在` })
        }
      }
    })
  }

  reportFile(relFile, errs)
}

function validateGuide(filename) {
  const filePath = path.join(CONTENT_GUIDES, filename)
  const relFile = path.relative(ROOT, filePath)

  const { frontmatter, error } = parseFrontmatter(readText(filePath))
  if (error) {
    reportFile(relFile, [{ path: '', message: `frontmatter 解析失败 — ${error}` }])
    return
  }
  if (!frontmatter || Object.keys(frontmatter).length === 0) {
    reportFile(relFile, [{ path: '', message: '缺少 frontmatter' }])
    return
  }

  const errs = []
  checkValue(frontmatter, loadSchema(SCHEMA_FILES.guide), SCHEMA_FILES.guide, errs, '')

  const expectedId = filename.replace(/\.md$/, '')
  if (frontmatter.id !== undefined && frontmatter.id !== expectedId) {
    errs.push({ path: 'id', message: `id '${frontmatter.id}' 与文件名 '${expectedId}' 不一致` })
  }

  reportFile(relFile, errs)
}

function checkUniqueIds() {
  const seenPlugins = new Map()
  for (const id of listSubdirs(CONTENT_PLUGINS)) {
    if (id === '_template') continue
    const file = path.join(CONTENT_PLUGINS, id, 'tutorial.md')
    if (!exists(file)) continue
    const { frontmatter } = parseFrontmatter(readText(file))
    const fid = (frontmatter && frontmatter.id) || id
    const prev = seenPlugins.get(fid)
    if (prev) {
      const relFile = path.relative(ROOT, file)
      const prevRel = path.relative(ROOT, prev)
      reportFile(relFile, [{ path: 'id', message: `插件 id '${fid}' 与 ${prevRel} 重复` }])
    } else {
      seenPlugins.set(fid, file)
    }
  }

  const seenGuides = new Map()
  for (const f of listMdFiles(CONTENT_GUIDES)) {
    const file = path.join(CONTENT_GUIDES, f)
    const { frontmatter } = parseFrontmatter(readText(file))
    const fid = (frontmatter && frontmatter.id) || f.replace(/\.md$/, '')
    const prev = seenGuides.get(fid)
    if (prev) {
      const relFile = path.relative(ROOT, file)
      const prevRel = path.relative(ROOT, prev)
      reportFile(relFile, [{ path: 'id', message: `教程 id '${fid}' 与 ${prevRel} 重复` }])
    } else {
      seenGuides.set(fid, file)
    }
  }
}

function main() {
  if (exists(CONTENT_PLUGINS)) {
    for (const id of listSubdirs(CONTENT_PLUGINS)) {
      if (id === '_template') continue
      validatePlugin(id)
    }
  }

  if (exists(CONTENT_GUIDES)) {
    for (const f of listMdFiles(CONTENT_GUIDES)) {
      validateGuide(f)
    }
  }

  checkUniqueIds()

  if (findings.length === 0) {
    console.log('[validate] 所有内容通过校验')
    process.exit(0)
  }

  for (const { file, errors } of findings) {
    console.error(`[validate] ${file}`)
    for (const e of errors) {
      console.error(`  · ${e.path || '(根)'}: ${e.message}`)
    }
  }
  const total = findings.reduce((s, f) => s + f.errors.length, 0)
  console.error(`\n[validate] 共 ${total} 处错误，校验未通过`)
  process.exit(1)
}

main()