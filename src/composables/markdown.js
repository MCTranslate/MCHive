/**
 * Small dependency-free Markdown subset for repository-authored content.
 * Raw HTML is escaped before markup is generated; links are restricted to safe schemes.
 *
 * The optional YAML frontmatter block at the very top of the input
 * (delimited by `---` fences) is stripped before markdown parsing so it never
 * leaks into the rendered HTML. See `./frontmatter.js` for the parser.
 */
import { parseFrontmatter } from './frontmatter.js'

export function parseMarkdown(markdown) {
  if (!markdown) return ''

  const { content } = parseFrontmatter(markdown)
  let html = escapeHtml(content)

  // 占位符哨兵在正文中绝不可能出现（含 NUL，且会按需加长直到确认无冲突），
  // 因此正文里恰好写出的 `__CODE_BLOCK_0__` 之类字面量不会再被当成占位符替换掉，
  // 也就不会出现「正文被静默吞掉 / 被替换成别处代码块」的问题。
  const sentinel = pickSentinel(html)
  const placeholder = (kind, index) => `${sentinel}${kind}${index}${sentinel}`
  const codeBlockRef = new RegExp(`${escapeRegExp(sentinel)}CB(\\d+)${escapeRegExp(sentinel)}`, 'g')
  const inlineCodeRef = new RegExp(`${escapeRegExp(sentinel)}IC(\\d+)${escapeRegExp(sentinel)}`, 'g')
  const quotedTableRef = new RegExp(`${escapeRegExp(sentinel)}QT(\\d+)${escapeRegExp(sentinel)}`, 'g')
  const placeholderLine = new RegExp(`^${escapeRegExp(sentinel)}(?:CB|IC|QT)\\d+${escapeRegExp(sentinel)}$`)

  const codeBlocks = []
  html = html.replace(/```([\w-]*)\n([\s\S]*?)```/g, (_, language, code) => {
    const index = codeBlocks.length
    const safeLanguage = language || 'text'
    const body = code.replace(/[\s]+$/, '')
    codeBlocks.push(`<pre class="code-block"><div class="code-toolbar"><span>${safeLanguage}</span><button type="button" data-copy-code aria-label="复制代码">复制</button></div><code class="lang-${safeLanguage}">${body}</code></pre>`)
    return `\n${placeholder('CB', index)}\n`
  })

  const inlineCodes = []
  html = html.replace(/`([^`\n]+)`/g, (_, code) => {
    const index = inlineCodes.push(`<code>${code}</code>`) - 1
    return placeholder('IC', index)
  })

  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, href) => {
    const target = safeHref(href)
    return target ? `<a href="${target}" target="_blank" rel="noopener noreferrer">${label}</a>` : label
  })

  // 引用块内的表格：形如
  //   &gt; | 概念 | 含义 |
  //   &gt; |------|------|
  //   &gt; | TPS  | ...  |
  // 必须在「引用块 → blockquote」之前处理，否则每一行会各自变成独立 blockquote，
  // 表格永远匹配不到（行首已不是 `|`）。这里先摘出来生成真实 table，
  // 再用哨兵占位，最后随 blockquote 一起还原。
  const quotedTables = []
  html = html.replace(/(?:^&gt;\s*\|.*\|\s*$\n?)+/gm, match => {
    const rows = match.split('\n')
      .map(line => line.replace(/^&gt;\s*/, '').trim())
      .filter(line => line)
    if (rows.length < 2) return match
    const cells = row => row.split('|').slice(1, -1).map(cell => cell.trim())
    const header = cells(rows[0]).map(cell => `<th>${cell}</th>`).join('')
    const body = rows.slice(2)
      .filter(row => !/^\|[\s\-:|]+\|$/.test(row))
      .map(row => `<tr>${cells(row).map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')
    const index = quotedTables.length
    quotedTables.push(`<table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`)
    return `${sentinel}QT${index}${sentinel}\n`
  })

  html = html.replace(/^(?:&gt;\s?)+(.+)$/gm, '<blockquote>$1</blockquote>')

  html = html.replace(/((?:^\|.+\|\s*\n?)+)/gm, match => {
    const rows = match.trim().split('\n').filter(line => line.trim())
    if (rows.length < 2) return match
    const cells = row => row.split('|').slice(1, -1).map(cell => cell.trim())
    const header = cells(rows[0]).map(cell => `<th>${cell}</th>`).join('')
    const body = rows.slice(2).filter(row => !/^\|[\s\-:|]+\|$/.test(row)).map(row => `<tr>${cells(row).map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')
    return `<table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`
  })

  html = html.replace(/^[-*] \[ \] (.+)$/gm, '<label class=\"task-item\"><input type=\"checkbox\" disabled> $1</label>')
  html = html.replace(/^[-*] \[x\] (.+)$/gim, '<label class=\"task-item\"><input type=\"checkbox\" checked disabled> $1</label>')
  html = html.replace(/(^[\s]*[-*]\s+[^\n]+\n?)+/gm, match => `<ul>${match.trim().split('\n').map(item => `<li>${item.replace(/^\s*[-*]\s+/, '')}</li>`).join('')}</ul>`)
  html = html.replace(/(^[\s]*\d+\.\s+[^\n]+\n?)+/gm, match => `<ol>${match.trim().split('\n').map(item => `<li>${item.replace(/^\s*\d+\.\s+/, '')}</li>`).join('')}</ol>`)
  html = html.replace(/^[-*_]{3,}[\s]*$/gm, '<hr>')
  html = html.replace(/^((?!<[a-z/]).+)$/gm, match => {
    const trimmed = match.trim()
    if (!trimmed) return ''
    if (/^<(h[1-6]|pre|table|ul|ol|blockquote|hr)/.test(trimmed) || placeholderLine.test(trimmed)) return trimmed
    return `<p>${trimmed}</p>`
  })

  html = html.replace(codeBlockRef, (_, index) => codeBlocks[Number(index)] || '')
  html = html.replace(quotedTableRef, (_, index) => quotedTables[Number(index)] || '')
  html = html.replace(inlineCodeRef, (_, index) => inlineCodes[Number(index)] || '')
  return html.replace(/\n{3,}/g, '\n\n')
}

function pickSentinel(text) {
  let sentinel = '\u0000'
  while (text.includes(sentinel)) sentinel += '\u0000'
  return sentinel
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function safeHref(value) {
  const decoded = value.replace(/&amp;/g, '&').trim()
  // 协议相对地址（//host、/\host、\host）会被浏览器当成外部站点，一律拒绝
  if (/^[\\/]{2}/.test(decoded) || /^\\/.test(decoded)) return ''
  if (/^(https?:|mailto:|#|\/|\.\/|\.\.\/)/i.test(decoded)) return escapeAttribute(decoded)
  return ''
}

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}
