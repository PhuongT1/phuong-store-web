# Routing & Internationalization

## Route Structure

Dynamic channel segment: all shop pages are under `/[channel]/` (e.g., `/hcm/`)

### Route Config (`src/config/routes.ts`)

```ts
routes.home           → "/"
routes.search         → "/hcm/search"
routes.cart           → "/cart"
routes.products(slug) → "/products/{slug}"
routes.checkout.index → "/checkout"
routes.account.*      → "/account/profile", "/account/orders", etc.
routes.auth.signIn    → "/sign-in"
```

### Route Groups

| Group       | Layout            | Purpose                                   |
| ----------- | ----------------- | ----------------------------------------- |
| `(auth)`    | AuthLayout        | Sign-in, sign-up                          |
| `(shop)`    | MainLayout        | All shop pages                            |
| `(main)`    | Main nav + footer | Within [channel]                          |
| `(catalog)` | Product layout    | Categories, collections, products, search |

## i18n (next-intl)

- Plugin: `next-intl/plugin` (in `next.config.ts`)
- Messages: `/messages/en/`, `/messages/vi/`
- Usage: `const t = useTranslations("namespace")`
- Server: `getLocale()` from `next-intl/server`

### Translation Types (`src/app/types.ts`)

```ts
type GetTranslations<Namespace> = ReturnType<typeof useTranslations<Namespace>>
type TranslationMessage<Namespace> = string key from messages
```

## Channel System

- Default channel from env: `NEXT_PUBLIC_DEFAULT_CHANNEL_SLUG`
- Channels fetched from Saleor: `ChannelsListDocument`
- `generateStaticParams()` in `[channel]/layout.tsx` generates paths
- `LinkWithChannel` auto-prefixes links with current channel

## Important Constants

```ts
PRODUCTS_PER_PAGE = 8
REVALIDATE_TIME = 10 (seconds)
DEFAULT_CHANNEL_SLUG = "/hcm" (from env)
COUNTRY_CODE_DEFAULT = "VN"
LANGUAGE_CODE_DEFAULT = ViVn (from Saleor enum)
```
