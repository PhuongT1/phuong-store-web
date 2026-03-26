import { MenuSwiper } from "@components/swiper/MenuSwiper";
import { type MenuGetBySlugQuery } from "@/gql/graphql";

export type NavigationMenuProps = { navLinks: MenuGetBySlugQuery };

export function NavigationLinks({ navLinks }: NavigationMenuProps) {
	return <MenuSwiper navLinks={navLinks} />;
}
