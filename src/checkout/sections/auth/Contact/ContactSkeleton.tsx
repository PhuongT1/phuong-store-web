import React from "react";
import { Skeleton } from "@components/skeleton";

export const ContactSkeleton: React.FC = () => {
	return (
		<div className="py-2">
			{/* email input */}
			<Skeleton className="h-11 w-full rounded-xl" />
			{/* checkbox */}
			<div className="mt-3 flex items-center gap-2">
				<Skeleton className="h-5 w-5 rounded" />
				<Skeleton className="h-4 w-48" />
			</div>
		</div>
	);
};
