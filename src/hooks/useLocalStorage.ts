import { useCallback } from 'react'
import type { Conversation } from '../types/chat'

const STORAGE_KEY = 'ollamachat-storage'

export function useLocalStorage() {
  const exportConversations = useCallback((): Conversation[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return parsed?.state?.conversations || []
    } catch {
      return []
    }
  }, [])

  const importConversations = useCallback(
    (conversations: Conversation[]): boolean => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return false
        const parsed = JSON.parse(raw)
        const existing = parsed?.state?.conversations || []
        const merged = [...existing, ...conversations]
        // Deduplicate by id
        const unique = merged.filter(
          (c: Conversation, i: number, arr: Conversation[]) =>
            arr.findIndex((x) => x.id === c.id) === i,
        )
        parsed.state.conversations = unique
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
        window.dispatchEvent(new Event('storage'))
        return true
      } catch {
        return false
      }
    },
    [],
  )

  const exportAsJson = useCallback((): string => {
    const conversations = exportConversations()
    return JSON.stringify(conversations, null, 2)
  }, [exportConversations])

  const importFromJson = useCallback(
    (json: string): { success: boolean; count: number } => {
      try {
        const conversations = JSON.parse(json) as Conversation[]
        if (!Array.isArray(conversations)) {
          return { success: false, count: 0 }
        }
        const ok = importConversations(conversations)
        return { success: ok, count: conversations.length }
      } catch {
        return { success: false, count: 0 }
      }
    },
    [importConversations],
  )

  const downloadBackup = useCallback((): void => {
    const json = exportAsJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ollamachat-backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [exportAsJson])

  return {
    exportConversations,
    importConversations,
    exportAsJson,
    importFromJson,
    downloadBackup,
  }
}
