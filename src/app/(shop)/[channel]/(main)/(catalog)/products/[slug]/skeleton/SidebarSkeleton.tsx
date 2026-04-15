import { Skeleton } from "@components/skeleton";

const SidebarSkeleton = () => {
	return (
		<>
			<div className="space-y-3">
				<Skeleton className="h-9 w-4/5 rounded-lg" />
				<Skeleton className="h-4 w-28 rounded-full" />
			</div>
			<div className="space-y-3">
				<Skeleton className="h-8 w-32 rounded-lg" />
				<Skeleton className="h-4 w-20 rounded-full" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-10 w-full rounded-xl" />
				<Skeleton className="h-10 w-5/6 rounded-xl" />
			</div>
			<Skeleton className="h-12 w-full rounded-xl" />
			<div className="flex gap-4">
				<Skeleton className="h-12 w-28 rounded-xl" />
				<Skeleton className="h-12 flex-1 rounded-xl" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-4 w-full rounded-full" />
				<Skeleton className="h-4 w-full rounded-full" />
				<Skeleton className="h-4 w-4/5 rounded-full" />
				<Skeleton className="h-4 w-2/3 rounded-full" />
			</div>
		</>
	);
};
export { SidebarSkeleton };
