"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, FormProvider, FormInput, Popover, PopoverAnchor, PopoverContent } from "@ui";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { SearchSuggestionsPanel } from "@/components/search";
import { ALL_PRODUCTS_SLUG } from "@/constants";
import { useAddQueryParams } from "@/lib/hooks";

type SearchProduct = {
	search?: string;
};

export const SearchBar = ({ channel }: { channel: string }) => {
	const t = useTranslations("nav");
	const router = useRouter();
	const pathname = usePathname();
	const { setParams, getParam } = useAddQueryParams();

	const methods = useForm<SearchProduct>({
		defaultValues: { search: getParam("filter_search") ?? "" }
	});

	const [isFocused, setFocused] = useState(false);
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const query = useWatch({ control: methods.control, name: "search" }) ?? "";

	const isOpen = isFocused && debouncedQuery.length > 0;

	const onSubmit = (formData: SearchProduct) => {
		setFocused(false);
		const { search } = formData;
		let url = `/${encodeURIComponent(channel)}${ALL_PRODUCTS_SLUG}`;
		if (pathname === url) return setParams({ filters: { search } });
		if (search && search.length > 0) url = `${url}?filter_search=${encodeURIComponent(search)}`;
		router.push(url);
	};

	const handleNavigate = (search: string) => {
		const url = `/${encodeURIComponent(channel)}${ALL_PRODUCTS_SLUG}`;
		if (pathname === url) return setParams({ filters: { search } });
		router.push(`${url}?filter_search=${encodeURIComponent(search)}`);
	};

	// Debounce
	useEffect(() => {
		const id = setTimeout(() => setDebouncedQuery(query.trim()), 300);
		return () => clearTimeout(id);
	}, [query]);

	// Prefetch search results page while user types — eliminates "View all" delay
	useEffect(() => {
		if (debouncedQuery.length > 0) {
			router.prefetch(
				`/${encodeURIComponent(channel)}${ALL_PRODUCTS_SLUG}?filter_search=${encodeURIComponent(debouncedQuery)}`
			);
		}
	}, [debouncedQuery, channel, router]);

	// Close on route change (Link navigation inside panel)
	useEffect(() => {
		setFocused(false);
	}, [pathname]);

	return (
		<Popover open={isOpen} onOpenChange={(open) => !open && setFocused(false)}>
			<PopoverAnchor asChild>
				<div className="w-full">
					<FormProvider
						methods={methods}
						formProps={{
							onSubmit: methods.handleSubmit(onSubmit),
							className: "group text-foreground relative flex w-full items-center text-sm"
						}}
					>
						<FormInput
							name="search"
							control={methods.control}
							affixWrapperProps={{
								allowClear: true,
								suffix: (
									<Button
										variant={"icon"}
										size={"icon"}
										type="submit"
										className="text-foreground mr-1 transition-colors"
									>
										<span className="sr-only">search</span>
										<SearchIcon aria-hidden className="h-5 w-5" />
									</Button>
								)
							}}
							wrapFieldProps={{ className: "flex-1" }}
							inputProps={{
								placeholder: t("searchPlaceholder"),
								sizeVariant: "medium",
								onFocus: () => setFocused(true)
							}}
						/>
					</FormProvider>
				</div>
			</PopoverAnchor>

			<PopoverContent
				className="surface-overlay data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100 data-[side=bottom]:slide-in-from-top-3 data-[state=closed]:slide-out-to-top-3 rounded-2xl p-0"
				style={{ width: "var(--radix-popover-trigger-width)" }}
				align="start"
				sideOffset={6}
				onOpenAutoFocus={(e) => e.preventDefault()}
				onCloseAutoFocus={(e) => e.preventDefault()}
			>
				<SearchSuggestionsPanel
					query={debouncedQuery}
					channel={channel}
					onClose={() => setFocused(false)}
					onNavigate={handleNavigate}
				/>
			</PopoverContent>
		</Popover>
	);
};
