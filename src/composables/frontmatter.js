/**
 * Minimal dependency-free frontmatter parser used by both the Vue runtime and
 * the build/validate scripts. The supported YAML subset is intentionally small
 * and only covers the shapes we author in `content/`:
 *
 *   key: value                  # scalar: string, number, boolean, null
 *   key: [a, b, c]              # inline array of scalars
 *   key:                        # followed by either of:
 *     child: value              #   a nested object
 *     - item                    #   or a block sequence of objects/scalars
 *     - key: value              #   sequence items can have inline key/value
 *       sibling: value          #   and indented sibling keys
 *
 * `#` comments are stripped from each line (ignoring `#` inside quotes).
 *
 * The return value is { frontmatter, content, range, error }.
 *   - frontmatter: parsed JS object
 *   - content: original markdown body with the frontmatter fences removed
 *   - range: { startLine, endLine } (1-based, inclusive) of the fences
 *   - error: null on success, otherwise a human-readable error message
 */
export function parseFrontmatter(raw) {
  if (typeof raw !== 'string') {
    return { frontmatter: {}, content: '', range: null, error: null }
  }

  const text = raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
  const lines = text.split('\n')

  if (lines[0] !== '---' || lines.length === 1) {
    return { frontmatter: {}, content: text, range: null, error: null }
  }

  let endLine = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') { endLine = i; break }
  }

  if (endLine === -1) {
    return {
      frontmatter: {},
      content: '',
      range: { startLine: 1, endLine: lines.length },
      error: '未闭合的 frontmatter（缺少结尾 ---）'
    }
  }

  const yamlLines = lines.slice(1, endLine)
  const tail = lines.slice(endLine + 1).join('\n')
  const content = tail.startsWith('\n') ? tail.slice(1) : tail

  const tokens = tokenize(yamlLines)

  try {
    const parsed = parseLevel(tokens, 0, -1, false)
    return {
      frontmatter: parsed.value,
      content,
      range: { startLine: 1, endLine: endLine + 1 },
      error: null
    }
  } catch (err) {
    return {
      frontmatter: {},
      content,
      range: { startLine: 1, endLine: endLine + 1 },
      error: err && err.message ? err.message : String(err)
    }
  }
}

function tokenize(yamlLines) {
  const tokens = []
  for (let i = 0; i < yamlLines.length; i++) {
    const stripped = stripComment(yamlLines[i])
    if (!stripped.trim()) continue
    tokens.push({
      indent: countIndent(stripped),
      content: stripped.trim(),
      line: i + 2 // 1-based, accounting for opening ---
    })
  }
  return tokens
}

function stripComment(line) {
  let inQuote = null
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuote) {
      if (ch === inQuote) inQuote = null
      continue
    }
    if (ch === '"' || ch === "'") { inQuote = ch; continue }
    if (ch === '#') {
      if (i === 0 || /\s/.test(line[i - 1])) return line.slice(0, i)
    }
  }
  return line
}

function countIndent(line) {
  let n = 0
  while (n < line.length && line[n] === ' ') n++
  return n
}

function parseLevel(tokens, startIdx, parentIndent, asArray) {
  const result = asArray ? [] : {}
  let pos = startIdx

  while (pos < tokens.length) {
    const tok = tokens[pos]
    if (tok.indent <= parentIndent) break

    if (asArray) {
      if (!tok.content.startsWith('- ')) { pos++; continue }
      const item = parseArrayItem(tokens, pos, tok)
      result.push(item.value)
      pos = item.next
    } else {
      const m = tok.content.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/)
      if (!m) { pos++; continue }
      const key = m[1]
      const valueStr = m[2].trim()

      if (valueStr !== '') {
        result[key] = parseScalarOrInlineArray(valueStr)
        pos++
      } else {
        pos++
        const child = findChildBlock(tokens, pos, tok.indent)
        if (child) {
          const sub = parseLevel(tokens, child.startIdx, child.indent - 1, child.isArray)
          result[key] = sub.value
          pos = sub.next
        } else {
          result[key] = null
        }
      }
    }
  }

  return { value: result, next: pos }
}

