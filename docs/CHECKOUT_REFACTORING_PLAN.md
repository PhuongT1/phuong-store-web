# Checkout Refactoring Plan

## Current Analysis

### Existing Structure

The checkout currently uses a complex `/checkout` directory structure with:

- Multiple sections (Contact, SignIn, GuestUser, AddressForms, etc.)
- Separate components for guest vs logged-in users
- Integration with Saleor GraphQL API
- Complex state management

### Issues Identified

1. ❌ No guest checkout - requires login
2. ❌ Shipping methods hidden for guests
3. ❌ Confusing contact information section
4. ❌ Basic login UI, no register page
5. ❌ Legacy components and unused files

---

## Refactoring Plan

### Phase 1: Create New Components ✅

Create modern, simplified checkout components:

1. **CheckoutContact.tsx** - Simplified email-first contact form
2. **CheckoutShipping.tsx** - Clean shipping address form
3. **CheckoutShippingMethod.tsx** - Shipping method selector
4. **CheckoutPayment.tsx** - Payment method form
5. **CheckoutOrderSummary.tsx** - Modern order summary sidebar
6. **LoginPage** - Proper login page with email/password
7. **RegisterPage** - Registration page with form validation

### Phase 2: Guest Checkout Support

- Modify GraphQL mutations to support guest checkout
- Update authentication logic to allow guest orders
- Add "Continue as Guest" flow

### Phase 3: Step-Based Flow

Implement wizard-style checkout:

```
Step 1: Contact (email) → "Continue as Guest" or  "Login"
Step 2: Shipping Address
Step 3: Shipping Method
Step 4: PaymentStep 5: Review & Place Order
```

### Phase 4: UI Modernization

- Implement 2-column layout (forms left, summary right)
- Add progress indicator
- Use white cards with soft shadows
- Improve form field styling
- Add responsive design

### Phase 5: Code Cleanup

- Remove unused checkout files
- Consolidate duplicate components
- Update folder structure

---

## Technical Requirements

### New File Structure

```
src/
├── app/
│   └── (shop)/
│       ├── checkout/
│       │   ├── page.tsx (new simplified checkout)
│       │   └── success/page.tsx
│       ├── login/
│       │   └── page.tsx (new)
│       └── register/
│           └── page.tsx (new)
└── components/
    └── checkout/
        ├── CheckoutContact.tsx
        ├── CheckoutShipping.tsx
        ├── CheckoutShippingMethod.tsx
        ├── CheckoutPayment.tsx
        └── CheckoutOrderSummary.tsx
```

### Guest Checkout Flow

1. User enters email
2. System checks if email exists
3. If exists: prompt to login
4. If not: continue as guest
5. Collect shipping info
6. Complete order without account

### Authentication Pages

- `/login` - Email/password login with "Forgot password" link
- `/register` - Account creation form
- Both pages should redirect to checkout after success

---

## Implementation Priority

### High Priority (Immediate)

1. ✅ Create simplified contact form component
2. ✅ Create login/register pages
3. ✅ Add guest checkout support
4. ✅ Implement 2-column layout

### Medium Priority (Week 2)

1. Shipping method selector
2. Payment integration
3. Order review step
4. Progress indicator

### Low Priority (Future)

1. Remove legacy components
2. Consolidate code
3. Add advanced features (saved addresses, etc.)

---

## Risk Mitigation

### Approach: Parallel Development

- Create new checkout flow alongside existing one
- Test thoroughly before switching
- Keep existing checkout as fallback
- Gradual migration path

### Testing Strategy

1. Test guest checkout flow end-to-end
2. Test authenticated user flow
3. Test all payment methods
4. Test shipping method selection
5. Verify order creation in Saleor admin

---

## Next Steps

1. **Review this plan** - Confirm approach
2. **Create base components** - Start with contact & summary
3. **Implement guest flow** - Core functionality
4. **Add authentication pages** - Login/register
5. **Test & iterate** - Ensure everything works
6. **Deploy & monitor** - Gradual rollout

---

## Estimated Timeline

- **Phase 1 (Components)**: 2-3 days
- **Phase 2 (Guest Checkout)**: 2-3 days
- **Phase 3 (Step Flow)**: 1-2 days
- **Phase 4 (UI Polish)**: 1-2 days
- **Phase 5 (Cleanup)**: 1 day

**Total**: 7-11 days for full implementation

---

## Questions to Clarify

1. Should we keep the existing checkout as a fallback?
2. What payment methods need to be supported?
3. Should we support saved addresses for logged-in users?
4. Do we need order tracking after checkout?
5. What's the priority: guest checkout or UI improvements?
