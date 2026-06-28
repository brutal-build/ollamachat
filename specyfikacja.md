# Ollamachat — Specyfikacja Techniczna

> Wersja: 1.0
> Stack: React 18+ / Vite 6+ / TypeScript / Tailwind CSS v4

---

## 1. Przeglad

Ollamachat to webowa aplikacja single-page (SPA), która laczy sie z lokalnym serwerem Ollama przez REST API i pozwala na chatowanie z modelami AI w interfejsie podobnym do ChatGPT.

**Kluczowe zalozenia:**
- Zero rejestracji, zero API kluczy — tylko dzialajaca Ollama na localhost:11434
- Wszystko dziala lokalnie, w przegladarce
- Responsywny design (mobile-friendly)
- Brak backendu — frontend laczy sie bezposrednio z Ollama API (CORS musi byc skonfigurowany po stronie Ollamy)

---

## 2. Flow uzytkownika

1. Uzytkownik otwiera apke w przegladarce
2. Aplikacja automatycznie probuje polaczyc sie z Ollama na `http://localhost:11434`
3. Jesli polaczenie udane — pobiera liste dostepnych modeli (`GET /api/tags`)
4. Jesli polaczenie nieudane — wyswietla ekran konfiguracji z polem na URL Ollamy i przyciskiem "Polacz"
5. Uzytkownik wybiera model z listy
6. Uzytkownik wpisuje wiadomosc w polu tekstowym i wysyla (Enter lub przycisk)
7. Aplikacja wysyla request do Ollamy (`POST /api/chat` z `stream: true`)
8. Odpowiedz jest streamowana SSE — kazdy chunk dokleja sie do ostatniej wiadomosci asystenta w czasie rzeczywistym
9. Uzytkownik moze w kazdej chwili przerwac generowanie (stop button)
10. Historia czatu jest zapisywana w localStorage i widoczna w panelu bocznym
11. Uzytkownik moze tworzyc nowe konwersacje, przełączac sie miedzy nimi, usuwac je

---

## 3. Architektura plików

```
Ollamachat/
├── PROJEKTY.md
├── specyfikacja.md
├── agents.md
├── hermes.md
├── skills-reference.md
├── src/
│   ├── main.tsx                    # Entry point, render App
│   ├── App.tsx                     # Root komponent — router/glowny layout
│   ├── index.css                   # Tailwind import + globalne style
│   ├── vite-env.d.ts               # Vite types
│   │
│   ├── types/
│   │   └── chat.ts                 # Wszystkie TypeScript typy
│   │
│   ├── api/
│   │   └── ollama.ts               # Klient HTTP do Ollama API
│   │
│   ├── store/
│   │   └── useChatStore.ts         # Zustand store — caly stan aplikacji
│   │
│   ├── hooks/
│   │   ├── useOllamaConnection.ts  # Sprawdzanie polaczenia + heartbeat
│   │   ├── useChatStream.ts        # SSE streaming odpowiedzi
│   │   └── useLocalStorage.ts      # Load/save konwersacji
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx       # Glowny layout (sidebar + chat)
│   │   │   ├── Sidebar.tsx         # Panel boczny z lista konwersacji
│   │   │   └── Header.tsx          # Górny pasek (model selector + tytul)
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx      # Glowny obszar czatu
│   │   │   ├── MessageBubble.tsx   # Pojedyncza wiadomosc (user/assistant)
│   │   │   ├── MessageList.tsx     # Lista wiadomosci z auto-scroll
│   │   │   └── StreamingMessage.tsx# Wiadomosc w trakcie generowania
│   │   │
│   │   ├── input/
│   │   │   ├── ChatInput.tsx       # Pole tekstowe + wyslij
│   │   │   └── StopButton.tsx      # Przycisk przerwania generowania
│   │   │
│   │   ├── connection/
│   │   │   ├── ConnectionStatus.tsx# Status polaczenia (zielony/czerwony)
│   │   │   └── ConnectionSetup.tsx # Ekran konfiguracji URL
│   │   │
│   │   └── settings/
│   │       └── ModelSelector.tsx   # Dropdown z lista modeli
│   │
│   └── utils/
│       ├── constants.ts            # Stale (domyslny URL, timeouty)
│       └── format.ts               # Helpery (formatowanie czasu, tekstu)
│
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## 4. Core modules

### 4.1. Typy (`src/types/chat.ts`)

```typescript
// Wiadomosc w czacie
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  model?: string          // model ktory wygenerowal odpowiedz
  done?: boolean          // czy odpowiedz jest kompletna
}

