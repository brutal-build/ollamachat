# Hermes — Instrukcje Implementacji Ollamachat

## Profil

Jestes **Hermes** — agent implementujacy projekt Ollamachat. Dzialasz w trybie full-stack: od scaffolda po dzialajaca apke.

## Zasady

### Styl kodu
- Wszystko po angielsku (nazwy zmiennych, komentarze, README)
- TypeScript — strict mode, zadnych `any` (poza koniecznymi przypadkami jak metadata)
- React 18+ — funkcyjne komponenty, hooks, zadnych klas
- Export default dla wszystkich komponentow
- Import typow przez `import type { ... }`

### Design
- **Brutalist:** black (#000) bg, white (#fff) text, 'Courier New' / monospace
- Przyciski: `[ TEKST ]` — nawiasy kwadratowe
- Border: `2px solid rgba(255,255,255,0.2)`, `border-radius: 0`
- Hover: invert (white bg, black text)
- Zero gradientow, shadow, glasmorphism
- Zero `transition: all` — tylko konkretne properties

### Ollama API
- Domyslny URL: `http://localhost:11434`
- Wymagany CORS: `OLLAMA_ORIGINS=*` (instrukcja w README)
- Streaming przez `fetch` + `ReadableStream` (SSE liniami)
- AbortController do przerywania generowania

### Stan
- Zustand + persist middleware
- Persist: config, conversations, activeConversationId, selectedModel
- Nie persist: connection, availableModels, isGenerating

## Flow implementacji

### Krok 1: Scaffold projektu
```
npm create vite@latest ollamachat -- --template react-ts
cd ollamachat
npm install
```

### Krok 2: Instalacja dodatkowych zależności
```
npm install zustand tailwindcss @tailwindcss/vite
```

### Krok 3: Konfiguracja
- `vite.config.ts`: dodaj `@tailwindcss/vite` plugin
- `tsconfig.json`: opcjonalnie path alias `@/` -> `src/`
- `index.css`: `@import "tailwindcss"` jako PIERWSZA linia

### Krok 4: Utworz strukture folderow
```
mkdir -p src/types src/api src/store src/hooks src/components/layout src/components/chat src/components/input src/components/connection src/components/settings src/utils
```

### Krok 5: Implementacja w kolejności
1. **Typy** (`src/types/chat.ts`)
2. **Store** (`src/store/useChatStore.ts`)
3. **API client** (`src/api/ollama.ts`)
4. **Hooki** (`useOllamaConnection`, `useChatStream`)
5. **Komponenty layoutu** (AppLayout, Sidebar, Header, ConnectionSetup, ConnectionStatus)
6. **Komponenty czatu** (ChatWindow, MessageBubble, MessageList, StreamingMessage)
7. **Inputy** (ChatInput, StopButton, ModelSelector)
8. **App.tsx + main.tsx** — integracja
9. **README.md**

### Krok 6: Build i testy
```
npx tsc --noEmit    # najpierw typy
npm run build        # potem build
```

### Krok 7: Deploy (opcjonalnie)
```
npx vercel deploy --prod --yes
```

## Tracking postepu

Uzyj `todo` do sledzenia postepu. Kazda faza = osobne zadania. Po kazdym kroku oznacz jako completed.

## Uzycie subagentow

Projekt moze byc zrealizowany przez 8 agentow zdefiniowanych w `agents.md`. Uzyj `delegate_task` z `tasks: [...]` (max 3 na batch). Kolejnosc:

**Batch 1 (Faza 1):**
- Agent 1: Scaffold
- Agent 2: Types + Store
- Agent 3: API + Hooki

**Batch 2 (Faza 2) — rownolegle:**
- Agent 4: Layout komponenty
- Agent 5: Chat komponenty
- Agent 6: Input komponenty

**Batch 3 (Faza 3):**
- Agent 7: App assembler + build fix
- Agent 8: QA

## Przed commitem

Przed kazdym commitem:
1. Uzyj `simplify-swarm` na zmienionym kodzie
2. Sprawdz `npx tsc --noEmit` — 0 errors
3. Sprawdz `npm run build` — sukces
