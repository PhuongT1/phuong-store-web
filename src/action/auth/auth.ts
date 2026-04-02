"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CONFIG } from "@/constants";

const setAccessToken = async (value: string) =>
	(await cookies()).set(CONFIG.COOKIE_KEY.accessToken, value, {
		httpOnly: true
	});

const setRefreshToken = async (value: string) =>
	(await cookies()).set(CONFIG.COOKIE_KEY.refreshToken, value, {
		httpOnly: true
	});

const clearSessionToken = async () => {
	(await cookies()).delete("next-auth.session-token");
	void clearAuthCookies();
};

const clearAuthCookies = async () => {
	const cookieStore = await cookies();

	// cookieStore.delete(CONFIG.COOKIE_KEY.accessToken);
	// cookieStore.delete(CONFIG.COOKIE_KEY.refreshToken);
	// Note: checkoutId is intentionally NOT cleared on sign-out.
	// The cart/checkout belongs to the shopping session, not the auth session.
	// It is only cleared after a successful order (useCheckoutComplete) or
	// when Saleor returns NOT_FOUND/INVALID for a stale checkout (cart.service).
	void cookieStore; // prevent unused variable lint error
};

const revalidateCurrentUser = async ({ callbackUrl }: { callbackUrl?: string }) => {
	revalidateTag(`USER:CURRENT`);
	if (callbackUrl) {
		redirect(callbackUrl);
	}
};

const TOKEN_CREATE_MUTATION = `
	mutation TokenCreate($email: String!, $password: String!) {
		tokenCreate(email: $email, password: $password) {
			token
			refreshToken
			csrfToken
			errors {
				field
				message
				code
			}
		}
	}
`;

const login = async ({ email, password }: { email: string; password: string }) => {
	try {
		const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
		if (!saleorApiUrl) throw new Error("Missing NEXT_PUBLIC_SALEOR_API_URL");

		const res = await fetch(saleorApiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			cache: "no-store",
			body: JSON.stringify({
				query: TOKEN_CREATE_MUTATION,
				variables: { email, password }
			})
		});

		const json = (await res.json()) as { data?: { tokenCreate?: unknown } };
		return (json.data?.tokenCreate ?? null) as {
			token: string | null;
			refreshToken: string | null;
			csrfToken: string | null;
			errors: { field: string | null; message: string }[];
		} | null;
	} catch (error) {
		console.error("Saleor login error:", error);
		return {
			token: null,
			refreshToken: null,
			csrfToken: null,
			errors: [{ field: "email", message: "Đăng nhập thất bại. Vui lòng thử lại." }]
		};
	}
};

export { setAccessToken, setRefreshToken, clearSessionToken, login, clearAuthCookies, revalidateCurrentUser };
