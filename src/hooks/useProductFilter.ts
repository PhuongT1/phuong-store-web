"use client";

import { useForm, useWatch } from "react-hook-form";
import { type StockAvailability, type ProductFilterInput } from "@/gql/graphql";
import { useAddQueryParams } from "@/lib/hooks";
import { useAttributeValues } from "@/hooks/useAttributeValues";

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
			...(data.stockAvailability ? { stockAvailability: data.stockAvailability } : {}),
			...(hasGte || hasLte
				? { minimalPrice: { gte: hasGte ? gte : undefined, lte: hasLte ? lte : undefined } }
				: {}),
			...(data.brand.length > 0 ? { brand: data.brand } : {}),
			...(data.size.length > 0 ? { size: data.size } : {}),
			...(data.color.length > 0 ? { color: data.color } : {}),
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
