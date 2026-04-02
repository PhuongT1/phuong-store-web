const fs = require("fs");

// Update vi.json
const vi = JSON.parse(fs.readFileSync("messages/vi/vi.json", "utf8"));
vi.orders = {
	title: "Đơn hàng của tôi",
	backToList: "Quay lại danh sách đơn hàng",
	emptyTitle: "Chưa có đơn hàng nào",
	emptyTitleFiltered: "Không có đơn hàng nào",
	emptyDesc: "Bạn chưa thực hiện bất kỳ đơn hàng nào trên hệ thống.",
	emptyDescFiltered: "Không có đơn hàng nào trong trạng thái này.",
	viewDetail: "Xem chi tiết",
	tabs: {
		all: "Tất cả",
		pending: "Chờ thanh toán",
		processing: "Đang xử lý",
		shipping: "Đang vận chuyển",
		delivered: "Đã giao",
		cancelled: "Đã hủy"
	},
	columns: { id: "Mã đơn hàng", date: "Ngày đặt", total: "Tổng tiền", payment: "Thanh toán" },
	item: { variant: "Phân loại", quantity: "Số lượng", perItem: "/ sản phẩm" },
	detail: {
		orderedOn: "Đặt ngày",
		products: "Sản phẩm",
		subtotal: "Tạm tính",
		shippingFee: "Phí vận chuyển",
		total: "Tổng cộng",
		shippingAddress: "Địa chỉ giao hàng",
		shippingMethod: "Phương thức vận chuyển",
		payment: "Thanh toán"
	},
	status: {
		UNCONFIRMED: "Chờ xác nhận",
		UNFULFILLED: "Đang xử lý",
		PARTIALLY_FULFILLED: "Đang vận chuyển",
		FULFILLED: "Đã giao",
		RETURNED: "Đã trả hàng",
		PARTIALLY_RETURNED: "Trả hàng một phần",
		CANCELED: "Đã hủy",
		EXPIRED: "Hết hạn",
		DRAFT: "Nháp"
	},
	chargeStatus: {
		NONE: "Chưa thanh toán",
		PARTIAL: "Thanh toán một phần",
		FULL: "Đã thanh toán",
		OVERCHARGED: "Thanh toán vượt"
	},
	paymentStatus: {
		NOT_CHARGED: "Chưa thanh toán",
		CANCELLED: "Đã hủy",
		REFUSED: "Bị từ chối",
		FULLY_CHARGED: "Đã thanh toán",
		FULLY_REFUNDED: "Đã hoàn tiền",
		PARTIALLY_CHARGED: "Thanh toán một phần",
		PARTIALLY_REFUNDED: "Hoàn tiền một phần",
		PENDING: "Đang xử lý"
	}
};
vi.account.manage = "Quản lý tài khoản";
vi.account.noAddresses = "Chưa có địa chỉ nào được lưu";
vi.account.addAddress = "Thêm địa chỉ mới";
vi.account.defaultShipping = "Giao hàng mặc định";
vi.account.defaultBilling = "Thanh toán mặc định";
fs.writeFileSync("messages/vi/vi.json", JSON.stringify(vi, null, 4));

// Update en.json
const en = JSON.parse(fs.readFileSync("messages/en/en.json", "utf8"));
en.orders = {
	title: "My orders",
	backToList: "Back to order list",
	emptyTitle: "No orders yet",
	emptyTitleFiltered: "No orders found",
	emptyDesc: "You have not placed any orders yet.",
	emptyDescFiltered: "No orders match this status.",
	viewDetail: "View details",
	tabs: {
		all: "All",
		pending: "Pending payment",
		processing: "Processing",
		shipping: "Shipping",
		delivered: "Delivered",
		cancelled: "Cancelled"
	},
	columns: { id: "Order ID", date: "Date", total: "Total", payment: "Payment" },
	item: { variant: "Variant", quantity: "Qty", perItem: "/ item" },
	detail: {
		orderedOn: "Ordered on",
		products: "Products",
		subtotal: "Subtotal",
		shippingFee: "Shipping fee",
		total: "Total",
		shippingAddress: "Shipping address",
		shippingMethod: "Shipping method",
		payment: "Payment"
	},
	status: {
		UNCONFIRMED: "Pending confirmation",
		UNFULFILLED: "Processing",
		PARTIALLY_FULFILLED: "Shipping",
		FULFILLED: "Delivered",
		RETURNED: "Returned",
		PARTIALLY_RETURNED: "Partially returned",
		CANCELED: "Cancelled",
		EXPIRED: "Expired",
		DRAFT: "Draft"
	},
	chargeStatus: {
		NONE: "Not charged",
		PARTIAL: "Partially charged",
		FULL: "Fully paid",
		OVERCHARGED: "Overcharged"
	},
	paymentStatus: {
		NOT_CHARGED: "Not charged",
		CANCELLED: "Cancelled",
		REFUSED: "Refused",
		FULLY_CHARGED: "Paid",
		FULLY_REFUNDED: "Refunded",
		PARTIALLY_CHARGED: "Partially paid",
		PARTIALLY_REFUNDED: "Partially refunded",
		PENDING: "Pending"
	}
};
en.account.manage = "Account management";
en.account.noAddresses = "No saved addresses";
en.account.addAddress = "Add new address";
en.account.defaultShipping = "Default shipping";
en.account.defaultBilling = "Default billing";
fs.writeFileSync("messages/en/en.json", JSON.stringify(en, null, 4));

console.log("Both message files updated OK");
