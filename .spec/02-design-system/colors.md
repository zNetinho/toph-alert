---
title: Design System — Colors
description: Paleta de cores OKLCH/hex e tokens semânticos derivados do n1.ag.
created: 2026-07-28
source: https://www.n1.ag/
---

# Design System — Colors

Paleta extraída dos tokens DaisyUI (OKLCH) do site N1.AG, com valores hex de referência convertidos via canvas.

## Paleta de marca (primitivos)

| Token | OKLCH | Hex | Uso |
|-------|-------|-----|-----|
| `page-bg` | — | `#0B1227` | Background da página (body) |
| `primary` | `27% 0.11 266` | `#0D1F5B` | Navy — superfícies, texto em CTA |
| `primary-content` | `85% 0.02 266` | `#C8CEDB` | Texto sobre primary / muted claro |
| `secondary` | `77% 0.12 205` | `#36CAD8` | Ciano — destaques, stats, links |
| `secondary-highlight` | — | `#3CCBDA` | Borda/highlight UI (header pill) |
| `accent` | `79% 0.17 77` | `#F6A900` | Ouro — CTA, badges de ação |
| `accent-alt` | — | `#F6AB00` | Variação ouro CTA (botões) |
| `accent-alt-2` | — | `#F8BC33` | Ouro secundário (glows) |
| `neutral` | `98% 0.00 0` | `#F8F8F8` | Superfície clara (submenus) |
| `neutral-content` | `20% 0.00 0` | `#161616` | Texto sobre neutral |
| `base-300` | `23% 0.11 266` | `#06144F` | Superfície elevada dark |
| `base-content` | `46% 0.00 0` | `#585858` | Texto muted, bordas outline |
| `base-200` | `83% 0.00 0` | `#C7C7C7` | Bordas light theme |
| `white` | — | `#FFFFFF` | Texto primário dark, superfícies light |
| `frost-10` | — | `rgba(255,255,255,0.1)` | Overlay sutil |
| `frost-20` | — | `rgba(255,255,255,0.2)` | Chips, bordas translúcidas |

## Cores semânticas

| Token | OKLCH | Hex | Uso |
|-------|-------|-----|-----|
| `success` | `52% 0.12 148` | `#2E7B3F` | Status ok, confirmações |
| `success-content` | `90% 0.02 148` | — | Texto sobre success |
| `warning` | `79% 0.15 86` | `#E5B22D` | Alertas, atenção |
| `warning-content` | `16% 0.03 86` | — | Texto sobre warning |
| `error` | `60% 0.19 32` | `#DA452C` | Erros, falhas críticas |
| `error-content` | `12% 0.04 32` | — | Texto sobre error |
| `info` | `100% 0.00 0` | `#FFFFFF` | Informação neutra |

## Tokens semânticos (UI)

Mapeamento para consumo no app. Valores por tema em [themes.md](./themes.md).

| Token CSS | Descrição |
|-----------|-----------|
| `--bg` | Background da aplicação |
| `--surface` | Cards, painéis, sidebar |
| `--surface-elevated` | Modais, dropdowns, popovers |
| `--text` | Texto primário |
| `--text-muted` | Texto secundário, placeholders |
| `--accent` | Destaques interativos (ciano) |
| `--accent-fg` | Texto sobre accent |
| `--cta` | Botões primários (ouro) |
| `--cta-fg` | Texto sobre CTA |
| `--border` | Bordas de componentes |
| `--border-subtle` | Divisores, separadores |
| `--success` | Status positivo |
| `--warning` | Status de atenção |
| `--danger` | Status de erro |

## Mapeamento dark / light

| Token | Dark | Light |
|-------|------|-------|
| `--bg` | `#0B1227` | `#F8F8F8` |
| `--surface` | `#0D1F5B` | `#FFFFFF` |
| `--surface-elevated` | `#06144F` | `#FFFFFF` |
| `--text` | `#FFFFFF` | `#0D1F5B` |
| `--text-muted` | `#C8CEDB` | `#585858` |
| `--accent` | `#36CAD8` | `#36CAD8` |
| `--accent-fg` | `#020E0F` | `#020E0F` |
| `--cta` | `#F6AB00` | `#F6AB00` |
| `--cta-fg` | `#0D1F5B` | `#0D1F5B` |
| `--border` | `rgba(255,255,255,0.2)` | `#C7C7C7` |
| `--border-subtle` | `rgba(255,255,255,0.1)` | `#E8E8E8` |
| `--success` | `#2E7B3F` | `#2E7B3F` |
| `--warning` | `#E5B22D` | `#E5B22D` |
| `--danger` | `#DA452C` | `#DA452C` |

## CSS variables (referência)

```css
:root,
.dark {
  --bg: #0B1227;
  --surface: #0D1F5B;
  --surface-elevated: #06144F;
  --text: #FFFFFF;
  --text-muted: #C8CEDB;
  --accent: #36CAD8;
  --accent-fg: #020E0F;
  --cta: #F6AB00;
  --cta-fg: #0D1F5B;
  --border: rgba(255, 255, 255, 0.2);
  --border-subtle: rgba(255, 255, 255, 0.1);
  --success: #2E7B3F;
  --warning: #E5B22D;
  --danger: #DA452C;
}

.light {
  --bg: #F8F8F8;
  --surface: #FFFFFF;
  --surface-elevated: #FFFFFF;
  --text: #0D1F5B;
  --text-muted: #585858;
  --accent: #36CAD8;
  --accent-fg: #020E0F;
  --cta: #F6AB00;
  --cta-fg: #0D1F5B;
  --border: #C7C7C7;
  --border-subtle: #E8E8E8;
  --success: #2E7B3F;
  --warning: #E5B22D;
  --danger: #DA452C;
}
```

## Uso por contexto

| Contexto | Cores |
|----------|-------|
| Background app | `--bg` |
| Sidebar / header | `--surface` |
| Card de ticket/alerta | `--surface` + `--border` |
| Stat/métrica destacada | `--accent` (texto) |
| CTA principal | `--cta` bg + `--cta-fg` texto |
| CTA secundário | transparente + `--border` |
| Status erro Sentry | `--danger` |
| Status resolvido | `--success` |
| Status pendente | `--warning` |
| Overlay/modal backdrop | `rgba(11, 18, 39, 0.8)` dark / `rgba(0,0,0,0.4)` light |

## Contraste (WCAG AA)

| Par | Ratio estimado | Status |
|-----|----------------|--------|
| `#FFFFFF` sobre `#0B1227` | > 15:1 | Pass |
| `#FFFFFF` sobre `#0D1F5B` | > 12:1 | Pass |
| `#36CAD8` sobre `#0B1227` | ~8:1 | Pass |
| `#F6AB00` sobre `#0D1F5B` | ~6:1 | Pass (large text) |
| `#0D1F5B` sobre `#F6AB00` | ~6:1 | Pass |
| `#585858` sobre `#F8F8F8` | ~5.5:1 | Pass |
| `#0D1F5B` sobre `#FFFFFF` | > 12:1 | Pass |
