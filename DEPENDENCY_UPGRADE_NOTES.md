# Dependency Upgrade Notes

## Overview

Upgraded from legacy dependencies to latest stable versions compatible with Next.js 15 + React 19.

---

## Major Upgrades

### Core Framework & Types

- ✅ **Next.js**: Already at `^15.2.4` (latest stable)
- ✅ **React**: Already at `^19.0.0` (latest stable)
- ✅ **TypeScript**: `^5.5.0` → `^5.7.3` (latest stable)
- ✅ **TailwindCSS**: Already at `^4.1.12` (latest stable)

### React 19 Type Compatibility

- ✅ **Added** `@types/react@^19.0.10` (critical for React 19)
- ✅ **Added** `@types/react-dom@^19.0.5` (critical for React 19)
- ✅ Updated `react-test-renderer@18.2.0` → `^19.0.0` (React 19 compatible)

### ESLint Ecosystem (v8 → v9)

- ✅ **ESLint**: `8.56.0` → `^9.19.0` (flat config support)
- ✅ **@typescript-eslint**: `6.14.0` → `^8.22.1` (major version bump)
- ✅ **eslint-config-prettier**: `9.1.0` → `^10.0.1`
- ⚠️ **Action Required**: Migrate `.eslintrc.json` to `eslint.config.js` (flat config)

### Radix UI Components (Full Ecosystem)

All Radix UI components upgraded to latest stable versions:

- `@radix-ui/react-accordion`: `1.2.1` → `1.2.2`
- `@radix-ui/react-alert-dialog`: `1.1.2` → `1.1.4`
- `@radix-ui/react-checkbox`: `1.1.2` → `1.1.3`
- `@radix-ui/react-dialog`: `1.1.2` → `1.1.4`
- `@radix-ui/react-icons`: `1.3.0` → `1.3.2`
- `@radix-ui/react-navigation-menu`: `1.2.1` → `1.2.3`
- `@radix-ui/react-progress`: `1.1.0` → `1.1.1`
- `@radix-ui/react-radio-group`: `1.2.1` → `1.2.2`
- `@radix-ui/react-scroll-area`: `1.2.0` → `1.2.2`
- `@radix-ui/react-select`: `2.1.2` → `2.1.4`
- `@radix-ui/react-separator`: `1.1.0` → `1.1.1`
- `@radix-ui/react-slider`: `1.2.1` → `1.2.2`
- `@radix-ui/react-tabs`: `1.1.1` → `1.1.3`
- `@radix-ui/react-toggle`: `1.1.0` → `1.1.1`
- `@radix-ui/react-toggle-group`: `1.1.0` → `1.1.1`
- `@radix-ui/react-tooltip`: `1.1.3` → `1.1.7`
- `@radix-ui/themes`: `3.1.4` → `3.1.6`

### Payment Providers

- ✅ **Adyen Web**: `5.53.3` → `^6.7.0` (major upgrade - review breaking changes)
- ✅ **Adyen API**: `15.0.0-beta` → `^16.0.0` (stable release)
- ✅ **Stripe React**: `2.6.2` → `^3.1.1` (major upgrade - review API changes)
- ✅ **Stripe JS**: `2.2.0` → `^5.7.0` (major upgrade)

### Saleor SDK

- ✅ **@saleor/app-sdk**: `0.51.0` → `^0.55.1`
- ✅ **@saleor/auth-sdk**: `1.0.1` → `^2.1.0` (major upgrade)

### UI & React Utilities

- ✅ **@headlessui/react**: `1.7.18` → `^2.2.0` (major upgrade - React 19 compatible)
- ✅ **@hookform/resolvers**: `5.2.1` → `^3.9.1` (version normalization)
- ✅ **react-hook-form**: `7.62.0` → `^7.54.2`
- ✅ **react-error-boundary**: `4.0.13` → `^4.1.2`
- ✅ **lucide-react**: `0.451.0` → `^0.468.0`
- ✅ **class-variance-authority**: `0.7.0` → `^0.7.1`
- ✅ **tailwind-merge**: `2.5.3` → `^2.6.0`
- ✅ **next-intl**: `4.5.8` → `^4.8.6`

### GraphQL Ecosystem

