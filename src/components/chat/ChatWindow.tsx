import { useRef, useEffect } from 'react'
import { useChatStore } from '../../store/useChatStore'
import { useChatStream } from '../../hooks/useChatStream'
import MessageList from './MessageList'
import StreamingMessage from './StreamingMessage'
import ChatInput from '../input/ChatInput'

export default function ChatWindow() {
  const activeId = useChatStore((s) => s.activeConversationId)
  const conversation = useChatStore((s) =>
    s.conversations.find((c) => c.id === s.activeConversationId)
  )
  const { sendMessage, stopGeneration, isGenerating } = useChatStream()

  const messages = conversation?.messages || []

  // Complete messages (only finished ones — exclude any in-progress streaming)
  const completeMessages = messages.filter(
    (m) => !(m.role === 'assistant' && !m.done)
  )

  // Find streaming message (the one still in progress)
  const streamingMessage = messages.find(
    (m) => m.role === 'assistant' && !m.done
  )
  const streamingContent = streamingMessage?.content || ''

  // Show streaming container if there's an active streaming message
  const showStreaming = !!streamingMessage

  // Auto-scroll during streaming
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [streamingContent, completeMessages.length])

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-primary)]">
      {!activeId ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[var(--text-muted)] text-lg font-mono mb-1">Ollamachat</div>
            <div className="text-[var(--text-muted-2)] text-xs font-mono">
              Select a conversation or create a new one
            </div>
          </div>
        </div>
      ) : (
        <>
          <MessageList messages={completeMessages} />
          {showStreaming && <StreamingMessage content={streamingContent} />}
          <div ref={bottomRef} />
          <ChatInput
            onSend={sendMessage}
            onStop={stopGeneration}
            isGenerating={isGenerating}
          />
        </>
      )}
    </div>
  )
}
