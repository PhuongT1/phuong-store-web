"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { type OrderDetailsFragment } from "@/gql/graphql";
import { formatDate, formatMoney, getHrefForVariant } from "@/lib/utils";
import { OrderLineThumbnail } from "@/ui/atoms/OrderLineThumbnail";
import { PaymentStatus } from "@/ui/components/PaymentStatus";
import { LinkWithChannel } from "../../components/navigation/LinkWithChannel";

type Props = {
	order: OrderDetailsFragment;
};

export const OrderListItem = ({ order }: Props) => {
	const t = useTranslations("orders");
	return (
		<div className="border-border bg-card overflow-hidden rounded-2xl border">
			{/* Card Header (Meta Info) */}
			<div className="border-border bg-muted grid grid-cols-2 gap-4 border-b p-4 sm:grid-cols-4 sm:p-6 lg:gap-8">
				<div className="flex flex-col gap-1">
					<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
						{t("columns.id")}
					</span>
					<span className="text-foreground font-semibold">{order.number}</span>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
						{t("columns.date")}
					</span>
					<span className="text-muted-foreground text-sm">
						<time dateTime={order.created}>{formatDate(new Date(order.created))}</time>
					</span>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
						{t("columns.total")}
					</span>
					<span className="text-price font-semibold">
						{formatMoney(order.total.gross.amount, order.total.gross.currency)}
					</span>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
						{t("columns.payment")}
					</span>
					<div>
						<PaymentStatus status={order.paymentStatus} />
					</div>
				</div>
			</div>

			{/* Card Body (Order Lines) */}
			{order.lines.length > 0 && (
				<div className="divide-border flex flex-col divide-y">
					{order.lines.map((item) => {
						if (!item.variant) return null;
						const product = item.variant.product;

						return (
							<div key={product.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
								<div className="flex flex-1 items-center gap-4">
									{product.thumbnail && (
										<OrderLineThumbnail url={product.thumbnail.url} alt={product.thumbnail.alt ?? ""} />
									)}
									<div className="flex flex-col">
										<LinkWithChannel
											href={getHrefForVariant({
												slug: product.slug,
												variantId: item.variant.id
											})}
											className="hover:text-info text-foreground text-base font-medium transition-colors"
										>
											{product.name}
										</LinkWithChannel>
										{item.variant.name !== item.variant.id && Boolean(item.variant.name) && (
											<span className="text-muted-foreground mt-1 text-sm">
												{t("item.variant")}: {item.variant.name}
											</span>
										)}
									</div>
								</div>

								<div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-1">
									<div className="text-muted-foreground flex items-center gap-2 text-sm sm:hidden">
										<span>
											{t("item.quantity")}: {item.quantity}
										</span>
										<span>×</span>
										<span>
											{item.variant.pricing?.price &&
												formatMoney(
													item.variant.pricing.price.gross.amount,
													item.variant.pricing.price.gross.currency
												)}
										</span>
									</div>

									<span className="text-muted-foreground hidden text-sm sm:block">
										{item.quantity} ×{" "}
										{item.variant.pricing?.price &&
											formatMoney(
												item.variant.pricing.price.gross.amount,
												item.variant.pricing.price.gross.currency
											)}
									</span>

									<span className="text-price font-semibold">
										{item.variant.pricing?.price &&
											formatMoney(
												item.variant.pricing.price.gross.amount * item.quantity,
												item.variant.pricing.price.gross.currency
											)}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Card Footer (Actions) */}
			<div className="border-border bg-muted/50 flex items-center justify-end gap-3 border-t px-4 py-4 sm:px-6">
				<Link
					href={`/account/orders/${encodeURIComponent(order.id)}`}
					className="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors"
				>
					{t("viewDetail")}
				</Link>
			</div>
		</div>
	);
};
