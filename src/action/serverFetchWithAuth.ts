"use server";

import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authConfig } from "@/auth/authConfig";
import { CONFIG } from "@/constants";
import { type GraphQLDocument, type GraphQLRequestOptions } from "@/lib/api/graphQLRequest";
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
 * 2. Call Saleor with the (possibly refreshed) access token.
 * 3. If Saleor returns an auth error (race condition / transient refresh failure):
 *    a. Read the refresh token directly from the raw JWT cookie.
 *    b. Call tokenRefresh mutation, retry the original request with the new token.
 *    c. If still failing: suppress silently — do NOT show auth errors on screen.
 * 4. Non-auth errors propagate normally to the UI.
 */
const serverFetchWithAuth = async <Result, Variables>(
	operation: GraphQLDocument<Result, Variables>,
	options: GraphQLRequestOptions<Variables>
) => {
	const session = await getServerSession(authConfig);
	const at = session?.accessToken ?? undefined;

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

		// Auth error → attempt one in-request refresh + retry.
		const rt = await getRefreshToken();
		if (rt) {
			const refreshResult = await refreshSaleorToken(rt);
			if (refreshResult.token) {
				try {
					const data = await callFetch(refreshResult.token);
					return { data, errors: [] };
				} catch (retryError: unknown) {
					if (!isAuthError(retryError)) return toErrorResult(retryError);
					// Auth error on retry — fall through to suppress.
				}
			}
		}

		// User requirement: suppress auth errors — never crash the UI with token errors.
		// The next request will retry refresh via the JWT callback.
		console.warn("[auth] Token error suppressed:", String(operation).slice(0, 60));
		return { data: null, errors: [] };
	}
};

export { serverFetchWithAuth };
