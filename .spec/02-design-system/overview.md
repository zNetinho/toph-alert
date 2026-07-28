---
title: Design System — Overview
description: Direção estética, stack e referências do design system Toph Alert derivado da marca N1.AG.
created: 2026-07-28
source: https://www.n1.ag/
---

# Design System — Overview

Design system do **Toph Alert** derivado dos padrões visuais da [N1.AG](https://www.n1.ag/), levantados via inspeção Playwright em:

- [Home](https://www.n1.ag/)
- [Quem somos](https://www.n1.ag/quem-somos)
- [Blog](https://www.n1.ag/blog)

## Propósito

Fornecer tokens e padrões visuais consistentes para o dashboard de monitoramento proativo de e-commerce, mantendo identidade de marca N1 e suportando temas **dark** (default) e **light** (derivado).

## Direção estética

| Atributo | Valor |
|----------|-------|
| Estilo | Dark-first, industrial/tech |
| Personalidade | Confiante, técnica, premium |
| Paleta dominante | Navy profundo + ciano elétrico + ouro CTA |
| Tipografia display | Archimoto (custom) |
| Tipografia body | Montserrat + Noto Sans |
| Formas | Pills nos CTAs (`rounded-full`), cards com raio 10–12px |
| Motion | Transições curtas (200–300ms), scale no focus de botões |

### O que evitar

- Fontes genéricas como Inter/Roboto como display
- Gradientes roxo/indigo sobre branco
- Cards com sombras pesadas sem propósito
- Light mode como default (marca é dark-first)

## Stack técnica (consumo dos tokens)

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16 App Router |
| Estilo | Tailwind CSS v4 |
| Tokens | CSS custom properties (`:root`, `.dark`, `.light`) |
| Tema | `class` no `<html>` + `color-scheme` |
| Fontes | `@font-face` local (Archimoto) + Google Fonts (Montserrat, Noto Sans) |

### Mapeamento Tailwind v4

```css
@import "tailwindcss";

@theme {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-accent: var(--accent);
  --color-cta: var(--cta);
  --font-display: "Archimoto", "Montserrat", sans-serif;
  --font-body: "Montserrat", "Noto Sans", sans-serif;
  --font-content: "Noto Sans", sans-serif;
}
```

## Fontes

### Archimoto (display / marca)

Fonte proprietária N1. Pesos usados no site:

| Peso | Valor | Uso |
|------|-------|-----|
| Thin | 100 | Decorativo |
| Regular | 400 | Texto display leve |
| Medium | 500 | Nav, captions, labels |
| Black | 900 | Headings, stats, hero |

Arquivos de referência: [`/fonts.css`](https://www.n1.ag/fonts.css)

```
/fonts/ArchimotoN1-Black.woff2
/fonts/ArchimotoV01-Medium.woff2
/fonts/ArchimotoN1-Regular.woff2
/fonts/ArchimotoN1-Thin.woff2
```

### Montserrat (UI / body fallback)

Stack padrão do site: `Montserrat, Noto Sans`. Usada em body, CTAs secundários e elementos de interface.

### Noto Sans (conteúdo)

Usada em parágrafos longos, headings de conteúdo (blog, seções informativas) e labels descritivos.

### Fallback (antes dos assets locais)

Enquanto Archimoto não estiver no monorepo:

- **Display:** `Montserrat, sans-serif`
- **Body:** `Montserrat, Noto Sans, sans-serif`
- **Content:** `Noto Sans, sans-serif`

## Licenciamento

**Archimoto** é fonte proprietária da N1.AG. Antes de incluir os arquivos `.woff2`/`.ttf` no repositório:

1. Confirmar licença de uso interno com a equipe N1
2. Não redistribuir publicamente sem autorização
3. Usar fallbacks (Montserrat) em ambientes sem os assets

## Arquivos desta spec

| Arquivo | Conteúdo |
|---------|----------|
| [colors.md](./colors.md) | Paleta OKLCH/hex, tokens semânticos |
| [typography.md](./typography.md) | Escala tipográfica, roles, mobile |
| [spacing.md](./spacing.md) | Grid, container, paddings, radii |
| [themes.md](./themes.md) | Contrato dark/light, toggle, a11y |
| [components.md](./components.md) | Button, Nav, Badge — spec visual |

## Escopo

- **Incluído:** specs de tokens e componentes em `.spec/02-design-system/`
- **Fora de escopo (fase atual):** implementação de componentes React, scaffold Next.js
