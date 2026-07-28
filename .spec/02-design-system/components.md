---
title: Design System — Components
description: Especificação visual de Button, Nav e Badge derivados do n1.ag.
created: 2026-07-28
source: https://www.n1.ag/
---

# Design System — Components

Especificação visual (sem implementação React). Tokens referenciados de [colors.md](./colors.md), [typography.md](./typography.md) e [spacing.md](./spacing.md).

---

## Button

### Variantes

#### 1. Primary (CTA)

Botão de ação principal. Fundo ouro, texto navy.

| Propriedade | Valor |
|-------------|-------|
| Background | `--cta` (`#F6AB00`) |
| Text | `--cta-fg` (`#0D1F5B`) |
| Font | `font-body` / `text-cta` (14px, 400) |
| Padding | `8px 20px` |
| Border radius | `rounded-full` (100px) |
| Border | none |
| Height | ~46px |
| Transition | `background-color 250ms, transform 250ms` |
| Focus | `scale(0.95)` + ring `--accent` |

**Estados:**

| Estado | Background | Text | Outros |
|--------|------------|------|--------|
| Default | `--cta` | `--cta-fg` | — |
| Hover | `#F8BC33` (gold-alt) | `--cta-fg` | — |
| Active | `#E5A000` | `--cta-fg` | `scale(0.95)` |
| Focus | `--cta` | `--cta-fg` | ring 2px `--accent` |
| Disabled | `--cta` @ 50% opacity | `--cta-fg` @ 50% | `cursor: not-allowed` |
| Loading | `--cta` | transparent | spinner `--cta-fg` |

**Exemplo visual (N1):** "Fale com um especialista", "Contato"

```
┌─────────────────────────────┐
│  Fale com um especialista → │  bg: #F6AB00, text: #0D1F5B
└─────────────────────────────┘
```

#### 2. Outline Muted

Botão secundário com borda sutil. Usado em contextos sobre dark.

| Propriedade | Valor |
|-------------|-------|
| Background | transparent |
| Text | `--text-muted` (`#585858` dark / light) |
| Font | `font-display` / `text-cta-outline` (14px, 600, uppercase) |
| Padding | `11px 20px` |
| Border | `1px solid #585858` |
| Border radius | `rounded-full` |
| Box shadow | `0 1px 2px rgba(0,0,0,0.05)` |

**Estados:**

| Estado | Background | Border | Text |
|--------|------------|--------|------|
| Default | transparent | `#585858` | `--text-muted` |
| Hover | `rgba(255,255,255,0.05)` | `#585858` | `--text` |
| Active | `rgba(255,255,255,0.1)` | `#585858` | `--text` |
| Focus | transparent | `--accent` | `--text` |
| Disabled | transparent | `--border` @ 50% | `--text-muted` @ 50% |

**Exemplo visual (N1):** "Conheça mais dos nossos serviços"

```
┌─────────────────────────────────┐
│  CONHEÇA MAIS DOS NOSSOS SERVIÇOS │  border: #585858, uppercase
└─────────────────────────────────┘
```

#### 3. Outline Light

Botão com borda branca. Usado sobre backgrounds dark.

| Propriedade | Valor |
|-------------|-------|
| Background | transparent |
| Text | `--text` (`#FFFFFF`) |
| Font | `font-display` (14px, 500) |
| Padding | `4px 20px` |
| Border | `1px solid #FFFFFF` |
| Border radius | `rounded-full` |

**Estados:**

| Estado | Background | Border | Text |
|--------|------------|--------|------|
| Default | transparent | `#FFFFFF` | `#FFFFFF` |
| Hover | `rgba(255,255,255,0.1)` | `#FFFFFF` | `#FFFFFF` |
| Active | `rgba(255,255,255,0.2)` | `#FFFFFF` | `#FFFFFF` |
| Focus | transparent | `--accent` | `#FFFFFF` |

**Exemplo visual (N1 blog):** Tags de categoria

```
┌──────────────┐
│  Categoria   │  border: white, text: white
└──────────────┘
```

### Tamanhos

| Size | Padding | Font | Height |
|------|---------|------|--------|
| `sm` | `4px 16px` | 12px | ~32px |
| `md` (default) | `8px 20px` | 14px | ~46px |
| `lg` | `11px 24px` | 16px | ~52px |

### Props (referência para implementação futura)

```tsx
interface ButtonProps {
  variant?: 'primary' | 'outline-muted' | 'outline-light' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  children: React.ReactNode
  onClick?: () => void
}
```

---

## Nav Link

Link de navegação do header/sidebar.

### Header Nav (marketing)

