"use client";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger
} from "@components/ui";
import { NavLink, getObjTypeMenu, renderMenu, NavLinkItem } from "../nav/components/NavLink";
import { type MenuGetBySlugQuery } from "@/gql/graphql";
import { type MenuItemSlugQuery } from "@/types";
import { ALL_PRODUCTS_SLUG } from "@/constants";

export type NavigationMenuProps = { navLinks: MenuGetBySlugQuery };

const MenuSwiper = ({ navLinks }: NavigationMenuProps) => {
	const hasChildren = (item: MenuItemSlugQuery) => Number(item?.children?.length) === 0;

	return (
		<NavigationMenu className="w-full">
			<NavigationMenuList hasIndicator={false} className="flex flex-nowrap gap-6 pb-2">
				{/* Static home link — always pinned first */}
				<NavigationMenuItem>
					<NavLink href="/">Trang chủ</NavLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavLink href={ALL_PRODUCTS_SLUG}>Tất cả sản phẩm</NavLink>
				</NavigationMenuItem>

				{navLinks.menu?.items?.map((item, _index) => (
					<NavigationMenuItem
						key={item.id}
						value={_index == 1 ? "1" : ""}
						className="flex shrink-0 items-center"
					>
						{hasChildren(item) ? (
							<NavLink href={getObjTypeMenu(item).href}>{renderMenu(item)}</NavLink>
						) : (
							<NavigationMenuTrigger defaultValue={"1"}>
								{renderMenu(item)}
								<NavigationMenuContent>
									<ul className="min-w-[200px] flex-col gap-2 p-3">
										{item.children?.map((children) => (
											<NavLinkItem key={children.id} href={getObjTypeMenu(children)?.href}>
												{renderMenu(children)}
											</NavLinkItem>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuTrigger>
						)}
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
};

export { MenuSwiper };
