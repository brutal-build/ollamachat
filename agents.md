# Ollamachat — Agenci Implementacji

> Definicje agentow do wieloagentowego developmentu Ollamachat.
> Stack: React 18+ / Vite 6+ / TypeScript / Tailwind CSS v4 / Zustand

---

## Stack

| Warstwa | Technologia |
|---------|-------------|
| Framework | React 18+ |
| Bundler | Vite 6+ |
| Jezyk | TypeScript |
| CSS | Tailwind CSS v4 (Vite plugin) |
| State management | Zustand + persist middleware |
| API | Fetch API + ReadableStream (SSE streaming) |
| Deploy | Vercel lub inny statyczny hosting |

---

## Agent 1: Architekt / Scaffolder

**Rola:** Tworzy projekt od zera — Vite scaffold, konfiguracja, struktura folderów, zależności.

**Obowiazki:**
- `npm create vite@latest ollamachat -- --template react-ts`
- Instalacja zależności: `zustand`, `tailwindcss`, `@tailwindcss/vite`
- Konfiguracja `vite.config.ts` z pluginem Tailwind v4
- Konfiguracja `tsconfig.json` (paths aliasy)
- Utworzenie struktury folderów (`src/types/`, `src/api/`, `src/store/`, `src/hooks/`, `src/components/layout/`, `src/components/chat/`, `src/components/input/`, `src/components/connection/`, `src/components/settings/`, `src/utils/`)
- Czyszczenie szablonu Vite (usuniecie `App.css`, `assets/`, defaultowego contentu)

**Delegate task prompt:**
```
Utworz projekt React+Vite+TypeScript+Tailwind v4 pod sciezka C:\Users\user\Desktop\Ollamachat.
Zainstaluj zustand, tailwindcss, @tailwindcss/vite jako zależności.
Skonfiguruj vite.config.ts z tailwindcss Vite plugin.
Stworz strukture folderow: src/types/, src/api/, src/store/, src/hooks/, src/components/layout/, src/components/chat/, src/components/input/, src/components/connection/, src/components/settings/, src/utils/.
Wyczysc szablon Vite (usun App.css, assets/, defaultowa zawartosc App.tsx i main.tsx).
Uzyj index.css z @import "tailwindcss" jako pierwsza linia.
```

---

## Agent 2: Types & Store

**Rola:** Tworzy wszystkie typy TypeScript i Zustand store z persist.

**Obowiazki:**
- Stworzenie `src/types/chat.ts` ze wszystkimi interfejsami (Message, Conversation, ConnectionStatus, OllamaConfig, OllamaModel, OllamaChatChunk, OllamaChatRequest, ChatState)
- Stworzenie `src/store/useChatStore.ts` z Zustand + persist middleware
- Implementacja wszystkich akcji: setConfig, setConnectionStatus, setAvailableModels, setSelectedModel, setIsGenerating, createConversation, deleteConversation, switchConversation, addMessage, updateLastAssistantMessage, checkConnection
- Partialize persist — tylko config, conversations, activeConversationId, selectedModel
- Generowanie UUID dla konwersacji i wiadomosci (crypto.randomUUID())

**Delegate task prompt:**
```
Stworz pliki:
1. C:\Users\user\Desktop\Ollamachat\src\types\chat.ts — wszystkie typy/interfejsy: Message, Conversation, ConnectionStatus, OllamaConfig, OllamaModel, OllamaChatChunk, OllamaChatRequest, ChatState (stan + akcje). Uzyj crypto.randomUUID() do generowania ID.
2. C:\Users\user\Desktop\Ollamachat\src\store\useChatStore.ts — Zustand store z persist middleware. Partialize: tylko config, conversations, activeConversationId, selectedModel. Nie persist: connection, availableModels, isGenerating.
Store musi zawierac: connection (initial: 'connecting'), config (initial: { baseUrl: 'http://localhost:11434', timeout: 30000 }), conversations (initial: []), activeConversationId (initial: null), availableModels (initial: []), selectedModel (initial: ''), isGenerating (initial: false).
Akcje: setConfig, setConnectionStatus, setAvailableModels, setSelectedModel, setIsGenerating, createConversation (generuje ID, tworzy nowa konwersacje z tytulem "Nowa konwersacja", ustawia ja jako aktywna, zwraca ID), deleteConversation, switchConversation, addMessage (dodaje Message do konkretnej konwersacji, aktualizuje updatedAt), updateLastAssistantMessage (znajduje ostatnia wiadomosc asystenta w konwersacji i dokleja/dopisuje content + opcjonalnie ustawia done).
Prefix store: 'ollamachat-storage'.
```

