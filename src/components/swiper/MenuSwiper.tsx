"use client";

import { useTranslations } from "next-intl";
import { useMenuActive } from "@/components/nav/hooks/useMenuActive";
import { ALL_PRODUCTS_SLUG } from "@/constants";
import { type MenuGetBySlugQuery } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { type MenuItemSlugQuery } from "@/types";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger
} from "@components/ui";
import { NavLink, getObjTypeMenu, renderMenu, NavLinkItem } from "../nav/components/NavLink";

export type NavigationMenuProps = { navLinks: MenuGetBySlugQuery };

const MenuSwiper = ({ navLinks }: NavigationMenuProps) => {
	const t = useTranslations("nav");
	const { isActivePath } = useMenuActive();
	const hasChildren = (item: MenuItemSlugQuery) => Number(item?.children?.length) === 0;

	return (
		<NavigationMenu className="w-full">
			<NavigationMenuList hasIndicator={false} className="flex flex-nowrap gap-6 pb-3">
				{/* Static home link — always pinned first */}
				<NavigationMenuItem>
					<NavLink href="/" isActive={isActivePath("/")}>
						{t("home")}
					</NavLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavLink href={ALL_PRODUCTS_SLUG} isActive={isActivePath(ALL_PRODUCTS_SLUG)}>
						{t("allProducts")}
					</NavLink>
				</NavigationMenuItem>

				{navLinks.menu?.items?.map((item, _index) => {
					const parentHref = getObjTypeMenu(item).href;
					const childHrefs = item.children?.map((c) => getObjTypeMenu(c).href) ?? [];
					const isLeaf = hasChildren(item);
					const isParentActive = !isLeaf && childHrefs.some(isActivePath);

					return (
						<NavigationMenuItem key={item.id} className="flex shrink-0 items-center">
							{isLeaf ? (
								<NavLink href={parentHref} isActive={isActivePath(parentHref)}>
									{renderMenu(item)}
								</NavLink>
							) : (
								<>
									<NavigationMenuTrigger
										className={cn(isParentActive && "border-nav-active text-nav-active border-b-[2px]")}
									>
										{renderMenu(item)}
									</NavigationMenuTrigger>
									<NavigationMenuContent>
										<ul className="flex min-w-[200px] flex-col gap-1.5 p-2.5">
											{item.children?.map((child) => {
												const childHref = getObjTypeMenu(child).href;
												return (
													<NavLinkItem key={child.id} href={childHref} isActive={isActivePath(childHref)}>
														{renderMenu(child)}
													</NavLinkItem>
												);
											})}
										</ul>
									</NavigationMenuContent>
								</>
							)}
						</NavigationMenuItem>
					);
				})}
			</NavigationMenuList>
		</NavigationMenu>
	);
};

export { MenuSwiper };
