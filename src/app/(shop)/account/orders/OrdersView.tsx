"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { OrderStatus, PaymentChargeStatusEnum, type OrderDetailsFragment } from "@/gql/graphql";
import { OrderListItem } from "@/ui/components/OrderListItem";

const TAB_KEYS = ["all", "pending", "processing", "shipping", "delivered", "cancelled"] as const;
type TabKey = (typeof TAB_KEYS)[number];

const TAB_FILTERS: Record<TabKey, (order: OrderDetailsFragment) => boolean> = {
	all: () => true,
	pending: (o) =>
		o.paymentStatus === PaymentChargeStatusEnum.NotCharged ||
		o.paymentStatus === PaymentChargeStatusEnum.Pending,
	processing: (o) => o.status === OrderStatus.Unconfirmed || o.status === OrderStatus.Unfulfilled,
	shipping: (o) => o.status === OrderStatus.PartiallyFulfilled,
	delivered: (o) =>
		o.status === OrderStatus.Fulfilled ||
		o.status === OrderStatus.PartiallyReturned ||
		o.status === OrderStatus.Returned,
	cancelled: (o) => o.status === OrderStatus.Canceled || o.status === OrderStatus.Expired
};

type Props = {
	orders: OrderDetailsFragment[];
	userName: string;
};

export function OrdersView({ orders, userName }: Props) {
	const t = useTranslations("orders");
	const [activeTab, setActiveTab] = useState<TabKey>("all");

	const filtered = orders.filter(TAB_FILTERS[activeTab]);
	// Lock content height to full-list height → no layout shift on tab switch
	const contentMinHeight = Math.max(orders.length > 0 ? orders.length * 364 : 0, 400);

	const tabLabels: Record<TabKey, string> = {
		all: t("tabs.all"),
		pending: t("tabs.pending"),
		processing: t("tabs.processing"),
		shipping: t("tabs.shipping"),
		delivered: t("tabs.delivered"),
		cancelled: t("tabs.cancelled")
	};

	return (
		<div className="flex flex-col">
			<h1 className="text-foreground mb-6 text-xl font-bold tracking-tight sm:text-2xl">
				{t("title")} <span className="text-muted-foreground text-base font-normal">— {userName}</span>
			</h1>

			{/* Status Tabs */}
			<div className="border-border mb-6 border-b">
				<nav className="scrollbar-hide -mb-px flex space-x-6 overflow-x-auto">
					{TAB_KEYS.map((key) => {
						const isActive = key === activeTab;
						const count = orders.filter(TAB_FILTERS[key]).length;
						return (
							<button
								key={key}
								type="button"
								onClick={() => setActiveTab(key)}
								className={`flex items-center gap-1.5 border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
									isActive
										? "border-info text-info"
										: "text-muted-foreground hover:border-border hover:text-foreground border-transparent"
								}`}
							>
								{tabLabels[key]}
								{count > 0 && key !== "all" && (
									<span
										className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
											isActive ? "bg-info/15 text-info" : "bg-muted text-muted-foreground"
										}`}
									>
										{count}
									</span>
								)}
							</button>
						);
					})}
				</nav>
			</div>

			{/* Content — height locked to full-list height → no shift when switching tabs */}
			<div style={{ minHeight: contentMinHeight }}>
				{filtered.length === 0 ? (
					<div className="border-border bg-card flex flex-col items-center justify-center rounded-2xl border px-4 py-20 text-center">
						<div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
							<ShoppingBag className="text-muted-foreground h-8 w-8" />
						</div>
						<h3 className="text-foreground text-lg font-medium">
							{activeTab === "all" ? t("emptyTitle") : t("emptyTitleFiltered")}
						</h3>
						<p className="text-muted-foreground mt-1 text-sm">
							{activeTab === "all" ? t("emptyDesc") : t("emptyDescFiltered")}
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-6">
						{filtered.map((order) => (
							<OrderListItem order={order} key={order.id} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
