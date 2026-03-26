import { LinkWithChannel } from "@components/navigation";
import { categoryShortcuts } from "./searchData";
import { cn } from "@/lib/utils";

const SearchCategoryTiles = () => {
	return (
		<section className="py-12">
			<div className="mb-6">
				<h2 className="text-2xl font-semibold tracking-tight text-gray-900">Shop by Category</h2>
				<p className="mt-1 text-sm text-gray-600">Find what you're looking for</p>
			</div>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{categoryShortcuts.map((item) => (
					<LinkWithChannel key={item.id} href={item.href} className="group">
						<div className="flex h-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 ease-out will-change-transform hover:-translate-y-1 hover:shadow-lg">
							<div>
								<p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Category</p>
								<p className="mt-3 text-xl font-bold text-gray-900">{item.label}</p>
							</div>
							<p className="mt-4 text-sm font-medium text-gray-600 transition-colors group-hover:text-gray-900">
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
