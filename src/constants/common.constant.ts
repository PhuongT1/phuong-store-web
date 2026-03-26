import { LanguageCodeEnum, OrderDirection, type ProductOrder, ProductOrderField } from "@/gql/graphql";

const REVALIDATE_TIME = 10;
const LOCATE = "vi-VN";
const COUNTRY_CODE_DEFAULT = "VN";
const LANGUAGE_CODE_DEFAULT = LanguageCodeEnum.ViVn;

const CLASS_INPUT =
	"flex h-10 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:border-neutral-700 focus:outline-none focus:ring focus:ring-neutral-100 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50";
const CLASS_HOVER_ICON =
	"flex items-center gap-1 rounded-full p-2 transition-all duration-200 hover:bg-accent hover:text-foreground active:scale-95 shadow-none";
const NONE_SHADOW_MOBILE = "border-0 shadow-none lg:border-[1px] lg:shadow";
const CLASS_BG_HEADER = "bg-header text-foreground";
const PRODUCTS_PER_PAGE = 8;

const PRODUCT_SORT_BY_DEFAULT: ProductOrder = {
	field: ProductOrderField.PublicationDate,
	direction: OrderDirection.Desc
};

export {
	CLASS_INPUT,
	LOCATE,
	COUNTRY_CODE_DEFAULT,
	LANGUAGE_CODE_DEFAULT,
	CLASS_HOVER_ICON,
	NONE_SHADOW_MOBILE,
	CLASS_BG_HEADER,
	REVALIDATE_TIME,
	PRODUCT_SORT_BY_DEFAULT,
	PRODUCTS_PER_PAGE
};
