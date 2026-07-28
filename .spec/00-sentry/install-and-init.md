# Sentry — Install & Init

> Fonte seguida: [skills.sentry.dev/instrument](https://skills.sentry.dev/instrument) (first-error setup)  
> SDK: `@sentry/nextjs` (Next.js App Router — prioridade sobre `react` / `node`)  
> Escopo: **first error** → errors + tracing (sem replay/logging/profiling neste passo)

---

## Projeto Sentry

| Campo | Valor |
|-------|--------|
| Org | `agencia-n1` |
| Region | `https://de.sentry.io` |
| Project | `monitoring-ecommerces` |
| Dashboard | https://agencia-n1.sentry.io |
| DSN | `https://ad68696c6ab5943b8b34d84cc44eb8f1@o4511111515340800.ingest.de.sentry.io/4511812813324368` |

> O DSN é público no client (`NEXT_PUBLIC_*`). Não commitar `SENTRY_AUTH_TOKEN` (source maps).

---

## Pré-requisito

App Next.js (App Router) já criada — ver `.spec/01-nextjs-app/`.  
Este passo **não** cria a app; só instrumenta depois que ela existir.

---

## 1. Install

```bash
npm install @sentry/nextjs --save
```

Versão mínima: `@sentry/nextjs` ≥ 8.28.0 (`onRequestError`).

---

## 2. Env

`.env.local` (gitignored):

```bash
NEXT_PUBLIC_SENTRY_DSN=https://ad68696c6ab5943b8b34d84cc44eb8f1@o4511111515340800.ingest.de.sentry.io/4511812813324368
SENTRY_DSN=https://ad68696c6ab5943b8b34d84cc44eb8f1@o4511111515340800.ingest.de.sentry.io/4511812813324368

# Build-time only (source maps) — criar em Sentry → Settings → Auth Tokens
# SENTRY_AUTH_TOKEN=
```

---

## 3. Init (três runtimes)

### `instrumentation-client.ts` (browser)

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
```

### `sentry.server.config.ts` (Node)

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  includeLocalVariables: true,
});
```

### `sentry.edge.config.ts` (Edge)

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  replaysSessionSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### `instrumentation.ts` (registro server)

```typescript
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
```

Colocar na raiz do projeto ou em `src/` conforme a estrutura da app.

---

## 4. App Router — `global-error.tsx`

Em `app/global-error.tsx` (ou `src/app/global-error.tsx`):

```tsx
"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
```

---

## 5. `next.config` + source maps

```typescript
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // config existente
};

export default withSentryConfig(nextConfig, {
  org: "agencia-n1",
  project: "monitoring-ecommerces",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  silent: !process.env.CI,
});
```

Se existir `middleware.ts`, excluir `/monitoring` do matcher.

---

## 6. Verificação (após a app existir)

1. Disparar erro real na app (não script avulso):

```typescript
import * as Sentry from "@sentry/nextjs";
Sentry.captureException(new Error("Sentry test error — delete me"));
```

2. Confirmar no MCP / dashboard (`agencia-n1` / `monitoring-ecommerces`) título, mensagem e URL da issue.
3. Remover o trigger de teste.

---

## Próximos (não fazer neste passo)

- Session Replay, Logging, Profiling, Metrics
- Deploy em produção com DSN + `SENTRY_AUTH_TOKEN` no ambiente de build
- Source maps em `next build` para stack traces legíveis

---

## Status

| Item | Estado |
|------|--------|
| Org / project escolhidos | ✅ `agencia-n1` / `monitoring-ecommerces` |
| DSN obtido via MCP | ✅ |
| Spec install + init | ✅ (este arquivo) |
| Pacote instalado no repo | ⏳ depende de `.spec/01-nextjs-app` |
| Erro real verificado no Sentry | ⏳ após app + install |
