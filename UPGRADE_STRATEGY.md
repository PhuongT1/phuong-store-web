# Safe Dependency Upgrade Strategy

## Issue Discovered

Many package versions I initially recommended don't exist on npm. Taking a more conservative, tested approach.

## Phase 1: Critical Type Safety (Do This First)

These are REQUIRED for React 19 + TypeScript compatibility:

```bash
# Install React 19 type definitions
yarn add -D @types/react@^19.0.10 @types/react-dom@^19.0.5

# Update Node types for compatibility
yarn add -D @types/node@^22.10.5

# Test if TypeScript still compiles
yarn tsc --noEmit
```

##Phase 2: ESLint 9 Migration (Required for Modern Next.js)

**Step 1**: Install ESLint 9 ecosystem

```bash
yarn add -D eslint@^9.19.0 \
  @typescript-eslint/eslint-plugin@^8.22.1 \
  @typescript-eslint/parser@^8.22.1 \
  eslint-config-prettier@^10.0.1
```

**Step 2**: Create `eslint.config.js` (flat config format)

File already created: `eslint.config.js`

**Step 3**: Remove old config

```bash
rm .eslintrc.json
```

**Step 4**: Test

```bash
yarn lint
```

## Phase 3: Saleor SDK Upgrades (Test Carefully)

These have major version jumps - test auth/API integration after each:

```bash
# App SDK v0 → v1 (major)
yarn add @saleor/app-sdk@^1.7.0

# Test app integration, check for breaking changes
# Verify webhook handlers still work

# Auth SDK patch update (safe)
yarn add @saleor/auth-sdk@^1.0.3

# Test authentication flow
```

## Phase 4: UI Library Updates (One at a Time)

### Radix UI (Safe Minor Updates)

```bash
yarn add @radix-ui/react-accordion@^1.2.2 \
  @radix-ui/react-alert-dialog@^1.1.4 \
  @radix-ui/react-checkbox@^1.1.3 \
  @radix-ui/react-dialog@^1.1.4 \
  @radix-ui/react-icons@^1.3.2 \
  @radix-ui/react-navigation-menu@^1.2.3 \
  @radix-ui/react-progress@^1.1.1 \
  @radix-ui/react-radio-group@^1.2.2 \
  @radix-ui/react-scroll-area@^1.2.2 \
  @radix-ui/react-select@^2.1.4 \
  @radix-ui/react-separator@^1.1.1 \
  @radix-ui/react-slider@^1.2.2 \
  @radix-ui/react-tabs@^1.1.3 \
  @radix-ui/react-toggle@^1.1.1 \
  @radix-ui/react-toggle-group@^1.1.1 \
  @radix-ui/react-tooltip@^1.1.7 \
  @radix-ui/themes@^3.1.6
```

### Headless UI v1 → v2 (BREAKING CHANGES)

**DO NOT UPGRADE** until you read the migration guide: https://headlessui.com/react/migration

When ready:

```bash
yarn add @headlessui/react@^2.2.0
```

Check all Headless UI components (Combobox, etc.) for breaking changes.

## Phase 5: Other Package Updates (Test Between Each Group)

### Build Tools

```bash
yarn add -D husky@^9.1.7  # Update prepare script to "husky"
yarn add -D lint-staged@^15.3.0
yarn add -D prettier@^3.7.4
yarn add -D autoprefixer@^10.4.20
```

### GraphQL

```bash
yarn add -D @graphql-codegen/cli@^5.0.4 \
  @graphql-codegen/client-preset@^4.5.2

# Test code generation
yarn generate
```

### Testing

```bash
yarn add -D @playwright/test@^1.49.1 \
  vitest@^4.0.15 \
  @vitejs/plugin-react@^5.1.1 \
  jsdom@^25.0.1 \
  react-test-renderer@^19.0.0

# Run tests
yarn test
```

### Utilities (Low Risk)

```bash
yarn add libphonenumber-js@^1.11.16 \
  tailwind-merge@^2.6.0 \
  lucide-react@^0.468.0
```

## Packages To Keep At Current Version

DO NOT upgrade these (nonexistent versions or breaking changes):

- `next-intl`: Keep at `4.5.8` (latest is `4.8.3`, but test first)
- `zod`: Keep at current version (v4 experimental - wait for stable)
- `@hookform/resolvers`: Keep at current (complex dependency tree)

## Payment SDKs (High Risk - Upgrade Last)

Only upgrade after fully testing:

### Stripe (v2 → v5, v2→ v3)

```bash
yarn add @stripe/stripe-js@latest @stripe/react-stripe-js@latest
```

**Breaking Changes**: Updated Elements API, new payment methods
**Guide**: https://stripe.com/docs/js/migration_guide

### Adyen (v5 → v6)

```bash
yarn add @adyen/adyen-web@latest @adyen/api-library@latest
```

**Breaking Changes**: Updated component APIs, new initialization
**Guide**: https://docs.adyen.com/online-payments/release-notes/web/

## Final Phase: Build & Deploy Testing

```bash
# Clear caches
rm -rf .next node_modules/.cache

# Fresh install
yarn install

# Type check
yarn tsc --noEmit

# Lint
yarn lint

# Build
yarn build

# Dev server
yarn dev

# E2E tests
yarn test:old
```

## Rollback Plan

If anything breaks:

1. Check which package caused the issue
2. npm view [package-name] versions
3. Downgrade to previous working version
4. Document the incompatibility

## Testing Checklist

After each upgrade phase:

- [ ] TypeScript compiles (`yarn tsc --noEmit`)
- [ ] ESLint passes (`yarn lint`)
- [ ] Build succeeds (`yarn build`)
- [ ] Dev server starts (`yarn dev`)
- [ ] Auth flow works (login, logout, register)
- [ ] Payment integrations work (Stripe, Adyen)
- [ ] Language switcher works
- [ ] Checkout flow completes
- [ ] E2E tests pass

## Estimated Timeline

- Phase 1 (Types): 15 min
- Phase 2 (ESLint): 30 min
- Phase 3 (Saleor): 1-2 hours (testing)
- Phase 4 (UI): 1-2 hours (Headless UI migration)
- Phase 5 (Other): 1 hour
- Payment SDKs: 2-4 hours (integration testing)
- **Total**: 6-10 hours

## Support Resources

- Next.js 15 docs: https://nextjs.org/docs
- React 19 upgrade guide: https://react.dev/blog/2024/12/05/react-19
- ESLint 9 migration: https://eslint.org/docs/latest/use/configure/migration-guide
- TypeScript 5.7 release: https://devblogs.microsoft.com/typescript/announcing-typescript-5-7/

## Current Status

- ✅ ESLint flat config created (`eslint.config.js`)
- ✅ Migration notes documented
- ⏸️ Waiting for user to execute Phase 1 (Type Safety)
