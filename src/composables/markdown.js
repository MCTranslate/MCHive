/**
 * Markdown 子集转 HTML
 * 覆盖常用语法：标题、加粗、斜体、行内代码、代码块、链接、表格、列表、引用
 */

export function parseMarkdown(md) {
  if (!md) return ''

  var html = md

  // 0. 先保护代码块，避免被后续规则处理
  var codeBlocks = []
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, function(_, lang, code) {
    var idx = codeBlocks.length
    var escaped = escapeHtml(code.replace(/[\s]+$/, ''))
    codeBlocks.push(
      '<pre><code class="lang-' + lang + '">' + escaped + '</code></pre>'
    )
    return '__CODE_BLOCK_' + idx + '__'
  })

  // 保护行内代码
  var inlineCodes = []
  html = html.replace(/`([^`\n]+)`/g, function(_, code) {
    var idx = inlineCodes.length
    inlineCodes.push('<code>' + escapeHtml(code) + '</code>')
    return '__INLINE_CODE_' + idx + '__'
  })

  // 1. 标题（h4-h1，从长到短依次匹配）
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // 2. 加粗 & 斜体
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // 3. 链接
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>'
  )

  // 4. 引用块
  html = html.replace(/^(?:&gt;|&gt;|>)\s+(.+)$/gm, '<blockquote>$1</blockquote>')

  // 5. 表格
  html = html.replace(/((?:^\|.+\|\s*\n?)+)/gm, function(match) {
    var rows = match.trim().split('\n').filter(function(l) { return l.trim() })
    if (rows.length < 2) return match

    var tableHtml = '<table><thead><tr>'
    var headerCells = rows[0].split('|').filter(function(c) { return c.trim() })
    headerCells.forEach(function(cell) {
      tableHtml += '<th>' + escapeHtml(cell.trim()) + '</th>'
    })
    tableHtml += '</tr></thead><tbody>'

    for (var i = 2; i < rows.length; i++) {
      if (rows[i].match(/^\|[\s\-|:]+\|$/)) continue
      tableHtml += '<tr>'
      var cells = rows[i].split('|').slice(1, -1).map(function(c) { return c.trim() })
      cells.forEach(function(cell) {
        tableHtml += '<td>' + escapeHtml(cell) + '</td>'
      })
      tableHtml += '</tr>'
    }

    tableHtml += '</tbody></table>'
    return tableHtml
  })

  // 6. 无序列表
  html = html.replace(/(^(?:[\s]*[-*][^\n]+)\n?)+/gm, function(match) {
    var items = match.trim().split('\n')
    var ul = '<ul>'
    items.forEach(function(item) {
      ul += '<li>' + item.replace(/^\s*[-*]\s+/, '') + '</li>'
    })
    ul += '</ul>'
    return ul
  })

  // 7. 有序列表
  html = html.replace(/(^(?:[\s]*\d+\.[^\n]+)\n?)+/gm, function(match) {
    var items = match.trim().split('\n')
    var ol = '<ol>'
    items.forEach(function(item) {
      ol += '<li>' + item.replace(/^\s*\d+\.\s+/, '') + '</li>'
    })
    ol += '</ol>'
    return ol
  })

  // 8. 分隔线
  html = html.replace(/^---+[\s]*$/gm, '<hr/>')

  // 9. 段落（兜底处理）
  html = html.replace(/^((?!<[a-z/]).+)$/gm, function(match) {
    var trimmed = match.trim()
    if (!trimmed) return ''
    if (/^<(h[1-6]|pre|table|ul|ol|blockquote|hr)/.test(trimmed)) return trimmed
    return '<p>' + trimmed + '</p>'
  })

  // 10. 恢复代码块占位符
  html = html.replace(/__CODE_BLOCK_(\d+)__/g, function(_, idx) {
    return codeBlocks[parseInt(idx)]
  })
  html = html.replace(/__INLINE_CODE_(\d+)__/g, function(_, idx) {
    return inlineCodes[parseInt(idx)]
  })

  // 11. 清理多余空行
  html = html.replace(/\n{3,}/g, '\n\n')

  return html
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
