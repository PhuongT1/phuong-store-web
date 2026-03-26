import { createSaleorAuthClient } from "@saleor/auth-sdk";
import { getNextServerCookiesStorage } from "@saleor/auth-sdk/next/server";
import { invariant } from "ts-invariant";

const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
invariant(saleorApiUrl, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

export const getServerAuthClient = () => {
	const nextServerCookiesStorage = getNextServerCookiesStorage();
	return createSaleorAuthClient({
		saleorApiUrl
		// refreshTokenStorage: nextServerCookiesStorage,
		// accessTokenStorage: nextServerCookiesStorage
	});
};
