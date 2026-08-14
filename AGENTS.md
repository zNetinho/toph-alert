# AGENTS.md

> README para agentes de código. Índice da documentação do repositório + comandos e regras para contribuir no **toph-alert**.

## Project Overview

**toph-alert** monitora erros em lojas ecommerce via **SDK browser** → `POST /api/ingest` (202 Accepted) → fingerprint/dedupe → fila outbox → ticket **Runrunit** → alerta **Discord**.

| Camada       | Tecnologia                                                      |
| ------------ | --------------------------------------------------------------- |
| Monorepo     | pnpm workspaces (`apps/*`, `packages/*`)                        |
| Runtime      | Node **22** (`.nvmrc`; engines `>=20.9.0`)                      |
| App          | Next.js **16.2.12** App Router, React **19.2**, Tailwind **v4** |
| Dados / Auth | Supabase (Postgres 17)                                          |
| Arquitetura  | DDD + ports/adapters (hexagonal)                                |

**Fluxo V1:** browser SDK → ingest ACK → outbox → dedupe → Runrunit → Discord.

Use o **índice de documentação** abaixo antes de implementar qualquer feature.

---

## Documentation Index

### Precedência quando documentos divergem

1. [`docs/backlog-v1.md`](docs/backlog-v1.md) — escopo V1, tasks T01–T15, critérios de aceite
2. [`.spec/`](.spec/) — como implementar cada área
3. [`docs/contexto.mdc`](docs/contexto.mdc) — stack, problema de negócio, equipe
4. [`docs/objetivo.md`](docs/objetivo.md) / [`docs/requisitos.md`](docs/requisitos.md) — visão de produto (pode ser **maior** que V1)
5. [`docs/architecture/toph-alert-mvp.json`](docs/architecture/toph-alert-mvp.json) — diagrama Archify (HTML é só visualização)
6. [`docs/adr/`](docs/adr/) — decisões arquiteturais; `001` ainda é stub

**Conflitos conhecidos:**

- O JSON de arquitetura ainda descreve RLS por `cliente_id` e painel assinante. O backlog V1 manda **não** fazer isso (painel interno, sem tabela `clientes`).
- `objetivo.md` inclui session recording, painel do lojista e vários ticket providers — isso é **visão**, não escopo V1.

### `docs/` — produto, backlog e arquitetura

| Arquivo                                                                          | Para que serve                                                                       | Quando ler                                        |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------- |
| [`docs/backlog-v1.md`](docs/backlog-v1.md)                                       | Source of truth operacional do MVP: tasks, dependências, aceite, fora de escopo V2   | **Sempre** antes de implementar ou estimar escopo |
| [`docs/contexto.mdc`](docs/contexto.mdc)                                         | Stack, integrações (Runrunit, Discord), problema de negócio, equipe                  | Contexto rápido do repo                           |
| [`docs/objetivo.md`](docs/objetivo.md)                                           | Visão de produto de longo prazo (multi-plataforma, painéis, vários ticket providers) | Entender direção; **não** expandir escopo V1      |
| [`docs/requisitos.md`](docs/requisitos.md)                                       | Índice curto de requisitos (monitoramento, Runrunit, tags)                           | Referência leve; sem links profundos              |
| [`docs/architecture/toph-alert-mvp.json`](docs/architecture/toph-alert-mvp.json) | Fonte do diagrama: componentes, views, fluxo SDK → ingest → pipeline                 | Entender topologia; validar escopo com backlog V1 |
| [`docs/architecture/toph-alert-mvp.html`](docs/architecture/toph-alert-mvp.html) | Diagrama interativo gerado (Archify)                                                 | Humanos; agentes preferem o `.json`               |
| [`docs/adr/001-dependency-cruiser.md`](docs/adr/001-dependency-cruiser.md)       | Grafo de camadas + enforcement ESLint (ADR 001); `dependency-cruiser` adiado até CI  | Validar imports e composition root                |

### `.spec/` — specs de implementação

