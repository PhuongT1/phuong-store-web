import { invariant } from "ts-invariant";
import { CheckoutCreateDocument, type CheckoutCreateInput, CheckoutLinesAddDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { getCheckoutIdCookie, revalidateCart, setCheckoutIdCookie } from "@/action";

const addToCart = async (input: CheckoutCreateInput) => {
	let checkoutId = await getCheckoutIdCookie();

	if (!checkoutId) {
		const checkout = await executeGraphQL(CheckoutCreateDocument, {
			cache: "no-cache",
			variables: {
				input
			},
			withAuth: false
		});
		checkoutId = checkout.checkoutCreate?.checkout?.id ?? "";

		invariant(checkout, "This should never happen");

		await setCheckoutIdCookie(checkoutId);
	} else {
		await executeGraphQL(CheckoutLinesAddDocument, {
			variables: {
				id: checkoutId,
				lines: input.lines
			},
			cache: "no-cache",
			withAuth: false
		});
	}

	await revalidateCart(checkoutId);
	return checkoutId;
};

export { addToCart };