---

## Agent 3: API & Connection

**Rola:** Tworzy klienta Ollama API i hooki do lacznosci.

**Obowiazki:**
- Stworzenie `src/api/ollama.ts` — funkcje: `checkOllamaConnection(baseUrl)`, `fetchModels(baseUrl)`, `streamChat(baseUrl, request)` (generator async)
- `streamChat` używa `fetch()` + `ReadableStream` do SSE
- Stworzenie `src/hooks/useOllamaConnection.ts` — heartbeat co 30s, fetch modeli, update store
- Stworzenie `src/hooks/useChatStream.ts` — wysylanie wiadomosci, streaming, AbortController, update store

**Delegate task prompt:**
```
Stworz 3 pliki w C:\Users\user\Desktop\Ollamachat:

1. src/api/ollama.ts:
   - checkOllamaConnection(baseUrl: string): Promise<boolean> — fetch GET ${baseUrl}/, sprawdza status 200
   - fetchModels(baseUrl: string): Promise<OllamaModel[]> — fetch GET ${baseUrl}/api/tags, zwraca tablice modeli
   - streamChat(baseUrl: string, request: OllamaChatRequest): AsyncGenerator<OllamaChatChunk> — fetch POST z stream:true, odczyt ReadableStream, parsowanie JSON z kazdej linii, yield chunk. Jesli response.ok = false, throw Error z kodem bledu.
   - AbortSignal jako opcjonalny parametr w streamChat

2. src/hooks/useOllamaConnection.ts:
   - Przy montowaniu: sprawdza polaczenie, fetchuje modele, update store
   - useEffect z cleanup (abort controller)
   - Heartbeat co 30 sekund (setInterval + cleanup)
   - Zwraca: { isConnected: boolean, isChecking: boolean, error: string | null, reconnect: () => void }

3. src/hooks/useChatStream.ts:
   - Pobiera aktualna konwersacje i config ze store
   - Funkcja sendMessage(content: string):
     a. Sprawdza czy jest aktywna konwersacja (jesli nie, tworzy nowa)
     b. Dodaje wiadomosc usera do store
     c. Tworzy pusta wiadomosc asystenta
     d. setGenerating(true)
     e. Wysyła streamChat z cala historia wiadomosci (bez ostatniej pustej asystenckiej)
     f. Dla kazdego chunka: updateLastAssistantMessage (dokleja content)
     g. Po done: updateLastAssistantMessage(done: true) + setGenerating(false)
     h. catch bledy: setGenerating(false), dodaje wiadomosc z error do UI
   - Funkcja stopGeneration(): abortuje AbortController
   - Zwraca: { sendMessage, stopGeneration, isGenerating }

Importuj typy z '../types/chat' i store z '../store/useChatStore'.
```

---

## Agent 4: UI Components — Layout

**Rola:** Tworzy layout komponenty (AppLayout, Sidebar, Header, ConnectionSetup, ConnectionStatus).

