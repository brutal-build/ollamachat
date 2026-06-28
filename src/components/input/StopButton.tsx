interface StopButtonProps {
  onStop: () => void
}

export default function StopButton({ onStop }: StopButtonProps) {
  return (
    <button
      onClick={onStop}
      className="border border-[var(--border-color)] hover:border-red-500/60 hover:text-red-400 text-[var(--text-muted)] px-4 py-2.5 text-sm font-mono font-[var(--font-family)] transition-all duration-150 shrink-0"
    >
      [ STOP ]
    </button>
  )
}
