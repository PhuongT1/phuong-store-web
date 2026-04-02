# Directory Structure & Path Aliases

## Path Aliases (tsconfig.json)

```
@/*           → src/*
@ui/*         → src/components/ui/*
@ui           → src/components/ui/index.ts
@components/* → src/components/*
@constants/*  → src/constants/*
@config/*     → src/config/*
@type         → src/types/
@services/*   → src/services/*
@services     → src/services/index.ts
@lib/*        → src/lib/*
@sections/*   → src/checkout/sections/*
@checkout/*   → src/checkout/*
@hooks/*      → src/hooks/*
@assets/*     → src/assets/*
@provider/*   → src/app/provider/*
@store/*      → src/store/*
@i18n/*       → src/i18n/*
```

## Top-Level Structure

```
src/
├── app/                  # Next.js App Router (pages, layouts, API routes)
├── action/               # Server Actions (cart, auth, checkout, locale)
├── assets/               # Static assets (icons, styles, images)
├── auth/                 # NextAuth configuration (providers, callbacks, session)
├── checkout/             # Self-contained checkout module (Formik + urql)
├── components/           # Shared UI components
├── config/               # App config, routes, SWR keys
├── constants/            # Application constants
├── gql/                  # Generated GraphQL types (DO NOT EDIT)
├── graphql/              # Raw GraphQL documents (fragments, queries, mutations)
├── hooks/                # Custom React hooks
├── i18n/                 # Internationalization setup
├── lib/                  # Utility libraries (API client, auth helpers, utils)
├── regions/              # Channel/region configuration
├── services/             # API service layer (server actions for data operations)
├── store/                # Zustand stores
├── types/                # TypeScript type definitions
└── ui/                   # Additional UI components
```

## App Router Structure

```
app/
├── layout.tsx              # Root layout (fonts, Providers, Toaster)
├── page.tsx                # Home redirect
├── (auth)/                 # Auth group (sign-in, sign-up) — uses AuthLayout
│   └── sign-in/            # Login page (React Hook Form + Zod)
├── (shop)/                 # Shop group — uses MainLayout
│   ├── [channel]/          # Dynamic channel segment (e.g. /hcm/)
│   │   └── (main)/         # Main layout with nav
│   │       ├── (catalog)/  # Product catalog
│   │       │   ├── categories/[slug]
│   │       │   ├── collections/[slug]
│   │       │   ├── products/[slug]
│   │       │   └── search/       # Search page (infinite scroll)
│   │       ├── cart/              # Shopping cart
│   │       └── pages/[slug]       # CMS pages
│   ├── account/            # User account pages
│   ├── checkout/           # Checkout flow
│   └── register/           # Registration
├── api/                    # API routes
│   ├── auth/[...nextauth]/ # NextAuth handler
│   ├── province/           # Province API
│   └── ...
└── provider/               # Provider wrappers
    ├── Providers.tsx        # Root: Theme → SWR → Session → i18n → Auth
    ├── SessionProvider.tsx  # NextAuth session + token watcher
    ├── NextIntlProvider.tsx # i18n messages
    └── ThemeProvider.tsx    # next-themes dark mode
```

## Provider Tree (nesting order)

```
ThemeProvider
  └── SWRProvider
        └── SessionProvider (NextAuth)
              └── NextIntlProvider (i18n)
                    └── AuthProvider (Saleor urql client)
                          └── {children}
```