**Delegate task prompt:**
```
Stworz komponenty layoutu w C:\Users\user\Desktop\Ollamachat\src\components\:

1. layout/AppLayout.tsx — glowny layout z sidebar (300px, biala ramka po prawej) + main content. Na mobile sidebar chowa sie. Uzywa zustand store do sprawdzenia connection status — jesli disconnected, pokazuje ConnectionSetup zamiast chatu. Props: children (JSX).

2. layout/Sidebar.tsx — lista konwersacji. Pobiera conversations, activeConversationId, switchConversation, deleteConversation, createConversation ze store. Kazda konwersacja pokazuje tytul + przycisk [x] do usuniecia. Aktywna ma biale tlo (bg-white/10). Przycisk [ + NOWA ] na gorze. Na mobile: absolute positioned, z-index 50, przeslona.

3. layout/Header.tsx — pasek na gorze glownego panelu. Zawiera ModelSelector po lewej i przycisk [ + NOWA ] po prawej.

4. connection/ConnectionSetup.tsx — ekran wyswietlany gdy polaczenie z Ollama nie udane. Pole input na URL (domyslnie http://localhost:11434), przycisk [ POLACZ ]. Wywoluje checkConnection z store.

5. connection/ConnectionStatus.tsx — mala ikonka/kolko: zielone = polaczono, czerwone = brak polaczenia, zolte = ladowanie.

Styl: brutalist (czarny bg, bialy text, monospace, border-2, zero rounded, bracket buttons).
Wszystkie komponenty export default.
```

---

## Agent 5: UI Components — Chat

**Rola:** Tworzy komponenty czatu (ChatWindow, MessageBubble, MessageList, StreamingMessage).

**Delegate task prompt:**
```
Stworz komponenty czatu w C:\Users\user\Desktop\Ollamachat\src\components\chat\:

1. ChatWindow.tsx — glowny kontener czatu. Renderuje MessageList na gorze (flex-1, overflow-y-auto) i ChatInput na dole. Uzywa useChatStream hook.

2. MessageList.tsx — lista MessageBubble/StreamingMessage. Auto-scroll do dolu (useRef + useEffect scrollIntoView). Virtualnie renderuje wszystkie wiadomosci (nie ma wirtualizacji na poczatek — max kilkaset wiadomosci).

3. MessageBubble.tsx — pojedyncza wiadomosc:
   - role 'user': ramka po prawej, [TY] na gorze, content
   - role 'assistant': ramka po lewej, [ASISTENT] na gorze, content
   - role 'system': wysrodkowana, mniejsza czcionka, [SYSTEM]
   - Content renderowany jako text (bez markdown na poczatek — potem mozna dodac)
   - Timestamp (format: HH:MM) w rogu

4. StreamingMessage.tsx — wariant MessageBubble dla streamowanej odpowiedzi:
   - Pokazuje migajacy cursor (|) na koncu tekstu gdy done = false
   - Gdy done = true, cursor znika
   - Reszta jak MessageBubble

Importuj store z '../../store/useChatStore'.
Styl: brutalist (czarny bg, bialy text, monospace, border-2 wokol wiadomosci, zero rounded).
Wszystkie komponenty export default.
```

---

## Agent 6: UI Components — Input & Controls

**Rola:** Tworzy ChatInput, StopButton, ModelSelector.

**Delegate task prompt:**
```
Stworz komponenty inputow w C:\Users\user\Desktop\Ollamachat\src\components\:

1. input/ChatInput.tsx:
   - Textarea (auto-resize, max 5 lines) + przycisk wyslij [ -> ]
   - Enter = wyslij (bez Shift), Shift+Enter = nowa linia
   - Wysylanie wywoluje sendMessage z hooka useChatStream
   - Input disabled gdy isGenerating = true (ale textarea dalej widoczny, tylko przycisk sie zmienia na StopButton)
   - Placeholder: "Wpisz wiadomosc..."

2. input/StopButton.tsx:
   - Przycisk [ STOP ] — widoczny tylko podczas generowania
   - Wywoluje stopGeneration
   - Czerwony border przy hoverze

3. settings/ModelSelector.tsx:
   - <select> dropdown z lista availableModels ze store
   - Po zmianie wywoluje setSelectedModel
   - Styl: jak input — czarny bg, biala ramka 2px, monospace, bialy text

Styl: brutalist (czarny bg, bialy text, monospace, border-2, zero rounded).
Wszystkie komponenty export default.
```

