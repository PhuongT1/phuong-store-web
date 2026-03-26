// import { getFormattedMoney } from "@/checkout/lib/utils/money";

// import { type AriaLabel, type Classes } from "@/checkout/lib/globalTypes";
// import { cn } from "@/lib/utils";
// import { type Maybe, type Money as MoneyType } from "@/gql/graphql";
// export interface MoneyProps<TMoney extends MoneyType = MoneyType> extends Classes, AriaLabel {
// 	money?: Maybe<MoneyType>;
// 	negative?: boolean;
// }

// export const Money = <TMoney extends MoneyType>({
// 	money,
// 	className,
// 	ariaLabel,
// 	negative,
// 	...textProps
// }: MoneyProps<TMoney>) => {
// 	const formattedMoney = getFormattedMoney(money, negative);

// 	if (!money) {
// 		return null;
// 	}

// 	return (
// 		<p {...textProps} aria-label={ariaLabel} className={cn("text-destructive", className)}>
// 			{formattedMoney}
// 		</p>
// 	);
// };