| Propriedade | Valor |
|-------------|-------|
| Font | `font-display` / `text-nav` (16px, 500) |
| Text transform | `uppercase` |
| Color | `--text` (`#FFFFFF` dark) |
| Padding | 0 |
| Letter-spacing | normal |
| Transition | `color 200ms` |

**Estados:**

| Estado | Color | Outros |
|--------|-------|--------|
| Default | `--text` | — |
| Hover | `--accent` | underline animado (opcional) |
| Active | `--accent` | font-weight 600 |
| Focus | `--accent` | ring |

**Exemplo visual (N1):** "quem somos", "cases", "clientes", "serviços", "blog"

### Sidebar Nav (dashboard)

| Propriedade | Valor |
|-------------|-------|
| Font | `font-body` (14px, 500) |
| Text transform | none (sentence case) |
| Color | `--text-muted` |
| Padding | `8px 12px` |
| Border radius | `8px` |
| Gap (icon + text) | `8px` |

**Estados:**

| Estado | Background | Color |
|--------|------------|-------|
| Default | transparent | `--text-muted` |
| Hover | `--border-subtle` | `--text` |
| Active | `--surface-elevated` | `--accent` |
| Focus | transparent | `--text` + ring |

```
Sidebar:
┌────────────────────┐
│ ◉ Dashboard        │  active: accent text
│   Tickets          │  default: muted
│   Alertas          │
│   Configurações    │
└────────────────────┘
```

### Props (referência)

```tsx
interface NavLinkProps {
  href: string
  active?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  variant?: 'header' | 'sidebar'
}
```

---

## Badge / Chip

Indicadores de status, tags e labels compactos.

### Variante Frost (overlay)

| Propriedade | Valor |
|-------------|-------|
| Background | `rgba(255,255,255,0.1)` dark / `rgba(0,0,0,0.05)` light |
| Text | `--text` |
| Font | `text-caption` (12px, 500) |
| Padding | `4px 12px` |
| Border radius | `rounded-full` |
| Border | `1px solid rgba(255,255,255,0.2)` dark / `--border` light |

### Variante Status

| Status | Background | Text | Border |
|--------|------------|------|--------|
| Success | `--success` @ 15% | `--success` | `--success` @ 30% |
| Warning | `--warning` @ 15% | `--warning` | `--warning` @ 30% |
| Danger | `--danger` @ 15% | `--danger` | `--danger` @ 30% |
| Info | `--accent` @ 15% | `--accent` | `--accent` @ 30% |
| Neutral | `--border-subtle` | `--text-muted` | `--border` |

### Variante Accent (destaque)

| Propriedade | Valor |
|-------------|-------|
| Background | `--accent` |
| Text | `--accent-fg` |
| Font | `text-caption` (12px, 600) |
| Padding | `2px 10px` |
| Border radius | `rounded-full` |

### Tamanhos

| Size | Padding | Font |
|------|---------|------|
| `sm` | `2px 8px` | 10px |
| `md` | `4px 12px` | 12px |
| `lg` | `6px 16px` | 14px |

### Props (referência)

```tsx
interface BadgeProps {
  variant?: 'frost' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}
```

**Exemplos de uso no Toph Alert:**

```
┌─────────┐  ┌──────────┐  ┌─────────┐
│ Aberto  │  │ Crítico  │  │ Sentry  │
└─────────┘  └──────────┘  └─────────┘
  warning      danger        info
```

---

## Card (referência)

Superfície container para tickets, alertas e métricas.

| Propriedade | Dark | Light |
|-------------|------|-------|
| Background | `--surface` | `--surface` |
| Border | `1px solid --border` | `1px solid --border` |
| Border radius | `10px` | `10px` |
| Padding | `20–24px` | `20–24px` |
| Shadow | none | `--shadow` |

### Card com gradiente (referência blog N1)

```
background: linear-gradient(181deg, #FFFFFF -176%, transparent 50%)
border-radius: 10px
padding: 30px 20px
```

Usar apenas em contextos promocionais, não no dashboard funcional.

---

## Input (referência mínima)

| Propriedade | Valor |
|-------------|-------|
| Background | transparent (dark) / `--surface` (light) |
| Border | `1px solid --border` |
| Border radius | `8px` |
| Padding | `10px 16px` |
| Font | `text-body` (16px) |
| Color | `--text` |
| Placeholder | `--text-muted` |
| Focus border | `--accent` |
| Height | ~44px |

---

## Acessibilidade (todos os componentes)

- Touch target mínimo: **44×44px**
- Focus visible: `outline: 2px solid var(--accent); outline-offset: 2px`
- Contraste AA em todos os estados (default, hover, active, disabled)
- `aria-disabled` em botões desabilitados
- `aria-current="page"` em nav links ativos
- `role="status"` em badges de status dinâmicos
- Keyboard: Tab para navegar, Enter/Space para ativar botões
