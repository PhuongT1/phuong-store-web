import { Skeleton } from "@/components/skeleton/Skeleton";

const SuggestionProductRowSkeleton = () => (
	<div className="surface-subtle flex items-center gap-3 px-2.5 py-2">
		<Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
		<div className="flex flex-1 flex-col gap-1.5">
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-3.5 w-1/3" />
		</div>
	</div>
);

export { SuggestionProductRowSkeleton };