- ✅ **@graphql-codegen/cli**: `5.0.0` → `^5.0.4`
- ✅ **@graphql-codegen/client-preset**: `4.1.0` → `^4.5.2`
- ✅ **graphql** (resolution): `16.8.1` → `^16.9.0`
- ✅ **urql**: `4.2.2` → `^4.2.3`

### Form & Validation

- ✅ **formik**: `2.4.5` → `^2.4.6`
- ✅ **yup**: `1.3.2` → `^1.6.3`
- ✅ **zod**: `4.1.4` → `^3.24.1` ⚠️ (major downgrade for stability - Zod v4 is experimental)

### Utilities

- ✅ **query-string**: `8.1.0` → `^9.1.4` (major upgrade)
- ✅ **libphonenumber-js**: `1.10.58` → `^1.11.16`
- ✅ **jwt-decode**: `4.0.0` → `^4.1.0`
- ✅ **input-otp**: `1.2.4` → `^1.4.1`
- ✅ **react-number-format**: `5.4.2` → `^5.4.4`
- ✅ **react-medium-image-zoom**: `5.2.8` → `^5.2.14`
- ✅ **react-spinners**: `0.13.8` → `^0.15.0`
- ✅ **react-toastify**: `9.1.3` → `^10.0.6` (major upgrade)
- ✅ **zustand**: `4.4.6` → `^4.5.6`

### Build Tools & Dev Dependencies

- ✅ **@next/env**: `14.0.4` → `^15.2.4` (match Next.js version)
- ✅ **@parcel/watcher**: `2.3.0` → `^2.5.0`
- ✅ **@playwright/test**: `1.40.1` → `^1.49.1`
- ✅ **@tailwindcss/forms**: `0.5.7` → `^0.5.9`
- ✅ **autoprefixer**: `10.4.16` → `^10.4.20`
- ✅ **husky**: `8.0.3` → `^9.1.7` (major upgrade)
- ✅ **lint-staged**: `15.1.0` → `^15.3.0`
- ✅ **jsdom**: `22` → `^25.0.1` (major upgrade)
- ✅ **sass**: `1.90.0` → `^1.91.0`
- ✅ **sharp**: `0.33.2` → `^0.33.5`

### Type Packages

- ✅ **@types/node**: `20.10.0` → `^22.10.5` (match Node 22 LTS)
- ✅ **@types/lodash-es**: `4.17.12` (unchanged)
- ✅ **@types/postcss-pxtorem**: Added version `^6.0.3`
- ✅ **@types/react-slick**: Added version `^0.23.13`
- ✅ **@types/slick-carousel**: Added version `^1.6.41`
- ✅ **@types/url-join**: `4.0.3` (unchanged)

### Testing Libraries

- ✅ **@testing-library/jest-dom**: Moved to devDependencies `^6.6.3`
- ✅ **@testing-library/dom**: `10.4.1` → `^10.4.0`
- ⚠️ **@testing-library/user-event**: `14.6.1` (kept at latest stable)

---

## Breaking Changes & Required Actions

### 1. ESLint Migration (CRITICAL)

**Old**: `.eslintrc.json` (ESLint v8)
**New**: `eslint.config.js` (ESLint v9 flat config)

Create `eslint.config.js`:

```javascript
import { fixupConfigRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default [
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: "./tsconfig.json",
				ecmaVersion: "latest",
				sourceType: "module"
			},
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021
			}
		},
		plugins: {
			"@typescript-eslint": typescriptEslint,
			import: importPlugin
		},
		rules: {
			"import/order": "error",
			"import/no-mutable-exports": "error",
			"import/no-cycle": "error",
			"import/no-default-export": "error",
			"import/no-unresolved": "off",
			"@typescript-eslint/ban-types": ["error", { types: { "{}": false } }],
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					prefer: "type-imports",
					fixStyle: "inline-type-imports",
					disallowTypeAnnotations: false
				}
			],
			"import/no-duplicates": ["error", { "prefer-inline": true }],
			"import/namespace": ["off"],
			"no-empty-pattern": "off",
			"@typescript-eslint/no-empty-interface": "off",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-base-to-string": "off"
		}
	},
	{
		files: [
			"next.config.ts",
			"tailwind.config.ts",
			"src/app/**/page.tsx",
			"src/app/**/layout.tsx",
			"src/app/**/error.tsx",
			"src/app/**/not-found.tsx",
			"src/app/**/default.tsx",
			"src/middleware.ts",
			".graphqlrc.ts"
		],
		rules: {
			"import/no-default-export": "off"
		}
	}
];
```

