"use server";

import { revalidatePath } from "next/cache";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { CheckoutDeleteLinesDocument } from "@/gql/graphql";

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

	revalidatePath("/cart");
};
