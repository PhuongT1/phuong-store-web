import { ImageSkeleton } from "@/components/skeleton/ImageSkeleton";
import { Skeleton } from "@/components/skeleton/Skeleton";

const OrderListItemSkeleton = () => (
	<div className="border-border bg-card overflow-hidden rounded-2xl border">
		{/* Header - matches 4-col grid of OrderListItem */}
		<div className="border-border bg-muted grid grid-cols-2 gap-4 border-b p-4 sm:grid-cols-4 sm:p-6 lg:gap-8">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="flex flex-col gap-2">
					<Skeleton className="h-3 w-20" />
					<Skeleton className="h-4 w-24" />
				</div>
			))}
		</div>

		{/* Body - one product line */}
		<div className="flex items-center gap-4 p-4 sm:p-6">
			<ImageSkeleton
				skeletonProps={{ className: "h-20 w-20 shrink-0 rounded-lg sm:h-24 sm:w-24" }}
				imageProps={{ size: 40 }}
			/>
			<div className="flex flex-1 flex-col gap-2">
				<Skeleton className="h-4 w-1/2" />
				<Skeleton className="h-3 w-1/4" />
			</div>
			<div className="flex flex-col items-end gap-1">
				<Skeleton className="h-4 w-20" />
				<Skeleton className="h-3 w-16" />
			</div>
		</div>

		{/* Footer */}
		<div className="border-border bg-muted/50 flex items-center justify-end border-t px-4 py-4 sm:px-6">
			<Skeleton className="h-9 w-28" />
		</div>
	</div>
);
OrderListItemSkeleton.displayName = "OrderListItemSkeleton";

const OrdersPageSkeleton = () => (
	<div className="flex flex-col">
		{/* Title */}
		<Skeleton variant="title" className="mb-6 h-8 w-1/3" />

		{/* Tabs — each pill wrapped in py-4 to match real button's padding */}
		<div className="border-border mb-6 border-b">
			<div className="-mb-px flex gap-6 overflow-x-auto">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="py-4">
						<Skeleton className={`h-4 ${i === 0 ? "w-12" : "w-24"}`} />
					</div>
				))}
			</div>
		</div>

		{/* Order cards */}
		<div className="flex flex-col gap-6">
			{Array.from({ length: 2 }).map((_, i) => (
				<OrderListItemSkeleton key={i} />
			))}
		</div>
	</div>
);
OrdersPageSkeleton.displayName = "OrdersPageSkeleton";

export { OrderListItemSkeleton, OrdersPageSkeleton };
