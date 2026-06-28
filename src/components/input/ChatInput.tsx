import { useRef, useEffect } from 'react'
import StopButton from './StopButton'

interface ChatInputProps {
  onSend: (content: string) => void
  onStop: () => void
  isGenerating: boolean
}

export default function ChatInput({ onSend, onStop, isGenerating }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isGenerating && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isGenerating])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const sendMessage = () => {
    const value = textareaRef.current?.value?.trim()
    if (value && !isGenerating) {
      onSend(value)
      if (textareaRef.current) {
        textareaRef.current.value = ''
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 5 * 24) + 'px'
    }
  }

  return (
    <div className="border-t border-[var(--border-subtle)] p-3 bg-[var(--bg-primary)]">
      <div className="flex gap-2 items-end max-w-4xl mx-auto">
        <textarea
          ref={textareaRef}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Type a message... (Shift+Enter for new line)"
          className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] px-3 py-2.5 text-sm font-mono font-[var(--font-family)] placeholder:text-[var(--text-muted-2)] outline-none focus:border-[var(--border-color)] transition-colors duration-150"
          rows={1}
          disabled={isGenerating}
        />
        {isGenerating ? (
          <StopButton onStop={onStop} />
        ) : (
          <button
            onClick={sendMessage}
            className="border border-[var(--border-color)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] text-[var(--text-muted)] px-4 py-2.5 text-sm font-mono font-[var(--font-family)] transition-all duration-150 shrink-0"
          >
            [ SEND ]
          </button>
        )}
      </div>
    </div>
  )
}
