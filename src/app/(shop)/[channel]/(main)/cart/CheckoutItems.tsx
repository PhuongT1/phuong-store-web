"use client";
import { LinkWithChannel } from "@/components/navigation/LinkWithChannel";
import { type Checkout } from "@/gql/graphql";
import { formatMoney, getHrefForVariant } from "@/lib/utils";
import { UndiscountedElement } from "@components/product";
import { ImageItem } from "@components/ui";
import { DeleteLineButton } from "./DeleteLineButton";

interface ICheckoutItems {
	checkout: Checkout;
	checkoutId: string;
}

export function CheckoutItems({ checkout, checkoutId }: ICheckoutItems) {
	return (
		<div className="flex-1 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm backdrop-blur-sm">
			<ul data-testid="CartProductList" role="list" className="divide-y divide-border/40">
				{checkout.lines.map(({ variant, id, totalPrice, quantity, undiscountedTotalPrice }) => (
					<li
						key={id}
						className="group relative flex gap-5 p-5 transition-colors duration-150 hover:bg-muted/40 lg:gap-6 lg:p-6"
					>
						{/* Product image */}
						<div className="relative shrink-0 overflow-hidden rounded-xl border border-border/50 bg-product-image-bg shadow-sm">
							<div className="h-24 w-24 sm:h-28 sm:w-28">
								{variant?.product?.thumbnail?.url && (
									<ImageItem
										src={variant.product.thumbnail.url}
										alt={variant.product.thumbnail.alt ?? ""}
									/>
								)}
							</div>
						</div>

						{/* Details */}
						<div className="flex flex-1 flex-col justify-between gap-3">
							<div className="flex items-start justify-between gap-2">
								<div className="flex flex-col gap-1">
									<LinkWithChannel
										href={getHrefForVariant({ slug: variant.product.slug, variantId: variant.id })}
									>
										<h2 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors hover:text-primary leading-snug lg:text-base">
											{variant?.product?.name}
										</h2>
									</LinkWithChannel>
									{variant.name !== variant.id && Boolean(variant.name) && (
										<p className="text-xs text-muted-foreground">{variant.name}</p>
									)}
								</div>
								<DeleteLineButton checkoutId={checkoutId} lineId={id} />
							</div>

							<div className="flex items-end justify-between">
								{/* Quantity badge */}
								<span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
									SL: <span className="font-bold text-foreground">{quantity}</span>
								</span>

								{/* Price */}
								<div className="text-right">
									<p className="text-lg font-black text-price leading-none">
										{formatMoney(totalPrice.gross.amount, totalPrice.gross.currency)}
									</p>
									{variant.pricing?.onSale && (
										<UndiscountedElement
											priceUndiscounted={formatMoney(
												undiscountedTotalPrice.amount,
												undiscountedTotalPrice.currency
											)}
										/>
									)}
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
