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
		<div className="fixed right-0 bottom-0 left-0 z-10 md:sticky md:top-[calc(var(--header-height)+1.5rem)] md:h-fit md:w-80 lg:w-96">
			<div className="rounded-t-2xl border border-border/60 bg-card/95 p-6 shadow-2xl backdrop-blur-md md:rounded-2xl md:shadow-md">
				<h3 className="mb-5 text-xs font-black tracking-widest text-foreground uppercase">
					Tóm tắt đơn hàng
				</h3>

				<div className="space-y-3 text-sm">
					<div className="flex justify-between">
						<span className="text-muted-foreground">Tạm tính</span>
						<span className="font-semibold text-foreground">
							{formatMoney(subtotalPrice.gross.amount, subtotalPrice.gross.currency)}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Phí vận chuyển</span>
						<span className="font-semibold">
							{shippingPrice.gross.amount > 0 ? (
								<span className="text-foreground">
									{formatMoney(shippingPrice.gross.amount, shippingPrice.gross.currency)}
								</span>
							) : (
								<span className="text-muted-foreground italic">Tính sau</span>
							)}
						</span>
					</div>
				</div>

				<div className="my-5 h-px bg-border/50" />

				<div className="mb-6 flex items-center justify-between">
					<span className="text-xs font-black tracking-widest text-foreground uppercase">Tổng cộng</span>
					<span className="text-2xl font-black text-price">
						{formatMoney(totalPrice.gross.amount, totalPrice.gross.currency)}
					</span>
				</div>

				<ButtonLink isKeepHref checkoutId={checkoutId} disabled={!checkout.lines.length} className="w-full" />

				<p className="mt-4 text-center text-xs text-muted-foreground/70">
					Phí vận chuyển chính xác sẽ hiển thị ở bước tiếp theo
				</p>
			</div>
		</div>
	);
}
