import { useState } from 'react'
import { useChatStore } from '../../store/useChatStore'
import { themes } from '../../utils/themes'
import type { ThemeId } from '../../types/chat'

interface ThemeSettingsProps {
  onClose: () => void
}

type SettingsTab = 'general' | 'data-controls'

export default function ThemeSettings({ onClose }: ThemeSettingsProps) {
  const currentTheme = useChatStore((s) => s.theme)
  const setTheme = useChatStore((s) => s.setTheme)
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')

  const handleSelect = (id: ThemeId) => {
    setTheme(id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Click-through backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative flex w-[640px] max-w-[90vw] h-[440px] rounded-2xl overflow-hidden pointer-events-auto"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 50px -8px rgba(0,0,0,0.6), 0 8px 20px -4px rgba(0,0,0,0.4)',
        }}
      >
        {/* Left column — navigation */}
        <div
          className="w-[200px] shrink-0 flex flex-col pt-4 gap-0.5 px-2"
          style={{
            background: 'var(--bg-tertiary)',
          }}
        >
          {/* General */}
          <button
            onClick={() => setActiveTab('general')}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-left w-full rounded-lg transition-all duration-150"
            style={{
              background: activeTab === 'general' ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === 'general' ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'general' ? 'inset 0 1px 2px rgba(0,0,0,0.15)' : 'none',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>General</span>
          </button>

          {/* Data controls */}
          <button
            onClick={() => setActiveTab('data-controls')}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-left w-full rounded-lg transition-all duration-150"
            style={{
              background: activeTab === 'data-controls' ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === 'data-controls' ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'data-controls' ? 'inset 0 1px 2px rgba(0,0,0,0.15)' : 'none',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <span>Data controls</span>
          </button>
        </div>

        {/* Right column — content */}
        <div
          className="flex-1 p-7 overflow-y-auto relative"
          style={{ borderLeft: '1px solid var(--border-subtle)' }}
        >
          {activeTab === 'general' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  General
                </h2>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors duration-150"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Appearance */}
              <div className="flex items-center justify-between py-3.5">
                <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Appearance
                </label>
                <select
                  value={currentTheme}
                  onChange={(e) => handleSelect(e.target.value as ThemeId)}
                  className="px-3.5 py-2 text-sm rounded-lg cursor-pointer appearance-none transition-all duration-150 hover:brightness-110"
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    minWidth: '150px',
                  }}
                >
                  {themes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div
                className="flex items-center justify-between py-3.5"
                style={{ borderTop: '1px solid var(--border-subtle)' }}
              >
                <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Language
                </label>
                <div
                  className="px-3.5 py-2 text-sm rounded-lg flex items-center gap-2 transition-all duration-150"
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    minWidth: '150px',
                  }}
                >
                  <span className="flex-1">Auto-detect</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </>
          )}

          {activeTab === 'data-controls' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Data controls
                </h2>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors duration-150"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Your chats and data are stored locally. No data is sent to external servers
                beyond your configured Ollama instance.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
