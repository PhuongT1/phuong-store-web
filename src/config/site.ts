const siteName = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "Deal24";
const titleSeparator = " | ";

const SITE_CONFIG = {
	name: siteName,
	titleSeparator,
	titleTemplate: `%s${titleSeparator}${siteName}`
} as const;

export { SITE_CONFIG };
