const heroCampaigns = [
	{
		id: "new-arrivals",
		tag: "WHAT'S HOT",
		title: "New Arrivals",
		subtitle: "Drop moi tu chay bo den outfit streetwear.",
		cta: "Kham pha ngay",
		href: "/categories/new-arrivals",
		theme: "from-neutral-900 via-neutral-800 to-neutral-900",
		accent: "text-white"
	},
	{
		id: "running",
		tag: "RUNNING",
		title: "Running Collection",
		subtitle: "Nhe hon, ben hon, chay xa hon moi ngay.",
		cta: "Shop running",
		href: "/categories/running",
		theme: "from-neutral-900 via-neutral-800 to-black",
		accent: "text-white"
	},
	{
		id: "football",
		tag: "FOOTBALL",
		title: "Football Boots",
		subtitle: "Toc do va kiem soat trong moi buoc chay.",
		cta: "Chon giay",
		href: "/categories/football",
		theme: "from-neutral-900 via-neutral-700 to-neutral-900",
		accent: "text-white"
	},
	{
		id: "limited",
		tag: "LIMITED",
		title: "Limited Edition",
		subtitle: "Doi phom dang, doi phong cach, doi ban.",
		cta: "San pham gioi han",
		href: "/categories/limited",
		theme: "from-neutral-900 via-neutral-800 to-neutral-900",
		accent: "text-white"
	}
];

const categoryShortcuts = [
	{ id: "shoes", label: "Shoes", href: "/categories/shoes", tone: "from-neutral-100 to-neutral-50" },
	{ id: "clothing", label: "Clothing", href: "/categories/clothing", tone: "from-neutral-100 to-white" },
	{
		id: "accessories",
		label: "Accessories",
		href: "/categories/accessories",
		tone: "from-neutral-100 to-neutral-50"
	},
	{ id: "sports", label: "Sports", href: "/categories/sports", tone: "from-neutral-100 to-neutral-50" },
	{ id: "new", label: "New Arrivals", href: "/categories/new-arrivals", tone: "from-neutral-100 to-white" }
];

const whatsHotItems = [
	{
		id: "hot-1",
		name: "Ultraboost Light",
		tagline: "Nang cao nang luong tung buoc chay.",
		cta: "Shop now",
		href: "/search?filter_search=ultraboost",
		bg: "from-neutral-900 via-neutral-800 to-neutral-900",
		accent: "text-white"
	},
	{
		id: "hot-2",
		name: "Samba OG",
		tagline: "Iconic style, everyday comfort.",
		cta: "Shop now",
		href: "/search?filter_search=samba",
		bg: "from-neutral-900 via-neutral-800 to-neutral-900",
		accent: "text-white"
	},
	{
		id: "hot-3",
		name: "Predator League",
		tagline: "Precision and control for every touch.",
		cta: "Shop now",
		href: "/search?filter_search=predator",
		bg: "from-neutral-900 via-neutral-800 to-neutral-900",
		accent: "text-white"
	},
	{
		id: "hot-4",
		name: "Essentials Pack",
		tagline: "Wardrobe staples for training and travel.",
		cta: "Shop now",
		href: "/search?filter_search=essentials",
		bg: "from-neutral-900 via-neutral-800 to-neutral-900",
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
