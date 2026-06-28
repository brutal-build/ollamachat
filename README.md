# Ollamachat

> A brutalist, local-first chat interface for [Ollama](https://ollama.com). No accounts, no API keys, no backend — just your local models and a terminal-inspired UI.

Built with **React 19** + **TypeScript** + **Vite 6** + **Tailwind CSS v4**. Connects directly to your local Ollama instance and provides a ChatGPT-like chat experience entirely in your browser, entirely on your machine.

---

## Features

### Chat
- **Real-time streaming** — responses appear word-by-word as the model generates (SSE via `ReadableStream`)
- **Multiple conversations** — create, switch, and delete conversations with auto-save to localStorage
- **Model selection** — pick any model from your Ollama library
- **Stop generation** — abort mid-response at any time
- **Auto-title** — conversations are automatically named from your first message

### Content
- **Markdown rendering** — full GFM support: headings, lists, tables, code blocks, images
- **Syntax highlighting** — code blocks highlighted by language (Python, JS, Rust, etc.)

### UI
- **Multiple themes** — Brutalist, macOS Dark, Nord, Dracula, Terminal
- **Mobile responsive** — sidebar collapses on small screens
- **Connection status** — real-time indicator of Ollama connection state

---

## Quick Start

### Prerequisites

- **Node.js 20+**
- **Ollama** installed and running ([download](https://ollama.com/download))

### 1. Start Ollama with CORS

Ollama must allow cross-origin requests from the dev server:

```bash
# Windows (cmd)
set OLLAMA_ORIGINS=*
ollama serve

# macOS / Linux
OLLAMA_ORIGINS=* ollama serve
```

### 2. Install and run

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

### 3. Build for production

```bash
npm run build
npm run preview
```

The `dist/` folder is a fully static site — deploy to any static host (Vercel, Netlify, GitHub Pages, etc.).

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 |
| Bundler | Vite 6 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| State | Zustand + persist middleware (localStorage) |
| Markdown | marked + highlight.js |
| API | Fetch API + ReadableStream (SSE streaming) |

---

## License

MIT — [brutal-build](https://github.com/brutal-build)
