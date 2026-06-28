import type { ThemeId, ThemeDefinition } from '../types/chat'

export const themes: ThemeDefinition[] = [
  {
    id: 'brutalist',
    label: 'Brutalist',
    description: 'Black, white, monospace — zero compromise',
  },
  {
    id: 'macos-dark',
    label: 'macOS Dark',
    description: 'Dark grey, system font, rounded edges',
  },
  {
    id: 'nord',
    label: 'Nord',
    description: 'Frosty blue-grey palette',
  },
  {
    id: 'dracula',
    label: 'Dracula',
    description: 'Deep purple with warm accents',
  },
  {
    id: 'terminal',
    label: 'Terminal',
    description: 'Green phosphor on black — retro CRT',
  },
]

export function getTheme(id: ThemeId): ThemeDefinition {
  return themes.find((t) => t.id === id) || themes[0]
}
