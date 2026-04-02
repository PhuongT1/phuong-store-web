import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CreditCard, MapPin, Package, Truck } from "lucide-react";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { GetOrderDetailDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { formatDate, formatMoney } from "@/lib/utils";
import { OrderLineThumbnail } from "@/ui/atoms/OrderLineThumbnail";

export const generateMetadata = async ({
	params
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> => {
	const { id } = await params;
	return { title: `Chi tiết đơn hàng #${id}` };
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const decodedId = decodeURIComponent(id);
	const t = await getTranslations("orders");

	const { order } = await executeGraphQL(GetOrderDetailDocument, {
		variables: { id: decodedId },
		cache: "no-cache"
	});

	if (!order) return notFound();

	const shippingMethod = order.deliveryMethod?.__typename === "ShippingMethod" ? order.deliveryMethod : null;

	return (
		<div className="flex flex-col gap-6">
			{/* Back link */}
			<Link
				href="/account/orders"
				className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-2 text-sm transition-colors"
			>
				<ArrowLeft className="h-4 w-4" />
				{t("backToList")}
			</Link>

			{/* Header */}
			<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-foreground text-2xl font-bold tracking-tight">
						{t("detail.orderedOn")} #{order.number}
					</h1>
					<p className="text-muted-foreground mt-1 text-sm">
						<time dateTime={order.created}>{formatDate(new Date(order.created))}</time>
					</p>
				</div>
				<div className="flex flex-col items-start gap-1 sm:items-end">
					<span className="border-border bg-muted text-foreground rounded-full border px-3 py-1 text-xs font-medium">
						{t(`status.${order.status}`)}
					</span>
					<span className="text-muted-foreground text-xs">{t(`chargeStatus.${order.chargeStatus}`)}</span>
				</div>
			</div>

			{/* Order Lines */}
			<div className="border-border bg-card overflow-hidden rounded-2xl border">
				<div className="border-border bg-muted flex items-center gap-2 border-b px-6 py-4">
					<Package className="text-muted-foreground h-4 w-4" />
					<span className="text-foreground text-sm font-semibold">{t("detail.products")}</span>
				</div>
				<div className="divide-border flex flex-col divide-y">
					{order.lines.map((line) => (
						<div key={line.id} className="flex items-center gap-4 p-4 sm:p-6">
							{line.thumbnail && (
								<OrderLineThumbnail url={line.thumbnail.url} alt={line.thumbnail.alt ?? line.productName} />
							)}
							<div className="flex flex-1 flex-col gap-1">
								<span className="text-foreground font-medium">{line.productName}</span>
								{line.variantName && line.variantName !== line.productName && (
									<span className="text-muted-foreground text-sm">
										{t("item.variant")}: {line.variantName}
									</span>
								)}
								<span className="text-muted-foreground text-sm">
									{t("item.quantity")}: {line.quantity}
								</span>
							</div>
							<div className="flex flex-col items-end gap-0.5">
								<span className="text-primary font-semibold">
									{formatMoney(line.totalPrice.gross.amount, line.totalPrice.gross.currency)}
								</span>
								{line.quantity > 1 && (
									<span className="text-muted-foreground text-xs">
										{formatMoney(line.unitPrice.gross.amount, line.unitPrice.gross.currency)}{" "}
										{t("item.perItem")}
									</span>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Totals */}
				<div className="border-border bg-muted/50 border-t px-6 py-4">
					<div className="ml-auto max-w-xs space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">{t("detail.subtotal")}</span>
							<span className="text-foreground">
								{formatMoney(order.subtotal.gross.amount, order.subtotal.gross.currency)}
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">{t("detail.shippingFee")}</span>
							<span className="text-foreground">
								{formatMoney(order.shippingPrice.gross.amount, order.shippingPrice.gross.currency)}
							</span>
						</div>
						<div className="border-border flex justify-between border-t pt-2 font-semibold">
							<span className="text-foreground">{t("detail.total")}</span>
							<span className="text-primary">
								{formatMoney(order.total.gross.amount, order.total.gross.currency)}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Info cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{/* Shipping address */}
				{order.shippingAddress && (
					<div className="border-border bg-card rounded-2xl border p-5">
						<div className="mb-3 flex items-center gap-2">
							<MapPin className="text-muted-foreground h-4 w-4" />
							<span className="text-foreground text-sm font-semibold">{t("detail.shippingAddress")}</span>
						</div>
						<div className="text-muted-foreground space-y-0.5 text-sm">
							<p className="text-foreground font-medium">
								{order.shippingAddress.firstName} {order.shippingAddress.lastName}
							</p>
							{order.shippingAddress.streetAddress1 && <p>{order.shippingAddress.streetAddress1}</p>}
							{order.shippingAddress.streetAddress2 && <p>{order.shippingAddress.streetAddress2}</p>}
							{order.shippingAddress.city && (
								<p>
									{order.shippingAddress.city}
									{order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ""}
								</p>
							)}
							<p>{order.shippingAddress.country.country}</p>
						</div>
					</div>
				)}

				{/* Shipping method */}
				{shippingMethod && (
					<div className="border-border bg-card rounded-2xl border p-5">
						<div className="mb-3 flex items-center gap-2">
							<Truck className="text-muted-foreground h-4 w-4" />
							<span className="text-foreground text-sm font-semibold">{t("detail.shippingMethod")}</span>
						</div>
						<p className="text-muted-foreground text-sm">{shippingMethod.name}</p>
					</div>
				)}

				{/* Payment */}
				<div className="border-border bg-card rounded-2xl border p-5">
					<div className="mb-3 flex items-center gap-2">
						<CreditCard className="text-muted-foreground h-4 w-4" />
						<span className="text-foreground text-sm font-semibold">{t("detail.payment")}</span>
					</div>
					<p className="text-muted-foreground text-sm">{t(`chargeStatus.${order.chargeStatus}`)}</p>
					{order.userEmail && <p className="text-muted-foreground mt-1 text-xs">{order.userEmail}</p>}
				</div>
			</div>
		</div>
	);
}
