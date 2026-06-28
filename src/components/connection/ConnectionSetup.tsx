import { useState } from 'react'
import { useChatStore } from '../../store/useChatStore'
import { DEFAULT_OLLAMA_URL } from '../../utils/constants'

export default function ConnectionSetup() {
  const [url, setUrl] = useState(DEFAULT_OLLAMA_URL)
  const checkConnection = useChatStore((s) => s.checkConnection)
  const setConfig = useChatStore((s) => s.setConfig)
  const connection = useChatStore((s) => s.connection)

  const handleConnect = async () => {
    setConfig({ baseUrl: url })
    await checkConnection()
  }

  const isLoading = connection === 'connecting'

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto px-4">
      <div className="text-center">
        <div className="text-xl font-mono mb-2 text-[var(--text-primary)]">Ollamachat</div>
        <div className="text-xs text-[var(--text-muted)] font-mono">
          Connect to your local Ollama instance
        </div>
      </div>

      <div className="w-full space-y-3">
        <div>
          <label className="text-[10px] text-[var(--text-muted)] font-mono block mb-1">Ollama URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.currentTarget.value)}
            placeholder="http://localhost:11434"
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] px-3 py-2 text-sm font-mono font-[var(--font-family)] outline-none focus:border-[var(--border-color)] transition-colors duration-150"
          />
        </div>

        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full border border-[var(--border-color)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] disabled:opacity-40 text-[var(--text-muted)] px-4 py-2 text-sm font-mono font-[var(--font-family)] transition-all duration-150"
        >
          {isLoading ? '[ CONNECTING... ]' : '[ CONNECT ]'}
        </button>

        {connection === 'disconnected' && (
          <div className="text-[10px] text-[var(--text-muted)] text-center font-mono">
            Cannot connect. Make sure Ollama is running with OLLAMA_ORIGINS=*
          </div>
        )}
      </div>
    </div>
  )
}