| Arquivo                                                                                | Para que serve                                             | Quando ler                            |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------- |
| [`.spec/00-sentry/install-and-init.md`](.spec/00-sentry/install-and-init.md)           | Sentry em `apps/web` (errors + tracing; sem replay no MVP) | T13, instrumentação do dashboard      |
| [`.spec/01-nextjs-app/install-and-initi.md`](.spec/01-nextjs-app/install-and-initi.md) | Scaffold Next.js 16.2.12, App Router                       | T01, setup do app                     |
| [`.spec/02-design-system/overview.md`](.spec/02-design-system/overview.md)             | Design system N1.AG, dark-first, tipografia                | T04, T11 — visão geral                |
| [`.spec/02-design-system/colors.md`](.spec/02-design-system/colors.md)                 | Paleta brand + semântica, CSS vars                         | T04 — tokens de cor                   |
| [`.spec/02-design-system/typography.md`](.spec/02-design-system/typography.md)         | Escala tipográfica, fontes                                 | T04 — tipografia                      |
| [`.spec/02-design-system/spacing.md`](.spec/02-design-system/spacing.md)               | Grid 4px, container, radii, motion                         | T04 — espaçamento                     |
| [`.spec/02-design-system/themes.md`](.spec/02-design-system/themes.md)                 | Dark default, toggle, a11y                                 | T04 — temas                           |
| [`.spec/02-design-system/components.md`](.spec/02-design-system/components.md)         | Spec visual de Button, Nav, Badge, Card, Input             | T11 — UI (spec-only, sem React ainda) |
| [`.spec/03-ingest/consumo-erro.md`](.spec/03-ingest/consumo-erro.md)                   | Fluxo SDK → ingest → ticket; deep-link                     | T02, T05, T10, T12                    |
| [`.spec/04-notifications/discord.md`](.spec/04-notifications/discord.md)               | Discord **após** Runrunit 200/204; notify pluggável        | T08, T09                              |
| [`.spec/05-runrunit/integracao.md`](.spec/05-runrunit/integracao.md)                   | Client Runrunit, headers, env, retry                       | T07, T09                              |

### Outros recursos para agentes

| Arquivo                                                                | Para que serve                                                                            |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [`apps/web/AGENTS.md`](apps/web/AGENTS.md)                             | Aviso: Next.js 16 tem APIs diferentes — ler `node_modules/next/dist/docs/` antes de codar |
| [`.cursor/skills/supabase/SKILL.md`](.cursor/skills/supabase/SKILL.md) | Skill oficial Supabase: migrations, Auth, RLS                                             |

### Mapa task → spec

| Task | Título                        | Spec / recurso                                                                                                                                  |
| ---- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| T01  | Scaffold monorepo             | [`.spec/01-nextjs-app/install-and-initi.md`](.spec/01-nextjs-app/install-and-initi.md)                                                          |
| T02  | Contratos do domínio          | [`.spec/03-ingest/consumo-erro.md`](.spec/03-ingest/consumo-erro.md)                                                                            |
| T03  | Schema Supabase V1            | [`.cursor/skills/supabase/SKILL.md`](.cursor/skills/supabase/SKILL.md) + [`supabase/migrations/`](supabase/migrations/)                         |
| T04  | Tokens design system N1       | [`.spec/02-design-system/`](.spec/02-design-system/)                                                                                            |
| T05  | POST /api/ingest ACK + outbox | [`.spec/03-ingest/consumo-erro.md`](.spec/03-ingest/consumo-erro.md)                                                                            |
| T06  | ErrorPipeline + dedupe        | [`docs/backlog-v1.md`](docs/backlog-v1.md) § T06                                                                                                |
| T07  | Adapter Runrunit              | [`.spec/05-runrunit/integracao.md`](.spec/05-runrunit/integracao.md)                                                                            |
| T08  | Adapter Discord               | [`.spec/04-notifications/discord.md`](.spec/04-notifications/discord.md)                                                                        |
| T09  | Worker outbox                 | [`.spec/04-notifications/discord.md`](.spec/04-notifications/discord.md) + [`.spec/05-runrunit/integracao.md`](.spec/05-runrunit/integracao.md) |
| T10  | Browser SDK + CDN             | [`.spec/03-ingest/consumo-erro.md`](.spec/03-ingest/consumo-erro.md)                                                                            |
| T11  | Painel interno                | [`.spec/02-design-system/overview.md`](.spec/02-design-system/overview.md)                                                                      |
| T12  | Deep-link `/errors/[id]`      | [`.spec/03-ingest/consumo-erro.md`](.spec/03-ingest/consumo-erro.md)                                                                            |
| T13  | Sentry app-only               | [`.spec/00-sentry/install-and-init.md`](.spec/00-sentry/install-and-init.md)                                                                    |
| T14  | Happy path E2E piloto         | [`docs/backlog-v1.md`](docs/backlog-v1.md) § T14                                                                                                |
| T15  | Testes dedupe + ordem Discord | [`docs/backlog-v1.md`](docs/backlog-v1.md) § T15                                                                                                |

