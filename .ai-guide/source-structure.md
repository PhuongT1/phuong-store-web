# Source Structure — Saleor Storefront (Next.js)

> Tài liệu này mô tả cấu trúc source code để AI có thể hiểu và làm việc hiệu quả với dự án.
> **Cập nhật:** 2026-03-08

---

## Tech Stack

| Lớp              | Công nghệ                                              |
| ---------------- | ------------------------------------------------------ |
| Framework        | Next.js 15 (App Router)                                |
| Language         | TypeScript (strict mode)                               |
| Styling          | TailwindCSS + shadcn/ui                                |
| State Management | Zustand (`src/store/`) + SWR (`src/app/provider/swr/`) |
| Auth             | NextAuth v4 (`src/auth/`)                              |
| i18n             | next-intl (EN + VI)                                    |
| GraphQL          | Apollo / codegen (`src/graphql/`)                      |
| Fonts            | Inter (Google Fonts)                                   |
| Testing          | Vitest + Playwright                                    |

---

## Path Aliases (tsconfig.json)

```ts
"@/*"           → src/*
"@ui/*"         → src/components/ui/*
"@ui"           → src/components/ui/index.ts
"@components/*" → src/components/*
"@constants/*"  → src/constants/*
"@config/*"     → src/config/*
"@type"         → src/types/
"@services/*"   → src/services/*
"@services"     → src/services/index.ts
"@lib/*"        → src/lib/*
"@sections/*"   → src/checkout/sections/*
"@checkout/*"   → src/checkout/*
"@hooks/*"      → src/hooks/*
"@assets/*"     → src/assets/*
"@provider/*"   → src/app/provider/*
"@store/*"      → src/store/*
"@i18n/*"       → src/i18n/*
```

---

## Cấu trúc thư mục tổng quan

```
/
├── src/
│   ├── app/                  # Next.js App Router
│   ├── action/               # Server Actions
│   ├── assets/               # Static assets (icons, styles)
│   ├── auth/                 # NextAuth config
│   ├── checkout/             # Module Checkout (self-contained)
│   ├── components/           # Shared UI Components
│   ├── config/               # App config & routes
│   ├── constants/            # Constants
│   ├── graphql/              # GraphQL queries/mutations/fragments
│   ├── hooks/                # Custom React hooks
│   ├── i18n/                 # Internationalization
│   ├── lib/                  # Utility libraries
│   ├── regions/              # Channel/Region config
│   ├── services/             # API service layer
│   ├── store/                # Zustand global state
│   ├── types/                # TypeScript types
│   └── ui/                   # Headless UI atoms
├── messages/                 # i18n messages (en/, vi/)
├── public/                   # Static files
├── __tests__/                # Integration tests
└── test/                     # E2E tests (Playwright)
```

---

## Chi tiết từng module

### `src/app/` — Next.js App Router

```
app/
├── (auth)/                   # Auth group layout
│   ├── __tests__/            # Auth tests
│   └── sign-in/              # Sign-in page
├── (shop)/                   # Shop group layout
│   ├── [channel]/            # Dynamic channel (e.g. /default-channel/)
│   │   ├── (main)/           # Main layout
│   │   │   ├── (catalog)/    # Product catalog routes
│   │   │   │   ├── categories/   → /categories/[slug]
│   │   │   │   ├── collections/  → /collections/[slug]
│   │   │   │   ├── products/     → /products/[slug]
│   │   │   │   └── search/       → /search
│   │   │   ├── cart/             → /cart
│   │   │   ├── pages/            → /page/[slug]
│   │   │   ├── ProductListFeature.tsx
│   │   │   └── ProductListSale.tsx
│   │   └── layout.tsx        # Channel layout
│   ├── account/              → /account (profile, orders, etc.)
│   ├── checkout/             → /checkout
│   └── layout.tsx
├── api/                      # API routes (Next.js handlers)
├── provider/                 # Global providers
│   ├── Providers.tsx         # Root provider tree
│   ├── AuthProvider.tsx
│   ├── SessionProvider.tsx
│   ├── ThemeProvider.tsx
│   ├── NextIntlProvider.tsx
│   └── swr/                  # SWR config & provider
├── layout.tsx                # Root layout (font, metadata, providers)
├── page.tsx                  # Home page (redirects to channel)
├── error.tsx                 # Global error boundary
├── not-found.tsx
└── robots.ts
```

**Provider tree order:**
`ThemeProvider` → `SWRProvider` → `SessionProvider` → `NextIntlProvider` → `AuthProvider`

---

### `src/components/` — Shared UI Components

