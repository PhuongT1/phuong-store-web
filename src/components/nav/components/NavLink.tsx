"use client";

import React from "react";
import { NavigationMenuLink, navigationMenuTriggerStyle, ImageItem } from "@ui";
import { LinkWithChannel, type LinkWithChannelProps } from "@/components/navigation/LinkWithChannel";
import { cn } from "@/lib/utils";
import { type MenuItemSlugQuery, type MenuItemType } from "@/types";
import { MenuSlug, MenuType } from "@/constants";

export const getObjTypeMenu = (item: MenuItemSlugQuery): MenuItemType => {
	switch (true) {
		case !!item.category:
			return {
				...item.category,
				__typename: "Category",
				href: `/${MenuSlug[MenuType.Category]}/${item.category.slug}`
			};
		case !!item.collection:
			return {
				...item.collection,
				__typename: "Collection",
				href: `/${MenuSlug[MenuType.Collection]}/${item.collection.slug}`
			};
		case !!item.page:
			return {
				...item.page,
				__typename: "Page",
				name: item.page.title,
				href: `/${MenuSlug[MenuType.Page]}/${item.page.slug}`
			};

		default:
			return {
				...item,
				href: item.url || ""
			};
	}
};

export const renderMenu = (item: MenuItemSlugQuery, className?: string) => {
	const menuItem = getObjTypeMenu(item);

	switch (true) {
		case menuItem?.__typename === "Category" || menuItem?.__typename === "Collection":
			return (
				<span className={cn("flex items-center gap-2", className)}>
					{menuItem?.backgroundImage?.url && (
						<ImageItem height={15} width={25} src={menuItem?.backgroundImage?.url} alt={""} />
					)}
					{menuItem?.name}
				</span>
			);

		default:
			return <>{menuItem?.name}</>;
	}
};

export const NavLink = ({
	href,
	children,
	...rest
}: { href: string } & React.ComponentProps<typeof LinkWithChannel>) => {
	return (
		<NavigationMenuLink asChild>
			<LinkWithChannel
				{...rest}
				href={href}
				className={cn(
					"inline-flex w-max items-center justify-center text-current transition-colors duration-200",
					"hover:bg-accent hover:text-foreground",
					"select-none disabled:pointer-events-none disabled:opacity-50",
					navigationMenuTriggerStyle()
				)}
			>
				{children}
			</LinkWithChannel>
		</NavigationMenuLink>
	);
};
NavLink.displayName = "NavLink";

export const NavLinkItem = ({ className, title, children, href, ...props }: LinkWithChannelProps) => {
	return (
		<li className="w-full">
			<NavigationMenuLink asChild>
				<LinkWithChannel
					href={href}
					{...props}
					className={cn(
						"hover:bg-accent focus:bg-accent block w-max min-w-full space-y-1 rounded-md p-3 leading-none no-underline transition-all duration-200 outline-none select-none",
						className
					)}
				>
					<p className="text-foreground hover:text-primary focus:text-primary line-clamp-2 text-[15px] leading-snug font-medium">
						{children}
					</p>
				</LinkWithChannel>
			</NavigationMenuLink>
		</li>
	);
};

NavLinkItem.displayName = "NavLinkItem";
