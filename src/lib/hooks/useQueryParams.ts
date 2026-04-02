"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type InputMaybe, type ProductFilterInput, type ProductOrder } from "@/gql/graphql";
import { parseParams } from "../utils/url";

const useAddQueryParams = () => {
        const searchParams = useSearchParams();
        const pathname = usePathname();
        const router = useRouter();
        const [, startTransition] = useTransition();

        const getQueryParams = () => {
                const params: Record<string, string> = {};
                searchParams?.forEach((value, key) => {
                        params[key] = value;
                });
                return params;
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

                // Update URL bar immediately — no React/Next.js round-trip latency
                if (typeof window !== "undefined") {
                        window.history.replaceState(null, "", newUrl);
                }
                // Sync Next.js router state in a non-blocking transition so
                // useSearchParams() consumers re-render without freezing the UI
                startTransition(() => {
                        router.replace(newUrl, { scroll: false });
                });
        };

        const parseParamUrl = () => {
                // Read from window.location.search so this is always in sync with the
                // latest URL even before React's useSearchParams() has re-rendered
                const searchStr =
                        typeof window !== "undefined"
                                ? window.location.search.slice(1)
                                : (searchParams?.toString() ?? "");

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
                const urlsearch =
                        typeof window !== "undefined" ? window.location.search : (searchParams?.toString() ?? "");
                const params = new URLSearchParams(urlsearch);
                const value = params.get(paramName);
                return value ?? "";
        };

        return { useAddQueryParams, getQueryParams, setParams, parseParamUrl, getParam };
};

export { useAddQueryParams };
