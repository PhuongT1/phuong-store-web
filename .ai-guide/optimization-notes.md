# Optimization Notes — Saleor Storefront

> Ghi chú tối ưu và các vấn đề đã được giải quyết / cần theo dõi.

---

## ✅ Đã thực hiện

### 1. Xóa file rác (Dead Files)

| File                                             | Lý do                                                                       |
| ------------------------------------------------ | --------------------------------------------------------------------------- |
| `src/components/ui/AropdownMenu.tsx`             | Duplicate của `DropdownMenu.tsx` với typo tên, đã bị comment trong index.ts |
| `src/middleware.old.ts`                          | File middleware cũ không còn dùng                                           |
| `src/graphql/ProductListPaginatedV2.graphql_old` | GraphQL query cũ với extension `.graphql_old`                               |

### 2. Clean up `src/components/ui/index.ts`

- Xóa comment reference đến `AropdownMenu` (file đã xóa)
- Uncomment `Toaster` export — component này đang được dùng trong `app/layout.tsx` nhưng import từ `@components/ui` chứ không phải qua barrel

### 3. Enable TypeScript strict checks (`tsconfig.json`)

- Uncomment `noUnusedLocals: true` — phát hiện biến/import không dùng
- Uncomment `noUnusedParameters: true` — phát hiện tham số không dùng

> **Lưu ý:** `ignoreBuildErrors: true` và `ignoreDuringBuilds: true` đang bật trong `next.config.ts`.
> Nên tắt dần khi codebase đã clean để enforce quality.

---

## 🔍 Vấn đề cần theo dõi

### 1. Hai thư mục Navigation trùng lặp

- `src/components/nav/` (15 files) — Navigation chính
- `src/components/navigation/` (2 files) — Có thể là wrapper nhỏ
- **Đề xuất:** Review để merge hoặc đặt tên rõ ràng hơn

### 2. `Toaster` vs `Sonner`

- Cả `Toast.tsx + Toaster.tsx` (shadcn Toaster) lẫn `Sonner.tsx` (sonner lib) đều được export
- `app/layout.tsx` import `Toaster` từ `@components/ui` — nhưng `Providers.tsx` cũng render `Toaster` riêng
- **Đề xuất:** Thống nhất chỉ dùng Sonner hoặc shadcn Toast, xóa cái còn lại

### 3. `next.config.ts` — Build Error Suppression

```ts
typescript: {
	ignoreBuildErrors: true;
}
eslint: {
	ignoreDuringBuilds: true;
}
```

Đây là "technical debt". Bật lại khi codebase clean để enforce quality.

### 4. Metadata trong `app/layout.tsx`

```ts
title: "Bán hàng giá siêu rẻ"; // Placeholder — cần cập nhật
description: "Starter pack..."; // Mô tả mặc định của Saleor — cần cập nhật
```

### 5. `reactStrictMode: false` trong `next.config.ts`

- Nên bật `reactStrictMode: true` sau khi fix các side-effect issues (useEffect double-run)

---

## 📐 Best Practices hiện tại

### Naming Conventions ✅

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `*.type.ts`
- Services: `*.service.ts`
- Constants: `*.constant.ts`
- Hooks: `use*.ts` hoặc `use*.tsx`

### Import Path ✅

- Luôn dùng path aliases (`@ui`, `@components/*`, etc.)
- Tránh relative import quá sâu (`../../../`)

### Barrel Exports ✅

- Mỗi thư mục có `index.ts` để re-export
- Consumer chỉ cần import từ thư mục, không cần biết file cụ thể
