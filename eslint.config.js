import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import playwrightPlugin from "eslint-plugin-playwright";

export default [
	// Global ignores (replaces ignorePatterns)
	{
		ignores: ["node_modules/**", "dist/**", ".next/**", "generated/**"]
	},

	// Base config for all TypeScript/JavaScript files
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: "./tsconfig.json",
				ecmaVersion: "latest",
				sourceType: "module"
			}
		},
		plugins: {
			"@typescript-eslint": tseslint,
			import: importPlugin,
			"react-hooks": reactHooksPlugin,
			"@next/next": nextPlugin
		},
		rules: {
			...tseslint.configs.recommended.rules,
			...tseslint.configs["recommended-requiring-type-checking"].rules,
			...importPlugin.configs.recommended.rules,
			...importPlugin.configs.typescript.rules,

			// Import rules
			"import/order": [
				"error",
				{
					groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
					pathGroups: [
						{
							pattern: "react",
							group: "builtin",
							position: "before"
						},
						{
							pattern: "next/**",
							group: "builtin",
							position: "after"
						},
						{
							pattern: "@/**",
							group: "internal",
							position: "before"
						},
						{
							pattern:
								"@{components,hooks,lib,config,constants,types,styles,store,action,services,checkout,auth,providers,gql,i18n,modules}/**",
							group: "internal",
							position: "before"
						}
					],
					pathGroupsExcludedImportTypes: ["react"],
					"newlines-between": "never",
					alphabetize: { order: "asc", caseInsensitive: true }
				}
			],
			"import/no-mutable-exports": "error",
			"import/no-cycle": "error",
			"import/no-default-export": "error",
			"import/no-unresolved": "off",
			"import/no-duplicates": ["error", { "prefer-inline": true }],
			"import/namespace": "off",

			// React Hooks rules
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",

			// Next.js rules
			"@next/next/no-html-link-for-pages": "error",

			// TypeScript rules
			// "ban-types" was removed in @typescript-eslint v8 — {} is allowed by default now
			"@typescript-eslint/no-restricted-types": "off",
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					prefer: "type-imports",
					fixStyle: "inline-type-imports",
					disallowTypeAnnotations: false
				}
			],

			// Allow patterns
			"no-empty-pattern": "off",
			"@typescript-eslint/no-empty-interface": "off",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-base-to-string": "off",
			"@typescript-eslint/require-await": "off",

			// Error handling
			"@typescript-eslint/return-await": ["error", "in-try-catch"],

			// Unused vars
			"@typescript-eslint/no-unused-vars": "off",

			// Template expressions
			"@typescript-eslint/restrict-template-expressions": [
				"error",
				{
					allowNumber: true,
					allowBoolean: true
				}
			],

			// Relaxed type safety (@todo items from original config)
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-unsafe-argument": "off",

			// Promises
			"@typescript-eslint/no-misused-promises": [
				"error",
				{
					checksVoidReturn: false
				}
			]
		}
	},

	// Next.js App Router files and framework config files (allow default exports)
	{
		files: [
			"src/app/**/{page,layout,error,loading,not-found}.tsx",
			"*.ts", // Root-level config files (next.config.ts, tailwind.config.ts, playwright.config.ts, etc.)
			"src/app/**/robots.ts",
			"src/app/**/sitemap.ts",
			"src/i18n/**/*.ts",
			"src/next-auth.config.ts",
			"src/pages/**/*.{ts,tsx}"
		],
		rules: {
			"import/no-default-export": "off"
		}
	},

	// Checkout standalone component (no Next.js imports)
	{
		files: ["src/checkout/**/*.{ts,tsx}"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							group: ["next/*", "@next/*", "next"],
							message:
								"Usage of Next.js-specific imports inside src/checkout is forbidden. Checkout is a standalone component and should not depend on Next.js."
						}
					]
				}
			],
			"react-hooks/exhaustive-deps": "off",
			"@next/next/no-html-link-for-pages": "off",
			"@typescript-eslint/no-unsafe-enum-comparison": "off",
			"@typescript-eslint/no-empty-object-type": "off"
		}
	},

	// Checkout-related hooks (same enum/typing relaxations as checkout)
	{
		files: ["src/hooks/checkout/**/*.{ts,tsx}"],
		rules: {
			"@typescript-eslint/no-unsafe-enum-comparison": "off",
			"@typescript-eslint/no-empty-object-type": "off"
		}
	},

	// Checkout GraphQL files
	{
		files: ["src/checkout/graphql/**/*.{ts,tsx}"],
		rules: {
			"import/no-named-as-default": "off"
		}
	},

	// Test files with Playwright
	{
		files: ["__tests__/**/*.{ts,tsx}"],
		plugins: {
			playwright: playwrightPlugin
		},
		rules: {
			...playwrightPlugin.configs.recommended.rules
		}
	},

	// Vitest/Jest test files (allow require() in vi.mock/jest.mock factories)
	{
		files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}"],
		rules: {
			"@typescript-eslint/no-require-imports": "off"
		}
	},

	// TypeScript declaration files
	{
		files: ["**/*.d.ts"],
		rules: {
			"@typescript-eslint/no-empty-object-type": "off",
			"import/no-default-export": "off"
		}
	}
];
