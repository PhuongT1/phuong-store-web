import React from "react";
import { Skeleton } from "@components/skeleton";

export const ContactSkeleton: React.FC = () => {
	return (
		<div className="py-4">
			<Skeleton variant="title" className="mb-4 w-48" />
			{/* email input */}
			<Skeleton className="h-10 w-full rounded-md" />
			{/* checkbox */}
			<div className="mt-3 flex items-center gap-2">
				<Skeleton className="h-4 w-4 rounded" />
				<Skeleton className="h-4 w-48" />
			</div>
		</div>
	);
};
