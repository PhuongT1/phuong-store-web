import { Image as ImageIcon } from "lucide-react";
import React from "react";
import { Skeleton } from "./Skeleton";
import { cn } from "@/lib/utils";
import { type ProductDetailsQuery } from "@/gql/graphql";

type ImageSkeletonProps = {
	skeletonProps?: React.ComponentPropsWithoutRef<typeof Skeleton>;
	imageProps?: React.ComponentPropsWithoutRef<typeof ImageIcon>;
} & ProductDetailsQuery;

const ImageSkeleton = ({ skeletonProps, imageProps }: ImageSkeletonProps) => {
	return (
		<Skeleton
			{...skeletonProps}
			className={cn("flex h-auto items-center justify-center rounded-none", skeletonProps?.className)}
		>
			<ImageIcon
				size={120}
				strokeWidth={0.3}
				{...imageProps}
				className={cn("fill-neutral-300 stroke-gray-200", imageProps?.className)}
			/>
		</Skeleton>
	);
};
ImageSkeleton.displayName = "ImageSkeleton";

export { ImageSkeleton };
