"use server";

import { getCheckoutIdCookie, revalidateCart, setCheckoutIdCookie, removeCheckoutIdCookie } from "@/action";
import {
	CheckoutCreateDocument,
	type CheckoutCreateInput,
	CheckoutErrorCode,
	CheckoutLinesAddDocument
} from "@/gql/graphql";
import { executePublicGraphQLRequest } from "@/lib/api/publicGraphQL";

const createCheckout = async (input: CheckoutCreateInput): Promise<string> => {
	const { checkoutCreate } = await executePublicGraphQLRequest(CheckoutCreateDocument, {
		cache: "no-cache",
		variables: { input },
		shouldSendToken: false
	});

	const checkoutId = checkoutCreate?.checkout?.id;

	// If Saleor returned a checkout (even with errors), it was created — save the cookie.
	// Errors here are usually line-level warnings (INSUFFICIENT_STOCK with reduced qty) — not fatal.
	if (checkoutId) {
		await setCheckoutIdCookie(checkoutId);
		return checkoutId;
	}

	// No checkout returned → truly failed.
	const errors = checkoutCreate?.errors ?? [];
	if (errors.length > 0) {
		throw new Error(errors.map((e) => e.message).join(", "));
	}
	throw new Error("Checkout creation failed: no checkout ID returned");
};

class StaleCheckoutError extends Error {
	constructor() {
		super("Checkout is stale or no longer exists");
		this.name = "StaleCheckoutError";
	}
}

const addLinesToCheckout = async (checkoutId: string, lines: CheckoutCreateInput["lines"]): Promise<void> => {
	const { checkoutLinesAdd } = await executePublicGraphQLRequest(CheckoutLinesAddDocument, {
		variables: { id: checkoutId, lines },
		cache: "no-cache",
		shouldSendToken: false
	});

	// If Saleor returned a checkout, the line was processed (possibly with adjusted qty due to
	// stock limits). Errors alongside a returned checkout are warnings, not failures.
	if (checkoutLinesAdd?.checkout) return;

	// No checkout returned → complete failure. Detect if the checkout is stale/gone.
	const errors = checkoutLinesAdd?.errors ?? [];
	if (errors.length > 0) {
		const isStale = errors.some(
			(e) => e.code === CheckoutErrorCode.NotFound || e.code === CheckoutErrorCode.Invalid
		);
		if (isStale) throw new StaleCheckoutError();
		throw new Error(errors.map((e) => e.message).join(", "));
	}

	// checkoutLinesAdd is null entirely (unexpected null from API)
	throw new StaleCheckoutError();
};

const addToCart = async (input: CheckoutCreateInput) => {
	let checkoutId = await getCheckoutIdCookie();

	if (!checkoutId) {
		// createCheckout already includes lines in the input, so the item is added
		// during creation. Skip revalidateTag here to avoid the cookies().set() +
		// revalidateTag() combination that causes a flight-response error in Next 15.
		// The tag is brand-new so revalidateTag would be a no-op anyway.
		checkoutId = await createCheckout(input);
		return checkoutId;
	}

	try {
		await addLinesToCheckout(checkoutId, input.lines);
	} catch (error) {
		// StaleCheckoutError = GraphQL errors array flagged NOT_FOUND/INVALID.
		// "resolve to a node" = Saleor throws at transport level for a deleted checkout.
		const isStale =
			error instanceof StaleCheckoutError ||
			(error instanceof Error && error.message.includes("resolve to a node"));
		if (isStale) {
			await removeCheckoutIdCookie();
			checkoutId = await createCheckout(input);
			await revalidateCart(checkoutId);
			return checkoutId;
		}
		throw error;
	}

	await revalidateCart(checkoutId);
	return checkoutId;
};

export { addToCart };
