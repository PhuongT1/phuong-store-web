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
	onDeleted?: () => void;
}

export function CheckoutItems({ checkout, checkoutId, onDeleted }: ICheckoutItems) {
	return (
		<div className="border-border/60 bg-card flex-1 overflow-hidden rounded-2xl border shadow-sm backdrop-blur-sm">
			<ul data-testid="CartProductList" role="list" className="divide-border/40 divide-y">
				{checkout.lines.map(({ variant, id, unitPrice, quantity, undiscountedUnitPrice }) => (
					<li
						key={id}
						className="group hover:bg-muted/40 relative flex gap-5 p-5 transition-colors duration-150 lg:gap-6 lg:p-6"
					>
						{/* Product image */}
						<div className="border-border/50 bg-product-image-bg relative shrink-0 overflow-hidden rounded-xl border shadow-sm">
							<div className="h-24 w-24 sm:h-28 sm:w-28">
								{variant?.product?.thumbnail?.url && (
									<ImageItem src={variant.product.thumbnail.url} alt={variant.product.thumbnail.alt ?? ""} />
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
										<h2 className="text-foreground hover:text-primary line-clamp-2 text-sm leading-snug font-semibold transition-colors lg:text-base">
											{variant?.product?.name}
										</h2>
									</LinkWithChannel>
									{variant.name !== variant.id && Boolean(variant.name) && (
										<p className="text-muted-foreground text-xs">{variant.name}</p>
									)}
								</div>
								<DeleteLineButton checkoutId={checkoutId} lineId={id} onDeleted={onDeleted} />
							</div>

							<div className="flex items-end justify-between">
								{/* Quantity badge */}
								<span className="border-border/60 bg-muted/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium">
									SL: <span className="text-foreground font-bold">{quantity}</span>
								</span>

								{/* Price */}
								<div className="text-right">
									<p className="text-price text-lg leading-none font-black">
										{formatMoney(unitPrice.gross.amount, unitPrice.gross.currency)}
									</p>
									<UndiscountedElement
										onSale={undiscountedUnitPrice.amount > unitPrice.gross.amount}
										priceUndiscounted={formatMoney(
											undiscountedUnitPrice.amount,
											undiscountedUnitPrice.currency
										)}
									/>
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
