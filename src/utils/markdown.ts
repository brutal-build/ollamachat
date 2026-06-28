import { marked, Renderer } from 'marked'
import hljs from 'highlight.js'

// Custom renderer to add language label on code blocks
const renderer = new Renderer()

renderer.code = function ({ text, lang }: { text: string; lang?: string }): string {
  let highlighted: string
  if (lang && hljs.getLanguage(lang)) {
    try {
      highlighted = hljs.highlight(text, { language: lang }).value
    } catch {
      highlighted = text
    }
  } else {
    try {
      highlighted = hljs.highlightAuto(text).value
    } catch {
      highlighted = text
    }
  }

  const langAttr = lang ? ` data-language="${lang}"` : ''
  return `<pre${langAttr}><code class="hljs language-${lang || 'plaintext'}">${highlighted}</code></pre>`
}

// Configure marked once with syntax highlighting
marked.setOptions({
  gfm: true,
  breaks: true,
})

export function renderMarkdown(content: string): string {
  try {
    return marked.parse(content, { renderer }) as string
  } catch {
    return content
  }
}
