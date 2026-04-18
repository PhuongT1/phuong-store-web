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
	// Clear checkoutId on sign-out because the cart belongs to the authenticated user.
	// Leaving it causes permission errors for the next anonymous session or another user.
	cookieStore.delete(CONFIG.COOKIE_KEY.checkoutId);
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

const ATTACH_CHECKOUT_MUTATION = `
	mutation CheckoutCustomerAttach($checkoutId: ID!) {
		checkoutCustomerAttach(id: $checkoutId) {
			checkout { id }
			errors { code message }
		}
	}
`;

const FETCH_USER_CHECKOUT = `
	query FetchUserCheckout {
		me {
			checkouts(first: 1) {
				edges { node { id } }
			}
		}
	}
`;

const syncCheckoutWithUser = async (token: string) => {
	try {
		const cookieStore = await cookies();
		let currentCheckoutId = cookieStore.get(CONFIG.COOKIE_KEY.checkoutId)?.value;
		const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
		if (!saleorApiUrl) return;

		// 1. If anonymous checkout exists, attach it to this user
		if (currentCheckoutId) {
			const attachRes = await fetch(saleorApiUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				cache: "no-store",
				body: JSON.stringify({ query: ATTACH_CHECKOUT_MUTATION, variables: { checkoutId: currentCheckoutId } })
			});
			const attachJson = (await attachRes.json()) as any;
			const errors = attachJson?.data?.checkoutCustomerAttach?.errors;
			
			// If attachment fails (maybe it belongs to someone else?), fallback to fetching their own cart
			if (errors && errors.length > 0) {
				currentCheckoutId = undefined;
			} else {
				return; // Successfully attached anonymous cart to user
			}
		}

		// 2. Otherwise fetch the user's existing cart from the server
		if (!currentCheckoutId) {
			const fetchRes = await fetch(saleorApiUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				cache: "no-store",
				body: JSON.stringify({ query: FETCH_USER_CHECKOUT })
			});
			const fetchJson = (await fetchRes.json()) as any;
			const edges = fetchJson?.data?.me?.checkouts?.edges;

			if (edges && edges.length > 0) {
				const userCheckoutId = edges[0].node.id;
				cookieStore.set(CONFIG.COOKIE_KEY.checkoutId, userCheckoutId, {
					maxAge: CONFIG.COOKIE_MAX_AGE.checkout,
					httpOnly: true,
					path: "/"
				});
			} else {
				cookieStore.delete(CONFIG.COOKIE_KEY.checkoutId);
			}
		}
	} catch (error) {
		console.error("Failed to sync checkout:", error);
	}
};

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

export { setAccessToken, setRefreshToken, clearSessionToken, login, clearAuthCookies, revalidateCurrentUser, syncCheckoutWithUser };
