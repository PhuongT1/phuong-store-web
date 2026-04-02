# Data Layer — GraphQL, API, Services

## GraphQL Architecture

### Code Generation

- Raw documents: `src/graphql/` (fragments/, queries/, mutations/)
- Config: `.graphqlrc.ts`
- Generated output: `src/gql/graphql.ts` (TypedDocumentString)
- Run: `yarn generate`

### API Client Stack

```
┌──────────────────────────────────────────────┐
│              Consumer Code                    │
│  (pages, hooks, server actions)              │
├──────────────────────────────────────────────┤
│         executeGraphQL()                      │ ← src/lib/api/fetchGraphQL.ts
│         Main entry point                      │ ← Dispatches based on withAuth flag
├──────────┬───────────────────────────────────┤
│ withAuth │                                    │
│   true   │  serverFetchWithAuth()            │ ← src/action/serverFetchWithAuth.ts
│          │    → fetchGraphQL()               │ ← src/lib/api/secureGraphQL.ts
│          │      → getUserSession() for token │
│          │      → fetch(SALEOR_API_URL)      │
├──────────┼───────────────────────────────────┤
│ withAuth │                                    │
│   false  │  fetchGraphQL()                   │ ← src/lib/api/secureGraphQL.ts
│          │    → shouldSendToken flag decides  │
│          │    → fetch(SALEOR_API_URL)        │
├──────────┴───────────────────────────────────┤
│       fetchPublicGraphQL()                    │ ← src/lib/api/publicGraphQL.ts
│       No auth, used by server actions         │ ← (token refresh, cart create)
├──────────────────────────────────────────────┤
│       graphQLRequest.ts                       │ ← Shared: requestInit, responseData,
│       (Error classes: GraphQLError, HTTPError)│    type definitions
└──────────────────────────────────────────────┘
```

### Key Types (graphQLRequest.ts)

```ts
GraphQLDocument<Result, Variables>; // TypedDocumentString | string
GraphQLRequestOptions<Variables>; // { variables, cache, withAuth, shouldSendToken, saleorAppToken }
VariablesFromDoc<Doc>; // Extracts variables type from document
ResultFromDoc<Doc>; // Extracts result type from document
```

### Usage Pattern

```ts
// Server component (with auth)
const data = await executeGraphQL(SomeQueryDocument, { variables: { ... } });

// Server component (no auth)
const data = await executeGraphQL(SomeQueryDocument, { variables: { ... }, withAuth: false });

// Server action (public, no auth token at all)
const data = await executePublicGraphQLRequest(SomeMutationDocument, {
  variables: { ... },
  shouldSendToken: false,
});
```

## REST API Client

`src/lib/api/apiClient.ts` — `getAPI<T>()` / `postAPI<T, U>()` for non-GraphQL endpoints.
Used for the rating API (`NEXT_PUBLIC_API_URL`).

## Services Layer (src/services/)

Server-action services for data mutations:

| Service  | File                  | Purpose                                                            |
| -------- | --------------------- | ------------------------------------------------------------------ |
| Cart     | `cart.service.ts`     | `addToCart()` — creates checkout or adds lines. **Server action**. |
| Checkout | `checkout.service.ts` | Checkout CRUD operations                                           |
| Address  | `address.service.ts`  | Address management                                                 |
| Rating   | `rating.service.ts`   | Product rating API                                                 |

## SWR Cache Keys (src/config/keys/swrKeys.ts)

```
CHECKOUT, PRODUCT_LIST, PRODUCT_DETAIL, PRODUCT_RELATED_LIST,
PRODUCT_CATEGORY_LIST, PRODUCT_COLLECTION_LIST, PRODUCT_SEARCH_LIST
```

## Dual GraphQL Systems

**Main app**: `executeGraphQL` + SWR hooks (manual fetch)
**Checkout module**: urql client + generated hooks (via AuthProvider's urql Provider)

These coexist. The checkout module uses urql for its mutation hooks (from `src/checkout/graphql/`).
The rest of the app uses the manual fetch + SWR approach.
