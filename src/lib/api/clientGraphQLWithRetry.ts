/**
 * clientGraphQLWithRetry
 *
 * Client-side GraphQL fetch wrapper with automatic token refresh + retry.
 *
 * Flow:
 * 1. Get session via getSession() (client-side next-auth)
 * 2. Call fetchGraphQL with current accessToken
 * 3. If GraphQL/HTTP auth error detected → force session update (next-auth refresh)
 * 4. Retry once with the new token
 * 5. Non-auth errors propagate immediately to the caller
 */

"use client";

import { getSession } from "next-auth/react";
import { type GraphQLDocument, type GraphQLRequestOptions } from "./graphQLRequest";
import { fetchGraphQL } from "./secureGraphQL";

const AUTH_ERROR_KEYWORDS = [
	"signature has expired",
	"not authenticated",
	"unauthenticated",
	"authentication credentials",
	"invalid token"
] as const;

const isAuthErrorMessage = (msg: string): boolean => {
	const lower = msg.toLowerCase();
	return AUTH_ERROR_KEYWORDS.some((kw) => lower.includes(kw));
};

const isAuthError = (err: unknown): boolean => {
	if (!(err instanceof Error)) return false;
	return isAuthErrorMessage(err.message);
};

/**
 * Force next-auth to refresh the session cookie (calls /api/auth/session?update).
 * Returns the new accessToken if available, or undefined.
 */
const forceSessionRefresh = async (): Promise<string | undefined> => {
	try {
		const session = await getSession();
		return session?.accessToken ?? undefined;
	} catch {
		return undefined;
	}
};

/**
 * Client-side GraphQL fetch with automatic token refresh + 1 retry on auth errors.
 *
 * Usage (client components):
 * ```tsx
 * import { clientFetchGraphQL } from "@/lib/api/clientGraphQLWithRetry";
 * const data = await clientFetchGraphQL(SomeDocument, { variables: {...} });
 * ```
 */
export const clientFetchGraphQL = async <Result, Variables>(
	operation: GraphQLDocument<Result, Variables>,
	options: Omit<GraphQLRequestOptions<Variables>, "saleorAppToken" | "shouldSendToken">
): Promise<Result> => {
	// 1. Get current session token
	const session = await getSession();
	const accessToken = session?.accessToken ?? undefined;

	const callFetch = (token: string | undefined) =>
		fetchGraphQL(operation, {
			...options,
			saleorAppToken: token,
			shouldSendToken: true
		});

	try {
		return await callFetch(accessToken);
	} catch (firstError: unknown) {
		if (!isAuthError(firstError)) throw firstError;

		// Auth error → force session refresh and retry once
		const newToken = await forceSessionRefresh();

		try {
			return await callFetch(newToken);
		} catch (retryError: unknown) {
			// If still auth error after refresh, surface the original error
			throw retryError;
		}
	}
};

export { isAuthError as isClientAuthError };
