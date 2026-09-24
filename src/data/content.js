import pluginIndex from '../../data/plugins.json'
import guideIndex from '../../data/guides.json'

export const contentEntries = [
  ...guideIndex.map(item => ({ ...item, type: '教程', to: '/guide/' + item.id, keywords: [item.name, item.description, ...(item.tags || [])].join(' ') })),
  ...pluginIndex.map(item => ({ ...item, type: '插件', to: '/plugin/' + item.id, keywords: [item.name, item.description, item.category, ...(item.tags || []), ...(item.sections || []).map(section => section.name)].filter(Boolean).join(' ') }))
]

export function searchContent(query) {
  const tokens = String(query || '').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  if (!tokens.length) return contentEntries
  return contentEntries.filter(item => {
    const haystack = item.keywords.toLocaleLowerCase()
    return tokens.every(token => haystack.includes(token))
  })
}