### Gaps documentais

- `dependency-cruiser` adiado até CI — ver ADR 001; enforcement V1 via `no-restricted-imports` em `eslint.config.mjs`
- `docs/requisitos.md` é índice sem links para docs detalhados
- Plano Conselho referenciado no backlog **não está no disco** (link quebrado em `backlog-v1.md`)
- Sem CI (`.github/workflows/`) nem script `pnpm test` ainda (T14/T15 no backlog)
- `apps/web/README.md` é boilerplate create-next-app, não documentação de produto

---

## Setup Commands

```bash
# Node 22 (recomendado)
nvm use   # ou instalar conforme .nvmrc

# Dependências
pnpm install

# Variáveis de ambiente
cp .env.example .env
# Preencher: Supabase, Runrunit, Discord, Sentry (ver .env.example)
```

Package manager: **pnpm@10.28.2** (campo `packageManager` no root `package.json`).

---

## Development Workflow

```bash
# Servidor de desenvolvimento (apps/web em :3000, webpack)
pnpm dev

# Filtrar um pacote
pnpm --filter @toph-alert/web dev
pnpm --filter @toph-alert/domain typecheck

# Qualidade
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm typecheck

# Build
pnpm build
```

- Env é carregado da **raiz** do monorepo (`.env` na raiz).
- Pre-commit: Husky → lint-staged (ESLint --fix + Prettier).

---

## Monorepo

### Pacotes

| Pacote                     | Caminho                 | Responsabilidade                                           |
| -------------------------- | ----------------------- | ---------------------------------------------------------- |
| `@toph-alert/web`          | `apps/web`              | Composition root, rotas, worker outbox, UI dashboard       |
| `@toph-alert/domain`       | `packages/domain`       | Tipos, ports, fingerprint, orquestração (sem HTTP externo) |
| `@toph-alert/integrations` | `packages/integrations` | Adapters HTTP (Runrunit, Discord)                          |
| `@toph-alert/browser-sdk`  | `packages/browser-sdk`  | Captura de erros no browser, snippet CDN                   |

### Regra de camadas

| Camada                  | Faz                                                   | Não faz                        |
| ----------------------- | ----------------------------------------------------- | ------------------------------ |
| `packages/domain`       | Tipos, fingerprint, dedupe, ports                     | HTTP para Runrunit/Discord     |
| `packages/integrations` | Adapters HTTP externos                                | Lógica de negócio / dedupe     |
| `apps/web`              | Composition root, rotas, worker, UI, adapter Supabase | Detalhes de API externa inline |

Labels de pacote no backlog: `pkg:repo`, `pkg:web`, `pkg:domain`, `pkg:browser-sdk`, `pkg:integrations`, `pkg:supabase`.

---

## Architecture Rules

1. **Ports** em `packages/domain` (`TicketPort`, `NotifyPort`, `ErrorStore`).
2. **Adapters** em `packages/integrations` (HTTP) ou `apps/web/lib/supabase` (persistência).
3. **Wiring** somente em [`apps/web/lib/composition-root.ts`](apps/web/lib/composition-root.ts) — ingest, worker e pipeline recebem dependências injetadas.
4. **Env ausente → stub/no-op** com log (sem crash). Hoje: `tickets` e `notify` ainda são stub; `ErrorStore` cai para in-memory se `SUPABASE_SERVICE_ROLE_KEY` ausente.
5. **Ingest** responde **202 Accepted** — sem chamada síncrona a Runrunit/Discord.
6. **Ordem outbox:** step `create_ticket` (Runrunit 200/204) → step `notify` (Discord). Discord **nunca** dispara sem ticket confirmado.
7. **Dedupe:** unique `(loja_id, fingerprint)`; segundo evento igual não cria segundo ticket.
8. **Sentry** apenas em `apps/web` (dashboard). Lojas usam o SDK próprio, não Sentry.
9. **V1 — não implementar:** tabela `clientes`, RLS multi-tenant, painel assinante, Session Replay, novos providers (Slack/Jira/Linear). Ver seção 9 de [`docs/backlog-v1.md`](docs/backlog-v1.md).

