# Checkout Refactoring - Implementation Guide

## 📦 Components Created

### ✅ New Components Built

1. **CheckoutContact** - `/src/components/checkout/CheckoutContact.tsx`
   - Email-first contact form
   - Guest checkout support
   - "Continue as Guest" button
   - Link to login page
   - Clean, modern UI

2. **LoginPage** - `/src/app/(shop)/login/page.tsx`
   - Email/password authentication
   - Password visibility toggle
   - Forgot password link
   - Redirect after login
   - Link to register page
   - Modern card-based layout

3. **RegisterPage** - `/src/app/(shop)/register/page.tsx`
   - First name, last name fields
   - Email and password
   - Password confirmation
   - Form validation
   - Redirect after registration
   - Link to login page

4. **CheckoutOrderSummary** - `/src/components/checkout/CheckoutOrderSummary.tsx`
   - Product list with images
   - Quantity controls (+/-)
   - Remove item button
   - Subtotal, shipping, total
   - Trust badges
   - Sticky sidebar positioning

---

## 🚀 Implementation Steps

### Step 1: Test New Authentication Pages

Visit these URLs to test the new pages:

- `/login` - Login page
- `/register` - Registration page
- `/login?redirect=/checkout` - Login with redirect

**What to verify:**

- ✅ Forms validate correctly
- ✅ Password toggle works
- ✅ Links between login/register work
- ✅ "Back to store" link works

### Step 2: Integrate CheckoutContact

Add to your checkout page:

```typescript
import { CheckoutContact } from "@/components/checkout/CheckoutContact";

// In your checkout page component:
<CheckoutContact
  onContinue={(email, asGuest) => {
    // Handle contact info submission
    if (asGuest) {
      // Continue to shipping address
      setStep("shipping");
    } else {
      // Redirect to login
      router.push(`/login?redirect=/checkout`);
    }
  }}
/>
```

### Step 3: Integrate CheckoutOrderSummary

Add to your checkout layout:

```typescript
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { useCheckout } from "@/hooks/checkout";

// In your checkout component:
const { checkout } = useCheckout();

<div className="lg:grid lg:grid-cols-2 lg:gap-12">
  {/* Left: Forms */}
  <div>
    <CheckoutContact ... />
    {/* Other checkout steps */}
  </div>

  {/* Right: Order Summary */}
  <div>
    <CheckoutOrderSummary
      checkout={checkout}
      onUpdateQuantity={(lineId, qty) => {
        // Update line quantity
      }}
      onRemoveLine={(lineId) => {
        // Remove line from cart
      }}
    />
  </div>
</div>
```

### Step 4: Add Guest Checkout Support

Currently, guest checkout likely requires backend changes. You need to:

1. **Modify Saleor GraphQL mutations** to accept orders without authentication
2. **Update checkout flow** to skip login requirement
3. **Store guest email** in checkout session

Example mutation update needed:

```graphql
mutation CheckoutComplete($checkoutId: ID!, $email: String) {
	checkoutComplete(
		checkoutId: $checkoutId
		email: $email # Guest email
	) {
		order {
			id
			number
		}
		errors {
			field
			message
		}
	}
}
```

### Step 5: Create Shipping Address Form

Create `/src/components/checkout/CheckoutShipping.tsx`:

```typescript
"use client";

import { useState } from "react";
import { Button } from "@components/ui";

type ShippingFormData = {
	firstName: string;
	lastName: string;
	address1: string;
	address2?: string;
	city: string;
	postalCode: string;
	country: string;
	phone: string;
};

export const CheckoutShipping = ({ onContinue }: { onContinue: (data: ShippingFormData) => void }) => {
	// Form implementation
	// Similar structure to CheckoutContact
};
```

### Step 6: Create Step-Based Checkout Flow

Create `/src/app/(shop)/checkout/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import { CheckoutContact } from "@/components/checkout/CheckoutContact";
import { CheckoutShipping } from "@/components/checkout/CheckoutShipping";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";

type CheckoutStep = "contact" | "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>("contact");
  const [contactInfo, setContactInfo] = useState({ email: "", asGuest: true });

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <StepIndicator currentStep={step} />
        </div>

        {/* 2-Column Layout */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Forms */}
          <div>
            {step === "contact" && (
              <CheckoutContact
                onContinue={(email, asGuest) => {
                  setContactInfo({ email, asGuest });
                  setStep("shipping");
                }}
              />
            )}
            {step === "shipping" && <CheckoutShipping ... />}
            {/* Add other steps */}
          </div>

          {/* Right: Order Summary */}
          <div>
            <CheckoutOrderSummary ... />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 7: Add Step Indicator

Create a progress indicator component:

```typescript
const steps = [
  { id: "contact", name: "Contact" },
  { id: "shipping", name: "Shipping" },
  { id: "payment", name: "Payment" },
  { id: "review", name: "Review" }
];

