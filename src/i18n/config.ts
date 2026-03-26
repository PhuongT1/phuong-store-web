const languages = [
	{ label: "Tiếng Việt", value: "vi" },
	{ label: "English", value: "en" }
];

const locales = ["vi", "en"] as const;
type Locale = (typeof locales)[number];
const defaultLocale = "vi";

export { type Locale, languages, defaultLocale, locales };
