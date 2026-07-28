---
title: Design System — Spacing
description: Grid de espaçamento, container, paddings, gaps e border-radius derivados do n1.ag.
created: 2026-07-28
source: https://www.n1.ag/
---

# Design System — Spacing

## Grid base

Sistema de **4px** como unidade fundamental. Todos os espaçamentos devem ser múltiplos de 4.

| Token | Valor | Uso |
|-------|-------|-----|
| `--space-0` | 0px | Reset |
| `--space-0.5` | 2px | Micro ajustes (pt em pills) |
| `--space-1` | 4px | Gaps mínimos |
| `--space-2` | 8px | Padding interno compacto |
| `--space-2.5` | 10px | Padding vertical de botões outline |
| `--space-3` | 12px | Gaps pequenos |
| `--space-4` | 16px | Padding padrão de componentes |
| `--space-5` | 20px | Padding horizontal mobile, cards |
| `--space-6` | 24px | Gaps médios, seções internas |
| `--space-7` | 30px | Padding vertical de cards |
| `--space-8` | 32px | — |
| `--space-8.5` | 34px | Padding horizontal de grids |
| `--space-10` | 40px | Padding de submenus |
| `--space-15` | 60px | Padding horizontal intermediário (lg) |
| `--space-17.5` | 70px | Margin de seção (mobile) |
| `--space-20` | 80px | Margin de seção (desktop) |
| `--space-30` | 120px | Padding horizontal desktop |

## Container

| Propriedade | Valor | Classe ref. |
|-------------|-------|-------------|
| Max-width | 1440px | `.n1-container` |
| Padding horizontal (mobile) | 20px | `px-5` |
| Padding horizontal (desktop) | 120px | `lg:px-[120px]` |
| Centralização | `margin: 0 auto` | `lg:mx-auto` |

```css
.container {
  width: 100%;
  max-width: 1440px;
  margin-inline: auto;
  padding-inline: 20px;
}

@media (min-width: 1024px) {
  .container {
    padding-inline: 120px;
  }
}
```

## Layout de página

### Margens de seção

| Breakpoint | Margin top/bottom |
|------------|-------------------|
| Mobile | 70px (`mb-[70px]`) |
| Desktop (lg) | 80px (`lg:mb-[80px]`, `lg:mt-[80px]`) |

### Gaps comuns

| Contexto | Valor | Token |
|----------|-------|-------|
| Stack compacto | 8px | `gap-2` |
| Stack padrão | 18px | `gap-[18px]` |
| Stack médio | 24px | `gap-6` |
| Stack largo | 30px | `gap-[30px]` |
| Grid de stats | 18px | `gap-[18px]` |
| Nav items | 8px | `gap-2` |
| Botão com ícone | 8px | `gap-2` |

## Padding por componente

| Componente | Padding | Observação |
|------------|---------|------------|
| CTA primary | `8px 20px` | `py-2 px-5` |
| CTA outline | `11px 20px` | `py-[11px] px-5` |
| Cookie button | `2px 20px 0` | Micro ajuste top |
| Card (blog) | `30px 20px` | `py-[30px] px-5` |
| Dropdown item | `8px` | `p-2` |
| Submenu | `20px 40px 40px` | `pt-5 px-10 pb-10` |
| Header pill | `18px 60px` | `lg:py-[18px] lg:px-[60px]` |

## Border radius

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-none` | 0px | Elementos retos |
| `--radius-sm` | 2px | Inputs DaisyUI |
| `--radius-md` | 8px | Elementos pequenos |
| `--radius-lg` | 10px | Cards, dropdowns |
| `--radius-xl` | 12px | Header pill, containers |
| `--radius-2xl` | 16px | `--rounded-box` DaisyUI |
| `--radius-3xl` | 40px | Submenu bottom |
| `--radius-full` | 100px / 9999px | CTAs pill, badges |

### Mapeamento por componente

| Componente | Radius |
|------------|--------|
| Button primary | `rounded-full` (100px) |
| Button outline | `rounded-full` (100px) |
| Card | `rounded-[10px]` |
| Dropdown | `rounded-[10px]` |
| Header container | `rounded-[12px]` |
| Submenu | `rounded-b-[40px]` |
| Badge | `rounded-full` |
| Input | `0.2rem` (DaisyUI `--rounded-btn`) |

## Motion / timing

| Token | Valor | Uso |
|-------|-------|-----|
| `--duration-fast` | 150ms | Hover sutil |
| `--duration-normal` | 200ms | Inputs (`--animation-input`) |
| `--duration-slow` | 250ms | Botões (`--animation-btn`) |
| `--duration-slower` | 300ms | Transições de tema, modais |
| `--ease-default` | `ease` | Padrão |
| `--scale-focus` | 0.95 | Focus de botão (`--btn-focus-scale`) |

```css
@theme {
  --radius-sm: 2px;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 40px;
  --radius-full: 9999px;

  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 250ms;
  --duration-slower: 300ms;
}
```

## Breakpoints

| Token | Valor | Uso |
|-------|-------|-----|
| `sm` | 640px | — |
| `md` | 768px | — |
| `lg` | 1024px | Container padding, layout desktop |
| `xl` | 1280px | — |
| `2xl` | 1440px | Max container |

Prefixo `mobile:` no site N1 = estilos para viewport menor (equivalente a `< lg`).

## Dashboard Toph Alert — recomendações

| Área | Spacing |
|------|---------|
| Sidebar width | 240–280px |
| Sidebar padding | 16–24px |
| Main content padding | 24px (mobile) → 32–48px (desktop) |
| Card gap (grid) | 16–24px |
| Card padding | 20–24px |
| Section gap | 32–48px |
| Table row height | 48–56px |
| Touch target mínimo | 44px |

## Exemplo de composição

```html
<section class="container my-20">
  <div class="flex flex-col gap-[18px]">
    <h2 class="mb-2">Título</h2>
    <div class="grid grid-cols-3 gap-6">
      <article class="rounded-lg px-5 py-[30px]">Card</article>
    </div>
  </div>
</section>
```
