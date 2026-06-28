import type { OllamaChatRequest, OllamaChatChunk, OllamaModel } from '../types/chat'

export async function checkOllamaConnection(baseUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/`)
    return response.ok
  } catch {
    return false
  }
}

export async function fetchModels(baseUrl: string): Promise<OllamaModel[]> {
  const response = await fetch(`${baseUrl}/api/tags`)
  if (!response.ok) throw new Error(`Failed to fetch models: ${response.status}`)
  const data = await response.json()
  return data.models || []
}

export async function* streamChat(
  baseUrl: string,
  request: OllamaChatRequest,
  signal?: AbortSignal,
): AsyncGenerator<OllamaChatChunk> {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Ollama error ${response.status}: ${text}`)
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.trim()) {
        yield JSON.parse(line) as OllamaChatChunk
      }
    }
  }
}
