import { Skeleton } from "@components/skeleton";

/** Skeleton mirrors OrderConfirmation layout exactly: banner → 2-col grid (6fr/4fr). */
export const OrderConfirmationSkeleton = () => (
	<div className="bg-background min-h-screen pt-6 pb-16">
		{/* Banner */}
		<div className="mb-7 flex flex-col items-center gap-3">
			<Skeleton className="h-14 w-14 rounded-full" />
			<Skeleton className="h-6 w-48" />
			<Skeleton className="h-4 w-64" />
		</div>

		{/* Grid */}
		<div className="grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-[6fr_4fr]">
			{/* Left col */}
			<div className="space-y-4">
				{/* Card 1 — product list */}
				<div className="bg-card overflow-hidden rounded-xl shadow-sm">
					{/* Card header */}
					<div className="border-border bg-muted/30 border-b px-6 py-3">
						<Skeleton className="h-4 w-32" />
					</div>
					{/* Product row */}
					<div className="px-6 py-4">
						<div className="flex items-center gap-4">
							<Skeleton className="h-16 w-16 shrink-0 rounded-lg" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-1/2" />
								<Skeleton className="h-4 w-1/4" />
							</div>
							<div className="space-y-1 text-right">
								<Skeleton className="ml-auto h-4 w-20" />
								<Skeleton className="ml-auto h-4 w-16" />
							</div>
						</div>
					</div>
				</div>

				{/* Card 2 — info sections */}
				<div className="bg-card rounded-xl p-6 shadow-sm">
					{/* 4 info rows separated by dividers */}
					{[["w-28", "w-40"], ["w-24", "w-36"], ["w-32", "w-44"], ["w-28", "w-52", "w-40"]].map(
						(widths, i) => (
							<div
								key={i}
								className="border-border py-4 [&:first-child]:pt-0 [&:last-child]:pb-0 [&:not(:last-child)]:border-b"
							>
								<Skeleton className="mb-2 h-3 w-20" />
								<div className="space-y-1.5">
									{widths.map((w, j) => (
										<Skeleton key={j} className={`h-4 ${w}`} />
									))}
								</div>
							</div>
						)
					)}
				</div>
			</div>

			{/* Right col — summary (hidden on mobile, matches SummarySkeleton layout wrapped in card) */}
			<div className="hidden lg:block">
				<div className="bg-card rounded-xl p-6 shadow-sm">
					<div className="space-y-4">
						<div className="flex justify-between">
							<Skeleton className="h-4 w-1/5" />
							<Skeleton className="h-4 w-1/6" />
						</div>
						<div className="flex justify-between">
							<Skeleton className="h-4 w-1/4" />
							<Skeleton className="h-4 w-1/6" />
						</div>
						<div className="bg-border h-px" />
						<div className="flex justify-between">
							<Skeleton className="h-5 w-1/3" />
							<Skeleton className="h-5 w-1/4" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
);
