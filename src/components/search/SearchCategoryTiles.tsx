import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@components/navigation";
import { categoryShortcuts } from "./searchData";

const SearchCategoryTiles = () => {
	return (
		<section className="py-12">
			<div className="mb-6">
				<h2 className="text-foreground text-2xl font-semibold tracking-tight">Shop by Category</h2>
				<p className="text-muted-foreground mt-1 text-sm">Find what you're looking for</p>
			</div>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{categoryShortcuts.map((item) => (
					<LinkWithChannel key={item.id} href={item.href} className="group">
						<div className="border-border bg-card flex h-full flex-col justify-between rounded-xl border p-6 shadow-sm transition-all duration-200 ease-out will-change-transform hover:-translate-y-1 hover:shadow-lg">
							<div>
								<p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Category</p>
								<p className="text-foreground mt-3 text-xl font-bold">{item.label}</p>
							</div>
							<p className="text-muted-foreground group-hover:text-foreground mt-4 text-sm font-medium transition-colors">
								Discover now →
							</p>
						</div>
					</LinkWithChannel>
				))}
			</div>
		</section>
	);
};

export { SearchCategoryTiles };
