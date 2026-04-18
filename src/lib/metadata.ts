import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE_CONFIG } from "@/config/site";

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
	| "profile"
	| "address"
	| "settings"
	| "orders"
	| "orderConfirmation"
	| "orderDetail"
	| "rating"
	| "blog";

const resolveMetadataValue = (...candidates: Array<string | null | undefined>) =>
	candidates.find((candidate) => candidate?.trim());

const buildMetadata = ({
	title,
	description,
	alternates,
	openGraph
}: {
	title?: string | null;
	description?: string | null;
	alternates?: Metadata["alternates"];
	openGraph?: Metadata["openGraph"];
} = {}): Metadata => ({
	...(title ? { title } : {}),
	...(description ? { description } : {}),
	...(alternates ? { alternates } : {}),
	...(openGraph ? { openGraph } : {}),
	metadataBase
});

/**
 * Generate i18n-aware metadata for a static page.
 * Uses next-intl server translations from the "metadata" namespace.
 */
const generatePageMetadata = async (page: MetadataPage): Promise<Metadata> => {
	const t = await getTranslations("metadata");

	return buildMetadata({
		title: t(`${page}.title`),
		description: t(`${page}.description`)
	});
};

/**
 * Generate default metadata with i18n support.
 * Used for root/shop layouts.
 */
const generateDefaultMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("metadata");

	return {
		title: {
			default: SITE_CONFIG.name,
			template: SITE_CONFIG.titleTemplate
		},
		description: t("defaultDescription"),
		icons: {
			icon: "/images/logo-icon.svg"
		},
		metadataBase
	};
};

export { buildMetadata, generatePageMetadata, generateDefaultMetadata, metadataBase, resolveMetadataValue };
