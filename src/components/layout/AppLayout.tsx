import { useState, type ReactNode } from 'react'
import { useChatStore } from '../../store/useChatStore'
import Sidebar from './Sidebar'
import Header from './Header'
import ConnectionSetup from '../connection/ConnectionSetup'

export default function AppLayout({ children }: { children: ReactNode }) {
  const connection = useChatStore((s) => s.connection)
  const theme = useChatStore((s) => s.theme)
  const isDisconnected = connection === 'disconnected' || connection === 'error'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)
  const toggleSidebar = () => setSidebarOpen((v) => !v)

  return (
    <div
      data-theme={theme}
      className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono font-[var(--font-family)] overflow-hidden"
    >
      {/* Desktop sidebar — always visible in normal flex flow */}
      <div className="hidden md:flex shrink-0">
        <Sidebar onNavigate={closeSidebar} />
      </div>

      {/* Mobile sidebar — fixed overlay, slides in/out */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/60"
          onClick={closeSidebar}
        />
      )}
      <div
        className={`fixed md:hidden z-50 top-0 left-0 h-screen transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onNavigate={closeSidebar} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col border-l-2 border-[var(--border-subtle)] min-w-0 min-h-0">
        <Header onToggleSidebar={toggleSidebar} />
        {isDisconnected ? (
          <div className="flex-1 flex items-center justify-center">
            <ConnectionSetup />
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">{children}</div>
        )}
      </div>
    </div>
  )
}
