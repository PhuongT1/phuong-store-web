# Coding Standards — phuong-store-web

Tài liệu này là quy tắc bắt buộc cho AI (GitHub Copilot) và developer khi làm việc trong repo này.
Đọc file này trước khi bắt đầu bất kỳ task nào.

---

## 1. Giới hạn kích thước file

- **Tối đa 230 dòng mỗi file** (bao gồm import, type, comment).
- Nếu file đang tiến gần 230 dòng → tách thành subcomponent / hook / helper riêng.
- **Ngoại lệ được chấp nhận**: file GraphQL schema (`schema.graphql`), file generated (`generated/graphql.ts`), file config như `next.config.ts`.
- Khi tách file: giữ nguyên API bên ngoài, không đổi tên export đã được dùng ở nơi khác.

---

## 2. TypeScript

### Quy tắc cứng

- `npx tsc --noEmit` phải **0 errors** trước khi xem là xong.
- Không dùng `any` — dùng `unknown` + type guard nếu cần.

- Không `@ts-ignore` hoặc `@ts-expect-error` trừ khi có comment giải thích lý do và ticket/issue đi kèm.
- Không `as SomeType` để "trốn" lỗi — chỉ dùng khi thực sự biết kiểu dữ liệu.

### Dùng type từ lib, không định nghĩa lại

- **Ưu tiên import type từ lib có sẵn** thay vì tự khai báo interface/type tương đương.
- Ví dụ SAI:
  ```ts
  // ❌ Tự định nghĩa lại kiểu đã có trong graphql codegen
  type OrderLine = { id: string; quantity: number; thumbnail?: { url: string } };
  ```
- Ví dụ ĐÚNG:
  ```ts
  // ✅ Dùng từ generated types
  import { type OrderLine } from "@/gql/graphql";
  ```
- Với kiểu từ thư viện ngoài (React, SWR, Radix, RHF…) — import thẳng, không copy-paste lại.
- Khi cần extend: dùng `Pick`, `Omit`, `Partial`, `ReturnType`, `Parameters` thay vì viết lại từ đầu.

### Type casting an toàn

- Khi cần cast qua type boundary (ví dụ `OrderLine` có field không có trong `CheckoutLine`):
  ```ts
  // ✅ Cast rõ ràng với comment giải thích
  const orderLine = line as unknown as OrderLine; // OrderLine fields not in CheckoutLineForm
  ```

---

## 3. ESLint

- Chạy lệnh sau trước khi commit:
  ```bash
  npx eslint src/ --max-warnings 0
  ```
- Không để warning tồn tại — warning hôm nay là bug ngày mai.
- Các rule quan trọng cần chú ý:
  - `no-unused-vars` / `@typescript-eslint/no-unused-vars` — xóa import và biến không dùng.
  - `react-hooks/exhaustive-deps` — thêm đủ dependency vào `useCallback`/`useEffect`.
  - `@typescript-eslint/no-floating-promises` — `.then()` hoặc `void` trước async call.

---

## 4. Kiểm thử sau khi làm xong

Sau khi hoàn thành bất kỳ thay đổi nào, phải thực hiện theo thứ tự:

### Bước 1 — TypeScript

```bash
npx tsc --noEmit 2>&1 | head -30
```

→ Phải ra **rỗng** (no output = no errors).

### Bước 2 — ESLint trên file đã sửa

```bash
npx eslint <đường-dẫn-file> --max-warnings 0
```

### Bước 3 — Kiểm tra runtime thủ công

Với mỗi function/component đã sửa, test các case sau:

- **Happy path**: đầu vào hợp lệ → output đúng.
- **Edge case**: đầu vào `null`, `undefined`, mảng rỗng, chuỗi rỗng.
- **Error path**: API lỗi, network timeout → UI phản hồi đúng (toast, skeleton, error boundary).

### Bước 4 — Kiểm tra trong browser (với UI changes)

- Không CLS (layout không nhảy khi data load).
- Dark mode hiển thị đúng.
- Mobile viewport không bị vỡ layout.

