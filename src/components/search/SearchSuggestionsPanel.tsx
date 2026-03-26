"use client";

import { Button } from "@components/ui";
import { suggestionData } from "./searchData";

type SearchSuggestionsPanelProps = {
	query: string;
};

const SearchSuggestionsPanel = ({ query }: SearchSuggestionsPanelProps) => {
	const normalized = query.toLowerCase();
	const filterList = (items: string[]) =>
		items.filter((item) => item.toLowerCase().includes(normalized)).slice(0, 6);

	const trending = filterList(suggestionData.trending);
	const collections = filterList(suggestionData.collections);
	const categories = filterList(suggestionData.categories);
	const products = suggestionData.products.filter((item) => item.name.toLowerCase().includes(normalized));

	return (
		<div className="border-border bg-card absolute top-[calc(100%+8px)] right-0 left-0 z-30 grid gap-6 rounded-none border p-4 shadow-lg md:grid-cols-[1.1fr_0.9fr]">
			<div className="grid gap-4">
				<div>
					<p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
						Suggested products
					</p>
					<div className="mt-2 grid gap-2">
						{products.length ? (
							products.map((item) => (
								<div key={item.name} className="flex items-center justify-between text-sm">
									<span className="text-foreground font-medium">{item.name}</span>
									<span className="text-muted-foreground">{item.price}</span>
								</div>
							))
						) : (
							<p className="text-muted-foreground text-sm">No product suggestions.</p>
						)}
					</div>
				</div>

				<div>
					<p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
						Suggested categories
					</p>
					<div className="mt-2 flex flex-wrap gap-2">
						{categories.map((item) => (
							<Button key={item} variant="outline" className="rounded-none text-xs font-semibold">
								{item}
							</Button>
						))}
					</div>
				</div>

				<div>
					<p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
						Trending searches
					</p>
					<div className="mt-2 flex flex-wrap gap-2">
						{trending.map((item) => (
							<span key={item} className="bg-accent rounded-none px-2 py-1 text-xs font-medium">
								{item}
							</span>
						))}
					</div>
				</div>

				<div>
					<p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
						Brand collections
					</p>
					<div className="mt-2 flex flex-wrap gap-2">
						{collections.map((item) => (
							<span key={item} className="bg-accent rounded-none px-2 py-1 text-xs font-medium">
								{item}
							</span>
						))}
					</div>
				</div>
			</div>

			<div className="border-border flex flex-col gap-3 border-l pl-6">
				<p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">Preview</p>
				{suggestionData.products.slice(0, 3).map((item) => (
					<div key={item.name} className="border-border rounded-none border p-3">
						<p className="text-foreground text-sm font-semibold">{item.name}</p>
						<p className="text-muted-foreground text-xs">{item.price}</p>
						<Button className="mt-2 rounded-none text-xs font-semibold" variant="outline">
							Shop now
						</Button>
					</div>
				))}
			</div>
		</div>
	);
};

export { SearchSuggestionsPanel };