---

## Testing Instructions

Ainda **não há** `pnpm test`, Vitest, Jest ou Playwright configurados.

| O que rodar hoje | Comando             |
| ---------------- | ------------------- |
| Lint             | `pnpm lint`         |
| Typecheck        | `pnpm typecheck`    |
| Format check     | `pnpm format:check` |
| Build            | `pnpm build`        |

Testes planejados: **T14** (happy path E2E piloto), **T15** (dedupe + ordem Discord). Ao adicionar testes, documentar o script aqui.

---

## Code Style

- **ESLint 9** flat config: [`eslint.config.mjs`](eslint.config.mjs) (root), [`apps/web/eslint.config.mjs`](apps/web/eslint.config.mjs) (Next)
- **Prettier:** semi, `singleQuote`, `trailingComma: all`, `printWidth: 100` — [`.prettierrc`](.prettierrc)
- **EditorConfig:** LF, indent 2 espaços — [`.editorconfig`](.editorconfig)
- Pacotes TypeScript: ESM, exports via `src/index.ts`
- **Next.js:** ler [`apps/web/AGENTS.md`](apps/web/AGENTS.md) e `node_modules/next/dist/docs/` antes de usar APIs novas (Next 16 tem breaking changes)

---

## Security / Environment

Variáveis em [`.env.example`](.env.example):

| Grupo    | Chaves                                                                                                                           |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Ingest   | `INGEST_RATE_LIMIT_PER_MINUTE` (opcional)                                                                                        |
| Runrunit | `RUNRUNIT_APP_KEY`, `RUNRUNIT_USER_TOKEN`, `RUNRUNIT_PROJECT_ID`, `RUNRUNIT_TYPE_ID`                                             |
| Discord  | `DISCORD_WEBHOOK_URL`                                                                                                            |
| Sentry   | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`                                                    |

**Nunca** commitar `.env` nem expor `SUPABASE_SERVICE_ROLE_KEY` no client. Ingest valida `store_key`, origin vs `allowed_origins` e rate limit por loja.

---

## Build and Deployment

```bash
pnpm build      # build recursivo (web + typecheck nos packages)
pnpm typecheck  # tsc --noEmit em todos os workspaces
```

- **CI:** não há `.github/workflows/` no repo; qualidade via pre-commit local.
- **Deploy:** implícito Vercel (`.vercel` no `.gitignore`).
- **Supabase local:** config em [`supabase/config.toml`](supabase/config.toml); migrations em [`supabase/migrations/`](supabase/migrations/). Para schema/Auth: [`.cursor/skills/supabase/SKILL.md`](.cursor/skills/supabase/SKILL.md).

---

## Pull Request Guidelines

Não há convenção formal de commits/PR no repo. Antes de abrir PR:

1. `pnpm lint` e `pnpm typecheck` verdes
2. Título descritivo do que mudou
3. Não expandir escopo V2 (consultar seção 9 de [`docs/backlog-v1.md`](docs/backlog-v1.md))
4. Novas features seguem composition root + ports (sem wiring manual posterior)
5. Atualizar testes quando T15 estiver implementado

---

## Gotchas

- [`apps/web/lib/composition-root.ts`](apps/web/lib/composition-root.ts) ainda registra **stubs** para `tickets` e `notify` — adapters reais chegam em T07/T08.
- [`apps/web/README.md`](apps/web/README.md) é boilerplate create-next-app, não documentação do produto.
- [`docs/architecture/toph-alert-mvp.html`](docs/architecture/toph-alert-mvp.html) é artefato gerado para visualização — **não** use como fonte de implementação.
- [`docs/adr/001-dependency-cruiser.md`](docs/adr/001-dependency-cruiser.md) define o grafo de camadas; `dependency-cruiser` só no follow-up com CI.
- Spec Sentry pode mencionar replay no edge config — backlog V1 manda **sem Session Replay** no MVP; backlog prevalece.