---

## Agent 7: App Assembler

**Rola:** Laczy wszystko w App.tsx i main.tsx, tworzy index.css, konczy integracje.

**Obowiazki:**
- Stworzenie `src/App.tsx` — glowny komponent, renderuje AppLayout z ChatWindow
- Stworzenie `src/main.tsx` — ReactDOM.createRoot, import index.css
- Stworzenie `src/index.css` — `@import "tailwindcss"` + globalne style brutalist
- Sprawdzenie czy wszystkie importy sie zgadzaja
- `npm run build` — zapewnienie ze build przechodzi

**Delegate task prompt:**
```
Stworz i polacz pliki w C:\Users\user\Desktop\Ollamachat:

1. src/index.css:
   @import "tailwindcss"
   
   Dodaj globalne style:
   - body: bg-black, text-white, font-mono, m-0, p-0
   - ::-webkit-scrollbar: cienki bialy scrollbar
   - textarea: bg-black, text-white, border-2 border-white/20, font-mono, resize-none, outline-none
   - select: bg-black, text-white, border-2 border-white/20, font-mono
   - pre: bg-white/10, p-4, overflow-x-auto, font-mono, text-sm

2. src/App.tsx:
   - Uzywa useOllamaConnection hook do inicjalizacji
   - Renderuje AppLayout > ChatWindow (lub ConnectionSetup jesli brak polaczenia)
   - Importuje i renderuje ConnectionStatus w headerze

3. src/main.tsx:
   - Standardowy React 18 createRoot
   - Import './index.css'
   - Render <App /> w strict mode

4. Sprawdz czy npm run build przechodzi. Jesli nie, napraw bledy.
```

---

## Agent 8: QA / Reviewer

**Rola:** Audytuje projekt przed final delivery.

**Obowiazki:**
- Sprawdza czy kazdy plik z architektury istnieje
- `npx tsc --noEmit` — zero bledow TypeScript
- `npm run build` — sukces
- Sprawdza czy wszystkie importy sa poprawne
- Sprawdza czy nie ma dead code

---

## Workflow: Fazy i przypisania agentow

```
Faza 1 — Scaffold i infrastruktura
├── Agent 1 (Architekt):     Scaffold projektu, konfiguracja, instalacja deps
├── Agent 2 (Types & Store): Typy TS + Zustand store z persist
└── Agent 3 (API):           Klient Ollama API + hooki (connection, stream)

Faza 2 — Komponenty UI
├── Agent 4 (Layout):        AppLayout, Sidebar, Header, ConnectionSetup, ConnectionStatus
├── Agent 5 (Chat UI):       ChatWindow, MessageBubble, MessageList, StreamingMessage
└── Agent 6 (Inputs):        ChatInput, StopButton, ModelSelector

Faza 3 — Integracja i QA
├── Agent 7 (Assembler):     App.tsx, main.tsx, index.css, build fix
└── Agent 8 (QA):            Audit TypeScript, build, importy
```

---

## Zasady delegacji

1. Faza 1 musi byc pierwsza — Agent 1 tworzy projekt, potem reszta
2. Agent 2 (types) musi byc przed Agentem 3 (API) i Agentami 4-6 (UI)
3. Faza 2 moze byc rownolegla (Agents 4, 5, 6 jednoczesnie) — maja niezalezne komponenty
4. Agent 7 (assembler) po wszystkich komponentach
5. Agent 8 (QA) na koncu — po assemblerze

---

## Bramki jakosci

- [ ] `npx tsc --noEmit` — 0 errors
- [ ] `npm run build` — sukces
- [ ] Wszystkie pliki z architektury istnieja
- [ ] Zustand persist dziala (dane w localStorage po odswiezeniu)
- [ ] ConnectionSetup pokazuje sie gdy Ollama nie dziala
- [ ] Chat wysyla wiadomosci i streamuje odpowiedzi
- [ ] Stop przerywa generowanie
- [ ] Sidebar pokazuje konwersacje, mozna sie przelaczac
