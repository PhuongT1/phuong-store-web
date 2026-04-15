"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authConfig } from "@/auth/authConfig";
import { routes } from "@/config";
import { CONFIG } from "@/constants";
import { type GraphQLDocument, type GraphQLRequestOptions, HTTPError } from "@/lib/api/graphQLRequest";
import { fetchGraphQL } from "@/lib/api/secureGraphQL";
import { refreshSaleorToken } from "@/lib/auth/refreshSaleorToken";

const { refreshToken: REFRESH_TOKEN_KEY } = CONFIG.COOKIE_KEY;

/** Auth-related error keywords from Saleor GraphQL responses. */
const AUTH_ERROR_PATTERNS = [
	"signature has expired",
	"not authenticated",
	"unauthenticated",
	"authentication credentials",
	"invalid token"
] as const;

const isAuthError = (err: unknown): boolean => {
	// HTTP 401 / 403 from a proxy, WAF, or Saleor itself should also trigger refresh.
	if (err instanceof HTTPError) {
		const status = err.message.match(/HTTP error (\d+)/)?.[1];
		return status === "401" || status === "403";
	}
	if (!(err instanceof Error)) return false;
	const msg = err.message.toLowerCase();
	return AUTH_ERROR_PATTERNS.some((p) => msg.includes(p));
};

/**
 * Read the Saleor refresh token from the raw request JWT cookie.
 * Bypasses the JWT callback — so it returns the token BEFORE this request's
 * getServerSession() may have cleared it. Enables in-request retry.
 */
const getRefreshToken = async (): Promise<string | null> => {
	try {
		const h = await headers();
		const rawToken = await getToken({
			req: { headers: { cookie: h.get("cookie") ?? "" } } as Parameters<typeof getToken>[0]["req"],
			secret: process.env.NEXTAUTH_SECRET ?? ""
		});
		const rt = rawToken?.[REFRESH_TOKEN_KEY];
		return typeof rt === "string" ? rt : null;
	} catch {
		return null;
	}
};

/**
 * Authenticated server-side GraphQL fetch.
 *
 * Flow:
 * 1. getServerSession() → JWT callback refreshes the access token proactively.
 *    - If JWT callback detected a PERMANENT failure it sets session.error and
 *      clears both tokens. We redirect to sign-in immediately.
 * 2. Call Saleor with the (possibly refreshed) access token.
 * 3. If Saleor returns an auth error (race condition / 401 / 403):
 *    a. Read the refresh token directly from the raw JWT cookie.
 *    b. Call tokenRefresh mutation, retry the original request with the new token.
 *    c. Permanent refresh failure → redirect to sign-in.
 *    d. Transient failure → suppress silently, next request will retry.
 * 4. Non-auth errors propagate normally to the UI.
 */
const serverFetchWithAuth = async <Result, Variables>(
	operation: GraphQLDocument<Result, Variables>,
	options: GraphQLRequestOptions<Variables>
) => {
	const session = await getServerSession(authConfig);
	const hasActiveSession = session !== null;
	let at = session?.accessToken ?? undefined;

	// JWT callback already determined the refresh token is permanently invalid
	// (sets error = "RefreshAccessTokenError" and clears both tokens).
	// Redirect the user to sign-in immediately — no point attempting the request.
	if (session?.error === "RefreshAccessTokenError") {
		console.warn("[auth] Session error detected — redirecting to sign-in");
		redirect(routes.auth.signIn);
	}

	// accessToken was cleared by the JWT callback (transient refresh failure) but
	// the session is still alive. Attempt an in-request refresh before giving up.
	//
	// NOTE: we read the raw JWT cookie here to bypass getServerSession(), which
	// already ran and may have cleared the accessToken this request.
	if (hasActiveSession && !at) {
		const rt = await getRefreshToken();
		if (rt) {
			const refreshResult = await refreshSaleorToken(rt);
			if (refreshResult.token) {
				// Recovered in-request — proceed with the fresh token.
				at = refreshResult.token;
			} else if (refreshResult.failureKind === "permanent") {
				// Saleor permanently rejected the refresh token → force sign-in.
				console.warn("[auth] In-request token refresh permanently failed — redirecting to sign-in");
				redirect(routes.auth.signIn);
			} else {
				// Transient failure (network issue). Suppress and let next request retry.
				console.warn("[auth] In-request token refresh transiently failed — suppressing");
				return { data: null, errors: [] };
			}
		} else {
			// No refresh token in cookie — the JWT callback should have set
			// session.error (caught above). This is a defensive fallback.
			console.warn("[auth] No refresh token found — suppressing request");
			return { data: null, errors: [] };
		}
	}

	const callFetch = (token: string | undefined) =>
		fetchGraphQL(operation, { ...options, saleorAppToken: token });

	const toErrorResult = (err: unknown) => {
		const e = err as { errors?: unknown[]; message?: string };
		console.error("Server fetch error:", JSON.stringify(e, null, 2));
		if (e.errors) return { data: null, errors: e.errors };
		return { data: null, errors: [{ message: e.message ?? "Unknown error" }] };
	};

	try {
		const data = await callFetch(at);
		return { data, errors: [] };
	} catch (firstError: unknown) {
		if (!isAuthError(firstError)) return toErrorResult(firstError);

		// Auth / 401 / 403 error → attempt one in-request refresh + retry.
		const rt = await getRefreshToken();
		if (rt) {
			const refreshResult = await refreshSaleorToken(rt);
			if (refreshResult.token) {
				try {
					const data = await callFetch(refreshResult.token);
					return { data, errors: [] };
				} catch (retryError: unknown) {
					if (!isAuthError(retryError)) return toErrorResult(retryError);
					// Auth error on retry — fall through.
				}
			} else if (refreshResult.failureKind === "permanent") {
				// Refresh token permanently rejected mid-request → redirect to sign-in.
				console.warn("[auth] Token refresh permanently failed during request — redirecting to sign-in");
				redirect(routes.auth.signIn);
			}
			// transient refresh failure: fall through to suppress
		}

		// Transient auth error (network race, Saleor momentarily down).
		// Suppress silently — SessionWatcher handles logout if error is permanent.
		console.warn("[auth] Transient token error suppressed:", String(operation).slice(0, 60));
		return { data: null, errors: [] };
	}
};

export { serverFetchWithAuth };
