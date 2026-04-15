import { ImageSkeleton } from "@/components/skeleton/ImageSkeleton";
import { Skeleton } from "@/components/skeleton/Skeleton";

const OrderListItemSkeleton = () => (
	<div className="border-border bg-card overflow-hidden rounded-2xl border">
		<div className="border-border bg-muted grid grid-cols-2 gap-4 border-b p-4 sm:grid-cols-4 sm:p-6 lg:gap-8">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="flex flex-col gap-1">
					<Skeleton className="h-3 w-20 rounded-full" />
					<Skeleton className="h-4 w-24 rounded-full" />
				</div>
			))}
		</div>

		<div className="divide-border flex flex-col divide-y">
			{Array.from({ length: 2 }).map((_, index) => (
				<div key={index} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
					<div className="flex flex-1 items-center gap-4">
						<ImageSkeleton
							skeletonProps={{ className: "h-20 w-20 shrink-0 rounded-xl sm:h-24 sm:w-24" }}
							imageProps={{ size: 44 }}
						/>
						<div className="flex flex-1 flex-col gap-1.5">
							<Skeleton className="h-5 w-2/3 rounded" />
							<Skeleton className="h-4 w-32 rounded-full" />
						</div>
					</div>
					<div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-1">
						<Skeleton className="h-4 w-24 rounded-full" />
						<Skeleton className="h-5 w-20 rounded" />
					</div>
				</div>
			))}
		</div>

		<div className="border-border bg-muted/50 flex items-center justify-end border-t px-4 py-4 sm:px-6">
			<Skeleton className="h-9 w-28 rounded-lg" />
		</div>
	</div>
);
OrderListItemSkeleton.displayName = "OrderListItemSkeleton";

const OrdersPageSkeleton = () => (
	<div className="flex flex-col">
		<Skeleton variant="title" className="mb-6 h-8 w-56 rounded-lg sm:h-9 sm:w-72" />

		<div className="border-border mb-6 border-b">
			<div className="-mb-px flex gap-6 overflow-x-auto">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="py-4">
						<Skeleton className={`h-4 rounded-full ${i === 0 ? "w-12" : "w-24"}`} />
					</div>
				))}
			</div>
		</div>

		<div className="flex flex-col gap-6">
			{Array.from({ length: 2 }).map((_, i) => (
				<OrderListItemSkeleton key={i} />
			))}
		</div>
	</div>
);
OrdersPageSkeleton.displayName = "OrdersPageSkeleton";

export { OrderListItemSkeleton, OrdersPageSkeleton };