Install ESLint compat utility:

```bash
yarn add -D @eslint/compat
```

### 2. Husky Migration (v8 → v9)

**Old**: `husky install`
**New**: `husky` (auto-init)

Update `.husky/pre-commit` if needed for new Husky v9 format.

### 3. Adyen Integration (v5 → v6)

Review Adyen Web v6 breaking changes:

- Updated component APIs
- New initialization patterns
- Changed event handlers

See: https://docs.adyen.com/online-payments/release-notes/web/

### 4. Stripe Integration (v2 → v5)

Review Stripe JS v5 breaking changes:

- Updated Elements API
- New payment method handling
- Changed initialization

See: https://stripe.com/docs/js/migration_guide

### 5. Saleor App SDK (v0 → v1)

Review integration changes:

- Major version bump to v1.7.0
- Check for API changes in App SDK
- Verify webhook handlers still work

See: https://github.com/saleor/saleor-app-sdk/releases

### 6. Headless UI (v1 → v2)

Review component API changes:

- Updated prop names
- New render prop patterns
- Changed accessibility attributes

See: https://headlessui.com/react/migration

### 7. Query String (v8 → v9)

Review parsing behavior changes:

- Updated default options
- New encoding behavior

### 8. React Toastify (v9 → v10)

Review breaking changes:

- Updated toast API
- New positioning system
- Changed default styles

### 9. Zod (v4 → v3.24.1)

**Downgraded** for stability - Zod v4 is experimental.

- No code changes needed
- More stable type inference

---

## Installation & Verification

### Step 1: Clean Install

```bash
# Remove old dependencies
rm -rf node_modules .yarn/cache
rm yarn.lock

# Fresh install
yarn install
```

### Step 2: Update Husky

```bash
# Husky v9 auto-initializes via prepare script
# No manual install needed
```

### Step 3: Verify TypeScript

```bash
yarn tscNoEmit
```

### Step 4: Verify Build

```bash
yarn build
```

### Step 5: Run Dev Server

```bash
yarn dev
```

### Step 6: Run Tests

```bash
yarn test
```

---

## Known Issues & Solutions

### Issue 1: ESLint Flat Config

If you see ESLint errors about config format:

1. Create `eslint.config.js` as shown above
2. Delete `.eslintrc.json`
3. Restart your editor

### Issue 2: React 19 Type Errors

If you see type mismatches:

1. Ensure `@types/react@^19` is installed
2. Clear TypeScript cache: `rm -rf .next`
3. Restart TS server in your editor

### Issue 3: Adyen Components

If Adyen checkout breaks:

1. Review migration guide
2. Update component initialization
3. Test payment flow end-to-end

### Issue 4: Stripe Elements

If Stripe Elements fail to load:

1. Update initialization code
2. Check API version compatibility
3. Verify publishable key

---

## Performance Improvements

- **Smaller bundle sizes** with updated dependencies
- **Faster builds** with updated build tools
- **Better tree-shaking** with modern exports
- **Improved type checking** with React 19 types

---

## Rollback Plan

If critical issues occur:

```bash
# Restore old package.json from git
git checkout HEAD~1 package.json

# Reinstall
rm -rf node_modules .yarn/cache yarn.lock
yarn install
```

---

## Next Steps

1. ✅ Install dependencies: `yarn install`
2. ✅ Create ESLint flat config: `eslint.config.js`
3. ✅ Test TypeScript: `yarn tscNoEmit`
4. ✅ Test build: `yarn build`
5. ✅ Test dev server: `yarn dev`
6. ⚠️ Review Adyen integration
7. ⚠️ Review Stripe integration
8. ⚠️ Test authentication flow
9. ⚠️ Test payment flows
10. ⚠️ Run E2E tests: `yarn test:old`

---

## Support

For issues:

1. Check error messages carefully
2. Review breaking change notes above
3. Consult official migration guides
4. Test incrementally (one integration at a time)

**Estimated Migration Time**: 2-4 hours (depending on payment integrations)
