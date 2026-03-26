"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { CONFIG } from "@/config/config";

const revalidateCart = async (checkoutId: string) => {
	revalidateTag(`CHECKOUT:${checkoutId}`);
};

const setCheckoutIdCookie = async (id: string) => {
	(await cookies()).set(CONFIG.COOKIE_KEY.checkoutId, id, {
		maxAge: CONFIG.COOKIE_MAX_AGE.checkout,
		httpOnly: true
	});
};

const getCheckoutIdCookie = async () => {
	return (await cookies()).get(CONFIG.COOKIE_KEY.checkoutId)?.value ?? "";
};

const removeCheckoutIdCookie = async () => {
	(await cookies()).delete(CONFIG.COOKIE_KEY.checkoutId);
};

export { revalidateCart, setCheckoutIdCookie, getCheckoutIdCookie, removeCheckoutIdCookie };
