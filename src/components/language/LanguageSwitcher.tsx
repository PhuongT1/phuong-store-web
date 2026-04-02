"use client";

import { DropdownMenuElement, type MenuElement } from "@ui";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { setUserLocale } from "@/action";
import { type Locale, languages } from "@i18n/config";

const LanguageSwitcher = () => {
	const locale = useLocale();
	const currentLang = languages.find((l) => l.value === locale);

	const menus: MenuElement[] = languages.map((lang) => ({
		label: lang.label,
		active: lang.value === locale,
		onClick: () => void setUserLocale(lang.value as Locale)
	}));

	return (
		<DropdownMenuElement menus={menus}>
			<span className="text-sm font-semibold">{currentLang?.label ?? locale.toUpperCase()}</span>
			<ChevronDown className="h-3 w-3 opacity-50" />
		</DropdownMenuElement>
	);
};

export { LanguageSwitcher };
