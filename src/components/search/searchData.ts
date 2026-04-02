const heroCampaigns = [
	{
		id: "new-arrivals",
		tag: "WHAT'S HOT",
		title: "New Arrivals",
		subtitle: "Drop moi tu chay bo den outfit streetwear.",
		cta: "Kham pha ngay",
		href: "/categories/new-arrivals",
		theme: "from-rose-600 via-pink-500 to-orange-400",
		accent: "text-white"
	},
	{
		id: "running",
		tag: "RUNNING",
		title: "Running Collection",
		subtitle: "Nhe hon, ben hon, chay xa hon moi ngay.",
		cta: "Shop running",
		href: "/categories/running",
		theme: "from-sky-600 via-blue-500 to-indigo-600",
		accent: "text-white"
	},
	{
		id: "football",
		tag: "FOOTBALL",
		title: "Football Boots",
		subtitle: "Toc do va kiem soat trong moi buoc chay.",
		cta: "Chon giay",
		href: "/categories/football",
		theme: "from-emerald-600 via-teal-500 to-cyan-500",
		accent: "text-white"
	},
	{
		id: "limited",
		tag: "LIMITED",
		title: "Limited Edition",
		subtitle: "Doi phom dang, doi phong cach, doi ban.",
		cta: "San pham gioi han",
		href: "/categories/limited",
		theme: "from-violet-600 via-purple-500 to-fuchsia-500",
		accent: "text-white"
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
		{ name: "Ultraboost Light", price: "3.590.000d" },
		{ name: "Samba OG", price: "2.790.000d" },
		{ name: "Predator League FG", price: "2.190.000d" },
		{ name: "Essentials Hoodie", price: "1.290.000d" }
	]
};

export { heroCampaigns, categoryShortcuts, whatsHotItems, suggestionData };
