import { useEffect, useRef } from 'react'
import type { Message } from '../../types/chat'
import MessageBubble from './MessageBubble'

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-[var(--text-muted)] text-lg font-mono mb-1">Ollamachat</div>
            <div className="text-[var(--text-muted-2)] text-xs font-mono">
              Start a conversation — type a message below
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
