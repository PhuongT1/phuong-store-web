# Coding Rules — phuong-store-web

## Stack

- **Next.js 15** App Router + TypeScript 5.7 + Tailwind CSS 4 (CSS `@theme inline`)
- **React Hook Form** + Yup for all forms (Formik is banned, removed from project)
- **SWR / SWR Infinite** for data fetching; Saleor GraphQL API
- **Radix UI** primitives wrapped in `src/components/ui/`
- **next-intl** for i18n (`messages/vi/`, `messages/en/`)
- Dark mode via oklch CSS variables in `src/assets/styles/tailwind/theme.css`

## Architecture Rules

1. **Max 230 lines per file.** Split into composable subcomponents / hooks when nearing limit.
2. **SOLID principles.** Single responsibility, open/closed, dependency inversion.
3. **No barrel file re-exports exceeding one level.** `@ui` → `src/components/ui/index.ts` is fine; deeper chains are not.
4. **Colocation.** Place hooks, types, and helpers next to the component that uses them. Only lift to `src/lib/` or `src/hooks/` when shared by 3+ consumers.

## Component Rules

1. **Always use `src/components/ui/` primitives** (Button, Input, Select, Card, Skeleton, etc.). Never create ad-hoc duplicates in feature folders.
2. **Delete duplicates immediately.** If a checkout or section component duplicates a `ui/` component, replace it with the shared one or wrap it as a thin variant.
3. **Export only what's consumed.** No "just in case" exports.
4. **Prefer composition over configuration.** Use `children` + slots, not deeply nested config props.

## Form Rules

1. **React Hook Form only.** No Formik, no custom form state management (except the existing `CheckoutFormContext` migration shim which should eventually move to RHF too).
2. **Yup** for validation schemas.
3. **Never show validation errors before user interaction.** Errors appear only after the field has been touched/blurred.

## Styling Rules

1. **Theme tokens only.** Use semantic CSS variables (`bg-card`, `text-foreground`, `border-border`, etc.). Zero hardcoded Tailwind colors (`bg-gray-200`, `text-red-500`).
2. **oklch color system.** All theme colors defined in oklch in `theme.css` (`:root` and `.dark`).
3. **Tailwind CSS 4.** Use `@theme inline` config, no `tailwind.config.ts`-based color extensions for theme colors.
4. Dark mode: 0.14 background, 0.18 card, 0.20 popover, cool-blue undertone (chroma 0.005, hue 260).
5. **`--info` = emerald green** (`oklch(0.50 0.18 163)` light / `oklch(0.68 0.18 163)` dark). Use `variant="info"` on Button for secondary CTAs: Apply discount, "Add new address". Also drives active radio ring (`border-info`, `fill-info`, `bg-info/5`). Main CTA (Place order) uses `variant="default"` (`--primary` = black).
6. **Sticky layout offset:** Use `sticky top-[calc(var(--header-height)+1.5rem)]` for sidebars/sticky elements — never hardcode `top-20`. `--header-height: 109px` is defined in `theme.css`.

## Skeleton Rules

1. **Skeletons must match the real component's dimensions** — same height, width proportions, gap, and padding.
2. **No skeleton for cached data.** If SWR already has data for a key (from fallback or cache), render the data immediately — never show skeleton over existing content.
3. **Loading states during revalidation:** Use `animate-pulse` on affected price/text rows, not a full skeleton replacement.

## Performance

1. **No CLS (Cumulative Layout Shift).** All images must have explicit `aspect-ratio` or `width`/`height`. Skeletons must match real layout heights.
2. **Lazy load below-fold images** (`loading="lazy"`). First 2-3 product cards get `priority` / `loading="eager"`.
3. **`keepPreviousData: true`** on all SWR infinite hooks to prevent flash-of-skeleton on pagination.

## File Organization

```
src/
  components/ui/       ← shared primitives (Button, Input, Card, Skeleton…)
  components/product/  ← product card, list, filters
  components/cart/     ← cart & summary
  components/skeleton/ ← all skeleton components
  components/layouts/  ← layout wrappers
  checkout/            ← checkout-specific sections, hooks, components
  hooks/               ← shared hooks (useCheckout, useInfiniteProductList…)
  lib/                 ← utilities, API helpers
  styles/              ← tailwind theme, global CSS
```
