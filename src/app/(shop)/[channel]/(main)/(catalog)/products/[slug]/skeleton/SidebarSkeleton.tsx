import { Skeleton } from "@components/skeleton";

const SidebarSkeleton = () => {
	return (
		<>
			<Skeleton className="h-9" />
			<Skeleton className="h-4 w-1/3" />
			<div className="flex flex-col gap-4">
				<Skeleton className="h-8 w-1/3" />
				<Skeleton className="h-6 w-1/2" />
			</div>
			<Skeleton className="h-12" />
			<div className="flex gap-4">
				<Skeleton className="h-12 w-1/2" />
				<Skeleton className="h-12 flex-1" />
			</div>
			<Skeleton className="h-[600px] flex-1" />
		</>
	);
};
export { SidebarSkeleton };
