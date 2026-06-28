export type ThemeId = 'brutalist' | 'macos-dark' | 'nord' | 'dracula' | 'terminal'

export interface ThemeDefinition {
  id: ThemeId
  label: string
  description: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  model?: string
  done?: boolean
}

export interface Conversation {
  id: string
  title: string
  model: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface OllamaConfig {
  baseUrl: string
  timeout: number
}

export interface OllamaModel {
  name: string
  modifiedAt: string
  size: number
}

export interface OllamaChatChunk {
  model: string
  createdAt: string
  message: {
    role: 'assistant'
    content: string
  }
  done: boolean
  doneReason?: string
  totalDuration?: number
  loadDuration?: number
  promptEvalCount?: number
  evalCount?: number
}

export interface OllamaChatRequest {
  model: string
  messages: Array<{ role: string; content: string }>
  stream: boolean
  options?: {
    temperature?: number
    top_p?: number
    top_k?: number
  }
}

export interface ChatState {
  connection: ConnectionStatus
  config: OllamaConfig
  conversations: Conversation[]
  activeConversationId: string | null
  availableModels: OllamaModel[]
  selectedModel: string
  isGenerating: boolean
  theme: ThemeId
  setConfig: (config: Partial<OllamaConfig>) => void
  setConnectionStatus: (status: ConnectionStatus) => void
  setAvailableModels: (models: OllamaModel[]) => void
  setSelectedModel: (model: string) => void
  setIsGenerating: (generating: boolean) => void
  setTheme: (theme: ThemeId) => void
  createConversation: (model?: string) => string
  deleteConversation: (id: string) => void
  switchConversation: (id: string) => void
  addMessage: (conversationId: string, message: Message) => void
  updateConversationTitle: (conversationId: string, title: string) => void
  updateLastAssistantMessage: (conversationId: string, content: string, done?: boolean) => void
  checkConnection: () => Promise<void>
}
