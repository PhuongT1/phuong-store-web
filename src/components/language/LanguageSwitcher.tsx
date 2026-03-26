"use client";

import { useLocale } from "next-intl";
import { DropdownMenuElement, type MenuElement } from "@ui";
import { type Locale, languages } from "@i18n/config";
import { ChevronDown } from "lucide-react";
import { setUserLocale } from "@/action";

const LanguageSwitcher = () => {
	const locale = useLocale();

	const menus: MenuElement[] = languages.map((lang) => ({
		label: lang.label,
		onClick: () => void setUserLocale(lang.value as Locale)
	}));

	return (
		<DropdownMenuElement menus={menus}>
			<span className="text-sm font-semibold uppercase">{locale}</span>
			<ChevronDown className="h-3 w-3 opacity-50" />
		</DropdownMenuElement>
	);
};

export { LanguageSwitcher };
