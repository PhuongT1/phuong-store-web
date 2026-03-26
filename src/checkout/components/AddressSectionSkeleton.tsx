import React from "react";

import { Skeleton } from "@/checkout/components";

export const AddressSectionSkeleton = () => (
	<div className="py-4">
		<Skeleton variant="title" className="mb-4 w-48" />
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