```
components/
├── ui/                       # shadcn/ui primitives (alias: @ui)
│   ├── Button.tsx, Badge.tsx, Card.tsx, Select.tsx, ...
│   ├── checkbox/, combobox/, dialog/, display/, form/, input/, typography/
│   └── index.ts              # Barrel export
├── layouts/                  # Layout components
│   ├── AuthProvider.tsx      # Auth state provider
│   ├── Header, Footer, Sidebar, etc.
│   └── index.ts
├── nav/                      # Navigation components (15 files)
├── navigation/               # Alternative navigation (2 files)
├── cart/                     # Cart UI components (11 files)
├── product/                  # Product UI components (22 files)
├── skeleton/                 # Skeleton loaders (16 files)
├── swiper/                   # Swiper carousel (6 files)
├── language/                 # Language switcher (1 file)
└── page/                     # Page-level components (2 files)
```

**Quan trọng:** `@ui` là barrel export của toàn bộ shadcn components. Luôn dùng `import { X } from "@ui"` thay vì import trực tiếp.

---

### `src/checkout/` — Checkout Module (Self-contained)

Checkout là một **feature module độc lập** với cấu trúc riêng:

```
checkout/
├── Root.tsx                  # Checkout root component
├── index.css                 # Checkout-specific styles
├── assets/                   # Checkout assets
├── components/               # Checkout-specific UI (35 files)
├── content/                  # Content/copy (2 files)
├── graphql/                  # Checkout GraphQL ops
├── hooks/                    # Checkout hooks (37 files)
├── lib/                      # Checkout utilities (9 files)
├── providers/                # Checkout providers (2 files)
├── sections/                 # Checkout sections/steps (82 files)
│   # Mỗi section là một bước: UserDetails, ShippingAddress,
│   # DeliveryMethod, Payment, OrderSummary, etc.
├── state/                    # Checkout state (9 files)
├── ui-kit/                   # Checkout UI primitives (10 files)
└── views/                    # Checkout views/pages (10 files)
```

**Path alias:** `@checkout/*` → `src/checkout/*`, `@sections/*` → `src/checkout/sections/*`

---

### `src/graphql/` — GraphQL Layer

```
graphql/
├── fragments/                # Reusable GQL fragments (25 files)
├── mutations/                # GQL mutations (3 files)
├── queries/                  # GQL queries (14 files)
└── ProductListPaginatedV2.graphql_old  # Old file (xóa được)
```

Build với `graphql-codegen`. Output tại `src/gql/`.

---

### `src/hooks/` — Custom Hooks

```
hooks/
├── index.ts                  # Barrel export
├── auth/                     # Auth hooks (useAuth, v.v.)
├── checkout/                 # Checkout hooks (5 files)
├── customer/                 # Customer hooks (3 files)
├── swr/                      # SWR-based hooks (1 file)
├── use-toast.ts              # Toast notifications
├── useAuth.ts
├── useDeviceSize.tsx
├── useFetcher.ts
├── useLoading.ts
├── useProductList.ts
├── useProductListByCategory.ts
├── useProductListByCollection.ts
├── useRatingProduct.ts
├── useRelatedPage.ts
├── useRelatedProduct.ts
└── useToggle.ts
```

---

### `src/services/` — API Service Layer

```
services/
├── index.ts                  # Barrel export (alias: @services)
├── address.service.ts        # Address CRUD
├── cart.service.ts           # Cart operations
├── checkout.service.ts       # Checkout API calls
└── rating.service.ts         # Product rating
```

Pattern: Service files gọi API REST/GraphQL và trả về data. Hooks dùng services.

---

### `src/types/` — TypeScript Types

```
types/
├── index.ts                  # Barrel export (alias: @type)
├── global/                   # Global type declarations (4 files)
├── address.type.ts
├── auth.type.ts
├── common.type.ts
├── menuItem.type.ts
├── page.type.ts
├── product.type.ts
├── rating.type.ts
└── status.type.ts
```

---

### `src/config/` — App Configuration

```
config/
├── index.tsx                 # Barrel export (alias: @config/*)
├── config.ts                 # Runtime config (env vars)
├── routes.ts                 # Typed route definitions
└── keys/                     # React Query / cache keys (2 files)
```

**`routes.ts`** là nguồn sự thật duy nhất cho tất cả URLs. Luôn dùng `routes.X` thay vì hardcode string.

---

### `src/auth/` — Authentication

```
auth/
├── authActions.ts            # Auth server actions
├── authCallbacks.ts          # NextAuth callbacks
├── authConfig.ts             # NextAuth configuration
├── authProviders.ts          # OAuth providers
└── authSession.ts            # Session helpers
```