// Pojedyncza konwersacja
export interface Conversation {
  id: string
  title: string           // auto-generated z pierwszej wiadomosci lub "Nowa konwersacja"
  model: string           // domyslny model dla tej konwersacji
  messages: Message[]
  createdAt: number
  updatedAt: number
}

// Stan polaczenia z Ollama
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

// Konfiguracja polaczenia
export interface OllamaConfig {
  baseUrl: string         // np. http://localhost:11434
  timeout: number
}

// Model z Ollamy
export interface OllamaModel {
  name: string            // np. "llama3.2:latest"
  modifiedAt: string
  size: number
}

// Chunk z SSE streamu (Ollama /api/chat response)
export interface OllamaChatChunk {
  model: string
  createdAt: string
  message: {
    role: 'assistant'
    content: string
  }
  done: boolean
  doneReason?: string
  totalDuration?: number
  loadDuration?: number
  promptEvalCount?: number
  evalCount?: number
}

// Request do /api/chat
export interface OllamaChatRequest {
  model: string
  messages: Array<{ role: string; content: string }>
  stream: boolean
  options?: {
    temperature?: number
    top_p?: number
    top_k?: number
  }
}

// Stan przechowywany w Zustandzie
export interface ChatState {
  connection: ConnectionStatus
  config: OllamaConfig
  conversations: Conversation[]
  activeConversationId: string | null
  availableModels: OllamaModel[]
  selectedModel: string
  isGenerating: boolean

  // Akcje
  setConfig: (config: Partial<OllamaConfig>) => void
  setConnectionStatus: (status: ConnectionStatus) => void
  setAvailableModels: (models: OllamaModel[]) => void
  setSelectedModel: (model: string) => void
  setIsGenerating: (generating: boolean) => void
  createConversation: (model?: string) => string
  deleteConversation: (id: string) => void
  switchConversation: (id: string) => void
  addMessage: (conversationId: string, message: Message) => void
  updateLastAssistantMessage: (conversationId: string, content: string, done?: boolean) => void
  checkConnection: () => Promise<void>
}
```

### 4.2. API Client (`src/api/ollama.ts`)

Laczy sie z Ollama REST API. Kluczowe endpointy:

| Endpoint | Metoda | Uzycie |
|----------|--------|--------|
| `/api/tags` | GET | Pobranie listy dostepnych modeli |
| `/api/chat` | POST | Wyslanie wiadomosci + streaming odpowiedzi |
| `/` | GET | Ping — sprawdzenie czy Ollama dziala |

**Streaming:** `POST /api/chat` z `stream: true` zwraca SSE (Server-Sent Events). Kazdy chunk to JSON w jednej linii:
```
{"model":"llama3.2","createdAt":"...","message":{"role":"assistant","content":"Hello"},"done":false}
{"model":"llama3.2","createdAt":"...","message":{"role":"assistant","content":" world"},"done":false}
{"model":"llama3.2","createdAt":"...","message":{"role":"assistant","content":""},"done":true,"totalDuration":...}
```

**Implementacja streamingu w przegladarce:**
Uzyj `fetch()` z `ReadableStream` do odczytu strumienia:

```typescript
async function* streamChat(baseUrl: string, request: OllamaChatRequest): AsyncGenerator<OllamaChatChunk> {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })

  if (!response.ok) throw new Error(`Ollama error: ${response.status}`)

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''  // ostatnia linia moze byc niekompletna

    for (const line of lines) {
      if (line.trim()) {
        yield JSON.parse(line)
      }
    }
  }
}
```

### 4.3. Zustand Store (`src/store/useChatStore.ts`)

Centralny stan aplikacji. Kluczowe aspekty:

- **Persistencja:** Konwersacje + config zapisywane do localStorage przez `persist` middleware Zustanda
- **Akcje:** Wszystkie mutacje stanu przez zdefiniowane akcje (nie bezposrednio)
- **Streaming:** Store przechowuje stan `isGenerating`, ale actual streaming dzieje sie w hooku `useChatStream`

Store używa `persist` middleware:
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // ... stan i akcje
    }),
    {
      name: 'ollamachat-storage',
      partialize: (state) => ({
        config: state.config,
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        selectedModel: state.selectedModel,
      })
    }
  )
)
```