---

## 5. Màu sắc — Color Tokens

> **Quy tắc bắt buộc**: Mọi màu sắc **phải** dùng CSS custom property (token) đã định nghĩa sẵn.  
> Không dùng hardcoded Tailwind color (`bg-gray-200`, `text-red-500`, `border-zinc-300`…).  
> Tất cả token đều hỗ trợ **cả light mode và dark mode** qua `:root` / `.dark` trong `src/assets/styles/tailwind/theme.css`.

### 5.1 Tại sao bắt buộc?

- Tailwind hardcode tệp như `bg-gray-100` chỉ có nghĩa ở light mode — dark mode sẽ sai màu.
- CSS variable `var(--accent)` tự động đổi giá trị khi theme thay đổi, không cần viết `dark:bg-*` riêng.
- Đảm bảo consistency — AI và developer cùng dùng chung bộ token, không mỗi người một màu xám khác nhau.

### 5.2 Danh sách token hiện có

Tất cả token trong `theme.css` (`--token-name`) ánh xạ sang class Tailwind `bg-token-name` / `text-token-name` / `border-token-name`.

#### Layout / Surface

| Token                  | Tailwind class            | Dùng cho                        |
| ---------------------- | ------------------------- | ------------------------------- |
| `--background`         | `bg-background`           | Nền toàn trang                  |
| `--foreground`         | `text-foreground`         | Màu chữ mặc định                |
| `--card`               | `bg-card`                 | Nền card / panel                |
| `--card-foreground`    | `text-card-foreground`    | Chữ trong card                  |
| `--popover`            | `bg-popover`              | Dropdown, tooltip, dialog       |
| `--popover-foreground` | `text-popover-foreground` | Chữ trong popover               |
| `--header`             | `bg-header`               | Nền header (dùng sticky header) |
| `--border`             | `border-border`           | Border mặc định                 |
| `--input`              | `bg-input`                | Nền ô input                     |

#### Brand / Action

| Token                    | Tailwind class                        | Dùng cho                                                                                                |
| ------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `--primary`              | `bg-primary`, `text-primary`          | CTA chính duy nhất ("Place order") — đen light / trắng dark                                             |
| `--primary-foreground`   | `text-primary-foreground`             | Chữ trên nền primary (luôn contrast đủ)                                                                 |
| `--secondary`            | `bg-secondary`                        | Hành động phụ, badge thứ cấp                                                                            |
| `--secondary-foreground` | `text-secondary-foreground`           | Chữ trên nền secondary                                                                                  |
| `--info`                 | `bg-info`, `text-info`, `border-info` | Active state (radio), secondary CTA (Apply, Add address), ACTIVE badge, tab active — **blue-teal/cyan** |
| `--info-foreground`      | `text-info-foreground`                | Chữ trên nền info (trắng light / đen dark)                                                              |
| `--info-muted`           | `bg-info-muted`                       | Nền nhạt khi item active (card highlight)                                                               |

#### Neutral

| Token                 | Tailwind class           | Dùng cho                                                        |
| --------------------- | ------------------------ | --------------------------------------------------------------- |
| `--muted`             | `bg-muted`               | Vùng mờ, hover state đậm                                        |
| `--muted-foreground`  | `text-muted-foreground`  | Chữ phụ / caption / placeholder                                 |
| `--accent`            | `bg-accent`              | Hover / focus background nhạt cho icon/button                   |
| `--accent-foreground` | `text-accent-foreground` | Chữ trên nền accent                                             |
| `--skeleton`          | `bg-skeleton`            | Nền skeleton loading                                            |
| `--icon-bg`           | `bg-icon-bg`             | Nền container icon button (muted surface, tự adapt dark/ light) |

#### Semantic — Trạng thái

