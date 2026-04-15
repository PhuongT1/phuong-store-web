"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toggleVariants = cva(
	cn(
		"inline-flex items-center justify-center gap-2 rounded-full text-[12px] font-semibold tracking-[-0.01em] transition-[background-color,color,border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
		"border border-border/70 bg-card/95 text-muted-foreground hover:bg-accent/70 hover:text-foreground data-[state=on]:border-info/55 data-[state=on]:bg-info/12 data-[state=on]:text-info data-[state=on]:shadow-[inset_0_1px_0_rgba(255,255,255,0.24)] dark:data-[state=on]:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
	),
	{
		variants: {
			variant: {
				default: "bg-transparent",
				outline: "border border-input bg-transparent shadow-sm hover:bg-accent/70 hover:text-accent-foreground"
			},
			size: {
				default: "h-9 px-3 min-w-9",
				sm: "h-8 px-2.5 min-w-8",
				lg: "h-10 px-4 min-w-10"
			}
		},
		defaultVariants: {
			variant: "default",
			size: "default"
		}
	}
);

const Toggle = React.forwardRef<
	React.ElementRef<typeof TogglePrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
	<TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
