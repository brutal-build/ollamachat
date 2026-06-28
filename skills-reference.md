# Skills Reference — Ollamachat

> Przydatne Hermes skills do implementacji projektu.

---

## Design / UI

| Skill | Opis | Kiedy uzyc |
|-------|------|------------|
| `taste` (design-taste-frontend) | Anti-slop frontend skill — czysty, brutalist UI | Przy tworzeniu wszystkich komponentow |
| `ui-ux-pro-max` | UI/UX design intelligence — 50+ design rules | Przy projektowaniu layoutu i flow |
| `emil-kowalski` (emil-design-eng, review-animations) | Emil Kowalski design philosophy — UI polish | Przy finalnym polerowaniu UI |
| `open-design` | 28k gwiazdek, 129 design systemow | Przy szukaniu referencji layoutu |
| `brutalist-ui` | Brutalist design system — pasuje idealnie do tego projektu | Przy stylowaniu komponentow |
| `industrial-brutalist-ui` | Raw mechanical interfaces — Swiss typography | Przy inputach i panelach bocznych |

## Jakosc kodu

| Skill | Opis | Kiedy uzyc |
|-------|------|------------|
| `simplify-swarm` | 3-agentowe czyszczenie kodu | Przed kazdym commitem |
| `pre-git-quality-gate` | Code review przed commit - bezpieczenstwo + logika | Przed kazdym commitem |
| `requesting-code-review` | Niezalezny reviewer dla security i bledow logicznych | Po kazdej fazie |
| `test-driven-development` | RED-GREEN-REFACTOR workflow | Przy hookach i API client |
| `simplify-code` | Auto-trigger czyszczenia przed commitem | W polaczeniu z simplify-swarm |

## Development

| Skill | Opis | Kiedy uzyc |
|-------|------|------------|
| `react-vite-scaffold` | Scaffold React + Vite + TS + Tailwind ze speca | Przy tworzeniu projektu od zera |
| `plan` | Plan mode — tworzenie planu implementacji | Przed rozpoczeciem implementacji |
| `spike` | Throwaway eksperymenty — testowanie pomyslow | Do testowania streamingu SSE lub Ollama API |
| `project-kickoff` | Start nowego projektu — caly workflow dokumentacyjny | Na poczatku tworzenia projektu |
| `systematic-debugging` | 4-fazowe debugowanie: zrozum zanim naprawisz | Przy bledach runtime/build |
| `graphify` | Analiza struktury kodu — zrozumienie zaleznosci | Przed wiekszymi zmianami |

## Deploy

| Skill | Opis | Kiedy uzyc |
|-------|------|------------|
| `static-site-deployment` | Deploy statycznych stron na Vercel | Przy finalnym deployu |
| `vercel` (nextjs-deployment) | Vercel deployment | Przy deployu na Vercel |

## Rekomendowana kolejnosc uzycia

1. **Na start (planowanie):**
   - `plan` — plan implementacji
   - `spike` — testowanie Ollama API / SSE streamingu

2. **Podczas implementacji:**
   - `react-vite-scaffold` — scaffold projektu
   - `taste` / `brutalist-ui` — podczas pisania komponentow
   - `ui-ux-pro-max` — podczas projektowania flow

3. **Przed kazdym commitem:**
   - `simplify-swarm` — czyszczenie kodu
   - `pre-git-quality-gate` — review bezpieczenstwa

4. **QA i finalizacja:**
   - `requesting-code-review` — finalny review
   - `test-driven-development` — testy core funkcjonalnosci
   - `graphify` — analiza zaleznosci po implementacji

5. **Deploy:**
   - `static-site-deployment` lub `vercel`
