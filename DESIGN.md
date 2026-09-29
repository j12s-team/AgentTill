---
# ==============================================================================
# DESIGN.md — AgentTill
# One system: a dark USDC desk. Brand and product share the same ink canvas
# and the arc-blue seed #339FFF already shipping in the frontend.
# Colors below are the live Tailwind theme, not a new palette.
# ==============================================================================

# ------------------------------------------------------------------------------
# LAYER 1 — BRAND IDENTITY  (wordmark, landing, hero wash)
# Aesthetic: dark settlement desk · arc blue on near-black ink
# ------------------------------------------------------------------------------

brand:
  positioning: "A policy-bound USDC till. The owner sets the budget. The agent spends inside it."
  workflow: "fund · cap · allowlist · spend — pause if it drifts"

  # Arc scale from apps/web/tailwind.config.ts (`arc`). Ordered light → deep.
  # arc-500 is the seed shared with glows, selection, and primary actions.
  spectrum:
    mist:    "#EEF9FF"   # arc-50
    ice:     "#D9F1FF"   # arc-100
    sky:     "#8ED8FF"   # arc-300, link and eyebrow accent
    bright:  "#59C0FF"   # arc-400
    blue:    "#339FFF"   # SEED — arc-500
    action:  "#1A7FF5"   # arc-600, filled buttons
    deep:    "#1469E1"   # arc-700
  spectrum-gradient: "linear-gradient(100deg,#8ED8FF,#339FFF,#1A7FF5)"

  # Status hues already used on stat cards and the spend console.
  # They are signals, not a second brand rainbow.
  status:
    settled: "#34D399"   # emerald-400, executed payments
    fund:    "#10B981"   # emerald-500, fund / positive wash
    caution: "#F59E0B"   # amber-500, cap pressure
    rejected: "#FB7185"  # rose-400, policy rejection

  # Dark brand surfaces (landing hero, header, contained mark)
  surfaces:
    void:    "#070B14"   # ink-950, page canvas
    panel:   "#0C1220"   # ink-900, raised card
    panel-2: "#121A2B"   # ink-800, inset well
    panel-3: "#1A2438"   # ink-700
    line:    "rgba(255,255,255,0.10)"
    line-soft: "rgba(255,255,255,0.05)"
    text:    "#E2E8F0"   # body, matches globals.css
    dim:     "#94A3B8"   # slate-400

  typography:
    display:
      fontFamily: "Geist Sans"
      usage: "AgentTill wordmark and hero. Sentence case. No wide tracking, no all-caps display."
    interface:
      fontFamily: "Geist Sans"
      usage: "Positioning lines, landing body, button labels"
    mono:
      fontFamily: "Geist Mono"
      usage: "Addresses, tx hashes, amounts, policy keys. Normal case. No letter-spacing stunt."

  logo:
    construction: "Wordmark only in the current frontend. No tile mosaic, no glitch mark."
    color-flow: "arc-300 on the name accent, white on the rest, sitting on ink-950"
    glow: "shadow-glow: 0 0 40px rgba(51,159,255,0.15) on the header mark and stat cards"
    motion: "none required. Honor prefers-reduced-motion if any wash is animated later."
    meaning: "a till: USDC in, policy around it, spend out"
    motifs: "two radial washes on the canvas only — arc blue at 18% top-left, emerald at 8% top-right. No scanlines, no chromatic split."
    clear-space: "≥ 16px around the wordmark"
    min-size: "16px type (wordmark)"

# ------------------------------------------------------------------------------
# LAYER 2 — PRODUCT UI  (dashboard, spend console, owner controls, ledger)
# Dark only. Roles below match classes already in the app.
# ------------------------------------------------------------------------------

