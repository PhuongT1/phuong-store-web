"use client";

import { getCheckoutIdCookie, revalidateCart, setCheckoutIdCookie, removeCheckoutIdCookie } from "@/action";
import {
	CheckoutCreateDocument,
	type CheckoutCreateInput,
	CheckoutErrorCode,
	type CheckoutErrorFragment,
	CheckoutLinesAddDocument,
	CountryCode
} from "@/gql/graphql";
import { clientFetchGraphQL } from "@/lib/api/clientGraphQLWithRetry";
import { notify } from "@components/ui";

class CartError extends Error {
	constructor(
		public code: string,
		public apiMessage: string | null | undefined,
		public isStale = false
	) {
		super(apiMessage ?? code);
		this.name = "CartError";
	}
}

const showCartError = (error: unknown) => {
	if (error instanceof CartError) {
		notify.error(error.code, { description: error.apiMessage });
	} else if (error instanceof Error) {
		notify.error(error.message);
	} else {
		notify.error("An unexpected error occurred");
	}
};

const createCheckout = async (input: CheckoutCreateInput): Promise<string> => {
	const { checkoutCreate } = await clientFetchGraphQL(CheckoutCreateDocument, {
		cache: "no-cache",
		variables: { input }
	});
	const checkoutId = checkoutCreate?.checkout?.id;
	if (checkoutId) {
		await setCheckoutIdCookie(checkoutId);
		return checkoutId;
	}
	const errors = checkoutCreate?.errors ?? [];
	const first = errors[0];
	throw new CartError(first?.code ?? "CHECKOUT_CREATE_FAILED", first?.message);
};

const addLinesToCheckout = async (
	checkoutId: string,
	lines: CheckoutCreateInput["lines"]
): Promise<CheckoutErrorFragment[]> => {
	const { checkoutLinesAdd } = await clientFetchGraphQL(CheckoutLinesAddDocument, {
		variables: { id: checkoutId, lines },
		cache: "no-cache"
	});

	const errors = checkoutLinesAdd?.errors ?? [];

	if (checkoutLinesAdd?.checkout) {
		return errors;
	}

	if (errors.length > 0) {
		const staleError = errors.find(
			(e) => e.code === CheckoutErrorCode.NotFound || e.code === CheckoutErrorCode.Invalid
		);
		if (staleError) {
			throw new CartError(String(staleError.code), staleError.message, true);
		}
		throw new CartError(
			errors
				.map((e) => e.code)
				.filter(Boolean)
				.join(", "),
			errors
				.map((e) => e.message)
				.filter(Boolean)
				.join("\n")
		);
	}

	throw new CartError("SERVER_ERROR", "No data returned from server");
};

const addToCart = async (
	input: CheckoutCreateInput
): Promise<{ checkoutId: string; warnings: CheckoutErrorFragment[] }> => {
	const inputWithCountry: CheckoutCreateInput = {
		...input,
		shippingAddress: { country: CountryCode.Vn, ...input.shippingAddress },
		validationRules: {
			shippingAddress: { checkRequiredFields: false, checkFieldsFormat: false }
		}
	};
	let checkoutId = await getCheckoutIdCookie();

	if (!checkoutId) {
		checkoutId = await createCheckout(inputWithCountry);
		return { checkoutId, warnings: [] };
	}

	let warnings: CheckoutErrorFragment[] = [];
	try {
		warnings = await addLinesToCheckout(checkoutId, inputWithCountry.lines);
	} catch (error) {
		const isStale =
			(error instanceof CartError && error.isStale) ||
			(error instanceof Error && error.message.includes("resolve to a node"));
		if (isStale) {
			// Remove the stale checkout cookie so the user can add to cart again
			await removeCheckoutIdCookie();
			checkoutId = await createCheckout(inputWithCountry);
			await revalidateCart(checkoutId);
			return { checkoutId, warnings: [] };
		}
		throw error;
	}

	await revalidateCart(checkoutId);
	return { checkoutId, warnings };
};

export { addToCart, CartError, showCartError };
