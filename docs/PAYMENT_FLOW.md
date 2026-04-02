# Payment Flow — phuong-store-web

> **Scope**: COD & VNPay checkout flows, key files, status mapping.  
> **Stack**: Next.js 15 App Router · Saleor GraphQL · React Hook Form · SWR

---

## Architecture

```
PayButton (click)
  └─ usePayButton.ts
       ├─ validateAllForms()          → checkoutValidationStateStore
       ├─ handleValidate()            → useEffect([handleValidate])
       └─ handleSubmit()
            ├─ VNPay path  → transactionInitialize → processTransactionData
            │                  CHARGE_ACTION_REQUIRED → popup → transactionProcess
            │                  CHARGE_SUCCESS/REQUEST  → onComplete → checkoutComplete
            └─ COD path    → processTransactionData(transaction[codGatewayId])
                               CHARGE_REQUEST → onComplete → checkoutComplete
```

---

## Payment App (`payment-vnpay`)

| Webhook | Handler | COD result | VNPay result |
|---------|---------|-----------|--------------|
| `TRANSACTION_INITIALIZE_SESSION` | `vnpay-transaction-initialize-session.ts` | `CHARGE_REQUEST` | `CHARGE_ACTION_REQUIRED` + `data.paymentUrl` |
| `TRANSACTION_PROCESS_SESSION` | `transaction-process-session.ts` | `CHARGE_REQUEST` (no vnpParams) | `CHARGE_SUCCESS` / `CHARGE_FAILURE` after HMAC verify |

### Why `CHARGE_REQUEST` for COD

Per Saleor lifecycle docs:

- **Checkout** `chargeStatus` counts `chargedAmount + chargePendingAmount`  
  → `CHARGE_REQUEST` makes `chargeStatus = FULL` → `checkoutComplete` succeeds.
- **Order** `chargeStatus` counts only `chargedAmount` (not pending)  
  → Order shows `NOT_CHARGED` / `paymentStatus = PENDING` = "chưa trả tiền". ✅
- Merchant collects cash → calls `transactionEventReport(CHARGE_SUCCESS)` → order marked paid.

---

## Storefront Key Files

| File | Role |
|------|------|
| `src/checkout/sections/payment/PayButton/usePayButton.ts` | Orchestrates entire submit flow |
| `src/checkout/sections/payment/PayButton/processTransactionData.ts` | Routes on event type; calls popup or `onComplete` |
| `src/checkout/sections/payment/PayButton/PayButton.tsx` | Button + `OrderCreatingOverlay` + `PaymentProcessingModal` |
| `src/checkout/sections/payment/PaymentSection/CashDelivery/cashDeliveryComponent.tsx` | Calls `transactionInitialize(vnpayGatewayId, {type:"cod"})` on mount |
| `src/checkout/components/OrderCreatingOverlay.tsx` | COD loading overlay (spinner, no timer) |
| `src/checkout/components/PaymentProcessingModal.tsx` | VNPay polling overlay (progress bar, timer, cancel) |
| `src/hooks/checkout/mutations/useTransaction.ts` | `useTransactionProcess` — calls `transactionProcess`, on success → `checkoutComplete` |
| `src/hooks/checkout/queries/useCheckoutComplete.ts` | `checkoutComplete` → removes cookie → redirect `/order-confirmation?order=<id>` |

---

## Gateway IDs

| Constant | Value | Used for |
|----------|-------|---------|
| `vnpayGatewayId` | `"vnpay.payment.app"` | VNPay **and** COD (same payment app handles both) |
| `cashDeliveryGatewayId` | `"saleor.app.cashDelivery"` | UI key only — **not** sent to Saleor API |

> ⚠️ COD `transactionInitialize` must use `vnpayGatewayId` because the VNPay payment app  
> is the one registered with `TRANSACTION_INITIALIZE_SESSION` webhook.  
> `cashDeliveryGatewayId` is used only as the local Zustand store key.

---

## `processTransactionData` event routing

```
transactionEvent.type
  ├─ CHARGE_ACTION_REQUIRED | AUTHORIZATION_ACTION_REQUIRED
  │    → open popup (VNPay) → onTrigger → transactionProcess
  ├─ CHARGE_FAILURE | AUTHORIZATION_FAILURE
  │    → show error toast, abort
  └─ anything else (CHARGE_REQUEST, CHARGE_SUCCESS, null …)
       → onComplete() → checkoutComplete → redirect
```

---

## Validation Gate

`checkoutValidationStateStore` tracks 3 scopes:

| Scope | Validated by | Notes |
|-------|-------------|-------|
| `shippingAddress` | `GuestShippingAddressSection` | RHF trigger on "validating" |
| `guestUser` | `useGuestUserForm` | Skipped when signed in |
| `billingAddress` | — | **Excluded from `validateAllForms`** (auto-synced from shipping, no UI form mounted) |

---

## UI Layout

Both `/checkout` and `/order-confirmation` share the same outer container from their route:

```tsx
// page.tsx (both routes)
<section className="mx-auto flex min-h-dvh max-w-[1440px] flex-col px-4 md:px-8 lg:px-10">
```

Inner grids use `grid-cols-[6fr_4fr]` on `lg` breakpoint — left=content, right=sticky summary.

---

## Known Limitations / Future Work

- Merchant must manually call `transactionEventReport(CHARGE_SUCCESS)` for COD; no dashboard button yet.
- `PaymentProcessingModal` translation keys (`processingPayment`, `connectingBank`, …) are not in `vi.json` yet — add when localising the VNPay polling modal.
- `CheckoutFormContext` migration shim still exists; plan to move fully to RHF.
