import { NavigationLinks } from "./NavigationLinks";
import { type MenuGetBySlugQuery } from "@/gql/graphql";
import { type Channel } from "@/types";

type NavLinksProps = {
	navLinks: MenuGetBySlugQuery;
} & Channel;

export const NavLinks = async ({ navLinks }: NavLinksProps) => {
	return <NavigationLinks navLinks={navLinks} />;
};
