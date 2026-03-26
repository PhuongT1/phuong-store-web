import { LOCATE } from "@/constants";
import { type ProductDetailsQuery } from "@/gql/graphql";
import { type Pages } from "@/types";

type ProductItem = {
	selectedVariantID?: string;
	isProductElement?: boolean;
} & Pick<ProductDetailsQuery, "product">;
type HrefForVariant = Partial<Pages> & { variantId?: string };

const formatDate = (date: Date | number) => {
	return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
};

const formatMoney = (amount?: number, currency?: string) =>
	new Intl.NumberFormat(LOCATE, {
		style: "currency",
		currency
	}).format(amount ?? 0);

/** Format a Saleor Money object (`{ amount, currency }`) into a localised string.
 *  Returns an empty string when the money object is null or undefined. */
const formatPrice = (money: { amount: number; currency: string } | null | undefined): string =>
	money ? formatMoney(money.amount, money.currency) : "";

const formatMoneyRange = (
	range: {
		start?: { amount: number; currency: string } | null;
		stop?: { amount: number; currency: string } | null;
	} | null
) => {
	const { start, stop } = range || {};
	const startMoney = start && formatMoney(start.amount, start.currency);
	const stopMoney = stop && formatMoney(stop.amount, stop.currency);

	if (startMoney === stopMoney) {
		return startMoney;
	}

	return `${startMoney} - ${stopMoney}`;
};

const getHrefForVariant = ({ slug, variantId, channel }: HrefForVariant): string => {
	const pathname = `${channel ? `/${channel}` : ""}/products/${encodeURIComponent(slug || "")}`;

	if (!variantId) {
		return pathname;
	}

	const query = new URLSearchParams({ variant: variantId });
	return `${pathname}?${query.toString()}`;
};

const getProductPrice = ({ product, selectedVariantID, isProductElement }: ProductItem) => {
	const variants = product?.variants;
	const selectedVariant =
		variants?.find(({ id }) => id === selectedVariantID) ||
		(isProductElement && variants ? variants[0] : undefined);

	const isAvailable = variants?.some((variant) => variant.quantityAvailable) ?? false;

	const price = selectedVariant?.pricing?.price?.gross
		? formatPrice(selectedVariant.pricing.price.gross)
		: isAvailable
			? formatMoneyRange({
					start: product?.pricing?.priceRange?.start?.gross,
					stop: product?.pricing?.priceRange?.stop?.gross
				})
			: "";

	/** Original price before any discount */
	const priceUndiscounted = formatPrice(selectedVariant?.pricing?.priceUndiscounted?.gross);

	/** Discount amount (e.g. "6,80 US$") — display with a leading "-" sign */
	const discounted = formatPrice(selectedVariant?.pricing?.discount?.gross);

	const media = Number(selectedVariant?.media?.length) > 0 ? selectedVariant?.media : product?.media;

	return { ...product, priceUndiscounted, price, discounted, selectedVariant, isAvailable, media };
};

export {
	formatDate,
	formatMoney,
	formatMoneyRange,
	formatPrice,
	getHrefForVariant,
	getProductPrice,
	type ProductItem
};
