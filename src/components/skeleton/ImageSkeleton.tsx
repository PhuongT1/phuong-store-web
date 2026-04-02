import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { type ProductDetailsQuery } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";

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
				className={cn("fill-muted-foreground/30 stroke-border", imageProps?.className)}
			/>
		</Skeleton>
	);
};
ImageSkeleton.displayName = "ImageSkeleton";

export { ImageSkeleton };