**NIE persistowac:** `connection`, `availableModels`, `isGenerating` — to sa stany UI, nie trwale dane.

### 4.4. Hook: `useChatStream`

Hook odpowiedzialny za cala komunikacje z Ollama podczas generowania odpowiedzi:

```
1. Pobiera aktualna konwersacje i model ze store
2. Na wyslaniu wiadomosci:
   a. Dodaje wiadomosc usera do store
   b. Tworzy pusta wiadomosc asystenta (content: '')
   c. Ustawia isGenerating = true
   d. Wysyła POST /api/chat z cala historia (bez pustej asystenckiej)
   e. Dla kazdego chunka: updateLastAssistantMessage (dokleja content)
   f. Po ostatnim chunku (done: true): updateLastAssistantMessage(done: true)
   g. Ustawia isGenerating = false
3. Obsluguje AbortController — uzytkownik moze przerwac
```

### 4.5. Hook: `useOllamaConnection`

```
1. Przy montowaniu: fetch GET / (ping) + GET /api/tags
2. Jesli ok: setConnectionStatus('connected'), setAvailableModels(models)
3. Jesli blad: setConnectionStatus('disconnected')
4. Heartbeat co 30 sekund — sprawdza czy polaczenie nadal zyje
```

### 4.6. Hook: `useLocalStorage`

Wrapper na persist middleware — w praktyce Zustand persist zalatwia to automatycznie.
Hook moze byc uzyty do operacji takich jak export/import konwersacji.

---

## 5. Design / UI

### 5.1. System designu (brutalist)

| Element | Styl |
|---------|------|
| Background | `#000` (black) |
| Text | `#fff` white, `'Courier New'`, monospace |
| Przyciski | `[ WYSLIJ ]` — nawiasy kwadratowe wokol tekstu |
| Border | `2px solid rgba(255,255,255,0.2)`, `border-radius: 0` |
| Hover | invert (biale tlo, czarny tekst) |
| Input | Czarny bg, biala ramka 2px, bialy tekst |
| Wiadomosci usera | Biala ramka, brak tla |
| Wiadomosci asystenta | Biala ramka, half-opacity biale tlo (`bg-white/5`) |
| Kod w odpowiedziach | `<pre>` z `bg-white/10`, monospace |
| Scrollbar | Cienki, bialy (`scrollbar-thin`) |
| Transition | Tylko `colors` i `opacity`, zero `transition: all` |

### 5.2. Layout (ASCII)

```
+------------------+--------------------------------------+
|                  | [ llama3.2:latest  ▾ ]  [+] Nowa      |
|                  +--------------------------------------+
|  HISTORIA        |                                      |
|                  |  [uzytkownik]                        |
|  [x] Nowa        |  Jak zrobic pythona w terminalu?     |
|    konwersacja   |                                      |
|  [ ] React hooks |  [asystent]                          |
|    pytanie       |  Aby uruchomic Pythona w terminalu,  |
|  [ ] Debug       |  wpisz `python` lub `python3`...     |
|    ollamy        |                                      |
|                  |                                      |
|                  |  [asystent jest w trakcie pisania...] |
|                  |                                      |
|                  +--------------------------------------+
|                  | [ Wpisz wiadomosc...        ] [->]   |
+------------------+--------------------------------------+
```

**Lewy sidebar:** Lista konwersacji. Kazda ma iks do usuniecia. Aktywna jest podswietlona.
**Prawy panel:** Chat window — wiadomosci przewijane, auto-scroll na dole.
**Input na dole:** Textarea (jedna linia, rozszerza sie), przycisk wyslij, przycisk stop (widoczny tylko podczas generowania).
**Header:** Wybor modelu + przycisk "Nowa konwersacja".

