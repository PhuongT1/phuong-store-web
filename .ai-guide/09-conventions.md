# Conventions & Rules

## Code Rules

1. **Forms**: Use React Hook Form + Zod. Formik is ONLY in `src/checkout/` (legacy).
2. **Imports**: Always use path aliases (`@ui`, `@components/*`, `@lib/*`, etc.)
3. **Notifications**: Use `notify` from `@ui` (Sonner). No other toast system.
4. **GraphQL**: Use `executeGraphQL()` from `@/lib/api`. Use `executePublicGraphQLRequest()` for public-only server actions.
5. **Server Actions**: Place in `src/action/`. Mark with `"use server"` directive.
6. **Types**: Keep in `src/types/*.type.ts`. Import from `@/types`.
7. **Barrel Exports**: Every directory has `index.ts`. Import from directory, not file.

## File Organization

```
# New feature checklist:
1. Types → src/types/featureName.type.ts
2. GraphQL → src/graphql/queries/ or mutations/
3. Hook → src/hooks/useFeatureName.ts
4. Service → src/services/featureName.service.ts (if server action needed)
5. Component → src/components/featureName/
6. Page → src/app/(shop)/[channel]/(main)/featureName/
```

## Known Technical Debt

| Issue                     | Location                        | Impact                                |
| ------------------------- | ------------------------------- | ------------------------------------- |
| Formik in checkout        | `src/checkout/` (10 files)      | Migrate to React Hook Form            |
| urql only in checkout     | `src/checkout/graphql/`         | Consider unifying with executeGraphQL |
| `any` types in checkout   | `src/checkout/hooks/useSubmit/` | Type safety                           |
| `ignoreBuildErrors: true` | `next.config.ts`                | Hiding TS errors                      |
| `reactStrictMode: false`  | `next.config.ts`                | Missing double-render checks          |

## GraphQL Fragments (Key Ones)

| Fragment               | Fields                                                                    | Used By              |
| ---------------------- | ------------------------------------------------------------------------- | -------------------- |
| `Product`              | id, name, slug, media, thumbnail, attributes, category, variants, pricing | Product pages, lists |
| `Checkout`             | Full checkout state (lines, prices, addresses, shipping, payment)         | Cart, checkout pages |
| `UserDetails`          | id, email, name, avatar, addresses                                        | Auth, account        |
| `VariantDetails`       | id, name, quantityAvailable, pricing, attributes, media                   | Product cards        |
| `Money` / `TaxedMoney` | currency, amount                                                          | All price displays   |

## Performance Notes

- SWR `keepPreviousData: true` for smooth infinite scroll
- SWR `revalidateOnMount: false` with SSR fallback for initial load
- Image optimization: Next.js Image with `sharp`, remote patterns `*`
- GraphQL caching: `REVALIDATE_TIME = 10` seconds default
- Cart: `cache: "no-cache"` (always fresh)
