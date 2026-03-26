"use server";

import { cookies } from "next/headers";
import { type Locale, defaultLocale } from "@/i18n/config";

const COOKIE_NAME = "NEXT_LOCALE";

const getUserLocale = async () => {
	return (await cookies()).get(COOKIE_NAME)?.value || defaultLocale;
};

const setUserLocale = async (locale: Locale) => {
	(await cookies()).set(COOKIE_NAME, locale);
};

export { getUserLocale, setUserLocale };