function parseArrayItem(tokens, startIdx, dashTok) {
  const afterDash = dashTok.content.slice(2)
  const item = {}
  let pos = startIdx

  const inline = readInlineKeyValue(afterDash)
  if (inline) {
    if (!inline.valueIsEmpty) {
      item[inline.key] = inline.value
      pos++
    } else {
      pos++
      const child = findChildBlock(tokens, pos, dashTok.indent)
      if (child) {
        const sub = parseLevel(tokens, child.startIdx, child.indent - 1, child.isArray)
        item[inline.key] = sub.value
        pos = sub.next
      } else {
        item[inline.key] = null
      }
    }
  } else {
    const trimmed = afterDash.trim()
    if (trimmed === '') {
      pos++
      const child = findChildBlock(tokens, pos, dashTok.indent)
      if (child) {
        const sub = parseLevel(tokens, child.startIdx, child.indent - 1, child.isArray)
        if (Array.isArray(sub.value)) {
          return { value: sub.value, next: sub.next }
        }
        Object.assign(item, sub.value)
        pos = sub.next
      }
    } else {
      return { value: parseScalar(trimmed), next: pos + 1 }
    }
  }

  while (pos < tokens.length) {
    const sib = tokens[pos]
    if (sib.indent <= dashTok.indent) break
    if (sib.indent === dashTok.indent && sib.content.startsWith('- ')) break

    const sibKv = readInlineKeyValue(sib.content)
    if (!sibKv) { pos++; continue }
    if (!sibKv.valueIsEmpty) {
      item[sibKv.key] = sibKv.value
      pos++
    } else {
      pos++
      const child = findChildBlock(tokens, pos, sib.indent)
      if (child) {
        const sub = parseLevel(tokens, child.startIdx, child.indent - 1, child.isArray)
        item[sibKv.key] = sub.value
        pos = sub.next
      } else {
        item[sibKv.key] = null
      }
    }
  }

  return { value: item, next: pos }
}

function findChildBlock(tokens, startIdx, parentIndent) {
  let p = startIdx
  while (p < tokens.length && tokens[p].indent <= parentIndent) p++
  if (p >= tokens.length) return null
  return {
    startIdx: p,
    indent: tokens[p].indent,
    isArray: tokens[p].content.startsWith('- ')
  }
}

function readInlineKeyValue(content) {
  const m = content.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/)
  if (!m) return null
  const valueStr = m[2].trim()
  if (valueStr === '') {
    return { key: m[1], value: null, valueIsEmpty: true }
  }
  return { key: m[1], value: parseScalarOrInlineArray(valueStr), valueIsEmpty: false }
}

function parseScalarOrInlineArray(valueStr) {
  if (valueStr.startsWith('[') && valueStr.endsWith(']')) {
    return parseInlineArray(valueStr)
  }
  return parseScalar(valueStr)
}

function parseInlineArray(valueStr) {
  const inner = valueStr.slice(1, -1)
  if (!inner.trim()) return []
  const items = []
  let buf = ''
  let inQuote = null
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i]
    if (inQuote) {
      buf += ch
      if (ch === inQuote) inQuote = null
      continue
    }
    if (ch === '"' || ch === "'") {
      inQuote = ch
      buf += ch
      continue
    }
    if (ch === ',') {
      const v = buf.trim()
      if (v !== '') items.push(parseScalar(v))
      buf = ''
      continue
    }
    buf += ch
  }
  const tail = buf.trim()
  if (tail !== '') items.push(parseScalar(tail))
  return items
}

function parseScalar(value) {
  const trimmed = String(value).trim()
  if (trimmed === '') return ''
  if (trimmed === 'null' || trimmed === '~') return null
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1)
  }
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed)
  if (/^-?\d+\.\d+$/.test(trimmed)) return Number(trimmed)
  return trimmed
}

export function stripFrontmatter(markdown) {
  return parseFrontmatter(markdown).content
}