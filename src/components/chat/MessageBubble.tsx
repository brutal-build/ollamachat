import { useMemo } from 'react'
import type { Message } from '../../types/chat'
import { formatTime } from '../../utils/format'
import { renderMarkdown } from '../../utils/markdown'

// Note: marked is configured once in utils/markdown.ts

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  const renderedHtml = useMemo(() => {
    if (isUser || isSystem) return null
    return renderMarkdown(message.content)
  }, [message.content, isUser, isSystem])

  if (isSystem) {
    return (
      <div className="flex justify-center px-4 py-2">
        <div className="text-xs text-[var(--text-muted)] italic max-w-lg text-center">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-4 py-2`}>
      <div
        className={`max-w-[80%] min-w-0 ${
          isUser
            ? 'bg-[var(--bg-tertiary)] border border-[var(--border-color)]'
            : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)]'
        }`}
      >
        <div className={`px-3 pt-2 pb-1 text-xs font-mono font-[var(--font-family)] ${
          isUser ? 'text-[var(--text-muted)]' : 'text-[var(--text-muted)]'
        }`}>
          {isUser ? '[ YOU ]' : '[ ASSISTANT ]'}
        </div>

        {/* Content */}
        <div className={`px-3 pb-2 text-sm font-mono font-[var(--font-family)] prose prose-invert max-w-none ${
          isUser ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'
        }`}>
          {isUser ? (
            <div className="whitespace-pre-wrap break-words leading-relaxed">
              {message.content || (
                <span className="text-[var(--text-muted)] italic">Empty message</span>
              )}
            </div>
          ) : renderedHtml ? (
            <div
              className="markdown-content leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          ) : (
            <span className="text-[var(--text-muted)] italic">Empty response</span>
          )}
        </div>

        <div className="px-3 pb-2 text-[10px] text-[var(--text-muted)] text-right font-mono font-[var(--font-family)]">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
}
