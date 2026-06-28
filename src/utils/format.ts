export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function truncateTitle(title: string, maxLen = 40): string {
  if (title.length <= maxLen) return title
  return title.slice(0, maxLen) + '...'
}
