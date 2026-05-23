<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Directives

## Workflow: Specification-Driven Development (OpenSpec)

This project uses **OpenSpec** (v1.3.1) as its SDD framework. Every change must flow through the spec layer — no direct implementation without a matching spec.

**Mandatory workflow:**
1. Before implementing any feature or fix, run `/opsx:propose "description"` to create a change proposal.
2. Read the generated `proposal.md`, `design.md`, and `tasks.md` under `openspec/changes/`.
3. Implement only what the tasks define, referencing the relevant spec under `openspec/specs/`.
4. After implementation, run `/opsx:archive` to merge the change back into the main specs.

**Specs location:** `openspec/specs/{capability}/spec.md`
**Active changes:** `openspec/changes/{change-id}/`

Never skip this process, even for "small" changes. The spec is the source of truth.

## Git & Commits

- **NEVER commit anything without explicit user approval.** No exceptions — not even "trivial" fixes.
- Before staging or committing, present the exact intended commit message to the user and wait for a "yes" (or equivalent). Only proceed after explicit confirmation.
- Follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): short description`. Examples: `feat(auth): add OAuth provider`, `fix(api): handle null session`.
- Never use `--no-verify`, `--force`, or any flag that bypasses hooks or safety checks unless the user explicitly requests it and acknowledges the risk.

## Code Quality & Language Conventions

- Follow the idioms and style of the language/framework in use (TypeScript strict mode, ESLint rules, Prettier formatting). Read existing code before adding new patterns.
- Prefer editing existing files to creating new ones. Do not introduce abstractions beyond what the task requires.
- Write no comments unless the *why* is genuinely non-obvious. Never narrate what the code does.
- Keep changes minimal and focused: one concern per commit, no unrelated refactors bundled in.

## Design System — Shaco Theme

This app uses the same visual identity as `../titico`. **Always follow these rules when writing UI code.**

### Paleta de cores
| Token CSS | Valor | Uso |
|---|---|---|
| `--red` | `#e3001b` | Cor primária — CTAs, destaques, títulos coloridos |
| `--red-dark` | `#b50015` | Hover de botões primários |
| `--red-darkest` | `#900010` | Active/pressed de botões primários |
| `--bg` | `#0d0d0d` | Fundo global da página |
| `--bg-card` | `#161616` | Cards e painéis |
| `--bg-section` | `#111111` | Seções alternadas |

Usar sempre as variáveis CSS acima via classes Tailwind `bg-[var(--bg)]` ou valores literais `bg-[#0d0d0d]` (os valores são constantes).

### Classes Tailwind obrigatórias
- **Texto primário:** `text-white`
- **Texto secundário/muted:** `text-white/70`, `text-white/60`, `text-white/50`, `text-white/30`
- **Títulos:** `font-black uppercase tracking-tight` (ou `tracking-wider` para labels)
- **Labels/tags:** `text-xs uppercase tracking-[0.25em] font-semibold`
- **Borders:** `border-white/5`, `border-white/10`, `border-white/20`
- **Cards:** `bg-[#161616] border border-white/5 rounded-xl`
- **Botão primário:** `bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] text-white font-black uppercase tracking-wider rounded-lg transition-colors`
- **Botão outline:** `border border-white/25 hover:border-white active:bg-white/10 text-white font-black uppercase tracking-wider rounded-lg transition-colors`
- **Acento lateral (section titles):** `border-l-2 border-[#e3001b] pl-3`

### Dificuldades dos matchups
- Fácil → `#4ade80`
- Médio → `#fbbf24`
- Difícil → `#ef4444`

### Assets externos
- Ícones de campeões: `https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/{Name}.png`
- Splash art: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/{Name}_0.jpg`

### Regras gerais de UI
- Fundo sempre escuro (`#0d0d0d`) — nunca usar branco/claro como base
- Vermelho `#e3001b` é reservado para destaque — não usar como cor de fundo de grandes áreas
- Sem fontes externas (Google Fonts etc.) — usar Arial/Helvetica nativo
- Sem bibliotecas de ícones — usar SVGs inline
- `'use client'` apenas quando estritamente necessário (interatividade)

## Security — Non-Negotiable

- Security is a first-class requirement, not an afterthought. Every code change must be evaluated for security impact before being written.
- Never introduce: SQL injection, XSS, CSRF, insecure direct object references, hard-coded secrets, or any OWASP Top 10 vulnerability.
- Never log, expose, or commit secrets, tokens, credentials, or PII. Use environment variables and keep them out of version control.
- Validate and sanitize all user input and external API responses at system boundaries.
- Use least-privilege principles for database access, API keys, and permissions.
- If a security concern is identified — even a minor one — flag it to the user immediately before proceeding.
