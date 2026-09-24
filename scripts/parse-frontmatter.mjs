// Re-export the canonical frontmatter parser so Node build/validate scripts
// share the exact same implementation as the Vue runtime.
//
// Keep this file thin: any logic change belongs in src/composables/frontmatter.js.
export { parseFrontmatter, stripFrontmatter } from '../src/composables/frontmatter.js'