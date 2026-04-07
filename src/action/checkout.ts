"use server";

import { CheckoutCreateDocument, type CheckoutCreateInput, CheckoutFindDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
// import { LANGUAGE_CODE_DEFAULT } from "@/constants";

const find = async (checkoutId: string) => {
	if (!checkoutId) return null;
	// Returns null  → Saleor confirmed the checkout does not exist (safe to clear cookie).
	//                  Only reachable if auth was valid (token present or guest).
	// Returns object → checkout is live.
	// Throws         → network / GraphQL error, auth recovery failed, or unknown state.
	//                  Caller must NOT clear the cookie.
	//
	// withAuth: true (default) — serverFetchWithAuth will:
	//   a) Use the session access token (already refreshed by JWT callback), OR
	//   b) Recover inline via refreshToken if the JWT callback's refresh was transient, OR
	//   c) Throw (returned as error) so the cookie is preserved for the next request.
	//
	// This contract guarantees that `null` only comes back when Saleor has genuine
	// confirmation the checkout is gone — never due to an auth race condition.
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
	// data is null when serverFetchWithAuth could not recover auth (all retries
	// exhausted). Throw so caller treats this as unknown state, not "deleted".
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
