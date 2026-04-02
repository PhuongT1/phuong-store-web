import { type Checkout } from "@/gql/graphql";
import { formatMoney } from "@/lib/utils";
import { ButtonLink } from "./ButtonLink";

interface ICheckoutSubmit {
	checkout: Checkout;
	checkoutId: string;
}

export function CheckoutSubmit({ checkoutId, checkout }: ICheckoutSubmit) {
	const { totalPrice, subtotalPrice, shippingPrice } = checkout;

	return (
		<div className="fixed right-0 bottom-0 left-0 z-10 md:sticky md:top-[var(--header-height)] md:h-fit md:min-w-80">
			<div className="rounded-t-2xl border border-border/60 bg-card/80 p-5 shadow-xl backdrop-blur-md md:rounded-2xl md:shadow-sm">
				<h3 className="mb-4 text-sm font-semibold tracking-wide text-foreground uppercase">Tóm tắt đơn hàng</h3>

				<div className="space-y-2.5 text-sm">
					<div className="flex justify-between text-muted-foreground">
						<span>Tạm tính</span>
						<span className="font-medium text-foreground">
							{formatMoney(subtotalPrice.gross.amount, subtotalPrice.gross.currency)}
						</span>
					</div>
					<div className="flex justify-between text-muted-foreground">
						<span>Phí vận chuyển</span>
						<span className="font-medium text-foreground">
							{shippingPrice.gross.amount > 0
								? formatMoney(shippingPrice.gross.amount, shippingPrice.gross.currency)
								: "Tính sau"}
						</span>
					</div>
				</div>

				<div className="my-4 h-px bg-border/60" />

				<div className="mb-5 flex items-baseline justify-between">
					<span className="text-sm font-semibold text-foreground">Tổng cộng</span>
					<span className="text-xl font-bold text-price">
						{formatMoney(totalPrice.gross.amount, totalPrice.gross.currency)}
					</span>
				</div>

				<ButtonLink isKeepHref checkoutId={checkoutId} disabled={!checkout.lines.length} className="w-full" />

				<p className="mt-3 text-center text-xs text-muted-foreground">
					Phí vận chuyển chính xác sẽ hiển thị ở bước tiếp theo
				</p>
			</div>
		</div>
	);
}
