"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { StarIcon } from "@/assets/icons/StarIcon";
import { cn } from "@/lib/utils";
import { type SvgComponentProps } from "@/types";

type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
	indicatorclassName?: string;
};

type RatingProgressProps = {
	progress?: React.ComponentPropsWithoutRef<typeof Progress>;
	icon?: SvgComponentProps;
	numberStart?: number;
};

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
	({ className, value, indicatorclassName, ...props }, ref) => (
		<ProgressPrimitive.Root
			ref={ref}
			className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorclassName)}
				style={{ transform: `translateX(-${100 - Number(value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	)
);
Progress.displayName = ProgressPrimitive.Root.displayName;

const RatingProgress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, RatingProgressProps>(
	({ progress, icon, numberStart }, ref) => (
		<div className="flex items-center gap-2">
			{numberStart && <span className="w-[10px] text-sm font-medium">{numberStart}</span>}
			<StarIcon {...icon} />
			<Progress {...progress} />
			<span className="w-[60px] text-sm">{progress?.value}%</span>
		</div>
	)
);
RatingProgress.displayName = "RatingProgress";

export { Progress, RatingProgress };
