# Authentication Flow

## Architecture

```
NextAuth v4 (JWT strategy)
  ├── CredentialsProvider → calls Saleor tokenCreate mutation
  ├── JWT callback → stores Saleor accessToken + refreshToken in JWT
  ├── Session callback → exposes accessToken to client
  └── Token refresh → automatic via authCallbacks.ts
```

## Files

| File                        | Purpose                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| `src/auth/authConfig.ts`    | NextAuth options (providers, callbacks, cookies, JWT strategy)                           |
| `src/auth/authProviders.ts` | CredentialsProvider with `authorize()` calling Saleor login                              |
| `src/auth/authCallbacks.ts` | JWT callback (token storage + auto-refresh), Session callback                            |
| `src/auth/authSession.ts`   | `getUserSession()` — works on both server (`getServerSession`) and client (`getSession`) |
| `src/auth/authActions.ts`   | `signOutUser()` — handles sign-out on both server and client                             |
| `src/action/auth/auth.ts`   | Server actions: `login()`, `setAccessToken()`, `clearSessionToken()`, etc.               |
| `src/action/auth/token.ts`  | `getAccessTokenFromRefresh()` — refreshes Saleor token                                   |
| `src/lib/auth/token.ts`     | `isTokenExpired()` — JWT decode + 60s buffer                                             |

## Login Flow

```
1. User submits email/password on /sign-in
2. useLogin hook → signIn("credentials", { redirect: false, email, password })
3. NextAuth POST /api/auth/callback/credentials
4. authorize() → login() server action → getServerAuthClient().signIn()
5. Saleor tokenCreate mutation → { token, refreshToken, errors }
6. If errors → throw → NextAuth returns { error: "CredentialsSignin" }
7. If success → return { token, refreshToken, id }
8. JWT callback stores tokens → session cookie set
9. Client gets { ok: true } → revalidateCurrentUser() → redirect
```

## Token Refresh

```
1. JWT callback checks token expiry on every request
2. If expired (with 60s buffer) → fetchNewAccessToken()
3. Uses refreshToken → Saleor tokenRefresh mutation
4. Singleton promise prevents concurrent refresh requests
5. If refresh fails → wipe tokens + set error: "RefreshAccessTokenError"
6. SessionWatcher component detects error → auto sign-out
```

## Cookie Keys

```ts
CONFIG.COOKIE_KEY = {
	checkoutId: "checkoutId",
	accessToken: "accessToken",
	refreshToken: "refreshToken",
	searchProvider: "searchProvider"
};
```

## Saleor Auth SDK

`@saleor/auth-sdk` is used in two places:

1. **Server**: `getServerAuthClient()` in `src/app/config.ts` — for login mutation
2. **Client**: `AuthProvider` in `src/components/layouts/AuthProvider.tsx` — urql client with `fetchWithAuth`
