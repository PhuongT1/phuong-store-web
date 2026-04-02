# Cart & Checkout Flow

## Add to Cart

```
User clicks "Add to Cart" on ProductCard
  → useProductCard.handleAddToCart()
  → addToCart() server action (src/services/cart.service.ts)
    → getCheckoutIdCookie()
    → If no checkout ID:
        → CheckoutCreate mutation (public, no auth)
        → Validate checkoutCreate.errors (throws on error)
        → Store checkoutId in cookie
    → If has checkout ID:
        → CheckoutLinesAdd mutation (public, no auth)
        → Validate checkoutLinesAdd.errors
        → If checkout expired/invalid → auto-create new checkout
    → revalidateCart(checkoutId)
  → notify.success() on success
  → notify.error() on failure
```

### Error Handling

- Mutation-level errors are checked: `checkoutCreate.errors`, `checkoutLinesAdd.errors`
- Stale checkout IDs (expired/deleted) detected by `NOT_FOUND` / `INVALID` error codes
- Auto-recovery: deletes stale cookie → creates fresh checkout
- All errors propagate to UI via throw → catch in useProductCard

## Cart Page

`/[channel]/cart` (e.g., `/hcm/cart`)

- **Server component** reads checkoutId from cookie
- Fetches checkout via `Checkout.find()` (CheckoutFindDocument)
- Renders: `CheckoutItems` (line items), `CheckoutSubmit` (total + CTA button)
- Line deletion: `DeleteLineButton` → `deleteLineFromCheckout` server action

## Checkout Flow

`/(shop)/checkout` — Self-contained module

```
1. CheckoutForm layout
2. Sections (sequential steps):
   ├── GuestUser / UserDetails
   ├── ShippingAddress (with Vietnamese province selection)
   ├── BillingAddress
   ├── DeliveryMethod
   ├── Payment (Stripe, Adyen, VNPay)
   └── OrderSummary
3. PayButton → checkout complete
4. Redirect to order confirmation
```

### Checkout Module Boundary

The `src/checkout/` module is semi-independent:

- Has its own: GraphQL codegen (urql), form system (Formik), CSS, state management
- Imports from main app: `@/gql/graphql`, `@/lib/api`, `@/hooks/checkout`, `@/components/ui`
- Main app imports from checkout: `@/checkout/graphql` types, summary components

## Cookie Management (Server Actions)

| Action                   | File             | Purpose                          |
| ------------------------ | ---------------- | -------------------------------- |
| `setCheckoutIdCookie`    | `action/cart.ts` | Set checkout ID (30-day max age) |
| `getCheckoutIdCookie`    | `action/cart.ts` | Read checkout ID from cookie     |
| `removeCheckoutIdCookie` | `action/cart.ts` | Clear stale checkout             |
| `revalidateCart`         | `action/cart.ts` | Revalidate `CHECKOUT:{id}` tag   |
