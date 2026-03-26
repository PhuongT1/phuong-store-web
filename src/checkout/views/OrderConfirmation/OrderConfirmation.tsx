import React, { Suspense } from "react";
import { CheckCircle2, ChevronLeft, ShoppingBag } from "lucide-react";
import { Button, Card } from "@components/ui";
import { OrderConfirmationSkeleton } from "./OrderConfirmationSkeleton";
import { Summary } from "@/checkout/sections/Summary";
import { SummarySkeleton } from "@/checkout/sections/Summary/SummarySkeleton";
import { OrderInfo } from "@/checkout/sections/OrderInfo";
import { useOrder } from "@/checkout/hooks/useOrder";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import { NONE_SHADOW_MOBILE } from "@/constants";
import { cn } from "@/lib/utils";
import { OrderDiscountType, type CheckoutLine } from "@/gql/graphql";
import { SummaryListEdit } from "@/components/cart/summary/SummaryListEdit";

export const OrderConfirmation = () => {
	const { order } = useOrder();
	const { isTabletOrBelow } = useDeviceSize();

	if (!order) return <OrderConfirmationSkeleton />;

	return (
		<main className="mx-auto max-w-6xl px-4 py-8">
			<div className="mb-8 flex flex-col items-center text-center lg:mb-12">
				<div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500 ring-8 ring-green-50/50">
					<CheckCircle2 size={48} />
				</div>
				<h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 lg:text-4xl">
					Đặt hàng thành công!
				</h1>
				<p className="max-w-prose text-lg text-gray-600">
					Cảm ơn bạn đã tin tưởng. Đơn hàng <span className="font-bold text-gray-900">#{order?.number}</span>{" "}
					đã được xác nhận và đang được xử lý.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
				<div className="space-y-6">
					<Card
						className={cn(
							"overflow-hidden border-none p-0 shadow-sm transition-shadow hover:shadow-md",
							NONE_SHADOW_MOBILE
						)}
					>
						<div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
							<h2 className="flex items-center gap-2 font-bold text-gray-800">
								<ShoppingBag size={18} className="text-gray-500" />
								Chi tiết sản phẩm
							</h2>
						</div>
						<div className="px-6 py-2">
							<SummaryListEdit
								{...(order as any)}
								discount={order?.discounts?.find(({ type }) => type === OrderDiscountType.Voucher)?.amount}
								voucherCode={order?.voucher?.code}
								totalPrice={order?.total}
								subtotalPrice={order?.subtotal}
								editable={false}
								lines={order?.lines as unknown as CheckoutLine[]}
								classNameCard="p-0 border-none shadow-none"
							/>
						</div>
					</Card>

					<Card className={cn("border-none p-6 shadow-sm", NONE_SHADOW_MOBILE)}>
						<OrderInfo />
					</Card>

					<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
						{/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
						<a href="/">
							<Button
								variant="ghost"
								className="group hover:text-primary flex items-center gap-2 transition-colors"
							>
								<ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
								Tiếp tục mua sắm
							</Button>
						</a>
						<p className="text-sm text-gray-500">
							Mọi thắc mắc vui lòng liên hệ{" "}
							<a href="mailto:support@example.com" className="text-primary font-medium hover:underline">
								support@example.com
							</a>
						</p>
					</div>
				</div>

				<aside className="space-y-6">
					{!isTabletOrBelow && (
						<Suspense fallback={<SummarySkeleton />}>
							<div className="sticky top-24">
								<Summary
									{...(order as any)}
									discount={order?.discounts?.find(({ type }) => type === OrderDiscountType.Voucher)?.amount}
									voucherCode={order?.voucher?.code}
									totalPrice={order?.total}
									subtotalPrice={order?.subtotal}
									editable={false}
									lines={order?.lines as unknown as CheckoutLine[]}
									classNameCard="border-none shadow-sm shadow-primary/5 ring-1 ring-primary/5"
								/>
							</div>
						</Suspense>
					)}
				</aside>
			</div>
		</main>
	);
};

OrderConfirmation.displayName = "OrderConfirmation";
