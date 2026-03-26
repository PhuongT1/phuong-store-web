import compact from "lodash-es/compact";
import { type CartLine, type CheckoutLineItem } from "./Cart.type";
import { type SummaryLineEditProps } from "./summary/SummaryLineEdit";
import { type CheckoutLineFragment, type OrderLineFragment } from "@/checkout/graphql";
import { type MightNotExist } from "@/checkout/lib/globalTypes";

export const isCheckoutLine = (line: CartLine): line is CheckoutLineItem =>
	line.__typename === "CheckoutLine";

export const getThumbnailFromLine = ({ line }: Pick<SummaryLineEditProps, "line">) => {
	const variant = line.variant;
	return variant.media?.length === 0 ? variant.product.thumbnail : variant.media?.[0];
};

// export const getSummaryLineProps = (line: CartLine) => {
// 	return isCheckoutLine(line)
// 		? {
// 				variantName: line.variant.translation?.name || line.variant.name,
// 				productName: line.variant.product.translation?.name || line.variant.product.name,
// 				productImage: getThumbnailFromLine(line)
// 			}
// 		: {
// 				variantName: line.variantName,
// 				productName: line.productName,
// 				productImage: line.thumbnail
// 			};
// };

export const useSummaryLineLineAttributesText = (line: CheckoutLineFragment | OrderLineFragment): string => {
	const parsedValues =
		line.variant?.attributes?.reduce<Array<MightNotExist<string>>>(
			(result, { values }) => [
				...result,
				...values.map(({ name, dateTime, translation }) => {
					if (translation?.name) {
						return translation.name;
					}

					if (dateTime) {
						return new Intl.DateTimeFormat("EN-US", { dateStyle: "medium" }).format(new Date(dateTime));
					}

					return name;
				})
			],
			[]
		) || [];

	return compact(parsedValues).join(", ");
};
