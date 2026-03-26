// import { type MightNotExist } from "@/checkout/lib/globalTypes";
// import { LOCATE } from "@/constants";
// import { type Money } from "@/gql/graphql";

// export const getFormattedMoney = <TMoney extends Money>(money: MightNotExist<TMoney>, negative = false) => {
// 	if (!money) {
// 		return "";
// 	}

// 	const { amount, currency } = money;

// 	return new Intl.NumberFormat(LOCATE, {
// 		style: "currency",
// 		currency,
// 		currencyDisplay: "symbol"
// 	}).format(negative ? -amount : amount);
// };