Dùng NextAuth v4. Session được inject vào `Providers.tsx` từ server.

---

### `src/regions/` — Channel & Region

```
regions/
├── client/                   # Client-side region hooks (2 files)
├── config.ts                 # Region/channel config
├── server.ts                 # Server-side region helpers
├── types.ts                  # Region types
└── utils.ts                  # Region utilities
```

Saleor dùng **channels** (e.g. `default-channel`) cho multi-region support. URL pattern: `/{channel}/...`

---

### `src/store/` — Global State (Zustand)

```
store/
└── useLoadingStore.ts        # Global loading state
```

Minimal. State chủ yếu được quản lý qua SWR và local state.

---

### `src/lib/` — Utilities

```
lib/
├── api/                      # API client utilities (6 files)
├── auth/                     # Auth utilities (1 file)
├── hooks/                    # Lib-level hooks (2 files)
└── utils/                    # General utilities (6 files)
```

---

### `src/assets/` — Static Assets

```
assets/
├── icons/                    # SVG icons (auto-imported via @svgr/webpack)
└── styles/
    └── globals.css           # Global CSS (Tailwind base + custom vars)
```

---

### `src/i18n/` — Internationalization

```
i18n/                         # next-intl config (4 files)
messages/
├── en/                       # English translations
└── vi/                       # Vietnamese translations
```

---

### `src/ui/` — Headless UI Atoms

```
ui/
├── atoms/                    # Primitive UI atoms (5 files)
└── components/               # Specialized UI (6 files, e.g. DraftModeNotification)
```

Khác với `src/components/ui/` (shadcn), đây là headless/utility components.

---

### `src/action/` — Server Actions

```
action/
└── auth/                     # Auth-related server actions (2+ files)
```

Next.js Server Actions cho form submissions, auth, v.v.

---

### `src/constants/` — Constants

```
constants/
├── index.ts                  # Barrel export
├── common.constant.ts        # Common constants (DEFAULT_CHANNEL_SLUG, etc.)
├── link.constant.ts          # Social/external links
├── menuItem.constant.ts      # Menu item constants
└── rating.constant.ts        # Rating constants
```

---

## Route Map (src/config/routes.ts)

| Route Key                       | URL                        |
| ------------------------------- | -------------------------- |
| `routes.home`                   | `/`                        |
| `routes.search`                 | `/{channel}/search`        |
| `routes.cart`                   | `/cart`                    |
| `routes.products(slug)`         | `/products/{slug}`         |
| `routes.checkout.index`         | `/checkout`                |
| `routes.checkout.payment`       | `/checkout/payment`        |
| `routes.order.confirmation(id)` | `/order/confirmation/{id}` |
| `routes.auth.signIn`            | `/sign-in`                 |
| `routes.account.profile`        | `/account/profile`         |
| `routes.account.orders`         | `/account/orders`          |
| `routes.staticPages.contact`    | `/static/contact`          |

---

## Conventions & Patterns

### Import Order

1. React / Next.js core
2. Third-party libraries
3. Path aliases (`@components/*`, `@ui`, `@hooks/*`, etc.)
4. Relative imports (`./`, `../`)

### Component Patterns

- **Server Components** mặc định (App Router)
- `"use client"` chỉ khi cần interactivity/hooks
- Barrel exports (`index.ts`) cho mỗi feature directory
- File naming: `PascalCase.tsx` cho components, `camelCase.ts` cho utilities

### State Management Strategy

| Loại state      | Giải pháp                    |
| --------------- | ---------------------------- |
| Server data     | SWR (stale-while-revalidate) |
| Global UI state | Zustand (`src/store/`)       |
| Form state      | react-hook-form              |
| URL state       | Next.js URL params           |
| Auth session    | NextAuth + SessionProvider   |

### GraphQL Pattern

- `.graphql` files tại `src/graphql/` và `src/checkout/graphql/`
- Codegen generates types tại `src/gql/`
- Fragments tại `src/graphql/fragments/` để reuse

---

## Điểm cần tối ưu (xem optimization-notes.md)

1. `AropdownMenu.tsx` — typo trong tên file (nên là `DropdownMenu.tsx`)
2. `ProductListPaginatedV2.graphql_old` — file cũ cần xóa
3. `src/middleware.old.ts` — file cũ cần xóa
4. `src/components/navigation/` và `src/components/nav/` — có thể merge
5. `noUnusedLocals` và `noUnusedParameters` đang bị comment trong tsconfig
