---
title: Design System — Typography
description: Escala tipográfica, famílias, pesos e roles derivados do n1.ag.
created: 2026-07-28
source: https://www.n1.ag/
---

# Design System — Typography

## Famílias

| Token | Stack | Uso |
|-------|-------|-----|
| `--font-display` | `"Archimoto", "Montserrat", sans-serif` | Headings, stats, nav, CTAs display |
| `--font-body` | `"Montserrat", "Noto Sans", sans-serif` | UI geral, labels, botões |
| `--font-content` | `"Noto Sans", sans-serif` | Parágrafos longos, conteúdo editorial |

### Pesos disponíveis

| Família | Pesos |
|---------|-------|
| Archimoto | 100 (Thin), 400 (Regular), 500 (Medium), 900 (Black) |
| Montserrat | 400, 500, 600, 700 |
| Noto Sans | 400, 600, 700, 900 |

## Escala tipográfica

### Desktop (≥1024px)

| Role | Token | Família | Size | Weight | Line-height | Letter-spacing | Transform |
|------|-------|---------|------|--------|-------------|----------------|-----------|
| Display mega | `text-display-mega` | Archimoto | 340px | 900 | 1.5 | 102px | none |
| Display XL | `text-display-xl` | Archimoto | 80px | 900 | 1.5 | normal | none |
| Display L / H1 | `text-display-l` | Archimoto | 60px | 900 | 1.0 | normal | none |
| H2 | `text-h2` | Archimoto | 48px | 900 | 1.2 | normal | none |
| Stat | `text-stat` | Archimoto | 40px | 900 | 1.5 | normal | none |
| H2 content | `text-h2-content` | Noto Sans | 32px | 900 | 38px | normal | none |
| H3 section | `text-h3` | Noto Sans | 30px | 600 | 40px | normal | none |
| H3 sub | `text-h3-sub` | Noto Sans | 20px | 700 | 24px | normal | none |
| Body LG | `text-body-lg` | Noto Sans | 18px | 400 | 36px | normal | none |
| Body | `text-body` | Montserrat | 16px | 400 | 24px | normal | none |
| Nav | `text-nav` | Archimoto | 16px | 500 | 22px | normal | uppercase |
| CTA | `text-cta` | Archimoto / Montserrat | 14px | 400–600 | 21px | normal | none |
| CTA outline | `text-cta-outline` | Archimoto | 14px | 600 | 14px | normal | uppercase |
| Caption | `text-caption` | Archimoto | 12px | 500 | 22px | normal | none |
| Micro | `text-micro` | Archimoto | 12px | 500 | 38px | normal | none |

### Mobile (<1024px)

Redução de ~40–50% nos displays. Utilitários observados no site: `mobile:text-12`, `mobile:text-14`, `mobile:text-20`, `mobile:text-22`, `mobile:text-24`.

| Role | Desktop | Mobile |
|------|---------|--------|
| Display L / H1 | 60px | 24px |
| H2 | 48px | 24px |
| Stat | 40px | 22px |
| H2 content | 32px | 20px |
| H3 section | 30px | 20px |
| Body LG | 18px | 16px |
| Body | 16px | 14px |
| Caption | 12px | 12px |

## Roles por contexto

### Dashboard Toph Alert

| Elemento | Role | Token |
|----------|------|-------|
| Título da página | Display L | `text-display-l` (reduzido para 32–40px no dashboard) |
| Título de seção | H3 section | `text-h3` |
| Título de card/ticket | H3 sub | `text-h3-sub` |
| Métrica/KPI | Stat | `text-stat` |
| Corpo de descrição | Body | `text-body` |
| Label de campo | Body | `text-body` + `font-medium` |
| Nav sidebar | Nav | `text-nav` (sem uppercase no dashboard) |
| Timestamp/metadata | Caption | `text-caption` + `text-muted` |
| Badge de status | Caption | `text-caption` + `font-medium` |

### Marketing (referência N1)

| Elemento | Role |
|----------|------|
| Hero headline | Display L |
| Marquee animado | Display XL |
| Logo decorativo | Display mega (stroke) |
| Stats em grid | Stat + Body LG |
| Nav header | Nav (uppercase) |

## Headings HTML

| Tag | Role default | Família | Observação |
|-----|--------------|---------|------------|
| `h1` | Display L | Archimoto | Uma por página |
| `h2` | H2 ou H2 content | Archimoto / Noto Sans | Seções |
| `h3` | H3 section / sub | Noto Sans | Subseções |
| `h4` | Stat | Archimoto | Métricas |
| `h5` | H3 sub | Noto Sans | Labels de grupo |
| `h6` | Body + semibold | Montserrat | Micro-headings |

## CSS variables (referência)

```css
@theme {
  --font-display: "Archimoto", "Montserrat", sans-serif;
  --font-body: "Montserrat", "Noto Sans", sans-serif;
  --font-content: "Noto Sans", sans-serif;

  --text-display-mega: 340px;
  --text-display-xl: 80px;
  --text-display-l: 60px;
  --text-h2: 48px;
  --text-stat: 40px;
  --text-h2-content: 32px;
  --text-h3: 30px;
  --text-h3-sub: 20px;
  --text-body-lg: 18px;
  --text-body: 16px;
  --text-nav: 16px;
  --text-cta: 14px;
  --text-caption: 12px;

  --leading-tight: 1.0;
  --leading-snug: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 2.0;
}
```

## Classes utilitárias (Tailwind)

```html
<!-- Display -->
<h1 class="font-display text-display-l font-black leading-tight">Título</h1>

<!-- Stat -->
<span class="font-display text-stat font-black text-accent">90</span>

<!-- Body -->
<p class="font-content text-body-lg">Descrição longa...</p>

<!-- Nav -->
<a class="font-display text-nav font-medium uppercase">Dashboard</a>

<!-- Caption -->
<span class="font-display text-caption text-muted">há 2 min</span>
```

## Carregamento de fontes

```css
/* Archimoto — local */
@font-face {
  font-family: "Archimoto";
  src: url("/fonts/ArchimotoN1-Black.woff2") format("woff2");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Archimoto";
  src: url("/fonts/ArchimotoV01-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Archimoto";
  src: url("/fonts/ArchimotoN1-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* Montserrat + Noto Sans — Google Fonts */
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Noto+Sans:wght@400;600;700;900&display=swap");
```

## Acessibilidade

- Tamanho mínimo de body: 14px (mobile), 16px (desktop)
- Line-height mínimo para body: 1.5
- Não usar font-weight < 400 para texto funcional
- Headings seguem hierarquia semântica (h1 → h6), estilo visual pode variar via classes
