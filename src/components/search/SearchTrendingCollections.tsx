"use client";

import { LinkWithChannel } from "@components/navigation";
import { whatsHotItems } from "./searchData";
import { cn } from "@/lib/utils";

const SearchTrendingCollections = () => {
	return (
		<section className="py-12">
			<div className="mb-8">
				<p className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
					Trending Collections
				</p>
				<h2 className="text-2xl font-semibold tracking-tight text-gray-900">Shop by Collection</h2>
			</div>
			<div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
				{whatsHotItems.map((item) => (
					<LinkWithChannel
						key={item.id}
						href={item.href}
						className="group min-w-[240px] flex-shrink-0 sm:min-w-[280px]"
					>
						<div className="flex h-28 items-center justify-between rounded-xl border border-gray-200 bg-white px-6 shadow-sm transition-all duration-200 ease-out will-change-transform hover:-translate-y-1 hover:shadow-md">
							<div>
								<p className="text-base font-semibold text-gray-900">{item.name}</p>
								<p className="mt-1 text-sm text-gray-600">{item.tagline.substring(0, 30)}...</p>
							</div>
							<svg
								className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1"
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
