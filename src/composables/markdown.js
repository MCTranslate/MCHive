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
  const codeBlocks = []
  html = html.replace(/```([\w-]*)\n([\s\S]*?)```/g, (_, language, code) => {
    const index = codeBlocks.length
    const safeLanguage = language || 'text'
    const body = code.replace(/[\s]+$/, '')
    codeBlocks.push(`<pre class="code-block"><div class="code-toolbar"><span>${safeLanguage}</span><button type="button" data-copy-code aria-label="复制代码">复制</button></div><code class="lang-${safeLanguage}">${body}</code></pre>`)
    return `\n__CODE_BLOCK_${index}__\n`
  })

  const inlineCodes = []
  html = html.replace(/`([^`\n]+)`/g, (_, code) => {
    const index = inlineCodes.push(`<code>${code}</code>`) - 1
    return `__INLINE_CODE_${index}__`
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
  html = html.replace(/^(?:&gt;\s?)+(.+)$/gm, '<blockquote>$1</blockquote>')

  html = html.replace(/((?:^\|.+\|\s*\n?)+)/gm, match => {
    const rows = match.trim().split('\n').filter(line => line.trim())
    if (rows.length < 2) return match
    const cells = row => row.split('|').slice(1, -1).map(cell => cell.trim())
    const header = cells(rows[0]).map(cell => `<th>${cell}</th>`).join('')
    const body = rows.slice(2).filter(row => !/^\|[\s\-:|]+\|$/.test(row)).map(row => `<tr>${cells(row).map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')
    return `<table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`
  })

  html = html.replace(/(^[\s]*[-*]\s+[^\n]+\n?)+/gm, match => `<ul>${match.trim().split('\n').map(item => `<li>${item.replace(/^\s*[-*]\s+/, '')}</li>`).join('')}</ul>`)
  html = html.replace(/(^[\s]*\d+\.\s+[^\n]+\n?)+/gm, match => `<ol>${match.trim().split('\n').map(item => `<li>${item.replace(/^\s*\d+\.\s+/, '')}</li>`).join('')}</ol>`)
  html = html.replace(/^---+[\s]*$/gm, '<hr>')
  html = html.replace(/^((?!<[a-z/]).+)$/gm, match => {
    const trimmed = match.trim()
    if (!trimmed) return ''
    if (/^<(h[1-6]|pre|table|ul|ol|blockquote|hr)/.test(trimmed) || /^__(CODE_BLOCK|INLINE_CODE)_\d+__$/.test(trimmed)) return trimmed
    return `<p>${trimmed}</p>`
  })

  html = html.replace(/__CODE_BLOCK_(\d+)__/g, (_, index) => codeBlocks[Number(index)] || '')
  html = html.replace(/__INLINE_CODE_(\d+)__/g, (_, index) => inlineCodes[Number(index)] || '')
  return html.replace(/\n{3,}/g, '\n\n')
}

function safeHref(value) {
  const decoded = value.replace(/&amp;/g, '&').trim()
  if (/^(https?:|mailto:|#|\/|\.\/|\.\.\/)/i.test(decoded)) return escapeAttribute(decoded)
  return ''
}

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}
