import { useState } from 'react'
import { useChatStore } from '../../store/useChatStore'
import { truncateTitle } from '../../utils/format'
import ThemeSettings from '../settings/ThemeSettings'

interface SidebarProps {
  onNavigate?: () => void
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const conversations = useChatStore((s) => s.conversations)
  const activeId = useChatStore((s) => s.activeConversationId)
  const switchConversation = useChatStore((s) => s.switchConversation)
  const deleteConversation = useChatStore((s) => s.deleteConversation)
  const createConversation = useChatStore((s) => s.createConversation)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt)

  const handleSwitch = (id: string) => {
    switchConversation(id)
    onNavigate?.()
  }

  const handleNew = () => {
    createConversation()
    onNavigate?.()
  }

  return (
    <>
      <div className="w-72 border-r border-[var(--border-subtle)] flex flex-col h-full bg-[var(--bg-primary)]">
        <div className="p-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-[var(--text-muted)] font-mono font-[var(--font-family)]">
              CONVERSATIONS
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="border border-[var(--border-subtle)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] text-[var(--text-muted)] p-1 transition-all duration-150"
              style={{ borderRadius: 'var(--radius)' }}
              title="Settings"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
          <button
            onClick={handleNew}
            className="w-full border border-[var(--border-color)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] text-[var(--text-secondary)] text-sm font-mono font-[var(--font-family)] px-4 py-2 transition-all duration-150"
            style={{ borderRadius: 'var(--radius)' }}
          >
            [ + NEW ]
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sorted.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleSwitch(conv.id)}
              className={`flex items-center justify-between px-3 py-2.5 cursor-pointer border-b border-[var(--border-subtle)] text-sm font-mono font-[var(--font-family)] transition-all duration-150 group ${
                conv.id === activeId
                  ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-l-2 border-l-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <span className="truncate flex-1 text-xs">
                {truncateTitle(conv.title)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteConversation(conv.id)
                }}
                className="ml-2 text-[var(--text-muted-2)] hover:text-[var(--text-muted)] border border-transparent hover:border-[var(--border-subtle)] px-1.5 py-0.5 text-[10px] font-mono transition-all duration-150 opacity-0 group-hover:opacity-100"
              >
                x
              </button>
            </div>
          ))}
          {sorted.length === 0 && (
            <div className="text-[var(--text-muted-2)] text-xs font-mono font-[var(--font-family)] text-center mt-8 px-4">
              No conversations
            </div>
          )}
        </div>
      </div>
      {settingsOpen && <ThemeSettings onClose={() => setSettingsOpen(false)} />}
    </>
  )
}