colors:
  # The app ships dark (`color-scheme: dark` in globals.css). These are the
  # roles a light theme would use if one is ever added. Do not invent it now.
  primary: "#1A7FF5"
  on-primary: "#FFFFFF"
  primary-container: "#142D57"
  on-primary-container: "#D9F1FF"

  secondary: "#243049"
  on-secondary: "#E2E8F0"
  secondary-container: "#1A2438"
  on-secondary-container: "#E2E8F0"

  tertiary: "#10B981"
  on-tertiary: "#FFFFFF"
  tertiary-container: "#064E3B"
  on-tertiary-container: "#D1FAE5"

  background: "#F8FAFC"
  on-background: "#0C1220"
  surface: "#FFFFFF"
  on-surface: "#0C1220"
  surface-variant: "#E2E8F0"
  on-surface-variant: "#334155"
  outline: "#94A3B8"
  outline-variant: "#E2E8F0"

  error: "#E11D48"
  on-error: "#FFFFFF"
  error-container: "#FFE4E6"
  on-error-container: "#881337"

colors-dark:
  # What the frontend actually renders today.
  primary: "#339FFF"
  on-primary: "#FFFFFF"
  primary-container: "#1A7FF5"
  on-primary-container: "#FFFFFF"
  secondary: "#243049"
  on-secondary: "#E2E8F0"
  surface: "#0C1220"
  on-surface: "#E2E8F0"
  surface-variant: "#121A2B"
  on-surface-variant: "#94A3B8"
  outline: "rgba(255,255,255,0.10)"
  outline-variant: "rgba(255,255,255,0.05)"
  background: "#070B14"
  error: "#FB7185"
  on-error: "#0C1220"
  success: "#34D399"
  warning: "#F59E0B"

typography:
  # Product and brand share Geist. Sizes follow the classes in the app,
  # not a Material type ramp.
  display-lg:  { fontFamily: "Geist Sans", fontSize: "48px", fontWeight: "600", lineHeight: "56px", letterSpacing: "-0.02em" }
  headline-lg: { fontFamily: "Geist Sans", fontSize: "30px", fontWeight: "600", lineHeight: "36px", letterSpacing: "-0.02em" }
  title-lg:    { fontFamily: "Geist Sans", fontSize: "20px", fontWeight: "600", lineHeight: "28px", letterSpacing: "0px" }
  title-md:    { fontFamily: "Geist Sans", fontSize: "16px", fontWeight: "500", lineHeight: "24px", letterSpacing: "0px" }
  body-lg:     { fontFamily: "Geist Sans", fontSize: "16px", fontWeight: "400", lineHeight: "24px", letterSpacing: "0px" }
  body-md:     { fontFamily: "Geist Sans", fontSize: "14px", fontWeight: "400", lineHeight: "20px", letterSpacing: "0px" }
  label-lg:    { fontFamily: "Geist Sans", fontSize: "14px", fontWeight: "500", lineHeight: "20px", letterSpacing: "0px" }
  label-md:    { fontFamily: "Geist Sans", fontSize: "12px", fontWeight: "500", lineHeight: "16px", letterSpacing: "0px" }
  mono-md:     { fontFamily: "Geist Mono", fontSize: "12px", fontWeight: "400", lineHeight: "16px", letterSpacing: "0px" }

layout:
  grid-unit: "8px"
  half-unit: "4px"
  margin-mobile: "16px"
  margin-desktop: "24px"
  gutter-desktop: "16px"
  max-width-desktop: "1152px"   # max-w-6xl on the header

elevation:
  level0: "none"
  level1: "0 0 40px rgba(51,159,255,0.15)"   # shadow-glow
  level2: "inset 0 0 0 1px rgba(255,255,255,0.05)"
  level3: "inset 0 0 0 1px rgba(255,255,255,0.10), 0 0 40px rgba(51,159,255,0.15)"

shapes:
  none: "0px"
  sm: "6px"     # rounded-md, compact header chips
  md: "8px"     # rounded-lg, inputs and most buttons
  lg: "12px"    # rounded-xl
  xl: "16px"    # rounded-2xl, cards, console, ledger
  full: "9999px"

