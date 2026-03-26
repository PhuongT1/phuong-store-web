"use client";

import { SaleorAuthProvider, useAuthChange } from "@saleor/auth-sdk/react";
import { invariant } from "ts-invariant";
import { createSaleorAuthClient } from "@saleor/auth-sdk";
import { useState, type ReactNode } from "react";
import {
	type Client,
	Provider as UrqlProvider,
	cacheExchange,
	createClient,
	debugExchange,
	fetchExchange
} from "urql";

const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
invariant(saleorApiUrl, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

const saleorAuthClient = createSaleorAuthClient({
	saleorApiUrl
});

const makeUrqlClient = () => {
	return createClient({
		url: saleorApiUrl,
		suspense: true,
		// requestPolicy: "cache-first",
		fetch: (input, init) => saleorAuthClient.fetchWithAuth(input as Parameters<typeof fetch>[0], init),
		exchanges: [debugExchange, cacheExchange, fetchExchange]
	});
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
	invariant(saleorApiUrl, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	const [urqlClient, setUrqlClient] = useState<Client>(() => makeUrqlClient());
	useAuthChange({
		saleorApiUrl,
		onSignedOut: () => {
			setUrqlClient(makeUrqlClient());
		},
		onSignedIn: () => {
			setUrqlClient(makeUrqlClient());
		}
	});

	return (
		<SaleorAuthProvider client={saleorAuthClient}>
			<UrqlProvider value={urqlClient}>{children}</UrqlProvider>
		</SaleorAuthProvider>
	);
};

export { saleorAuthClient, AuthProvider };
