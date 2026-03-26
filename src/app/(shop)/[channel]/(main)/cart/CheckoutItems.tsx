"use client";
import { CardBox, ImageItem } from "@components/ui";
import { UndiscountedElement } from "@components/product";
import { DeleteLineButton } from "./DeleteLineButton";
import { formatMoney, getHrefForVariant } from "@/lib/utils";
import { LinkWithChannel } from "@/components/navigation/LinkWithChannel";
import { type Checkout } from "@/gql/graphql";

interface ICheckoutItems {
	checkout: Checkout;
	checkoutId: string;
}

export function CheckoutItems({ checkout, checkoutId }: ICheckoutItems) {
	console.log("phuong checkout", checkout);

	return (
		<CardBox className="mx-0 flex-1 overflow-hidden border border-gray-200 p-0 shadow-sm">
			<ul data-testid="CartProductList" role="list" className="divide-y divide-neutral-200">
				{checkout.lines.map(({ variant, id, totalPrice, quantity, undiscountedTotalPrice }) => (
					<li key={id} className="flex gap-4 p-4 transition-colors hover:bg-gray-50/50 lg:p-6">
						<div className="aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white sm:h-[88px] sm:w-[88px]">
							{variant?.product?.thumbnail?.url && (
								<ImageItem src={variant.product.thumbnail.url} alt={variant.product.thumbnail.alt ?? ""} />
							)}
						</div>

						<div className="relative flex flex-1 flex-col justify-between">
							<div className="flex flex-col justify-between justify-items-start gap-1 md:flex-row md:gap-4">
								<div className="flex flex-1 flex-col gap-1">
									<LinkWithChannel
										href={getHrefForVariant({
											slug: variant.product.slug,
											variantId: variant.id
										})}
									>
										<h2 className="font-medium text-neutral-700">{variant?.product?.name}</h2>
									</LinkWithChannel>
									{variant.name !== variant.id && Boolean(variant.name) && (
										<p className="text-sm text-neutral-500">{variant.name}</p>
									)}
								</div>

								<div className="flex flex-row items-center justify-between gap-2 md:items-start md:gap-4">
									<div className="flex flex-col justify-between">
										<p className="text-price flex items-center gap-1 text-right font-semibold md:flex-col md:items-end md:gap-0">
											{formatMoney(totalPrice.gross.amount, totalPrice.gross.currency)}
											{variant.pricing?.onSale && (
												<UndiscountedElement
													priceUndiscounted={formatMoney(
														undiscountedTotalPrice.amount,
														undiscountedTotalPrice.currency
													)}
												/>
											)}
										</p>
										<div className="md:text-right">
											<div className="text-sm font-bold">Số lượng: {quantity}</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="align-self-start">
							<DeleteLineButton checkoutId={checkoutId} lineId={id} />
						</div>
					</li>
				))}
			</ul>
		</CardBox>
	);
}
