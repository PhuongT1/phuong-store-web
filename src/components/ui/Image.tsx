"use client";

import Image, { type ImageProps as NextImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { type Image as ImageProps } from "@/gql/graphql";

interface ImageItemProps extends Omit<NextImageProps, "alt">, Pick<ImageProps, "alt"> {
	size?: number;
}

const ImageItem = ({ size = 160, width, height, className, alt, ...rest }: ImageItemProps) => {
	return (
		<Image
			width={width ?? size}
			height={height ?? size}
			className={cn("max-h-full max-w-full object-contain object-center", className)}
			{...rest}
			alt={alt ?? "image"}
		/>
	);
};

export { ImageItem, type ImageItemProps };