### 5.3. Responsywnosc

- **Mobile (< 768px):** Sidebar chowa sie za hamburger menu. Sidebar wysuwa sie z lewej na cala szerokosc.
- **Desktop (>= 768px):** Sidebar widoczny, ~300px szerokosci.

---

## 6. Ollama API — wymagana konfiguracja

Ollama musi byc uruchomiona z CORS dla frontendu dzialajacego na innym porcie:

```bash
# Windows — zmienna srodowiskowa
set OLLAMA_ORIGINS=*

# lub konkretny origin
set OLLAMA_ORIGINS=http://localhost:5173

# potem uruchom Ollame
ollama serve
```

Bez tego przegladarka zablokuje requesty CORS-em.

---

## 7. Rozwoj — fazy

### Faza 1 — MVP (3 dni)

- [ ] Scaffold projektu (Vite + React + TS + Tailwind)
- [ ] Typy TypeScript
- [ ] Zustand store z persist
- [ ] Klient Ollama API (GET /api/tags, POST /api/chat z streamingiem)
- [ ] Hook useOllamaConnection — heartbeat, lista modeli
- [ ] Hook useChatStream — wysylanie + streaming
- [ ] Ekran polaczenia (ConnectionSetup)
- [ ] Status polaczenia w UI
- [ ] ChatWindow + MessageList + MessageBubble + StreamingMessage
- [ ] ChatInput + wysylanie (Enter)
- [ ] Auto-scroll w dół
- [ ] Sidebar z lista konwersacji
- [ ] Tworzenie / przełączanie / usuwanie konwersacji
- [ ] Persist konwersacji w localStorage
- [ ] Wybor modelu (ModelSelector)
- [ ] Stop generowania (AbortController)
- [ ] README z instrukcja uruchomienia

### Faza 2 — Rozszerzenie (2 dni)

- [ ] Obsluga kodu w odpowiedziach (highlighting, copy button)
- [ ] Responsywnosc (mobile sidebar)
- [ ] Export/import konwersacji (JSON)
- [ ] Skroty klawiszowe (Ctrl+Enter = nowa linia, Enter = wyslij)
- [ ] Podstawowe parametry (temperature, top_p, top_k)
- [ ] Obsluga bledów (timeout, connection refused, model not found)
- [ ] System prompt — mozliwosc dodania wiadomosci systemowej
- [ ] Przywracanie ostatniej konwersacji po odswiezeniu

### Faza 3 — Dodatki (opcjonalnie)

- [ ] Tryb ciemny/jasny (choc brutalist = zawsze ciemny)
- [ ] Wyszukiwanie w historii
- [ ] Regeneracja ostatniej odpowiedzi
- [ ] Edycja wiadomosci
- [ ] Kopiowanie pojedynczej wiadomosci
- [ ] Wiele zakladek (tabs zamiast sidebaru)

---

## 8. Obsluga bledow

| Scenariusz | Reakcja |
|------------|---------|
| Ollama nie dziala (connection refused) | Pokaz ekran ConnectionSetup, probuj reconnect co 10s |
| Model nie istnieje | Blad przy probie wyslania — \"Model nie znaleziony. Wybierz inny model.\" |
| Timeout (brak odpowiedzi 30s) | Przerwij generowanie, komunikat \"Przekroczono czas oczekiwania\" |
| Blad podczas streamingu | Zakoncz streaming, pokaz error w UI, nie usuwaj czesciowej odpowiedzi |
| localStorage pelne | Catch quotaExceededError, usun najstarsze konwersacje |

---

## 9. Wymagania techniczne

- Node.js 20+ (18 tez dziala ale wolniej)
- Ollama 0.1.x+ uruchomiona lokalnie z `OLLAMA_ORIGINS=*`
- Przegladarka: Chrome/Edge/Firefox/Brave (wspolczesna)
- Brak zewnetrznych zaleznosci backendowych — wszystko w przegladarce
