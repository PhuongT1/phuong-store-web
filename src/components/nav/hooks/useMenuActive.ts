"use client";

import { useParams, usePathname } from "next/navigation";

/**
 * Returns an `isActivePath(href)` function that detects whether a given menu
 * href matches the current route, correctly handling channel-prefixed URLs.
 *
 * Route shape: /{channel}/rest-of-path
 * Menu href shape: /rest-of-path  (e.g. /categories/apparel, /search, /)
 *
 * Active rules:
 *  - Exact match:   /search      → active only on /search
 *  - Prefix match: /categories  → active on /categories and /categories/foo
 *  - Home `/` is always exact match only
 */
export function useMenuActive() {
	const pathname = usePathname();
	const params = useParams<{ channel?: string }>();

	const stripped: string =
		params?.channel && pathname && pathname.startsWith(`/${params.channel}`)
			? pathname.slice(`/${params.channel}`.length) || "/"
			: (pathname ?? "/");

	const isActivePath = (href: string): boolean => {
		if (!href || href === "#") return false;
		if (href === "/") return stripped === "/";
		return stripped === href || stripped.startsWith(`${href}/`);
	};

	return { isActivePath };
}
