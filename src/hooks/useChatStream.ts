import { useCallback, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { streamChat } from '../api/ollama'
import type { Message } from '../types/chat'

export function useChatStream() {
  const abortRef = useRef<AbortController | null>(null)
  const isGenerating = useChatStore((s) => s.isGenerating)

  const sendMessage = useCallback(async (content: string) => {
    const state = useChatStore.getState()
    let conversationId = state.activeConversationId

    if (!conversationId) {
      conversationId = state.createConversation()
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    // Auto-title from first user message
    const conversation = useChatStore.getState().conversations.find(
      (c) => c.id === conversationId
    )
    if (conversation && conversation.messages.length === 0) {
      const title = content.length > 45 ? content.slice(0, 42) + '...' : content
      useChatStore.getState().updateConversationTitle(conversationId, title)
    }

    state.addMessage(conversationId, userMessage)

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      model: state.selectedModel,
      done: false,
    }

    state.addMessage(conversationId, assistantMessage)
    state.setIsGenerating(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const conversation = useChatStore.getState().conversations.find(
        (c) => c.id === conversationId
      )
      if (!conversation) throw new Error('Conversation not found')

      const messagesForApi = conversation.messages
        .filter((m) => m.id !== assistantMessage.id)
        .map((m) => ({ role: m.role, content: m.content }))

      const gen = streamChat(
        state.config.baseUrl,
        {
          model: state.selectedModel,
          messages: messagesForApi,
          stream: true,
        },
        controller.signal,
      )

      for await (const chunk of gen) {
        useChatStore.getState().updateLastAssistantMessage(
          conversationId,
          chunk.message.content,
          chunk.done,
        )
      }

      useChatStore.getState().setIsGenerating(false)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        useChatStore.getState().setIsGenerating(false)
        return
      }
      useChatStore.getState().setIsGenerating(false)
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      useChatStore.getState().updateLastAssistantMessage(
        conversationId,
        `\n\n[Error: ${errorMsg}]`,
        true,
      )
    }
  }, [])

  const stopGeneration = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
  }, [])

  return { sendMessage, stopGeneration, isGenerating }
}
