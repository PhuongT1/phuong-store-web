import Image from "next/image";
import { LinkWithChannel } from "../../components/navigation/LinkWithChannel";
import { formatDate, formatMoney, getHrefForVariant } from "@/lib/utils";
import { type OrderDetailsFragment } from "@/gql/graphql";
import { PaymentStatus } from "@/ui/components/PaymentStatus";

type Props = {
	order: OrderDetailsFragment;
};

export const OrderListItem = ({ order }: Props) => {
	return (
		<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
			{/* Card Header (Meta Info) */}
			<div className="grid grid-cols-2 gap-4 border-b border-gray-100 bg-gray-50 p-4 sm:grid-cols-4 sm:p-6 lg:gap-8">
				<div className="flex flex-col gap-1">
					<span className="text-xs font-medium tracking-wider text-gray-500 uppercase">Mã đơn hàng</span>
					<span className="font-semibold text-gray-900">{order.number}</span>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-xs font-medium tracking-wider text-gray-500 uppercase">Ngày đặt</span>
					<span className="text-sm text-gray-700">
						<time dateTime={order.created}>{formatDate(new Date(order.created))}</time>
					</span>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-xs font-medium tracking-wider text-gray-500 uppercase">Tổng tiền</span>
					<span className="text-primary font-semibold">
						{formatMoney(order.total.gross.amount, order.total.gross.currency)}
					</span>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-xs font-medium tracking-wider text-gray-500 uppercase">Thanh toán</span>
					<div>
						<PaymentStatus status={order.paymentStatus} />
					</div>
				</div>
			</div>

			{/* Card Body (Order Lines) */}
			{order.lines.length > 0 && (
				<div className="flex flex-col divide-y divide-gray-100">
					{order.lines.map((item) => {
						if (!item.variant) return null;
						const product = item.variant.product;

						return (
							<div key={product.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
								<div className="flex flex-1 items-center gap-4">
									{product.thumbnail && (
										<div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white sm:h-24 sm:w-24">
											<Image
												src={product.thumbnail.url}
												alt={product.thumbnail.alt ?? ""}
												fill
												className="object-contain p-2"
											/>
										</div>
									)}
									<div className="flex flex-col">
										<LinkWithChannel
											href={getHrefForVariant({
												slug: product.slug,
												variantId: item.variant.id
											})}
											className="hover:text-primary text-base font-medium text-gray-900 transition-colors"
										>
											{product.name}
										</LinkWithChannel>
										{item.variant.name !== item.variant.id && Boolean(item.variant.name) && (
											<span className="mt-1 text-sm text-gray-500">Phân loại: {item.variant.name}</span>
										)}
									</div>
								</div>

								<div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-1">
									<div className="flex items-center gap-2 text-sm text-gray-500 sm:hidden">
										<span>Số lượng: {item.quantity}</span>
										<span>×</span>
										<span>
											{item.variant.pricing?.price &&
												formatMoney(
													item.variant.pricing.price.gross.amount,
													item.variant.pricing.price.gross.currency
												)}
										</span>
									</div>

									<span className="hidden text-sm text-gray-500 sm:block">
										{item.quantity} ×{" "}
										{item.variant.pricing?.price &&
											formatMoney(
												item.variant.pricing.price.gross.amount,
												item.variant.pricing.price.gross.currency
											)}
									</span>

									<span className="font-semibold text-gray-900">
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
			<div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-4 py-4 sm:px-6">
				<button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900">
					Xem chi tiết
				</button>
				<button className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors">
					Mua lại
				</button>
			</div>
		</div>
	);
};
