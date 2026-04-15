"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

/**
 * Radix UI Accordion — SSR-safe wrapper.
 *
 * Root cause of hydration mismatch:
 * Radix generates internal IDs (aria-controls / aria-labelledby) using an
 * internal counter that resets between SSR and the client hydration pass,
 * producing different values → React hydration error.
 *
 * Fix: add `suppressHydrationWarning` on every Radix element that receives
 * auto-generated `id`, `aria-controls`, or `aria-labelledby` attributes:
 *   - AccordionPrimitive.Trigger  (gets aria-controls="radix-…")
 *   - AccordionPrimitive.Content  (gets id="radix-…")
 *
 * This tells React to skip the attribute diff for those nodes during hydration
 * without disabling hydration for their *children*.
 */

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
		isHiddenIcon?: boolean;
		/** Renders OUTSIDE the trigger <button> (valid HTML) — use for clear/action buttons */
		action?: React.ReactNode;
	}
>(({ className, children, isHiddenIcon = false, action, ...props }, ref) => (
	/**
	 * AccordionPrimitive.Header receives data-state="open|closed" from Radix.
	 * We set `className="group"` so children can use `group-data-[state=open]:*`.
	 * The chevron and action slot are siblings of <Trigger>, NOT children,
	 * so there is no invalid <button>→<button> nesting.
	 */
	<AccordionPrimitive.Header className="group flex items-center">
		<AccordionPrimitive.Trigger
			ref={ref}
			// suppressHydrationWarning: Radix sets aria-controls with a mismatched
			// SSR/client ID — suppress just this attribute diff, children are fine.
			suppressHydrationWarning
			className={cn(
				"flex flex-1 items-center justify-between gap-2 py-3 text-left text-sm font-medium transition-all hover:no-underline",
				className
			)}
			{...props}
		>
			<span className="min-w-0 flex-1">{children}</span>
			{!isHiddenIcon && (
				<ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
			)}
		</AccordionPrimitive.Trigger>
		{/* action slot — sibling of <button>, never a child (valid HTML) */}
		{action}
	</AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		// suppressHydrationWarning: Radix sets id="radix-…" which differs between
		// SSR and client hydration due to counter reset — suppress just this node.
		suppressHydrationWarning
		className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
		{...props}
	>
		<div className={cn("pb-4 pt-0", className)}>{children}</div>
	</AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
