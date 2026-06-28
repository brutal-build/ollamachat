# Ollamachat

> Lokalny chat z AI przez Ollame — zero API kluczy, zero subskrypcji, full prywatnosc.

**Problem:** Korzystanie z ChatGPT/Gemini/Claude wymaga wysylania danych na zewnetrzne serwery, placenia subskrypcji, i polegania na dostepnosci internetu. Ollama uruchamia modele lokalnie, ale nie ma porzadnego interfejsu chatu — jest tylko terminalowe `ollama run`.

**Rozwiazanie:** Ollamachat to webowa apka (React + Vite + TypeScript), która  laczy sie z lokalna instancja Ollamy (localhost:11434) i daje interfejs czatu jak w ChatGPT — z historia, streamingiem, wyborem modelu, i zapisywaniem konwersacji.

**Tech stack:** React 18+ / Vite 6+ / TypeScript / Tailwind CSS v4

**Poziom trudnosci:** Sredni (znajomosc Ollama API, SSE streaming, React hooks)

**Szacowany czas:** 3-5 dni

**Wartosc:** W 100% lokalne AI, prywatnosc danych, zero kosztow (poza hardwarem), dziala offline.
