"use server";

import { getCheckoutIdCookie, revalidateCart, setCheckoutIdCookie, removeCheckoutIdCookie } from "@/action";
import {
	CheckoutCreateDocument,
	type CheckoutCreateInput,
	CheckoutErrorCode,
	CheckoutFindDocument,
	CheckoutLinesAddDocument,
	CountryCode
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

	// No checkout returned → failure.
	const errors = checkoutLinesAdd?.errors ?? [];
	if (errors.length > 0) {
		const isStale = errors.some(
			(e) => e.code === CheckoutErrorCode.NotFound || e.code === CheckoutErrorCode.Invalid
		);
		if (isStale) throw new StaleCheckoutError();
		throw new Error(errors.map((e) => e.message).join(", "));
	}

	// checkoutLinesAdd is null entirely — ambiguous (Saleor internal error, proxy issue, etc.).
	// Do NOT treat this as StaleCheckoutError: that would wipe the cart incorrectly.
	// Throw a regular error so the caller shows a toast and the user can retry.
	throw new Error("Không thể thêm sản phẩm — vui lòng thử lại");
};

const addToCart = async (input: CheckoutCreateInput) => {
	// Always inject country VN so Saleor can compute shippingMethods immediately
	// without waiting for the user to fill in the address on the checkout page.
	// validationRules.shippingAddress.checkRequiredFields = false is required because
	// we only pass country (partial address). Without it, Saleor rejects the address
	// and shippingMethods stay empty — defeating the purpose. Country code itself is
	// always validated regardless of validationRules (per Saleor docs).
	const inputWithCountry: CheckoutCreateInput = {
		...input,
		shippingAddress: { country: CountryCode.Vn, ...input.shippingAddress },
		validationRules: {
			shippingAddress: { checkRequiredFields: false, checkFieldsFormat: false }
		}
	};
	let checkoutId = await getCheckoutIdCookie();

	if (!checkoutId) {
		// createCheckout already includes lines in the input, so the item is added
		// during creation. Skip revalidateTag here to avoid the cookies().set() +
		// revalidateTag() combination that causes a flight-response error in Next 15.
		// The tag is brand-new so revalidateTag would be a no-op anyway.
		checkoutId = await createCheckout(inputWithCountry);
		return checkoutId;
	}

	try {
		await addLinesToCheckout(checkoutId, inputWithCountry.lines);
	} catch (error) {
		// StaleCheckoutError = GraphQL errors array flagged NOT_FOUND/INVALID.
		// "resolve to a node" = Saleor throws at transport level for a deleted checkout.
		const isStale =
			error instanceof StaleCheckoutError ||
			(error instanceof Error && error.message.includes("resolve to a node"));
		if (isStale) {
			// 🛡️ Safety check: verify the checkout is ACTUALLY gone before wiping the cart.
			// Saleor (or a proxy/CDN) can occasionally return NOT_FOUND transiently for a
			// checkout that is still alive — a false positive. Wiping the cart in that case
			// deletes the user's items unnecessarily. We verify with a direct CheckoutFind
			// before committing to the wipe; if the checkout still exists, preserve it and
			// surface a retryable error instead.
			let checkoutGone = true;
			try {
				const verifyData = await executePublicGraphQLRequest(CheckoutFindDocument, {
					variables: { id: checkoutId },
					cache: "no-cache",
					shouldSendToken: false
				});
				checkoutGone = !verifyData?.checkout;
			} catch {
				// If the verify call itself fails (network error), err on the side of caution:
				// do NOT wipe the cart — we cannot confirm the checkout is gone.
				checkoutGone = false;
			}
			if (!checkoutGone) {
				// False positive: checkout exists. Preserve cart, surface retryable error.
				throw new Error("Không thể thêm sản phẩm — vui lòng thử lại");
			}
			await removeCheckoutIdCookie();
			checkoutId = await createCheckout(inputWithCountry);
			await revalidateCart(checkoutId);
			return checkoutId;
		}
		throw error;
	}

	await revalidateCart(checkoutId);
	return checkoutId;
};

export { addToCart };
