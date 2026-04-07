"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, FormProvider, FormInput } from "@ui";
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
	const { setParams } = useAddQueryParams();
	const { getParam } = useAddQueryParams();

	const searchContent = getParam("filter_search");

	const onSubmit = (formData: SearchProduct) => {
		const { search } = formData;
		let url = `/${encodeURIComponent(channel)}${ALL_PRODUCTS_SLUG}`;

		if (pathname === url) {
			return setParams({
				filters: {
					search: search
				}
			});
		}

		if (search && search.length > 0) {
			url = `${url}?filter_search=${encodeURIComponent(search)}`;
		}
		router.push(url);
	};

	const methods = useForm<SearchProduct>({
		defaultValues: {
			search: searchContent ?? ""
		}
	});
	const [isFocused, setFocused] = useState(false);
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
	const query = useWatch({ control: methods.control, name: "search" }) ?? "";

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query.trim());
		}, 300);

		return () => clearTimeout(handler);
	}, [query]);

	return (
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
				wrapFieldProps={{
					className: "flex-1"
				}}
				inputProps={{
					placeholder: t("searchPlaceholder"),
					sizeVariant: "medium",
					onFocus: () => {
						if (blurTimeout.current) clearTimeout(blurTimeout.current);
						setFocused(true);
					},
					onBlur: () => {
						blurTimeout.current = setTimeout(() => setFocused(false), 150);
					}
				}}
			/>
			{isFocused && debouncedQuery.length > 0 && <SearchSuggestionsPanel query={debouncedQuery} />}
		</FormProvider>
	);
};
