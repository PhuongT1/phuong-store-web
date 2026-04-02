/**
 * Two kinds of refresh failure:
 * - "transient": network/HTTP error → KEEP refreshToken, caller may retry
 * - "permanent": Saleor explicitly rejected the token → clear tokens, force re-login
 */
type RefreshFailureKind = "transient" | "permanent";

export type RefreshResult =
	| { token: string; failureKind: null }
	| { token: null; failureKind: RefreshFailureKind };

type RefreshBody = {
	data?: { tokenRefresh?: { token?: string | null; errors?: unknown[] } };
	errors?: unknown[];
};

/**
 * Call Saleor `tokenRefresh` mutation directly (no Authorization header).
 *
 * Saleor docs: "Do NOT add the Authorization header with an expired access token
 * to tokenRefresh — it will result in an error."
 *
 * Returns:
 * - success  → `{ token: newAccessToken, failureKind: null }`
 * - transient → `{ token: null, failureKind: "transient" }` — retry candidate
 * - permanent → `{ token: null, failureKind: "permanent" }` — force re-login
 */
export async function refreshSaleorToken(rt: string): Promise<RefreshResult> {
	const apiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
	if (!apiUrl) return { token: null, failureKind: "permanent" };

	try {
		const res = await fetch(apiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				query: `mutation TokenRefresh($refreshToken: String!) {
					tokenRefresh(refreshToken: $refreshToken) {
						token
						errors { field code message }
					}
				}`,
				variables: { refreshToken: rt }
			}),
			cache: "no-store"
		});

		// HTTP-level failure (server down, network issue) → transient
		if (!res.ok) return { token: null, failureKind: "transient" };

		const body = (await res.json()) as RefreshBody;
		const newToken = body.data?.tokenRefresh?.token;
		if (newToken) return { token: newToken, failureKind: null };

		// Saleor returned 200 but no token. Field or top-level errors → permanent.
		const hasFieldErrors = (body.data?.tokenRefresh?.errors?.length ?? 0) > 0;
		const hasTopLevelErrors = (body.errors?.length ?? 0) > 0;
		if (hasFieldErrors || hasTopLevelErrors) {
			return { token: null, failureKind: "permanent" };
		}

		// No token, no errors — ambiguous response, treat as transient.
		return { token: null, failureKind: "transient" };
	} catch {
		// Network exception, JSON parse failure → transient
		return { token: null, failureKind: "transient" };
	}
}
