const heroCampaigns = [
	{
		id: "new-arrivals",
		tag: "WHAT'S HOT",
		title: "Hàng Mới Về",
		subtitle: "Drop mới từ giày chạy bộ đến outfit streetwear — cập nhật liên tục mỗi tuần.",
		cta: "Khám phá ngay",
		href: "/categories/new-arrivals",
		colorScheme: "rose"
	},
	{
		id: "running",
		tag: "RUNNING",
		title: "Bộ Sưu Tập Chạy Bộ",
		subtitle: "Nhẹ hơn, bền hơn, chạy xa hơn mỗi ngày — công nghệ đệm đỉnh cao cho mọi cự ly.",
		cta: "Shop Running",
		href: "/categories/running",
		colorScheme: "sky"
	},
	{
		id: "football",
		tag: "FOOTBALL",
		title: "Giày Bóng Đá",
		subtitle: "Tốc độ và kiểm soát hoàn hảo trong mỗi bước chạy — lựa chọn của các nhà vô địch.",
		cta: "Chọn giày",
		href: "/categories/football",
		colorScheme: "emerald"
	},
	{
		id: "limited",
		tag: "LIMITED EDITION",
		title: "Phiên Bản Giới Hạn",
		subtitle: "Đổi phong cách, đổi phong cách, đổi bạn — số lượng có hạn, đừng bỏ lỡ.",
		cta: "Sản phẩm giới hạn",
		href: "/categories/limited",
		colorScheme: "violet"
	}
];

const categoryShortcuts = [
	{ id: "shoes", label: "Shoes", href: "/categories/shoes", tone: "from-muted to-muted/50" },
	{ id: "clothing", label: "Clothing", href: "/categories/clothing", tone: "from-muted to-background" },
	{
		id: "accessories",
		label: "Accessories",
		href: "/categories/accessories",
		tone: "from-muted to-muted/50"
	},
	{ id: "sports", label: "Sports", href: "/categories/sports", tone: "from-muted to-muted/50" },
	{ id: "new", label: "New Arrivals", href: "/categories/new-arrivals", tone: "from-muted to-background" }
];

const whatsHotItems = [
	{
		id: "hot-1",
		name: "Ultraboost Light",
		tagline: "Nang cao nang luong tung buoc chay.",
		cta: "Shop now",
		href: "/search?filter_search=ultraboost",
		bg: "from-amber-500 via-orange-500 to-red-500",
		accent: "text-white"
	},
	{
		id: "hot-2",
		name: "Samba OG",
		tagline: "Iconic style, everyday comfort.",
		cta: "Shop now",
		href: "/search?filter_search=samba",
		bg: "from-blue-600 via-indigo-500 to-violet-500",
		accent: "text-white"
	},
	{
		id: "hot-3",
		name: "Predator League",
		tagline: "Precision and control for every touch.",
		cta: "Shop now",
		href: "/search?filter_search=predator",
		bg: "from-emerald-500 via-green-500 to-lime-400",
		accent: "text-white"
	},
	{
		id: "hot-4",
		name: "Essentials Pack",
		tagline: "Wardrobe staples for training and travel.",
		cta: "Shop now",
		href: "/search?filter_search=essentials",
		bg: "from-rose-500 via-pink-500 to-fuchsia-500",
		accent: "text-white"
	}
];

const suggestionData = {
	trending: ["Ultraboost", "Samba", "Predator", "Forum", "Superstar"],
	collections: ["Adizero", "Terrex", "4DFWD", "Gazelle"],
	categories: ["Shoes", "Clothing", "Accessories", "Running", "Football"],
	products: [
		{ name: "Ultraboost Light", price: "3.590.000đ" },
		{ name: "Samba OG", price: "2.790.000đ" },
		{ name: "Predator League FG", price: "2.190.000đ" },
		{ name: "Essentials Hoodie", price: "1.290.000đ" }
	]
};

const blogPosts = [
	{
		id: "post-1",
		category: "Giày chạy bộ",
		title: "Top 5 đôi giày chạy bộ tốt nhất năm 2025",
		excerpt:
			"Từ Ultraboost đến 4DFWD — chúng tôi đã thử nghiệm tất cả để tìm ra đôi giày hoàn hảo cho mọi cự ly.",
		date: "28 tháng 3, 2025",
		readTime: "5 phút đọc",
		href: "/blog/top-5-giay-chay-bo-2025",
		colorScheme: "sky"
	},
	{
		id: "post-2",
		category: "Phong cách",
		title: "Streetwear 2025: Mix & Match như thế nào cho đúng trend?",
		excerpt: "Samba OG, Forum Low và những đôi giày đang làm mưa làm gió trên đường phố Việt Nam.",
		date: "20 tháng 3, 2025",
		readTime: "4 phút đọc",
		href: "/blog/streetwear-mix-match-2025",
		colorScheme: "violet"
	},
	{
		id: "post-3",
		category: "Hướng dẫn",
		title: "Cách chọn size giày đúng chuẩn — không bao giờ mua nhầm nữa",
		excerpt: "Bí quyết đo chân và chọn số chuẩn xác, áp dụng cho mọi thương hiệu từ Adidas đến Nike.",
		date: "14 tháng 3, 2025",
		readTime: "3 phút đọc",
		href: "/blog/chon-size-giay-dung",
		colorScheme: "emerald"
	},
	{
		id: "post-4",
		category: "Bộ sưu tập",
		title: "Samba OG × Street Art Hà Nội: Văn hoá đường phố qua từng đường nét",
		excerpt: "Bộ sưu tập giới hạn lấy cảm hứng từ nghệ thuật graffiti đặc trưng trên các con phố Hà Nội.",
		date: "7 tháng 3, 2025",
		readTime: "6 phút đọc",
		href: "/blog/samba-og-street-art-hanoi",
		colorScheme: "rose"
	},
	{
		id: "post-5",
		category: "Chăm sóc giày",
		title: "5 bước chăm sóc giày da để luôn như mới sau nhiều năm sử dụng",
		excerpt: "Hướng dẫn vệ sinh, bảo quản và khử mùi giày da hiệu quả nhất từ các chuyên gia hàng đầu.",
		date: "1 tháng 3, 2025",
		readTime: "4 phút đọc",
		href: "/blog/cham-soc-giay-da",
		colorScheme: "amber"
	},
	{
		id: "post-6",
		category: "Đánh giá",
		title: "Adizero vs Predator: Đâu là lựa chọn tốt hơn cho từng vị trí sân cỏ?",
		excerpt: "So sánh chi tiết hai dòng giày bóng đá huyền thoại: tốc độ thuần khiết vs kiểm soát tuyệt đối.",
		date: "22 tháng 2, 2025",
		readTime: "7 phút đọc",
		href: "/blog/adizero-vs-predator",
		colorScheme: "emerald"
	}
];

export { heroCampaigns, categoryShortcuts, whatsHotItems, suggestionData, blogPosts };
