import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardBox } from "@components/ui";
import { ButtonLink } from "./ButtonLink";
import { type Checkout } from "@/gql/graphql";
import { formatMoney } from "@/lib/utils";

interface ICheckoutSubmit {
	checkout: Checkout;
	checkoutId: string;
}

export function CheckoutSubmit({ checkoutId, checkout }: ICheckoutSubmit) {
	return (
		<CardBox className="fixed right-0 bottom-0 left-0 z-10 mx-0 h-auto min-w-96 border border-gray-200 p-0 shadow-sm md:sticky md:top-32 md:h-full">
			<CardHeader className="p-4">
				<CardTitle>Tổng tiền</CardTitle>
				<CardDescription>Chi phí vận chuyển sẽ được tính trong bước tiếp theo.</CardDescription>
			</CardHeader>
			<CardContent className="px-4 pb-4">
				<div className="text-price text-xl font-semibold">
					{formatMoney(checkout.totalPrice.gross.amount, checkout.totalPrice.gross.currency)}
				</div>
			</CardContent>
			<CardFooter className="px-4 pb-4">
				<ButtonLink isKeepHref checkoutId={checkoutId} disabled={!checkout.lines.length} className="w-full" />
			</CardFooter>
		</CardBox>
	);
}
