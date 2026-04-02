"use client";

import { Minus, Plus, X } from "lucide-react";
import { type Checkout } from "@/gql/graphql";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import { Button } from "@components/ui";

type CheckoutOrderSummaryProps = {
	checkout?: Partial<Checkout>;
	onUpdateQuantity?: (lineId: string, quantity: number) => void;
	onRemoveLine?: (lineId: string) => void;
};

const CheckoutOrderSummary = ({ checkout, onUpdateQuantity, onRemoveLine }: CheckoutOrderSummaryProps) => {
	const lines = checkout?.lines || [];
	const subtotal = checkout?.subtotalPrice?.gross?.amount || 0;
	const shipping = checkout?.shippingPrice?.gross?.amount || 0;
	const total = checkout?.totalPrice?.gross?.amount || 0;
	const currency = checkout?.totalPrice?.gross?.currency || "USD";

	const formatPrice = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency
		}).format(amount);
	};

	return (
		<div className="sticky top-4 space-y-6">
			{/* Order Summary Header */}
			<div className="rounded-lg bg-card p-6 shadow-sm">
				<h2 className="text-xl font-bold text-foreground">Order summary</h2>
				<p className="mt-1 text-sm text-muted-foreground">{lines.length} items in your cart</p>
			</div>

			{/* Product List */}
			<div className="rounded-lg bg-card p-6 shadow-sm">
				<div className="space-y-4">
					{lines.map((line) => {
						if (!line) return null;

						const product = line.variant?.product;
						const variant = line.variant;

						return (
							<div key={line.id} className="flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
								{/* Product Image */}
								<div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
									{product?.thumbnail?.url ? (
										<ProductImageWrapper
											src={product.thumbnail.url}
											alt={product.thumbnail.alt || product.name || ""}
											width={96}
											height={96}
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center text-muted-foreground">
											<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1}
													d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
										</div>
									)}

									{/* Quantity Badge */}
									<div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
										{line.quantity}
									</div>
								</div>

								{/* Product Details */}
								<div className="flex flex-1 flex-col justify-between">
									<div className="flex-1">
										<h3 className="text-sm font-semibold text-foreground">{product?.name}</h3>
										{variant?.name && variant.name !== product?.name && (
											<p className="mt-1 text-xs text-muted-foreground">{variant.name}</p>
										)}
									</div>

									{/* Quantity Controls */}
									<div className="mt-2 flex items-center justify-between">
										<div className="flex items-center gap-2 rounded-lg border border-border">
											<button
												onClick={() => onUpdateQuantity?.(line.id, Math.max(1, line.quantity - 1))}
												className="p-1.5 text-muted-foreground hover:text-foreground"
												disabled={line.quantity <= 1}
											>
												<Minus className="h-3 w-3" />
											</button>
											<span className="min-w-[24px] text-center text-sm font-medium text-foreground">
												{line.quantity}
											</span>
											<button
												onClick={() => onUpdateQuantity?.(line.id, line.quantity + 1)}
												className="p-1.5 text-muted-foreground hover:text-foreground"
											>
												<Plus className="h-3 w-3" />
											</button>
										</div>

										<button
											onClick={() => onRemoveLine?.(line.id)}
											className="text-muted-foreground hover:text-destructive"
											title="Remove item"
										>
											<X className="h-4 w-4" />
										</button>
									</div>
								</div>

								{/* Price */}
								<div className="text-right">
									<p className="text-sm font-semibold text-foreground">
										{formatPrice(line.totalPrice?.gross?.amount || 0)}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Price Summary */}
			<div className="rounded-lg bg-card p-6 shadow-sm">
				<div className="space-y-3">
					{/* Subtotal */}
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Subtotal</span>
						<span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
					</div>

					{/* Shipping */}
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Shipping</span>
						<span className="font-medium text-foreground">
							{shipping > 0 ? formatPrice(shipping) : "Calculated at next step"}
						</span>
					</div>

					{/* Divider */}
					<div className="border-t border-border"></div>

					{/* Total */}
					<div className="flex items-center justify-between">
						<span className="text-base font-semibold text-foreground">Total</span>
						<span className="text-xl font-bold text-foreground">{formatPrice(total)}</span>
					</div>
				</div>
			</div>

			{/* Trust Badges */}
			<div className="rounded-lg bg-muted p-4">
				<div className="grid grid-cols-2 gap-4 text-center">
					<div>
						<div className="text-2xl">🔒</div>
						<p className="mt-1 text-xs font-medium text-foreground">Secure Payment</p>
					</div>
					<div>
						<div className="text-2xl">🚚</div>
						<p className="mt-1 text-xs font-medium text-foreground">Free Shipping</p>
					</div>
					<div>
						<div className="text-2xl">↩️</div>
						<p className="mt-1 text-xs font-medium text-foreground">Easy Returns</p>
					</div>
					<div>
						<div className="text-2xl">💳</div>
						<p className="mt-1 text-xs font-medium text-foreground">Safe Checkout</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export { CheckoutOrderSummary };
