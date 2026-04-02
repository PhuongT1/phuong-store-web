"use server";

import { CheckoutCreateDocument, type CheckoutCreateInput, CheckoutFindDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
// import { LANGUAGE_CODE_DEFAULT } from "@/constants";

const find = async (checkoutId: string) => {
	if (!checkoutId) return null;
	// Returns null  → Saleor confirmed the checkout does not exist (safe to clear cookie)
	// Returns object → checkout is live
	// Throws         → network / GraphQL error; caller must NOT clear the cookie
	//
	// withAuth: true (default) — Checkout.find MUST send the user's token.
	// Saleor's `checkout` query is owner-protected: if the checkout belongs to a
	// logged-in user, calling without that user's JWT returns a permissions error
	// ("MANAGE_USERS, HANDLE_PAYMENTS, HANDLE_TAXES, OWNER").
	// For guest checkouts the token is ignored — no downside to sending it.
	const data = await executeGraphQL(CheckoutFindDocument, {
		variables: {
			id: checkoutId
			// languageCode: LANGUAGE_CODE_DEFAULT
		},
		cache: "no-cache",
		next: {
			tags: [`CHECKOUT:${checkoutId}`]
		}
	});
	// data can be null when serverFetchWithAuth suppresses an auth error
	// (expired token that failed to refresh). Treat as a transient error —
	// return null only when Saleor explicitly confirms checkout is gone.
	if (!data) throw new Error("Checkout fetch returned no data (auth or network error)");
	return data.checkout ?? null;
};

const create = async (input: CheckoutCreateInput) => {
	const checkout = await executeGraphQL(CheckoutCreateDocument, {
		cache: "no-cache",
		variables: { input },
		withAuth: false
	});
	return checkout.checkoutCreate?.checkout;
};

export { find, create };