components:
  card-panel:
    backgroundColor: "{colors-dark.surface}"
    textColor: "{colors-dark.on-surface}"
    borderColor: "{colors-dark.outline-variant}"
    rounded: "{shapes.xl}"
    padding: "20px"

  button-filled:
    backgroundColor: "{colors-dark.primary-container}"
    textColor: "{colors-dark.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{shapes.md}"
    padding: "12px 16px"

  button-positive:
    backgroundColor: "#059669"
    textColor: "#FFFFFF"
    rounded: "{shapes.md}"

  input:
    backgroundColor: "{brand.surfaces.void}"
    textColor: "#FFFFFF"
    borderColor: "{colors-dark.outline}"
    rounded: "{shapes.md}"

  stat-wash:
    # Stat cards: a 20% status tint into ink-900. Arc, emerald, amber, or rose.
    backgroundImage: "linear-gradient(to bottom right, rgba(51,159,255,0.20), #0C1220)"
    rounded: "{shapes.xl}"
    elevation: "{elevation.level1}"
---

## Overview

AgentTill is an onchain USDC desk for an AI agent. A person funds the till and sets the policy (per-payment cap, daily cap, payee allowlist, pause). The agent calls `spend` inside those bounds. Gas and payout are both USDC on Arc.

The look already shipping in `apps/web` is one dark system, not two palettes:

1. **Brand** — the landing page and header. Ink canvas `#070B14`, arc-blue wordmark accent, a soft blue wash and a fainter green wash. No neon spectrum, no mosaic tiles.
2. **Product** — dashboard, spend console, owner controls, ledger. Same ink panels, arc-blue primary actions, emerald for money in and settled payments, rose for rejections, amber for pressure.

**When in doubt, use the token that is already in Tailwind.** Do not introduce a new hue to make a screen feel more "designed."

---

## Brand Identity (Layer 1)

**Concept.** A till, not a fund and not a mosaic. The mark is the word AgentTill. The only decoration is light: an arc-blue glow and two radial washes on the page background.

**Color.** Seed `#339FFF` (`arc-500`, and `rgba(51, 159, 255, …)` in `globals.css`). The usable ramp is the `arc` scale from mist `#EEF9FF` down to deep `#1469E1`. Filled actions use `#1A7FF5` (`arc-600`). Status color is separate and small: emerald when a payment clears, rose when policy rejects it, amber when a cap is under pressure.

**Type.**

* **Geist Sans** — wordmark, headlines, body, buttons. Loaded as `--font-geist-sans`.
* **Geist Mono** — addresses, amounts, hashes, policy field names. Loaded as `--font-geist-mono`.

**Motifs (canvas only).** Top-left arc wash at 18% opacity, top-right emerald wash at 8% opacity, both fading to transparent. Selection highlight is arc blue at 35%. Do not add scanlines, glitch, or a rainbow gradient.

**Logo usage.** Keep the wordmark on `#070B14` or on a `bg-white/5` chip. Accent the "Till" or the live-address chip with `arc-300` / `arc-400`. Do not recolor it with emerald, rose, or amber. Those three are status, not identity.

---

## Product UI — Colors (Layer 2)

The dashboard is dark. There is no light theme in the app. Pair every surface with the text role next to it.

* **Primary** — connect, spend, and other arc-blue fills. Button fill `#1A7FF5`, hover and focus ring `#339FFF`, label white.
* **Surface** — cards and the console sit on `#0C1220` or `#121A2B`, hairline `rgba(255,255,255,0.05)` or `0.10`. Page behind them is `#070B14`.
* **Text** — titles white, body `#E2E8F0`, secondary `#94A3B8` (slate-400), meta `#64748B` (slate-500).
* **Success** — executed rows and the fund action. Text `#34D399`, fill around `#059669`.
* **Warning** — cap pressure on a stat card. Amber `#F59E0B` at 20% into the card, never as a button.
* **Error** — rejected spend and form errors. `#FB7185`.

