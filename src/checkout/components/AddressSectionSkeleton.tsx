import React from "react";
import { Skeleton } from "@components/skeleton";

export const AddressSectionSkeleton = () => (
	<div className="py-2 sm:py-4">
		<div className="mb-3 flex items-center gap-2.5">
			<Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
			<Skeleton className="h-5 w-40" />
		</div>
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{/* row 1: firstName, lastName */}
			<Skeleton className="h-10 w-full rounded-md" />
			<Skeleton className="h-10 w-full rounded-md" />
			{/* row 2: phone, countryCode */}
			<Skeleton className="h-10 w-full rounded-md" />
			<Skeleton className="h-10 w-full rounded-md" />
			{/* row 3: countryArea (province), city (district) */}
			<Skeleton className="h-10 w-full rounded-md" />
			<Skeleton className="h-10 w-full rounded-md" />
			{/* row 4: streetAddress1 - full width */}
			<Skeleton className="col-span-1 h-10 w-full rounded-md md:col-span-2" />
		</div>
	</div>
);
