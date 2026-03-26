export enum MenuType {
	Category = "category",
	Collection = "collection",
	Page = "page",
}

export const MenuSlug = {
	[MenuType.Category]: "categories",
	[MenuType.Collection]: `${MenuType.Collection}s`,
	[MenuType.Page]: `${MenuType.Page}s`,
};
