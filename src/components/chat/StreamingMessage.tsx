import { useMemo } from 'react'
import { renderMarkdown } from '../../utils/markdown'

interface StreamingMessageProps {
  content: string
}

export default function StreamingMessage({ content }: StreamingMessageProps) {
  const renderedHtml = useMemo(() => {
    if (!content) return ''
    return renderMarkdown(content)
  }, [content])

  return (
    <div className="flex justify-start px-4 py-2 border-t border-[var(--border-subtle)]">
      <div className="max-w-[80%] min-w-0 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
        <div className="px-3 pt-2 pb-1 text-xs font-mono font-[var(--font-family)] text-[var(--text-muted)]">
          [ ASSISTANT ]
        </div>
        <div className="px-3 pb-2 text-sm font-mono prose prose-invert max-w-none">
          {renderedHtml ? (
            <div
              className="markdown-content leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          ) : (
            <span className="text-[var(--text-muted)] italic">Thinking...</span>
          )}
          <span className="inline-block w-2 h-4 bg-[var(--text-primary)] ml-0.5 animate-pulse align-middle" />
        </div>
      </div>
    </div>
  )
}
