import React, { Suspense } from "react";
import { CheckCircle2, ChevronLeft, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useOrder } from "@/checkout/hooks/useOrder";
import { OrderInfo } from "@/checkout/sections/order-summary/OrderInfo";
import { Summary } from "@/checkout/sections/order-summary/Summary";
import { SummarySkeleton } from "@/checkout/sections/order-summary/Summary/SummarySkeleton";
import { SummaryListEdit } from "@/components/cart/summary/SummaryListEdit";
import { NONE_SHADOW_MOBILE } from "@/constants";
import { OrderDiscountType, type CheckoutLine } from "@/gql/graphql";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import { cn } from "@/lib/utils";
import { Button, Card } from "@components/ui";
import { OrderConfirmationSkeleton } from "./OrderConfirmationSkeleton";

/** Pick only the props Summary/SummaryListEdit actually consume from Checkout */
type OrderAsSummaryProps = {
	id: string;
	editable: boolean;
	lines: CheckoutLine[];
	classNameCard?: string;
	discount?: { currency: string; amount: number } | null;
	voucherCode?: string | null;
	totalPrice?: { gross: { currency: string; amount: number } };
	subtotalPrice?: { gross: { currency: string; amount: number } };
	shippingPrice?: { gross: { currency: string; amount: number } };
};

export const OrderConfirmation = () => {
	const { order } = useOrder();
	const { isTabletOrBelow } = useDeviceSize();
	const t = useTranslations("checkout");

	if (!order) return <OrderConfirmationSkeleton />;

	const orderVoucherDiscount = order?.discounts?.find(
		({ type }) => type === OrderDiscountType.Voucher
	)?.amount;
	const sharedOrderProps = {
		id: order.id,
		editable: false,
		discount: orderVoucherDiscount,
		voucherCode: order?.voucher?.code,
		totalPrice: order?.total,
		subtotalPrice: order?.subtotal,
		shippingPrice: order?.shippingPrice,
		lines: order?.lines as unknown as CheckoutLine[]
	} satisfies OrderAsSummaryProps;

	return (
		<div className="bg-background min-h-screen pt-6 pb-16">
			{/* Success banner */}
			<div className="mb-7 flex flex-col items-center text-center">
				<div className="bg-success-muted text-success ring-success-muted/40 mb-3 flex h-14 w-14 items-center justify-center rounded-full ring-4">
					<CheckCircle2 size={32} />
				</div>
				<h1 className="text-foreground mb-1 text-xl font-bold tracking-tight lg:text-2xl">
					{t("orderSuccess")}
				</h1>
				<p className="text-muted-foreground max-w-prose text-sm">
					{t("orderThankYou", { number: order?.number })}
				</p>
			</div>

			{/* Two-column grid — mirrors Checkout.tsx layout (6fr / 4fr) */}
			<div className="grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-[6fr_4fr]">
				<div className="space-y-4">
					{/* Card 1: Product list */}
					<Card className={cn("overflow-hidden border-none p-0 shadow-sm", NONE_SHADOW_MOBILE)}>
						<div className="border-border bg-muted/40 border-b px-6 py-3">
							<h2 className="text-foreground flex items-center gap-2 text-sm font-semibold">
								<ShoppingBag size={15} className="text-muted-foreground" />
								{t("productDetails")}
							</h2>
						</div>
						<div className="px-6 py-3">
							<SummaryListEdit
								{...({
									...sharedOrderProps,
									classNameCard: "p-0 border-none shadow-none"
								} as React.ComponentProps<typeof SummaryListEdit>)}
							/>
						</div>
					</Card>

					{/* Card 2: Order info (payment, delivery, contact, address) */}
					<Card className={cn("border-none p-6 shadow-sm", NONE_SHADOW_MOBILE)}>
						<OrderInfo />
					</Card>

					<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
						<a href="/">
							<Button
								variant="ghost"
								className="group hover:text-info flex items-center gap-2 transition-colors"
							>
								<ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
								{t("continueShopping")}
							</Button>
						</a>
						<p className="text-muted-foreground text-sm">
							{t("contactSupport")}{" "}
							<a href="mailto:support@example.com" className="text-info font-medium hover:underline">
								support@example.com
							</a>
						</p>
					</div>
				</div>

				{!isTabletOrBelow && (
					<aside className="sticky top-(--header-height) self-start">
						<Suspense fallback={<SummarySkeleton />}>
							<Summary
								{...({
									...sharedOrderProps,
									classNameCard: "border-none shadow-sm shadow-primary/5 ring-1 ring-primary/5"
								} as React.ComponentProps<typeof Summary>)}
							/>
						</Suspense>
					</aside>
				)}
			</div>
		</div>
	);
};

OrderConfirmation.displayName = "OrderConfirmation";