| Token                 | Tailwind class                                             | Dùng cho                            |
| --------------------- | ---------------------------------------------------------- | ----------------------------------- |
| `--destructive`       | `bg-destructive`, `text-destructive`, `border-destructive` | Xóa, lỗi nghiêm trọng               |
| `--destructive-muted` | `bg-destructive-muted`                                     | Nền nhạt cho vùng lỗi               |
| `--success`           | `text-success`                                             | Màu thành công                      |
| `--success-muted`     | `bg-success-muted`                                         | Nền nhạt cho thông báo thành công   |
| `--warning`           | `text-warning`                                             | Màu cảnh báo                        |
| `--warning-muted`     | `bg-warning-muted`                                         | Nền nhạt cho vùng cảnh báo trong UI |

#### Toast (dùng qua `notify.*`)

> `notify.error` dùng style **outlined** (Revoke-button): border đỏ + text đỏ, background gần như trong suốt (card bg). Không dùng filled red background.

| Token                | Dùng cho                                            |
| -------------------- | --------------------------------------------------- |
| `--toast-warning-bg` | Nền toast warning — đậm hơn `warning-muted`, đủ nổi |
| `--toast-success-bg` | Nền toast success                                   |
| `--toast-error-bg`   | Nền toast error                                     |
| `--toastify-success` | Màu icon / text success trong toast                 |
| `--toastify-error`   | Màu icon / text error trong toast                   |

#### Thương mại / Giá

| Token            | Tailwind class    | Dùng cho                       |
| ---------------- | ----------------- | ------------------------------ |
| `--price`        | `text-price`      | Hiển thị giá bán, giá nổi bật  |
| `--price-accent` | `bg-price-accent` | Nền highlight giá / badge sale |
| `--savings`      | `text-savings`    | Số tiền tiết kiệm được         |
| `--rating`       | `text-rating`     | Màu sao đánh giá               |

### 5.3 Overlay / Backdrop

> Modal overlay, sheet backdrop, và checkout overlay **phải** dùng `--overlay` token thay vì `bg-black/50` hay `bg-black/80` hardcode.

```tsx
// ❌ SAI — hardcoded rgba/black
<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
<AlertDialogOverlay className="fixed inset-0 bg-black/80" />

// ✅ ĐÚNG — dùng token, tự adapt dark/light
<div className="bg-overlay absolute inset-0 backdrop-blur-sm" />
<AlertDialogOverlay className="fixed inset-0 bg-overlay" />

```

Token `--overlay` được định nghĩa trong `theme.css`:
- Light: `oklch(0 0 0 / 0.55)` — semi-transparent black
- Dark: `oklch(0 0 0 / 0.70)` — slightly darker để compensate nền tối

---

### 5.10 Glassmorphism / Elevated card

> Checkout form panel, cart summary card có style "glassmorphism" (blur + semi-transparent) **phải** dùng `bg-card-elevated` + `border-card-elevated-border` thay vì `dark:bg-card/80 dark:border-border/30`.

```tsx
// ❌ SAI — dark: class override không theo token
<Card className="bg-card dark:bg-card/80 dark:border-border/30 border-transparent backdrop-blur-sm" />

// ✅ ĐÚNG — token tự động adapt
<Card className="bg-card-elevated border-card-elevated-border shadow-sm backdrop-blur-sm" />
```

Token `--card-elevated` được định nghĩa trong `theme.css`:
- Light: `oklch(1 0 0 / 1)` — opaque white card (no blur needed)
- Dark: `oklch(0.15 0.012 255 / 0.80)` — navy semi-transparent + `backdrop-blur-sm` = glass effect

---

### 5.11 Brand / Logo

> Logo wordmark **phải** dùng `var(--brand-logo)` thay vì hardcode `oklch(...)`, `#hex`, hay `rgb(...)`.

```tsx
// ❌ SAI — hardcoded oklch value
<span style={{ color: "oklch(0.52 0.2 18)" }}>Brand</span>

// ✅ ĐÚNG — dùng token
<span style={{ color: "var(--brand-logo)" }}>Brand</span>
// hoặc Tailwind class:
<span className="text-brand-logo">Brand</span>
```

---

### 5.12 Popup window / iframe context

