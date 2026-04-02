import React from "react";
import { Skeleton } from "./Skeleton";

const ProductListByCategorySkeleton = () => {
	return (
		<div className="min-h-screen">
			{/* Breadcrumb Skeleton */}
			<div>
				<div className="mx-auto max-w-[1920px] px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
			</div>

			{/* Hero Banner Skeleton */}
			<div>
				<Skeleton className="h-[400px] w-full md:h-[500px] rounded-none" />
			</div>

			{/* Subcategory Navigation Skeleton */}
			<div className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 lg:px-8">
				<div className="flex gap-3 overflow-hidden">
					{[1, 2, 3, 4, 5].map((i) => (
						<Skeleton key={i} className="h-24 w-[180px] shrink-0 rounded-xl" />
					))}
				</div>
			</div>

			{/* Product Grid Area */}
			<div className="px-4 py-6 sm:px-6 lg:px-8">
				<div className="flex w-full gap-6 md:gap-8 lg:gap-10">
					{/* Filter Sidebar Skeleton */}
					<div className="hidden w-1/4 max-w-[280px] md:block">
						<div className="space-y-6 rounded-lg bg-card p-6 shadow-sm">
							<Skeleton className="h-6 w-24" />
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="space-y-3">
									<Skeleton className="h-5 w-32" />
									<Skeleton className="h-24 w-full" />
								</div>
							))}
						</div>
					</div>

					{/* Product Grid Skeleton */}
					<div className="flex-1">
						{/* Sort Bar Skeleton */}
						<div className="mb-6 rounded-lg bg-card p-4 shadow-sm">
							<div className="flex items-center justify-between gap-4">
								<Skeleton className="h-6 w-32" />
								<div className="flex gap-2">
									{[1, 2, 3, 4].map((i) => (
										<Skeleton key={i} className="h-10 w-24 rounded-md" />
									))}
								</div>
							</div>
						</div>

						{/* Product Cards Grid */}
						<div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
							{[...Array(12)].map((_, i) => (
								<div key={i} className="overflow-hidden rounded-xl bg-card shadow-sm">
									<Skeleton className="aspect-4/5 w-full" />
									<div className="space-y-3 p-5">
										<Skeleton className="h-5 w-full" />
										<Skeleton className="h-4 w-3/4" />
										<Skeleton className="h-6 w-24" />
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

ProductListByCategorySkeleton.displayName = "ProductListByCategorySkeleton";

export { ProductListByCategorySkeleton };
