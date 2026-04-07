"use server";

import { revalidatePath } from "next/cache";
import { DEFAULT_CHANNEL_SLUG } from "@/constants";
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

	revalidatePath(`${DEFAULT_CHANNEL_SLUG}/cart`);
};