> HTML template string inject vào `window.open()` (VNPay popup, payment iframe) **không thể** dùng CSS token vì chạy trong context riêng biệt.  
> Trong trường hợp này dùng `prefers-color-scheme` media query với CSS custom property inline:

```ts
// ✅ ĐÚNG — CSS variables + media query trong template string
popup.document.write(`<style>
  :root { --bg: #f8f9fa; --spin: #3b82f6; }
  @media(prefers-color-scheme:dark) { :root { --bg: #0d0f14; --spin: #38bdf8; } }
  body { background: var(--bg); }
</style>`);
```

---

### 5.4 Hero-on-image text (ngoại lệ có kiểm soát)

> **Ngoại lệ duy nhất** cho white text: khi text/button đặt **trực tiếp** trên full-bleed image/gradient hero (CategoryHero, SearchHero, campaign slides).  
> Trong trường hợp này **phải** dùng các `--hero-*` token — **không** dùng `text-white` hay `bg-white` hardcode.

| Token | Tailwind class | Dùng cho |
| --- | --- | --- |
| `--hero-text` | `text-hero-text` | Heading chính trên hero image |
| `--hero-text-muted` | `text-hero-text-muted` | Body copy / subtitle trên hero (80% opacity) |
| `--hero-text-dim` | `text-hero-text-dim` | Label rất nhỏ trên hero (60% opacity) |
| `--hero-surface` | `bg-hero-surface` | Glassmorphism card / pill trên hero |
| `--hero-btn-bg` | `bg-hero-btn-bg` | CTA button background trên hero |
| `--hero-btn-text` | `text-hero-btn-text` | CTA button text trên hero |

```tsx
// ❌ SAI — hardcoded
<h1 className="text-white">Title</h1>
<p className="text-white/80">Subtitle</p>
<div className="bg-white/10">Glass card</div>
<Button className="bg-white text-black">CTA</Button>

// ✅ ĐÚNG — dùng hero tokens
<h1 className="text-hero-text">Title</h1>
<p className="text-hero-text-muted">Subtitle</p>
<div className="bg-hero-surface">Glass card</div>
<Button className="bg-hero-btn-bg text-hero-btn-text hover:bg-hero-btn-bg/90">CTA</Button>
```

> Lưu ý: các token này có giá trị cố định (always white) vì gradient hero luôn đủ tối để đảm bảo contrast — không cần thay đổi theo theme.

---

### 5.5 Quy tắc khi cần màu mới

**Không** tự thêm hardcode vào component. Thực hiện theo thứ tự:

1. **Tìm token phù hợp** trong bảng trên — đa số trường hợp đã có.
2. **Nếu chưa có** → định nghĩa token mới **cả hai** `:root` (light) và `.dark` trong `theme.css`:

   ```css
   /* theme.css — :root (light mode) */
   --my-new-token: oklch(0.92 0.05 220);

   /* theme.css — .dark */
   --my-new-token: oklch(0.25 0.08 220);
   ```

   Sau đó map vào `@theme inline` nếu muốn dùng class Tailwind:

   ```css
   --color-my-new-token: var(--my-new-token);
   ```

3. **Không** thêm token vào `tailwind.config.ts` — dự án dùng Tailwind CSS 4 với `@theme inline`.
4. Ghi chú lý do token mới ở comment trong `theme.css`.

### 5.6 Button variants — quy tắc chọn

| Variant               | Dùng khi                                                       |
| --------------------- | -------------------------------------------------------------- |
| `default`             | CTA duy nhất / quan trọng nhất: "Đặt hàng", "Lưu", "Xác nhận"  |
| `info`                | CTA phụ / secondary: "Áp dụng", "Thêm địa chỉ", "Lưu bản nháp" |
| `destructive`         | Xóa/hủy có fill đỏ — chỉ dùng khi action nguy hiểm rõ ràng     |
| `destructive-outline` | Outlined red (Revoke-button style) — cancel, remove nhẹ hơn    |
| `outline`             | Hành động trung tính: "Hủy", "Quay lại"                        |
| `ghost`               | Icon button, hover-only, ít nhấn mạnh                          |
| `secondary`           | Button thứ cấp bình thường                                     |

> **Không dùng `variant="default"` cho nhiều nút cùng lúc** — chỉ 1 CTA chính per form/section.

### 5.7 Active state convention

Mọi trạng thái active/selected trong UI phải dùng `--info` (blue-teal/cyan), **không** dùng `--primary`:

```tsx
// ✅ Tab active
"border-info text-info"          // underline tab
"bg-info/10 text-info"           // filled tab / sidebar item

// ✅ Radio/checkbox active
"border-info bg-info/5"          // border-variant radio card

// ✅ Status badge (ACTIVE style)
<span className="bg-info/10 text-info rounded px-2 py-0.5 text-xs font-medium">ACTIVE</span>

// ✅ Icon container
<div className="bg-icon-bg flex h-9 w-9 items-center justify-center rounded-[var(--radius)]">
  <SomeIcon className="text-muted-foreground h-5 w-5" />
</div>
```

### 5.8 Ví dụ đúng / sai

```tsx
// ❌ SAI — hardcoded Tailwind, vỡ dark mode
<div className="bg-gray-100 text-gray-700 border-gray-200">...</div>
<p className="text-red-500">Lỗi</p>
<span className="bg-amber-50">Cảnh báo</span>

// ✅ ĐÚNG — dùng token, tự động adapt dark/light
<div className="bg-card text-foreground border-border">...</div>
<p className="text-destructive">Lỗi</p>
<span className="bg-warning-muted text-warning-foreground">Cảnh báo</span>
```

```tsx
// ❌ SAI — inline style hardcode hex/rgb
<div style={{ color: "#ef4444", background: "#fef2f2" }}>...</div>

// ✅ ĐÚNG — inline style dùng CSS variable
<div style={{ color: "var(--destructive)", background: "var(--destructive-muted)" }}>...</div>
```

### 5.9 Checklist màu sắc

Thêm vào checklist trước khi báo "xong" nếu có thay đổi UI:

```
[ ] Không dùng hardcoded Tailwind color (bg-gray-*, text-red-*, border-zinc-*…)
[ ] Không dùng hex/rgb/hsl inline trừ khi qua var(--token)
[ ] Không dùng bg-black/*, bg-white, text-white, text-black trực tiếp — dùng token
[ ] Overlay/backdrop dùng bg-overlay (không dùng bg-black/50, bg-black/80)
[ ] Text trên hero image dùng text-hero-text / text-hero-text-muted / bg-hero-surface (không dùng text-white)
[ ] Màu mới (nếu có) đã định nghĩa cả :root và .dark trong theme.css
[ ] Đã test visual ở cả light mode và dark mode trong browser
```

---

## 6. Checklist tổng thể (trước khi báo "xong")

```
[ ] tsc --noEmit → 0 errors
[ ] eslint → 0 warnings, 0 errors
[ ] File không quá 230 dòng (hoặc có lý do ngoại lệ)
[ ] Không tự định nghĩa lại type đã có trong lib
[ ] Đã test happy path + edge cases (null/undefined/empty)
[ ] Đã test trong browser nếu là UI change
[ ] Không có any / @ts-ignore không có giải thích
[ ] (UI) Không hardcode màu — dùng token từ mục 5
[ ] (UI) Đã test light mode và dark mode
```

---

## 7. Form

### Quy tắc cứng

- **Chỉ dùng React Hook Form** — Formik bị **cấm** trong toàn bộ repo.
- **Schema validation dùng Zod** (không dùng Yup hay validate thủ công).
- **Không show lỗi trước khi user tương tác** — lỗi chỉ hiện sau khi field đã được touch/blur.
- `resolver: zodResolver(schema)` bắt buộc với mọi `useForm`.

### Ví dụ đúng

```tsx
// ✅ React Hook Form + Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
	email: z.string().email("Email không hợp lệ"),
	phone: z.string().optional()
});

const form = useForm<z.infer<typeof schema>>({
	resolver: zodResolver(schema),
	defaultValues: { email: "", phone: "" }
});
```

```tsx
// ❌ SAI — Formik bị banned
import { Formik, Field } from "formik";
```

---

## 8. API Call — Client vs Server

### Client Component (browser)

Dùng `fetchGraphQL` từ `@/lib/api/secureGraphQL` + token từ `useSession`:

```tsx
import { useSession } from "next-auth/react";
import { fetchGraphQL } from "@/lib/api/secureGraphQL";

const { data: session } = useSession();

const result = await fetchGraphQL(SomeDocument, {
  variables: { ... },
  saleorAppToken: session?.accessToken ?? undefined,
  shouldSendToken: true,
});
```

### Server Component / Server Action

Dùng `executeGraphQL` từ `@/lib/api/fetchGraphQL` (tự resolve token qua `getServerSession`):

```ts
import { executeGraphQL } from "@/lib/api/fetchGraphQL";

const result = await executeGraphQL(SomeDocument, {
  variables: { ... },
  withAuth: true,
});
```

### Quy tắc

- **Không dùng `executeGraphQL` trong Client Component** — nó gọi Server Action nội bộ, gây waterfall không cần thiết.
- **Không dùng `fetchGraphQL` trong Server Component** — `useSession` không hoạt động server-side.
- Mutation liên quan đến user data (address, account) → luôn dùng client-side với `useSession` token.
- Query public (products, categories) ở Server Component → dùng `executePublicGraphQLRequest` từ `@/lib/api/publicGraphQL`.

---

## 9. Client vs Server Component (`"use client"`)

### Khi nào BẮT BUỘC `"use client"`

- Dùng bất kỳ hook nào (`useState`, `useEffect`, `useSession`, `useSWR`, `useForm`…)
- Dùng browser API (`window`, `document`, `localStorage`)
- Dùng event handler trực tiếp (`onClick`, `onChange`, `onSubmit`)
- Dùng Radix UI interactive primitives (Dialog, DropdownMenu, Popover…)
- Dùng `useRouter`, `useSearchParams`, `usePathname`

### Khi nào KHÔNG dùng `"use client"`

- Component chỉ render HTML tĩnh hoặc dữ liệu fetch trên server
- Layout wrapper không có state
- Page component fetch data với `async/await` trực tiếp

### Quy tắc

- **Đẩy `"use client"` xuống thấp nhất có thể** — chỉ mark directive ở component thực sự cần interactivity, không mark ở parent/layout.
- Tách phần tĩnh và phần dynamic thành component riêng nếu cần.

```tsx
// ❌ SAI — mark cả page là client chỉ vì một button
"use client";
export default function ProductPage() { ... }

// ✅ ĐÚNG — tách button thành component riêng
// AddToCartButton.tsx
"use client";
export const AddToCartButton = () => { ... };

// ProductPage.tsx (Server Component)
import { AddToCartButton } from "./AddToCartButton";
export default async function ProductPage() { ... }
```

---

## 10. Các lỗi thường gặp — cần tránh

| Lỗi                                                         | Nguyên nhân                                                                                       | Cách tránh                                                                       |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `Cannot read properties of undefined (reading 'thumbnail')` | Dùng `variant.product.thumbnail` cho `OrderLine` vốn không fetch `variant.product` trong fragment | Luôn kiểm tra GraphQL fragment xem field nào thực sự được fetch trước khi access |
| `AUTHORIZATION_FAILURE` từ `transactionProcess`             | Gọi `transactionProcess` cho event không phải `ACTION_REQUIRED`                                   | Chỉ gọi `transactionProcess` khi `eventType === "ACTION_REQUIRED"`               |
| Validation deadlock (button không làm gì)                   | `validateAllForms` bao gồm scope của form chưa mount                                              | Chỉ validate scope của form đang được render trên màn hình                       |
| TypeScript error sau khi thêm prop                          | Import `cn` / util bị thiếu                                                                       | Kiểm tra tất cả import sau mỗi lần thêm function call                            |
