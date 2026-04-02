# Component Architecture

## Component Hierarchy

```
@ui (src/components/ui/)
  └── shadcn/ui primitives (Button, Card, Dialog, Select, Input, etc.)
  └── Sonner (Toaster + notify utility)
  └── form/ (FormProvider wrapping React Hook Form)

@components (src/components/)
  ├── layouts/   → AuthProvider, ContainerLayout, Header, Logo, PageContainer
  │              → auth-layout/, footer/, main/, product/, public-layout/
  ├── nav/       → Main navigation bar (15 files)
  ├── navigation/ → LinkWithChannel (channel-aware Next.js Link)
  ├── product/   → ProductCard, ProductList, ProductFilter, ProductSort, Rating
  ├── cart/      → Cart summary, line items
  ├── search/    → Search page components (hero, suggestions, results)
  ├── category/  → Category page components
  ├── skeleton/  → Loading skeletons
  ├── swiper/    → Carousel components
  └── page/      → Static page components
```

## Naming Conventions

| Category      | Pattern        | Example              |
| ------------- | -------------- | -------------------- |
| Component     | PascalCase.tsx | `ProductCard.tsx`    |
| Hook          | use\*.ts       | `useProductList.ts`  |
| Type file     | \*.type.ts     | `auth.type.ts`       |
| Service       | \*.service.ts  | `cart.service.ts`    |
| Constant      | \*.constant.ts | `common.constant.ts` |
| Server action | action/\*.ts   | `action/cart.ts`     |

## Key Components

### LinkWithChannel (`src/components/navigation/LinkWithChannel.tsx`)

- Wraps Next.js `<Link>` to auto-prefix href with current `[channel]` param
- Used by 30+ files across the codebase
- Handles hydration mismatch with `useState` + `useEffect`

### ProductCard (`src/components/product/product-card/`)

- `ProductCard.tsx` — UI (null-guard wrapper + inner component)
- `useProductCard.ts` — Logic hook (variant selection, pricing, add-to-cart)
- `ProductCardImage.tsx` — Image with sale badge
- `ProductCardPrice.tsx` — Price display with discount
- `ProductCardVariants.tsx` — Variant selector (color/size chips)

### ProductList (`src/components/product/product-list/`)

- `ProductList.tsx` — Grid of ProductCard components (responsive 2→3→4 cols)
- `ProductListLoadMore.tsx` — Infinite scroll wrapper
- `ProductFilter.tsx` — Sidebar filters (price, stock, brand, size, color)
- `ProductSort.tsx` — Sort toggle bar

## Form System

### Main App: React Hook Form + Zod

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider } from "@ui/form";
import { FormInput } from "@ui/input";
```

### Checkout Module: Formik + Yup (legacy)

```tsx
import { useFormik } from "formik";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
```

**Rule**: New code MUST use React Hook Form + Zod. Formik is only in checkout module.

## Notification System

Single system: **Sonner** (`src/components/ui/Sonner.tsx`)

```ts
import { notify } from "@ui";

notify.success("Added to cart");
notify.error("Something went wrong");
notify.warning("Low stock");
notify.info("Order confirmed");
```
