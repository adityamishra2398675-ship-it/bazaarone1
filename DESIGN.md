# Design Brief — BazaarOne

**Purpose**: All-in-one Indian e-commerce marketplace combining general shopping (Flipkart-style) and grocery delivery (Zepto-style). Trusted, vibrant, energetic bazaar feel.

## Tone & Differentiation
Vibrant marketplace energy + trustworthy confidence. Warm saffron primary action, cool ocean-blue secondary. Approachable, organized, never corporate. Rupee integration in typography. Product cards feel "alive" with shadows and hover states.

## Palette
| Token | OKLCH | Purpose |
|-------|-------|---------|
| Primary | 0.62 0.25 39 | Warm saffron — CTAs, highlights, primary actions |
| Secondary | 0.58 0.19 263 | Cool ocean blue — secondary actions, badges |
| Accent | 0.68 0.28 34 | Vibrant warm — hot deals, alerts, notifications |
| Destructive | 0.55 0.22 25 | Red — cancel, remove, warnings |
| Muted | 0.93 0.02 72 | Light neutral — secondary text, backgrounds |
| Background | 0.98 0.02 72 | Warm beige — main content area |
| Card | 0.99 0 0 | Pure white — product cards, elevated sections |

## Typography
| Role | Font | Usage |
|------|------|-------|
| Display | Bricolage Grotesque | Page headers, section titles, bold statements |
| Body | DM Sans | Product names, descriptions, UI labels |
| Mono | Geist Mono | Prices, technical info, order numbers |

## Elevation & Depth
- **card**: 0 2px 8px, rgba(0,0,0,0.08) — product cards, form inputs
- **elevated**: 0 4px 16px, rgba(0,0,0,0.12) — headers, modals, important floats
- Borders: subtle, neutral — 0.92 0.02 72 light mode, 0.25 0.02 72 dark mode
- No neon or glow effects — marketplace must feel grounded

## Structural Zones
| Zone | Light BG | Dark BG | Purpose |
|------|----------|---------|---------|
| Header/Nav | 0.99 0 0 (white) | 0.16 0.02 72 | Brand, search, cart — elevated with shadow-elevated |
| Content Grid | 0.98 0.02 72 | 0.12 0.01 72 | Product catalog, search results |
| Cards | 0.99 0 0 | 0.16 0.02 72 | Product items, order cards — shadow-card on hover |
| Sidebar | 0.97 0.03 72 | 0.14 0.02 72 | Category nav, filters |
| Footer | 0.93 0.02 72 | 0.14 0.02 72 | Links, info — border-t subtle |

## Spacing & Rhythm
- Base unit: 4px. Density varies: compact sections (8px gap), spacious product grids (16px), breathing room (24px).
- Card padding: 12-16px (mobile), 16-24px (desktop).
- Form inputs: 8-12px horizontal, 10-14px vertical.

## Component Patterns
- **Buttons**: Primary (saffron), secondary (blue), danger (red), muted (grey). Rounded-md (0.5rem).
- **Product cards**: Image + name/price + quick-add button. Hover: shadow-card, scale 1.02, primary accent on button.
- **Search**: Sticky header, input with ring-primary on focus.
- **Filter sidebar**: Collapsed on mobile, sticky scrollable on desktop. Primary accent on active filters.
- **Order tracking**: Timeline with primary accent for completed steps, muted for pending.

## Motion
- Default transition: all 0.3s ease-out (cubic-bezier 0.4, 0, 0.2, 1).
- Marketplace transition: all 0.2s (faster feedback on product hover/interactions).
- No bounce or spring animations — marketplace urgency demands crisp response.
- Entrance: fade in on page load, stagger product cards by 20ms.

## Constraints
- Minimum contrast: AA+ (light/dark text on any background).
- Imagery: product photography, no generic stock images. Rupee symbol visible on pricing.
- No rainbow palettes, no purple/pink/green mixes.
- Buttons always semantic (primary for purchase, secondary for skip).
- Accessibility: focus rings visible, keyboard navigation on all interactive elements.

## Signature Detail
Warm saffron primary with cool blue secondary creates visual rhythm across product grid. When scrolling, product cards "pop" slightly on hover with card shadow + scale. Rupee symbol in monospace font reinforces Indian marketplace identity. Header search stays sticky, conveying that discovery is central to browsing experience.
