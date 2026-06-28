import { useChatStore } from '../../store/useChatStore'

export default function ModelSelector() {
  const models = useChatStore((s) => s.availableModels)
  const selectedModel = useChatStore((s) => s.selectedModel)
  const setSelectedModel = useChatStore((s) => s.setSelectedModel)

  if (models.length === 0) {
    return (
      <select
        disabled
        className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-muted)] px-2 py-1 text-[10px] font-mono"
      >
        <option>No models</option>
      </select>
    )
  }

  return (
    <select
      value={selectedModel}
      onChange={(e) => setSelectedModel(e.currentTarget.value)}
      className="bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-muted)] px-2 py-1 text-[10px] font-mono cursor-pointer hover:border-[var(--border-color)] transition-colors duration-150"
    >
      {models.map((model) => (
        <option key={model.name} value={model.name}>
          {model.name}
        </option>
      ))}
    </select>
  )
}
