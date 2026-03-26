const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const CONFIG = {
	IMAGE_SIZES: {
		pdp: 1024
	},
	CACHE_TTL: {
		pdp: DAY,
		cart: MINUTE * 5,
		cms: MINUTE * 15
	},
	DEFAULT_DEBOUNCE_TIME_IN_MS: 500,
	DEFAULT_SORT_BY: "price-asc",
	DEFAULT_RESULTS_PER_PAGE: 12,
	COOKIE_KEY: {
		checkoutId: "checkoutId",
		accessToken: "accessToken",
		refreshToken: "refreshToken",
		searchProvider: "searchProvider"
	},
	COOKIE_MAX_AGE: {
		checkout: 30 * DAY
	},
	MIN_PASSWORD_LENGTH: 8,
	DEFAULT_PAGE_TITLE: "Shop thương mại điện tử",
	CHANGE_EMAIL_TOKEN_VALIDITY_IN_HOURS: 72,
	CHECKOUT_KEY: {
		completionKey: "checkoutComplete",
		updateKey: "checkoutUpdate",
		deleteKey: "checkoutDelete",
		addKey: "addDelete",
		transactionProcessKey: "transactionProcess"
	},
	TOAST_DURATION: {
		success: 3000,
		error: 5000,
		warning: 4000,
		info: 3000
	},
	SIZE_VARIANT: {
		medium: "h-10",
		small: "h-9",
		xsmall: "h-8"
	}
};

export { CONFIG };
