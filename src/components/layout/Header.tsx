import ModelSelector from '../settings/ModelSelector'
import ConnectionStatus from '../connection/ConnectionStatus'
import { useChatStore } from '../../store/useChatStore'

interface HeaderProps {
  onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const createConversation = useChatStore((s) => s.createConversation)

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="md:hidden border border-[var(--border-color)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] px-2 py-1 text-xs font-mono font-[var(--font-family)] transition-all duration-150 text-[var(--text-muted)]"
          style={{ borderRadius: 'var(--radius)' }}
          aria-label="Toggle sidebar"
        >
          [ = ]
        </button>
        <ConnectionStatus />
        <span className="text-xs text-[var(--text-muted)] font-mono font-[var(--font-family)] hidden sm:inline">Ollamachat</span>
        <ModelSelector />
      </div>
      <button
        onClick={() => createConversation()}
        className="border border-[var(--border-color)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] text-[var(--text-muted)] px-3 py-1 text-xs font-mono font-[var(--font-family)] transition-all duration-150"
        style={{ borderRadius: 'var(--radius)' }}
      >
        [ + NEW ]
      </button>
    </div>
  )
}
