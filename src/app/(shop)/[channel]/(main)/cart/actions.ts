"use server";

import { revalidateTag } from "next/cache";
import { CheckoutDeleteLinesDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";

type deleteLineFromCheckoutArgs = {
	lineId: string;
	checkoutId: string;
};

export const deleteLineFromCheckout = async ({ lineId, checkoutId }: deleteLineFromCheckoutArgs) => {
	await executeGraphQL(CheckoutDeleteLinesDocument, {
		variables: {
			checkoutId,
			lineIds: [lineId]
		},
		cache: "no-cache"
	});

	// Invalidate the server-cache tag so CartNavItem (which uses Next.js fetch cache)
	// reflects the updated line count. The cart page itself is fully client-rendered,
	// so no revalidatePath is needed — the caller calls SWR mutate() to refresh UI.
	revalidateTag(`CHECKOUT:${checkoutId}`);
};
