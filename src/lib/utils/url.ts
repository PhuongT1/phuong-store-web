import { PRODUCT_SORT_BY_DEFAULT } from "@/constants";
import { type InputMaybe, type ProductFilterInput, type ProductOrder } from "@/gql/graphql";

type FilterValue = string | boolean | string[] | Record<string, string>;
type Filters = Record<string, FilterValue>;
type SortBy = Record<string, string>;

const parseObjToObjString = <T extends Record<string, any>>(variables: T): Record<string, string> => {
	return Object.fromEntries(Object.entries(variables).map(([key, value]) => [key, String(value)]));
};

const getQueryString = <T extends Record<string, any>>(variables: T) =>
	`?${new URLSearchParams(parseObjToObjString(variables)).toString()}`;

const parseParams = (searchParams: Record<string, string | string[]>) => {
	const filters: Filters = {};
	const sortBy: SortBy = {};

	Object.entries(searchParams).forEach(([key, value]) => {
		if (key.startsWith("filter_")) {
			const filterKey = key.replace("filter_", "");

			if (Array.isArray(value)) {
				// Handle arrays
				filters[filterKey] = value;
			} else if (value === "true" || value === "false") {
				// Handle booleans
				filters[filterKey] = value === "true";
			} else if (filterKey.includes("_")) {
				// Handle nested objects
				const [mainKey, subKey] = filterKey.split("_");

				// Initialize the nested object if it doesn't exist yet
				if (!filters[mainKey] || typeof filters[mainKey] !== "object") {
					filters[mainKey] = {};
				}

				// Safely type assert the nested object
				const shouldParseNumber = mainKey === "minimalPrice" || mainKey === "price";
				const numericValue = shouldParseNumber ? Number(value) : NaN;
				(filters[mainKey] as Record<string, unknown>)[subKey] =
					shouldParseNumber && Number.isFinite(numericValue) ? numericValue : value;
			} else if (filterKey === "brand" || filterKey === "size" || filterKey === "color") {
				// Special handling for Saleor's attributes filter
				if (!filters.attributes) {
					filters.attributes = [];
				}
				const values = Array.isArray(value) ? value : value.split(",");
				(filters.attributes as any[]).push({ slug: filterKey, values });
			} else {
				// Handle simple values
				filters[filterKey] = value;
			}
		} else if (key.startsWith("sort_")) {
			// Handle sortBy parameters
			const sortKey = key.replace("sort_", "");
			sortBy[sortKey] = value as string;
		}
	});

	return {
		filter: (Object.keys(filters).length > 0 ? filters : null) as InputMaybe<ProductFilterInput>,
		sortBy: { ...PRODUCT_SORT_BY_DEFAULT, ...sortBy } as InputMaybe<ProductOrder>
	};
};

export { parseObjToObjString, getQueryString, parseParams };
