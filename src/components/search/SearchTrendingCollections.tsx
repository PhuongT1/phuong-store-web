"use client";

import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@components/navigation";
import { whatsHotItems } from "./searchData";

const SearchTrendingCollections = () => {
	return (
		<section className="py-12">
			<div className="mb-8">
				<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
					Trending Collections
				</p>
				<h2 className="text-foreground text-2xl font-semibold tracking-tight">Shop by Collection</h2>
			</div>
			<div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
				{whatsHotItems.map((item) => (
					<LinkWithChannel
						key={item.id}
						href={item.href}
						className="group min-w-[240px] shrink-0 sm:min-w-[280px]"
					>
						<div className="border-border bg-card flex h-28 items-center justify-between rounded-xl border px-6 shadow-sm transition-all duration-200 ease-out will-change-transform hover:-translate-y-1 hover:shadow-md">
							<div>
								<p className="text-foreground text-base font-semibold">{item.name}</p>
								<p className="text-muted-foreground mt-1 text-sm">{item.tagline.substring(0, 30)}...</p>
							</div>
							<svg
								className="text-muted-foreground h-5 w-5 transition-transform group-hover:translate-x-1"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</div>
					</LinkWithChannel>
				))}
			</div>
		</section>
	);
};

export { SearchTrendingCollections };
