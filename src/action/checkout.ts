"use server";

import { CheckoutCreateDocument, type CheckoutCreateInput, CheckoutFindDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
// import { LANGUAGE_CODE_DEFAULT } from "@/constants";

const find = async (checkoutId: string) => {
	try {
		const { checkout } = checkoutId
			? await executeGraphQL(CheckoutFindDocument, {
					variables: {
						id: checkoutId
						// languageCode: LANGUAGE_CODE_DEFAULT
					},
					cache: "no-cache",
					next: {
						tags: [`CHECKOUT:${checkoutId}`]
					}
				})
			: { checkout: null };

		return checkout;
	} catch {
		// we ignore invalid ID or checkout not found
	}
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
