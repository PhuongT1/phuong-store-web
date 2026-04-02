import { type Maybe, type Money } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { getFormattedMoney } from "./Money.utils";

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type MoneyData = MakeOptional<Money, "fractionDigits" | "fractionalAmount">;
type MoneyDisplayProps = {
	money?: Maybe<Money>;
	negative?: boolean;
} & React.ComponentProps<"p">;

const MoneyDisplay = ({ money, className, negative, ...textProps }: MoneyDisplayProps) => {
	const formattedMoney = getFormattedMoney(money, negative);

	if (!money) {
		return null;
	}

	return (
		<p {...textProps} className={cn("text-destructive", className)}>
			{formattedMoney}
		</p>
	);
};

export { MoneyDisplay, type MoneyData, type MoneyDisplayProps };
