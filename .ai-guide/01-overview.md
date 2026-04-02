# Project Overview — phuong-store-web

> **Tài liệu tham chiếu cho AI agent.** Quét thư mục `.ai-guide/` để hiểu dự án ngay.
> Cập nhật: 2026-03-26

## Tóm tắt

Saleor e-commerce storefront xây dựng trên Next.js 15 App Router. Kết nối backend Saleor GraphQL API.
Hỗ trợ đa ngôn ngữ (VI/EN) và đa kênh bán hàng (`[channel]` dynamic route).

## Tech Stack

| Layer           | Tech                                                            |
| --------------- | --------------------------------------------------------------- |
| Framework       | Next.js 15 (App Router, RSC + Client Components)                |
| Language        | TypeScript 5.7 (strict mode)                                    |
| Styling         | Tailwind CSS 4 + shadcn/ui (Radix primitives)                   |
| Forms           | React Hook Form + Zod (main app), Formik (checkout module only) |
| State           | SWR (server cache) + Zustand (client state)                     |
| Auth            | NextAuth v4 (JWT strategy) + Saleor auth-sdk                    |
| GraphQL         | graphql-codegen → TypedDocumentString, urql (checkout only)     |
| i18n            | next-intl (VI + EN, `/messages/` JSON files)                    |
| Notifications   | Sonner (toast library)                                          |
| Testing         | Vitest (unit) + Playwright (E2E)                                |
| Package Manager | Yarn (with `.yarnrc.yml`)                                       |

## Environment Variables (key)

```
NEXT_PUBLIC_SALEOR_API_URL   → Saleor GraphQL endpoint
NEXT_PUBLIC_DEFAULT_CHANNEL_SLUG → Default channel (e.g. "hcm")
NEXT_PUBLIC_API_URL          → Rating API (REST)
NEXTAUTH_SECRET              → NextAuth JWT secret
NEXTAUTH_URL                 → NextAuth callback URL
```

## Quick Commands

```bash
yarn dev          # Dev server on localhost:3000
yarn generate     # GraphQL codegen
yarn build        # Production build
yarn test         # Vitest watch mode
yarn lint         # ESLint fix
```
