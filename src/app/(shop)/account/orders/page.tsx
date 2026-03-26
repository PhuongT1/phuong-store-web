import { CurrentUserOrderListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { OrderListItem } from "@/ui/components/OrderListItem";

export default async function OrderPage() {
	const { me: user } = await executeGraphQL(CurrentUserOrderListDocument, {
		cache: "no-cache"
	});

	if (!user) {
		return null;
	}

	const orders = user.orders?.edges || [];

	return (
		<div className="flex flex-col">
			<h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
				Đơn hàng của {user.firstName ? user.firstName : user.email}
			</h1>

			{/* Mock Order Status Tabs */}
			<div className="mb-6 border-b border-gray-200">
				<nav className="scrollbar-hide -mb-px flex space-x-6 overflow-x-auto">
					{["Tất cả", "Chờ thanh toán", "Đang xử lý", "Đang vận chuyển", "Đã giao", "Đã hủy"].map(
						(tab, idx) => (
							<button
								key={tab}
								className={`border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap ${
									idx === 0
										? "border-primary text-primary"
										: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
								}`}
							>
								{tab}
							</button>
						)
					)}
				</nav>
			</div>

			{orders.length === 0 ? (
				<div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-20 text-center">
					<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
						<svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-medium text-gray-900">Chưa có đơn hàng nào</h3>
					<p className="mt-1 text-sm text-gray-500">Bạn chưa thực hiện bất kỳ đơn hàng nào trên hệ thống.</p>
				</div>
			) : (
				<div className="mt-8 flex flex-col gap-6">
					{orders.map(({ node: order }) => {
						return <OrderListItem order={order} key={order.id} />;
					})}
				</div>
			)}
		</div>
	);
}
