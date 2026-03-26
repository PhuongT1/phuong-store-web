import { DEFAULT_CHANNEL_SLUG } from "@/constants";

type RouteFn<T extends any[]> = (...params: T) => string;

const PREFIX = "";

const createBasePath = (base: string) => `${PREFIX}${base}`;

const ROOT = {
	home: createBasePath("/"),
	auth: createBasePath(""),
	checkout: createBasePath("/checkout"),
	account: createBasePath("/account"),
	order: createBasePath("/order"),
	payment: createBasePath("/payment"),
	legal: createBasePath("/legal"),
	static: createBasePath("/static"),
	page: createBasePath("/page")
} as const;

const createRoutes = <T extends string>(base: string, paths: Record<T, string>) => {
	return Object.fromEntries(
		Object.entries(paths).map(([key, path]) => [key, `${base}${String(path)}`])
	) as Record<T, string>;
};

// Main routes
const routes = {
	home: ROOT.home,
	chanel: DEFAULT_CHANNEL_SLUG,
	search: createBasePath(`${DEFAULT_CHANNEL_SLUG}/search`),
	cart: createBasePath("/cart"),
	products: ((slug: string) => createBasePath(`/products/${slug}`)) as RouteFn<[string]>,

	checkout: createRoutes(ROOT.checkout, {
		index: "",
		signIn: "/sign-in",
		userDetails: "/user-details",
		shippingAddress: "/shipping-address",
		deliveryMethod: "/delivery-method",
		payment: "/payment"
	}),

	order: {
		confirmation: ((id: string) => `${ROOT.order}/confirmation/${id}`) as RouteFn<[string]>
	},

	payment: createRoutes(ROOT.payment, {
		confirmation: "/confirmation"
	}),

	auth: createRoutes(ROOT.auth, {
		signIn: "/sign-in",
		createAccount: "/create-account",
		resetPassword: "/reset-password",
		newPassword: "/new-password",
		confirmNewEmail: "/confirm-new-email",
		confirmAccountRegistration: "/confirm-account-registration"
	}),

	account: createRoutes(ROOT.account, {
		profile: "/profile",
		orders: "/orders",
		privacySettings: "/privacy-settings",
		addresses: "/addresses",
		paymentMethods: "/payment-methods",
		deleteAccount: "/delete-account"
	}),

	legal: createRoutes(ROOT.legal, {
		termsOfUse: "/terms-of-use",
		privacyPolicy: "/privacy-policy"
	}),

	staticPages: createRoutes(ROOT.static, {
		contact: "/contact",
		aboutUs: "/about-us",
		faq: "/faq"
	}),

	page: ((slug: string) => `${ROOT.page}/${slug}`) as RouteFn<[string]>,

	notFound: createBasePath("/404")
} as const;

const QUERY_PARAMS = {
	orderPlace: "orderPlaced",
	errorCode: "errorCode"
} as const;

export { routes, QUERY_PARAMS };
