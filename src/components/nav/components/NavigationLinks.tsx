import { type MenuGetBySlugQuery } from "@/gql/graphql";
import { MenuSwiper } from "@components/swiper/MenuSwiper";

export type NavigationMenuProps = { navLinks: MenuGetBySlugQuery };

export function NavigationLinks({ navLinks }: NavigationMenuProps) {
	return <MenuSwiper navLinks={navLinks} />;
}
