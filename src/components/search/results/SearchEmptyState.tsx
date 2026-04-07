"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { LinkWithChannel } from "@components/navigation";

type SearchEmptyStateProps = {
	searchQuery?: string;
};

const SearchEmptyState = ({ searchQuery }: SearchEmptyStateProps) => {
	const t = useTranslations("searchEmpty");

	return (
		<section className="py-20">
			<div className="mx-auto max-w-2xl text-center">
				<div className="bg-muted mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full">
					<Search className="text-muted-foreground h-10 w-10" />
				</div>

				<h2 className="text-foreground mb-3 text-3xl font-semibold tracking-tight">
					{searchQuery ? t("noResultsFor", { query: searchQuery }) : t("noProducts")}
				</h2>

				<p className="text-muted-foreground mb-10 text-base leading-relaxed">{t("tryDifferent")}</p>

				<div className="mb-10">
					<p className="text-muted-foreground mb-4 text-xs font-medium tracking-wider uppercase">
						{t("popularCategories")}
					</p>
				</div>

				<div className="text-muted-foreground text-sm">
					<p className="text-foreground mb-3 font-semibold">{t("searchTips")}</p>
					<ul className="space-y-2 text-sm">
						<li>• {t("tip1")}</li>
						<li>• {t("tip2")}</li>
						<li>• {t("tip3")}</li>
					</ul>
				</div>
			</div>
		</section>
	);
};

export { SearchEmptyState };
