"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type InputMaybe, type ProductFilterInput, type ProductOrder } from "@/gql/graphql";
import { parseParams } from "../utils/url";

const QUERY_PARAMS_CHANGE_EVENT = "app:search-params-change";

const useAddQueryParams = () => {
        const searchParams = useSearchParams();
        const pathname = usePathname();
        const router = useRouter();
        const [immediateSearch, setImmediateSearch] = useState(() => searchParams?.toString() ?? "");

        useEffect(() => {
                const nextValue = searchParams?.toString() ?? "";
                setImmediateSearch((current) => (current === nextValue ? current : nextValue));
        }, [searchParams]);

        useEffect(() => {
                const syncFromLocation = () => {
                        const nextValue = window.location.search.slice(1);
                        setImmediateSearch((current) => (current === nextValue ? current : nextValue));
                };

                window.addEventListener("popstate", syncFromLocation);
                window.addEventListener(QUERY_PARAMS_CHANGE_EVENT, syncFromLocation);
                return () => {
                        window.removeEventListener("popstate", syncFromLocation);
                        window.removeEventListener(QUERY_PARAMS_CHANGE_EVENT, syncFromLocation);
                };
        }, []);

        const queryParams = useMemo(() => {
                const params: Record<string, string> = {};
                new URLSearchParams(immediateSearch).forEach((value, key) => {
                        params[key] = value;
                });
                return params;
        }, [immediateSearch]);

        const getQueryParams = () => {
                return queryParams;
        };

        const setParams = ({
                filters,
                sortBy
        }: {
                filters?: InputMaybe<ProductFilterInput>;
                sortBy?: InputMaybe<ProductOrder>;
        }) => {
                const params = new URLSearchParams(immediateSearch);

                const deleteByPrefix = (prefix: string) => {
                        Array.from(params.keys()).forEach((key) => {
                                if (key.startsWith(prefix)) {
                                        params.delete(key);
                                }
                        });
                };

                if (filters) {
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

                setImmediateSearch(query);
                if (typeof window !== "undefined") {
                        window.history.replaceState(null, "", newUrl);
                        window.dispatchEvent(new Event(QUERY_PARAMS_CHANGE_EVENT));
                }
                router.replace(newUrl, { scroll: false });
        };

        const parseParamUrl = () => {
                const searchStr = immediateSearch;

                const queryObject: Record<string, string | string[]> = {};
                new URLSearchParams(searchStr).forEach((value, key) => {
                        if (queryObject[key]) {
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
                const params = new URLSearchParams(immediateSearch);
                const value = params.get(paramName);
                return value ?? "";
        };

        return { useAddQueryParams, getQueryParams, setParams, parseParamUrl, getParam };
};

export { useAddQueryParams };
