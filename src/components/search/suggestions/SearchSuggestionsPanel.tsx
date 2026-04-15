"use client";

import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { Scrollbar } from "@/components/ui/Scrollbar";
import { ALL_PRODUCTS_SLUG } from "@/constants";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import { SuggestionLabel } from "./SuggestionLabel";
import { SuggestionProductRow } from "./SuggestionProductRow";
import { SuggestionProductRowSkeleton } from "./SuggestionProductRowSkeleton";
import { SuggestionRelatedTerm } from "./SuggestionRelatedTerm";

type SearchSuggestionsPanelProps = {
	query: string;
	channel: string;
	onClose: () => void;
	onNavigate: (query: string) => void;
};

const SKELETON_COUNT = 4;
// Max visible products before scrollbar kicks in (~4 rows × 64px ≈ 256px)
const PRODUCTS_MAX_HEIGHT = 280;

const SearchSuggestionsPanel = ({ query, channel, onClose, onNavigate }: SearchSuggestionsPanelProps) => {
	const t = useTranslations("searchSuggestions");
	const { products, isLoading } = useSearchSuggestions(query, channel);

	const relatedCategories = Array.from(
		new Map(products.filter((p) => p.category?.id).map((p) => [p.category!.id, p.category!.name])).entries()
	).slice(0, 5);

	const hasProducts = !isLoading && products.length > 0;
	const isEmpty = !isLoading && products.length === 0;
	const showCategories = isLoading || relatedCategories.length > 0;

	return (
		<div className="bg-popover/95 text-popover-foreground flex flex-col">
			{showCategories && (
				<div className="border-border/45 bg-muted/25 border-b px-4 py-3">
					<SuggestionLabel label={t("relatedCategories")} />
					<div className="flex flex-col">
						{isLoading && relatedCategories.length === 0
							? Array.from({ length: 3 }).map((_, i) => (
									<div key={i} className="flex items-center gap-2.5 py-1.5">
										<Skeleton className="h-3.5 w-3.5 shrink-0" />
										<Skeleton className="h-4 w-32" />
									</div>
								))
							: relatedCategories.map(([id, name]) => (
									<SuggestionRelatedTerm
										key={id}
										label={name}
										href={`/${encodeURIComponent(channel)}${ALL_PRODUCTS_SLUG}?filter_search=${encodeURIComponent(name)}`}
										onClose={onClose}
									/>
								))}
					</div>
				</div>
			)}

			<div className="px-4 pt-3 pb-1">
				<SuggestionLabel label={t("suggestedProducts")} />
			</div>

			<Scrollbar maxHeight={PRODUCTS_MAX_HEIGHT} className="px-4 pb-1">
				{isLoading && (
					<div className="flex flex-col pb-2">
						{Array.from({ length: SKELETON_COUNT }).map((_, i) => (
							<SuggestionProductRowSkeleton key={i} />
						))}
					</div>
				)}
				{hasProducts && (
					<div className="flex flex-col gap-2 pb-2">
						{products.map((product) => (
							<SuggestionProductRow key={product.id} product={product} channel={channel} onClose={onClose} />
						))}
					</div>
				)}
				{isEmpty && <p className="text-muted-foreground pb-3 text-sm">{t("noResults")}</p>}
			</Scrollbar>

			{hasProducts && (
				<div className="border-border/45 bg-muted/20 border-t px-4 py-2.5">
					<button
						type="button"
						onClick={() => {
							onNavigate(query);
							onClose();
						}}
						className="text-info hover:text-info/85 text-sm font-semibold underline-offset-2 hover:underline"
					>
						{t("viewAll")} →
					</button>
				</div>
			)}
		</div>
	);
};

export { SearchSuggestionsPanel };
