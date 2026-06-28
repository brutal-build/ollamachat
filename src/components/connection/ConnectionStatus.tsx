import { useChatStore } from '../../store/useChatStore'

export default function ConnectionStatus() {
  const connection = useChatStore((s) => s.connection)

  const colorMap = {
    'connecting': 'bg-yellow-500/80',
    'connected': 'bg-green-500/80',
    'disconnected': 'bg-red-500/80',
    'error': 'bg-red-500/80',
  }

  const labelMap = {
    'connecting': '...',
    'connected': 'OK',
    'disconnected': 'OFF',
    'error': 'ERR',
  }

  const color = colorMap[connection]
  const label = labelMap[connection]

  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 ${color}`} />
      <span className="text-[10px] text-[var(--text-muted)] font-mono">{label}</span>
    </div>
  )
}
