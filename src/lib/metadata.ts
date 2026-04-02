import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";

const STORE_NAME = "Phuong Store";

const metadataBase = process.env.NEXT_PUBLIC_STOREFRONT_URL
	? new URL(process.env.NEXT_PUBLIC_STOREFRONT_URL)
	: undefined;

type MetadataPage =
	| "home"
	| "search"
	| "cart"
	| "checkout"
	| "signIn"
	| "signUp"
	| "account"
	| "orders"
	| "rating";

/**
 * Generate i18n-aware metadata for a static page.
 * Uses next-intl server translations from the "metadata" namespace.
 */
const generatePageMetadata = async (page: MetadataPage): Promise<Metadata> => {
	const t = await getTranslations("metadata");

	return {
		title: t(`${page}.title`),
		description: t(`${page}.description`),
		metadataBase
	};
};

/**
 * Generate default metadata with i18n support.
 * Used for root/shop layouts.
 */
const generateDefaultMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("metadata");

	return {
		title: {
			default: t("defaultTitle"),
			template: `%s | ${STORE_NAME}`
		},
		description: t("defaultDescription"),
		icons: {
			icon: "/images/logo-icon.svg"
		},
		metadataBase
	};
};

export { generatePageMetadata, generateDefaultMetadata, STORE_NAME, metadataBase };