Do not ship the light `colors` block until a light theme exists. It is a reserve map so a future toggle has roles, not a second design.

---

## Product UI — Typography

Geist Sans for everything a person reads. Geist Mono for anything a person copies (address, amount, tx, cap).

* **Display / headline** — landing hero only.
* **Title** — card headers, dashboard section labels.
* **Body** — explanations under a control.
* **Label** — buttons, chips, table headers. 12px and 14px are the sizes already in use.
* **Mono** — ledger cells and policy readouts. Do not set these in sans.

---

## Layout & Spacing

8px grid. The header content width is `max-w-6xl` (1152px). Cards gap at 16px (`gap-4`). Form controls use 8px and 12px padding (`py-2 px-3`). Do not invent a 1200px frame. The app is already 1152px.

---

## Elevation

Depth comes from a lighter panel on a darker canvas, plus a 1px white hairline. The only shadow in the theme is `shadow-glow` (`0 0 40px rgba(51,159,255,0.15)`), and it belongs on the header mark and stat cards, not on every input.

---

## Shapes

* **`sm` / `md`** — header chips, inputs, buttons (`rounded-md`, `rounded-lg`).
* **`xl`** — stat cards, spend console, owner panel, ledger (`rounded-2xl`).
* **`full`** — the live-network pill and agent status dot only. Buttons are not pills.

---

## Components

* **Filled button** — `bg-arc-600`, white label, `rounded-lg`. Hover can step to `arc-500`. One primary per view (Execute payment, or the owner action in focus).
* **Positive button** — fund uses emerald (`bg-emerald-600/90` to `bg-emerald-500`). Do not use emerald for spend.
* **Panel** — `rounded-2xl`, `border-white/5` or `/10`, background `ink-900` or `ink-950`.
* **Input** — `bg-ink-950`, `border-white/10`, white text, `rounded-lg`.
* **Stat card** — gradient from a 20% status tint (`arc`, `emerald`, `amber`, or `rose`) into `ink-900`, plus `shadow-glow` when it is the lead figure.
* **Ledger** — row text `slate-300` / `slate-400`, executed amount `emerald-300` or `arc-300`, hairline `border-white/5`.

---

## Do's and Don'ts

### Do

* **Do** keep using `arc`, `ink`, slate, emerald, amber, and rose as they are used now.
* **Do** keep the app dark. The canvas is `#070B14`.
* **Do** put addresses and amounts in Geist Mono.
* **Do** use emerald for settled or funded, rose for rejected, amber only as a wash.
* **Do** reference tokens (`arc-500`, `ink-950`) instead of new hex in components.

### Don't

* **Don't** import a neon spectrum (cyan, magenta, pink, sunset) or a mosaic tile mark. That is a different product.
* **Don't** swap Geist for Michroma, Space Grotesk, Roboto, or a display face.
* **Don't** turn buttons into full pills.
* **Don't** use emerald as the primary action color. Spend stays arc blue.
* **Don't** add a light theme, scanlines, or glitch motion in this file's name. The frontend does not have them.

---

## Implementation Notes

* **Source of truth.** `apps/web/tailwind.config.ts` holds `arc`, `ink`, Geist families, and `shadow-glow`. `apps/web/src/app/globals.css` holds the canvas `#070B14`, body text `#E2E8F0`, the two radial washes, and the selection color. This document describes that theme. It does not change it.
* **Seed.** `#339FFF` / `rgb(51, 159, 255)`. Not `#319EFF`.
* **No Material layer.** Contrast is handled by white and slate on ink, not by an HCT palette. If a component needs a color, it should already exist in the `arc` or `ink` scale or in the status trio.
* **Scope.** Landing and dashboard share this system. Do not fork a second palette for the hero.

---

## Recorded from the frontend

Read from the AgentTill web app as it stands: `arc` 50–950, `ink` 600–950, Geist Sans, Geist Mono, `shadow-glow`, and the status washes on stat cards (arc, emerald, amber, rose). No new colors were added.
