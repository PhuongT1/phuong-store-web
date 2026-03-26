"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseParams } from "../utils/url";
import { type InputMaybe, type ProductFilterInput, type ProductOrder } from "@/gql/graphql";

const useAddQueryParams = () => {
	const searchParams = useSearchParams(); // Access the current search parameters
	const pathname = usePathname(); // Access the current pathname
	const router = useRouter();

	const getQueryParams = () => {
		const params: Record<string, string> = {};
		// Use searchParams to populate the object with current query parameters
		searchParams?.forEach((value, key) => {
			params[key] = value;
		});

		return params; // Return all query parameters as an object
	};

	const setParams = ({
		filters,
		sortBy
	}: {
		filters?: InputMaybe<ProductFilterInput>;
		sortBy?: InputMaybe<ProductOrder>;
	}) => {
		const params = new URLSearchParams(searchParams?.toString() ?? "");

		const deleteByPrefix = (prefix: string) => {
			Array.from(params.keys()).forEach((key) => {
				if (key.startsWith(prefix)) {
					params.delete(key);
				}
			});
		};

		if (filters) {
			// Only clear keys we intend to manage in this call.
			Object.keys(filters as Record<string, unknown>).forEach((key) => {
				params.delete(`filter_${key}`);
				deleteByPrefix(`filter_${key}_`);
			});

			Object.entries(filters).forEach(([key, value]) => {
				if (value === undefined || value === null) {
					params.delete(`filter_${key}`);
					deleteByPrefix(`filter_${key}_`);
					return;
				}

				if (Array.isArray(value)) {
					if (value.length === 0) {
						params.delete(`filter_${key}`);
						return;
					}
					params.set(`filter_${key}`, value.join(","));
				} else if (typeof value === "object" && value !== null) {
					deleteByPrefix(`filter_${key}_`);
					Object.entries(value).forEach(([subKey, subValue]) => {
						if (subValue === undefined || subValue === null || subValue === "") {
							params.delete(`filter_${key}_${subKey}`);
							return;
						}
						params.set(`filter_${key}_${subKey}`, String(subValue));
					});
				} else if (typeof value === "boolean") {
					if (!value) {
						params.delete(`filter_${key}`);
						return;
					}
					params.set(`filter_${key}`, value.toString());
				} else if (value !== null) {
					params.set(`filter_${key}`, String(value));
				}
			});
		}
		if (sortBy) {
			Object.keys(sortBy as Record<string, unknown>).forEach((key) => {
				params.delete(`sort_${key}`);
			});
			Object.entries(sortBy).forEach(([key, value]) => {
				if (value !== undefined) {
					params.set(`sort_${key}`, String(value));
				}
			});
		}

		const query = params.toString();
		const newUrl = query ? `${pathname ?? ""}?${query}` : (pathname ?? "/");
		router.replace(newUrl, { scroll: false });
	};

	const parseParamUrl = () => {
		const queryObject: Record<string, string | string[]> = {};
		searchParams?.forEach((value, key) => {
			if (queryObject[key]) {
				// Handle duplicate keys -> convert to an array of strings
				queryObject[key] = Array.isArray(queryObject[key])
					? [...queryObject[key], value]
					: [queryObject[key], value];
			} else {
				queryObject[key] = value;
			}
		});

		return parseParams(queryObject);
	};

	const getParam = (paramName: string) => {
		const urlsearch =
			typeof window !== "undefined" ? window.location.search : (searchParams?.toString() ?? "");

		const params = new URLSearchParams(urlsearch);
		const value = params.get(paramName);
		if (value) {
			return value;
		}

		return "";
	};

	return { useAddQueryParams, getQueryParams, setParams, parseParamUrl, getParam };
};

export { useAddQueryParams };
