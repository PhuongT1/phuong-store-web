# VNPay Payment Architecture & Popup Implementation

## 📐 Architecture Overview

### Tách biệt rõ ràng:

```
┌─────────────────────────────────────────────────────────────────┐
│  PAYMENT APP (payment-vnpay)                                    │
│  Deploy: Railway/Vercel - Riêng biệt                            │
│  Role: BACKEND SERVICE                                          │
│                                                                  │
│  ✅ CÓ THỂ CONTROL:                                              │
│  ├─ Payment logic (create VNPay session)                        │
│  ├─ VNPay API integration                                       │
│  ├─ Configuration management                                    │
│  ├─ Webhook response data structure                             │
│  └─ Return URLs (redirect/callback endpoints)                   │
│                                                                  │
│  ❌ KHÔNG THỂ CONTROL:                                           │
│  ├─ Storefront UI rendering                                     │
│  ├─ User flow/navigation                                        │
│  ├─ Popup/redirect decision                                     │
│  └─ Frontend component behavior                                 │
└─────────────────────────────────────────────────────────────────┘
                           ↓ Webhook Response
                    {paymentUrl, config...}
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STOREFRONT (saleor_user_web-main)                              │
│  Deploy: Vercel với source này                                  │
│  Role: FRONTEND APPLICATION                                     │
│                                                                  │
│  ✅ CÓ THỂ CONTROL:                                              │
│  ├─ Payment UI display                                          │
│  ├─ User experience flow                                        │
│  ├─ Popup vs redirect decision                                  │
│  ├─ Error handling & feedback                                   │
│  └─ Checkout completion flow                                    │
│                                                                  │
│  ❌ KHÔNG THỂ CONTROL:                                           │
│  ├─ Payment app webhook logic                                   │
│  ├─ VNPay API communication                                     │
│  └─ Payment app configuration                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 TL;DR: Ai Control Gì?

| Feature                     | Payment App | Storefront |
| --------------------------- | ----------- | ---------- |
| VNPay API integration       | ✅          | ❌         |
| Create payment session      | ✅          | ❌         |
| Return payment URL          | ✅          | ❌         |
| Configuration storage       | ✅          | ❌         |
| **Display payment options** | ❌          | ✅         |
| **Open popup/redirect**     | ❌          | ✅         |
| **Checkout UI/UX**          | ❌          | ✅         |
| **Complete order flow**     | ❌          | ✅         |

## 💡 Có thể "influence" flow từ payment app không?

**Yes, nhưng gián tiếp!** Payment app có thể trả về flags trong webhook response:

### Option: Add metadata to webhook response

```typescript
// In payment-vnpay/src/pages/api/webhooks/vnpay-transaction-initialize-session.ts

return res.status(200).json({
	pspReference: paymentResult.transactionRef,
	data: {
		paymentUrl: paymentResult.paymentUrl,
		configurationId: config.configurationId,

		// ✅ Thêm flags để influence storefront behavior
		uiPreferences: {
			openInPopup: true, // Suggest popup instead of redirect
			popupWidth: 800, // Popup dimensions
			popupHeight: 700,
			allowRedirectFallback: true // Fallback if popup blocked
		}
	},
	result: "AUTHORIZATION_ACTION_REQUIRED",
	amount: action.amount,
	actions: [
		{
			actionType: "REDIRECT", // hoặc "POPUP" nếu muốn
			url: paymentResult.paymentUrl
		}
	]
});
```

Sau đó trong storefront:

```typescript
// In saleor_user_web-main PayButton.tsx

const uiPrefs = (txData.data as any).uiPreferences;

if (uiPrefs?.openInPopup) {
	// Use popup
	openPaymentPopup({
		url: paymentUrl,
		width: uiPrefs.popupWidth || 800,
		height: uiPrefs.popupHeight || 700
		// ...
	});
} else {
	// Use redirect
	window.location.href = paymentUrl;
}
```

**Nhưng:** Cuối cùng storefront vẫn quyết định có follow suggestion hay không.

---

## 🎨 Popup Solution (Đã Implement)

### Files Created/Modified:

1. **`src/checkout/lib/paymentPopup.ts`** - Popup utility class
2. **`src/pages/vnpay-return.tsx`** - VNPay return handler (postMessage support)
3. **`src/checkout/sections/PayButton/PayButton.tsx`** - Updated to use popup

### Flow:

```
1. User clicks "Đặt hàng"
   ↓
2. PayButton checks transaction.transactionEvent.type
   ├─ If CHARGE_ACTION_REQUIRED
   │  ├─ Extract paymentUrl from data
   │  └─ Call openPaymentPopup(paymentUrl) ✅ POPUP!
   └─ Else: direct transactionProcess
   ↓
3. Popup opens with VNPay page
   ├─ User enters payment info
   └─ Completes/cancels payment
   ↓
4. VNPay redirects to /vnpay-return?vnp_ResponseCode=00&...
   ↓
5. vnpay-return.tsx detectsif (window.opener)
   ├─ If popup: window.opener.postMessage({type: 'PAYMENT_SUCCESS'})
   └─ If redirect: router.push('/checkout?payment=success')
   ↓
6. PayButton receives postMessage
   ├─ onSuccess: trigger transactionProcess → checkoutComplete ✅
   └─ onError: show error message
```

### Advantages:

✅ **User stays on checkout page** - không mất context  
✅ **Better UX** - fast payment without full page reload  
✅ **Popup blocked fallback** - can add redirect fallback  
✅ **Mobile compatible** - popup = new tab on mobile

### Considerations:

⚠️ **Popup blockers** - need to show message if blocked  
⚠️ **Mobile behavior** - popup opens as new tab (still works)  
⚠️ **postMessage security** - validate event.origin if needed

---

## 🔧 Config trong Payment App (Optional)

Nếu muốn control behavior từ payment app config UI:

```typescript
// In payment-vnpay configuration UI
interface VNPayConfig {
	// ...existing fields

	uiSettings?: {
		preferPopup: boolean;
		popupDimensions?: {
			width: number;
			height: number;
		};
	};
}
```

Webhook handler read config và include trong response → Storefront consume.

**Nhưng remember:** Ultimate decision vẫn nằm ở storefront code!

---

## 📝 Summary

| Question                                    | Answer                                              |
| ------------------------------------------- | --------------------------------------------------- |
| Có thể control UI flow trong payment-vnpay? | ❌ Không trực tiếp. Payment app là backend service. |
| Có thể influence behavior?                  | ✅ Yes, qua webhook response data/flags             |
| Popup hay redirect là quyết định của ai?    | ✅ Storefront (saleor_user_web-main)                |
| Đã implement popup rồi chưa?                | ✅ Yes! Check PayButton.tsx & paymentPopup.ts       |

**Best practice:** Keep payment logic in payment app, UI/UX decisions in storefront.
