import { useEffect, useCallback, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { checkOllamaConnection, fetchModels } from '../api/ollama'
import { HEARTBEAT_INTERVAL } from '../utils/constants'

export function useOllamaConnection() {
  const { config, setConnectionStatus, setAvailableModels, setSelectedModel, connection } = useChatStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isChecking = connection === 'connecting'

  const connect = useCallback(async () => {
    setConnectionStatus('connecting')
    try {
      const connected = await checkOllamaConnection(config.baseUrl)
      if (connected) {
        setConnectionStatus('connected')
        const models = await fetchModels(config.baseUrl)
        setAvailableModels(models)
        if (models.length > 0) {
          const store = useChatStore.getState()
          if (!store.selectedModel) {
            setSelectedModel(models[0].name)
          }
        }
      } else {
        setConnectionStatus('disconnected')
      }
    } catch {
      setConnectionStatus('disconnected')
    }
  }, [config.baseUrl, setConnectionStatus, setAvailableModels, setSelectedModel])

  useEffect(() => {
    connect()
    intervalRef.current = setInterval(connect, HEARTBEAT_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [connect])

  return {
    isConnected: connection === 'connected',
    isChecking,
    error: connection === 'error' ? 'Connection error' : connection === 'disconnected' ? 'Ollama is not running' : null,
    reconnect: connect,
  }
}
