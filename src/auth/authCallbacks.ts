import { type CallbacksOptions } from "next-auth";
import { CONFIG } from "@/constants";
import { refreshSaleorToken } from "@/lib/auth/refreshSaleorToken";
import { isTokenExpired } from "@/lib/auth/token";

const { accessToken, refreshToken } = CONFIG.COOKIE_KEY;

export const authCallbacks: Partial<CallbacksOptions> = {
	/**
	 * JWT callback runs on every getServerSession() call.
	 * Handles proactive token refresh with a 60-second buffer before actual expiry.
	 * Distinguishes transient failures (keep refreshToken, retry next request)
	 * from permanent failures (clear both tokens, force re-login).
	 */
	async jwt({ token, user, account }) {
		// Initial sign-in: store Saleor tokens from the credentials provider.
		if (account && user) {
			token[accessToken] = user.token;
			token[refreshToken] = user.refreshToken;
			return token;
		}

		// isTokenExpired returns true when exp < now + 60s (60-second proactive buffer).
		if (!isTokenExpired(token[accessToken])) return token;

		const rt = token[refreshToken];
		if (typeof rt !== "string") {
			token["error"] = "RefreshAccessTokenError";
			return token;
		}

		const result = await refreshSaleorToken(rt);
		if (result.token) {
			// Success: store new access token, clear any previous error flag.
			token[accessToken] = result.token;
			delete token["error" as keyof typeof token];
		} else if (result.failureKind === "permanent") {
			// Saleor explicitly rejected the refresh token → force re-login.
			token[accessToken] = undefined;
			token[refreshToken] = undefined;
			token["error"] = "RefreshAccessTokenError";
		} else {
			// Transient failure (network hiccup, Saleor temporarily down).
			// Clear the expired access token so it is never forwarded to Saleor
			// ("Signature has expired"), but KEEP refreshToken for the next request.
			// Do NOT set error — the user stays logged in; serverFetchWithAuth retries.
			token[accessToken] = undefined;
		}

		return token;
	},

	async session({ session, token }) {
		const t = token[accessToken];
		session[accessToken] = typeof t === "string" ? t : undefined;
		return session;
	}
};
