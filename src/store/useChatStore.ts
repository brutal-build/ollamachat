import type {
  Message,
  Conversation,
  ConnectionStatus,
  OllamaConfig,
  OllamaModel,
  ChatState,
  ThemeId,
} from '../types/chat'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState = {
  connection: 'connecting' as ConnectionStatus,
  config: { baseUrl: 'http://localhost:11434', timeout: 30000 } as OllamaConfig,
  conversations: [] as Conversation[],
  activeConversationId: null as string | null,
  availableModels: [] as OllamaModel[],
  selectedModel: '',
  isGenerating: false,
  theme: 'brutalist' as ThemeId,
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setConfig: (config: Partial<OllamaConfig>) => {
        set((state) => ({
          config: { ...state.config, ...config },
        }))
      },

      setConnectionStatus: (status: ConnectionStatus) => {
        set({ connection: status })
      },

      setAvailableModels: (models: OllamaModel[]) => {
        set({ availableModels: models })
      },

      setSelectedModel: (model: string) => {
        set({ selectedModel: model })
      },

      setIsGenerating: (generating: boolean) => {
        set({ isGenerating: generating })
      },

      setTheme: (theme: ThemeId) => {
        set({ theme })
      },

      createConversation: (model?: string) => {
        const id = crypto.randomUUID()
        const now = Date.now()
        const conversation: Conversation = {
          id,
          title: 'New conversation',
          model: model ?? get().selectedModel,
          messages: [],
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({
          conversations: [...state.conversations, conversation],
          activeConversationId: id,
        }))
        return id
      },

      deleteConversation: (id: string) => {
        set((state) => {
          const conversations = state.conversations.filter((c) => c.id !== id)
          const activeConversationId =
            state.activeConversationId === id ? null : state.activeConversationId
          return { conversations, activeConversationId }
        })
      },

      switchConversation: (id: string) => {
        set({ activeConversationId: id })
      },

      addMessage: (conversationId: string, message: Message) => {
        set((state) => {
          const conversations = state.conversations.map((c) => {
            if (c.id !== conversationId) return c
            return {
              ...c,
              messages: [...c.messages, message],
              updatedAt: Date.now(),
            }
          })
          return { conversations }
        })
      },

      updateConversationTitle: (conversationId: string, title: string) => {
        set((state) => {
          const conversations = state.conversations.map((c) => {
            if (c.id !== conversationId) return c
            return { ...c, title, updatedAt: Date.now() }
          })
          return { conversations }
        })
      },

      updateLastAssistantMessage: (
        conversationId: string,
        content: string,
        done?: boolean,
      ) => {
        set((state) => {
          const conversations = state.conversations.map((c) => {
            if (c.id !== conversationId) return c

            const messages = [...c.messages]
            // Find the last assistant message that is not done
            const lastIndex = messages.length - 1
            if (lastIndex < 0) return c

            for (let i = lastIndex; i >= 0; i--) {
              const msg = messages[i]
              if (msg.role === 'assistant' && !msg.done) {
                const updatedMessage: Message = {
                  ...msg,
                  content: msg.content + content,
                  ...(done !== undefined ? { done } : {}),
                }
                messages[i] = updatedMessage
                break
              }
            }

            return {
              ...c,
              messages,
              updatedAt: Date.now(),
            }
          })
          return { conversations }
        })
      },

      checkConnection: async () => {
        const { config } = get()
        set({ connection: 'connecting' })
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), config.timeout)
          const response = await fetch(config.baseUrl, {
            signal: controller.signal,
          })
          clearTimeout(timeoutId)
          if (response.ok) {
            set({ connection: 'connected' })
          } else {
            set({ connection: 'error' })
          }
        } catch {
          set({ connection: 'disconnected' })
        }
      },
    }),
    {
      name: 'ollamachat-storage',
      partialize: (state) => ({
        config: state.config,
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        selectedModel: state.selectedModel,
        theme: state.theme,
      }),
    },
  ),
)