const StepIndicator = ({ currentStep }: { currentStep: string }) => {
  return (
    <nav>
      <ol className="flex items-center justify-center gap-2">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center">
            <div className={`
              flex items-center gap-2 rounded-full px-4 py-2
              ${currentStep === step.id ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-600"}
            `}>
              <span className="font-medium">{index + 1}</span>
              <span>{step.name}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="mx-2 h-px w-8 bg-gray-300" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
```

---

## 🎨 UI Improvements Applied

### Color Scheme

- Background: `#f8fafc` (light gray)
- Cards: `white` with `shadow-sm`
- Primary text: `text-gray-900`
- Secondary text: `text-gray-600`
- Buttons: `bg-gray-900` with `hover:bg-gray-800`

### Spacing

- Section padding: `p-6` or `p-8`
- Element gaps: `gap-4` or `gap-6`
- Form field spacing: `space-y-6`

### Typography

- Headings: `text-2xl font-bold`
- Labels: `text-sm font-medium`
- Body text: `text-sm` or `text-base`

### Interactive Elements

- Rounded inputs: `rounded-lg`
- Focus rings: `focus:ring-1 focus:ring-gray-900`
- Hover transitions: `transition-all duration-200`
- Icon animations: `group-hover:translate-x-1`

---

## 🔧 Required Backend Changes

### 1. Guest Checkout Mutation

Update to accept guest email:

```graphql
mutation CheckoutComplete($id: ID!, $email: String) {
	checkoutComplete(id: $id, email: $email) {
		order {
			id
		}
	}
}
```

### 2. Email Verification Endpoint

Check if email exists:

```graphql
query CheckIfUserExists($email: String!) {
	user(email: $email) {
		id
		email
	}
}
```

### 3. Guest Order Tracking

Allow order lookup by email + order number (no login required)

---

## 📋 Testing Checklist

### Guest Checkout Flow

- [ ] Enter email on contact step
- [ ] Click "Continue as Guest"
- [ ] Fill shipping address
- [ ] Select shipping method
- [ ] Enter payment details
- [ ] Review order
- [ ] Complete order (no login)
- [ ] Receive confirmation email

### Authenticated Checkout Flow

- [ ] Click "Log in" from contact step
- [ ] Login redirects back to checkout
- [ ] Shipping address pre-filled
- [ ] Saved payment methods shown
- [ ] Complete order
- [ ] Order appears in account

### Authentication Pages

- [ ] Login page works
- [ ] Register page works
- [ ] Password visibility toggle
- [ ] Form validation errors
- [ ] Redirect after login/register
- [ ] "Forgot password" link

### Order Summary

- [ ] Products display correctly
- [ ] Quantity +/- buttons work
- [ ] Remove item button works
- [ ] Prices calculate correctly
- [ ] Shipping cost updates
- [ ] Total is accurate

---

## 🎯 Next Steps (Priority Order)

### High Priority

1. **Connect authentication** - Wire up login/register to Saleor API
2. **Guest checkout backend** - Enable guest orders in Saleor
3. **Shipping form** - Create address collection form
4. **Payment integration** - Add payment method step

### Medium Priority

1. **Shipping methods** - Display available shipping options
2. **Order review** - Summary before final submission
3. **Order confirmation** - Success page after checkout
4. **Email notifications** - Send order confirmations

### Low Priority

1. **Saved addresses** - Allow users to save addresses
2. **Multiple payment methods** - Support cards, PayPal, etc.
3. **Discount codes** - Add promo code field
4. **Gift cards** - Support gift card redemption

---

## 💡 Tips for Implementation

### 1. Start with Guest Checkout

Get guest flow working first, then add authentication features.

### 2. Use React Hook Form

For complex forms with validation:

```bash
npm install react-hook-form @hookform/resolvers zod
```

### 3. Add Loading States

Show skeletons during data fetching.

### 4. Handle Errors Gracefully

Display clear error messages for failed operations.

### 5. Test on Mobile

Ensure responsive design works on all screen sizes.

### 6. Add Analytics

Track checkout step completion rates:

- Contact info submitted
- Shipping address completed
- Payment method added
- Order completed

---

## 🐛 Known Issues & Solutions

### Issue: Email already exists

**Solution**: Show "This email is already registered. Please [log in](#)"

### Issue: Checkout session expires

**Solution**: Add session timeout warning and refresh option

### Issue: Payment fails

**Solution**: Allow retry without losing form data

### Issue: Shipping not available

**Solution**: Show message and alternative options

---

## 📚 Additional Resources

- **Saleor Checkout Docs**: https://docs.saleor.io/docs/3.x/developer/checkout
- **Shopify Checkout UX**: Reference for best practices
- **Nike Checkout**: Study their step-by-step flow
- **Adidas Checkout**: Inspiration for modern UI

---

## ✅ Success Criteria

The refactoring is successful when:

1. ✅ Users can complete purchases **without** logging in
2. ✅ Login/register pages are **modern** and **functional**
3. ✅ Contact step is **simple** (just email)
4. ✅ Checkout layout is **2-column** (forms left, summary right)
5. ✅ UI is **clean**, **white**, with **soft shadows**
6. ✅ Mobile experience is **seamless**
7. ✅ Order completion rate **improves**
8. ✅ User feedback is **positive**

---

**Need help?** Refer to:

- `/docs/CHECKOUT_REFACTORING_PLAN.md` - Overall plan
- Component files for implementation details
- Saleor documentation for API questions
