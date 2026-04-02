import { ImageSkeleton } from "@/components/skeleton/ImageSkeleton";
import { Skeleton } from "@/components/skeleton/Skeleton";

export default function OrderDetailLoading() {
	return (
		<div className="flex flex-col gap-6">
			{/* Back link */}
			<Skeleton className="h-4 w-48" />

			{/* Header */}
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-2">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-4 w-36" />
				</div>
				<Skeleton className="h-6 w-28 rounded-full" />
			</div>

			{/* Order lines card */}
			<div className="border-border bg-card overflow-hidden rounded-2xl border">
				<div className="border-border bg-muted flex items-center gap-2 border-b px-6 py-4">
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-20" />
				</div>
				<div className="flex items-center gap-4 p-4 sm:p-6">
					<ImageSkeleton
						skeletonProps={{ className: "h-20 w-20 shrink-0 rounded-lg" }}
						imageProps={{ size: 40 }}
					/>
					<div className="flex flex-1 flex-col gap-2">
						<Skeleton className="h-4 w-40" />
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-3 w-16" />
					</div>
					<Skeleton className="h-5 w-20" />
				</div>
				<div className="border-border bg-muted/50 border-t px-6 py-4">
					<div className="ml-auto flex max-w-xs flex-col gap-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-5 w-full" />
					</div>
				</div>
			</div>

			{/* Info cards grid */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-5">
						<div className="flex items-center gap-2">
							<Skeleton className="h-4 w-4" />
							<Skeleton className="h-4 w-32" />
						</div>
						<Skeleton className="h-3 w-3/4" />
						<Skeleton className="h-3 w-1/2" />
					</div>
				))}
			</div>
		</div>
	);
}
