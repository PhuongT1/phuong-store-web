import { type LinkWithHref } from "@/components/navigation/LinkWithChannel";
import {
	type CategoryFragment,
	type CollectionFragment,
	type MenuGetBySlugQuery,
	type PageFragment,
} from "@/gql/graphql";

type MenuItems = Extract<MenuGetBySlugQuery["menu"], { __typename?: "Menu" }>["items"];
type MenuItemSlugQuery = NonNullable<MenuItems>[number];

type CategoryType = CategoryFragment & LinkWithHref;

type CollectionType = CollectionFragment & LinkWithHref;

type PageType = PageFragment & LinkWithHref & Pick<CategoryFragment, "name">;

type UrlType = Omit<MenuItemSlugQuery, "children" | "collection" | "category" | "page"> &
	LinkWithHref &
	Pick<CategoryFragment, "name">;

type MenuItemType = CategoryType | CollectionType | PageType | UrlType;

export {
	type MenuItems,
	type MenuItemSlugQuery,
	type CategoryType,
	type CollectionType,
	type PageType,
	type UrlType,
	type MenuItemType,
};
