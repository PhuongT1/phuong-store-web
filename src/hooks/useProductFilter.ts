"use client";

import { useForm, useWatch } from "react-hook-form";
import { type StockAvailability, type ProductFilterInput } from "@/gql/graphql";
import { useAttributeValues } from "@/hooks/useAttributeValues";
import { useAddQueryParams } from "@/lib/hooks";

/** Clean form state — avoids InputMaybe/null so RHF paths resolve without casts */
export type ProductFilterForm = {
	tempPrice: string;
	brand: string[];
	size: string[];
	color: string[];
	minimalPrice: { gte?: number; lte?: number };
	stockAvailability?: StockAvailability;
};

/**
 * Extended payload type: `brand`, `size`, `color` are intentional extra fields
 * that the URL serializer (useAddQueryParams) stores as `filter_brand=…` etc.
 * and `parseParams` reconstructs back into `attributes[{slug, values}]`.
 */
type FilterPayload = ProductFilterInput & {
	brand?: string[];
	size?: string[];
	color?: string[];
};

const EMPTY_FILTER: ProductFilterForm = {
	tempPrice: "",
	brand: [],
	size: [],
	color: [],
	minimalPrice: { gte: undefined, lte: undefined },
	stockAvailability: undefined,
};

const useProductFilter = () => {
	const { setParams, parseParamUrl, getParam } = useAddQueryParams();
	const { getChoices, isLoading: isAttrLoading } = useAttributeValues(["brand", "size", "color"]);

	const getDefaultValues = (): ProductFilterForm => {
		const { filter } = parseParamUrl();
		if (!filter?.attributes) return EMPTY_FILTER;
		const attrs = filter.attributes as Array<{ slug: string; values: string[] }>;
		const pick = (slug: string) => attrs.find((a) => a.slug === slug)?.values ?? [];
		return { ...EMPTY_FILTER, brand: pick("brand"), size: pick("size"), color: pick("color") };
	};

	const methods = useForm<ProductFilterForm>({ defaultValues: getDefaultValues() });
	const selectedBrands = useWatch({ control: methods.control, name: "brand" });
	const selectedSizes = useWatch({ control: methods.control, name: "size" });
	const selectedColors = useWatch({ control: methods.control, name: "color" });
	const stockAvailability = useWatch({ control: methods.control, name: "stockAvailability" });

	const applyFilter = (data: ProductFilterForm) => {
		const currentSearch = getParam("filter_search");
		const { gte, lte } = data.minimalPrice;
		const hasGte = Number.isFinite(gte) && (gte ?? 0) > 0;
		const hasLte = Number.isFinite(lte) && (lte ?? 0) > 0;

		const payload: FilterPayload = {
			// Always include stockAvailability so setParams can delete the URL param when undefined
			stockAvailability: data.stockAvailability,
			// Always include minimalPrice so empty resets clear the URL params
			minimalPrice: hasGte || hasLte ? { gte: hasGte ? gte : undefined, lte: hasLte ? lte : undefined } : {},
			// Always include arrays — empty array triggers URL param deletion in setParams
			brand: data.brand,
			size: data.size,
			color: data.color,
			...(currentSearch ? { search: currentSearch } : {}),
		};

		// Cast to ProductFilterInput: extra fields (brand/size/color) are handled
		// by the URL serializer at runtime — not part of the GQL schema type.
		setParams({ filters: payload as ProductFilterInput });
	};

	const handleReset = () => {
		methods.reset(EMPTY_FILTER);
		applyFilter(EMPTY_FILTER);
	};

	const submit = methods.handleSubmit(applyFilter);

	return {
		methods,
		submit,
		handleReset,
		isAttrLoading,
		brandOptions: getChoices("brand"),
		sizeOptions: getChoices("size"),
		colorOptions: getChoices("color"),
		selectedBrands,
		selectedSizes,
		selectedColors,
		stockAvailability,
	};
};

export { useProductFilter };
