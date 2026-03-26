import { LOCATE } from "@/constants";
import { type Maybe, type Money } from "@/gql/graphql";

const CURRENCY_LOCALE_MAP: Record<string, string> = {
	USD: "en-US",
	EUR: "de-DE",
	GBP: "en-GB",
	JPY: "ja-JP"
};

const getLocaleForCurrency = (currency: string): string => CURRENCY_LOCALE_MAP[currency] ?? LOCATE;

const getFormattedMoney = <TMoney extends Maybe<Money>>(money?: TMoney, negative = false) => {
	if (!money) {
		return "";
	}

	const { amount, currency } = money;

	return new Intl.NumberFormat(getLocaleForCurrency(currency), {
		style: "currency",
		currency,
		currencyDisplay: "symbol"
	}).format(negative ? -amount : amount);
};

export { getFormattedMoney };
