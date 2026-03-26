import { type CallbacksOptions } from "next-auth";
import { type JWT } from "next-auth/jwt";
import { getAccessTokenFromRefresh } from "@/action/auth/token";
import { isTokenExpired } from "@/lib/auth/token";
import { CONFIG } from "@/constants";

const { accessToken, refreshToken } = CONFIG.COOKIE_KEY;
let refreshTokenPromise: ReturnType<typeof fetchNewAccessToken> | null = null;

/**
 * Fetches a new access token using the provided refresh token.
 * @param currentRefreshToken The current refresh token.
 * @returns A promise resolving to the new access token or null if the refresh fails.
 */
async function fetchNewAccessToken(token: JWT) {
	console.log("🔄 Token expired, attempting to refresh...");
	try {
		const data = await getAccessTokenFromRefresh(token[refreshToken] as string);
		console.log("✅ Token refreshed successfully");
		return data.token;
	} catch (error) {
		console.log("🔒 Token refresh failed. Invalidating tokens.");
		return null;
	}
}

/**
 * Manages the token refresh process, ensuring only one refresh request is made at a time.
 * @param currentAccessToken The current access token.
 * @param currentRefreshToken The current refresh token.
 * @returns A promise resolving to the new access token or null if the refresh fails.
 */
async function refreshAccessToken(token: JWT) {
	if (!refreshTokenPromise) {
		refreshTokenPromise = fetchNewAccessToken(token).finally(() => {
			refreshTokenPromise = null;
		});
	}
	return refreshTokenPromise;
}

export const authCallbacks: Partial<CallbacksOptions> = {
	async jwt({ token, user, account }) {
		// On initial sign-in, store tokens in the JWT.
		if (account && user) {
			token[accessToken] = user.token;
			token[refreshToken] = user.refreshToken;
		}

		// If the access token has expired, attempt to refresh it.
		if (token[accessToken] && isTokenExpired(token[accessToken] as string)) {
			const newAccessToken = await refreshAccessToken(token);
			if (newAccessToken) {
				token[accessToken] = newAccessToken;
			} else {
				// Wipe the tokens gracefully if refresh completely fails
				delete token[accessToken];
				delete token[refreshToken];
				token.error = "RefreshAccessTokenError";
			}
		}

		return token;
	},

	async session({ session, token }) {
		session[accessToken] = token[accessToken] as string | undefined;
		const tok = token as unknown as Record<string, string>;
		if (tok.error) {
			(session as unknown as Record<string, string>).error = tok.error;
		}
		return session;
	}
};
