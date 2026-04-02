# Hooks Architecture

## Generic Infinite Product List Factory

`src/hooks/useInfiniteProductList.ts` — Shared factory for cursor-based infinite scrolling.
All product list hooks use this factory:

```ts
useInfiniteProductList<TQuery, TVariables>(config, { channel, slug? })
```

Config provides: `document`, `cacheKey`, `extractProducts()`, `buildVariables()`, `initialData?`, `extractMeta?`

Returns: `{ products, hasNextPage, remainingCount, size, setSize, isLoading, ... }`

### Implementations

| Hook                                 | File                            | Extracts from              |
| ------------------------------------ | ------------------------------- | -------------------------- |
| `useProductListInfinite`             | `useProductList.ts`             | `page.products`            |
| `useProductListByCategoryInfinite`   | `useProductListByCategory.ts`   | `page.category.products`   |
| `useProductListByCollectionInfinite` | `useProductListByCollection.ts` | `page.collection.products` |

## SWR Hooks

| Hook            | File                   | Purpose                       |
| --------------- | ---------------------- | ----------------------------- |
| `useSWRGraphQl` | `hooks/swr/useSWR.tsx` | Typed SWR wrapper for GraphQL |
| `useSWRQuery`   | `hooks/swr/useSWR.tsx` | Typed SWR wrapper for REST    |

Both support `SWRConfigExtended` with `showLoading` flag.

## Auth Hooks

| Hook       | File                           | Purpose                                  |
| ---------- | ------------------------------ | ---------------------------------------- |
| `useLogin` | `hooks/auth/login/useLogin.ts` | Login via NextAuth signIn (SWR mutation) |

## Product Hooks

| Hook                  | File                                                | Purpose                                 |
| --------------------- | --------------------------------------------------- | --------------------------------------- |
| `useProductCard`      | `components/product/product-card/useProductCard.ts` | Variant selection, pricing, add-to-cart |
| `useProductFilter`    | `hooks/useProductFilter.ts`                         | Filter state management                 |
| `useAttributeValues`  | `hooks/useAttributeValues.ts`                       | Attribute value fetching                |
| `useRelatedProduct`   | `hooks/useRelatedProduct.ts`                        | Related products                        |
| `useRatingProduct`    | `hooks/useRatingProduct.ts`                         | Product ratings (read + write)          |
| `useSignatureProduct` | `hooks/useProductListByCategory.ts`                 | Featured collection products            |

## Utility Hooks

| Hook                        | File                                     | Purpose                                 |
| --------------------------- | ---------------------------------------- | --------------------------------------- |
| `useAddQueryParams`         | `lib/hooks/useQueryParams.ts`            | URL query params management             |
| `useRecentlyViewedProducts` | `lib/hooks/useRecentlyViewedProducts.ts` | Recently viewed products (localStorage) |
| `useDeviceSize`             | `hooks/useDeviceSize.tsx`                | Responsive breakpoint detection         |
| `useToggle`                 | `hooks/useToggle.ts`                     | Boolean toggle state                    |
| `useLoading`                | `hooks/useLoading.ts`                    | Loading state management                |

## Checkout Hooks (src/hooks/checkout/)

| Hook             | File                          | Purpose                  |
| ---------------- | ----------------------------- | ------------------------ |
| `useCheckout`    | `queries/useCheckout.ts`      | Fetch checkout by ID     |
| `useTransaction` | `mutations/useTransaction.ts` | Payment transaction      |
| `useProvinces`   | `customer/useProvinces.ts`    | Vietnamese province data |
