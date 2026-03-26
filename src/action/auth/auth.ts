"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getServerAuthClient } from "@/app/config";
import { type LoginForm } from "@/types";
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
	cookieStore.delete(CONFIG.COOKIE_KEY.checkoutId);
};

const revalidateCurrentUser = async ({ callbackUrl }: { callbackUrl?: string }) => {
	if (callbackUrl) {
		redirect("/hcm/search");
	}
	revalidateTag(`USER:CURRENT`);
};

const login = async ({ email, password }: LoginForm) => {
	const {
		data: { tokenCreate }
	} = await getServerAuthClient().signIn({ email, password }, { cache: "no-store" });

	return tokenCreate;
};

export { setAccessToken, setRefreshToken, clearSessionToken, login, clearAuthCookies, revalidateCurrentUser };
