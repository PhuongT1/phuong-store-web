"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay
		ref={ref}
		className={cn(
			"bg-overlay fixed inset-0 z-50 backdrop-blur-0 transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:duration-300 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:backdrop-blur-[5px]",
			className
		)}
		{...props}
	/>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<DialogPortal>
		<DialogOverlay />
			<DialogPrimitive.Content
				ref={ref}
				className={cn(
					"surface-overlay",
					"transform-gpu will-change-transform",
					"data-[state=open]:animate-in data-[state=closed]:animate-out",
					"data-[state=closed]:duration-200 data-[state=open]:duration-300",
					"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
					"data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2",
					"fixed top-auto right-auto bottom-0 left-[50%] z-50 grid w-full max-w-full translate-x-[-50%] translate-y-0",
					"gap-4 p-6 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
					"rounded-t-[calc(var(--radius)+10px)] rounded-b-none focus:outline-none sm:top-[50%] sm:bottom-auto sm:max-w-lg sm:translate-y-[-50%] sm:rounded-[calc(var(--radius)+4px)]",
					"sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:slide-in-from-bottom-1 sm:data-[state=closed]:slide-out-to-bottom-1",
					"dark:[--input:oklch(1_0_0_/_0.05)]",
					className
				)}
			{...props}
		>
			{children}
			<DialogPrimitive.Close className="text-muted-foreground hover:text-foreground hover:bg-accent/75 focus:ring-ring absolute top-3.5 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
				<Cross2Icon className="h-4 w-4" />
				<span className="sr-only">Close</span>
			</DialogPrimitive.Close>
		</DialogPrimitive.Content>
	</DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
		{...props}
	/>
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn("text-lg leading-none font-semibold tracking-tight", className)}
		{...props}
	/>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn("text-muted-foreground text-sm", className)}
		{...props}
	/>
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
	Dialog,
	DialogPortal,
	DialogOverlay,
	DialogTrigger,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription
};
