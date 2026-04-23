"use client";

import { useEffect, useMemo, useRef } from "react";
import { FormProvider, RadioList } from "@ui";
import { useForm, useWatch } from "react-hook-form";
import { type ProductDetailsQuery } from "@/gql/graphql";
import { getHrefForVariant } from "@/lib/utils";
import { type Pages } from "@/types";

type VariantElement = NonNullable<ProductDetailsQuery["product"]>["variants"];
type VariantElementProps = {
	variants: VariantElement;
	selectedVariantID?: string;
	onVariantChange?: (variantId: string) => void;
} & Pages;

type FormAttributes = Record<string, string | undefined>;

const getVariantAttributeValues = (variant?: VariantElement[number]) =>
	Object.fromEntries(
		variant?.attributes.flatMap((attr) => {
			const valueId = attr.values[0]?.id;
			return valueId ? [[attr.attribute.id, valueId]] : [];
		}) ?? []
	) as FormAttributes;

const variantHasAttributeValue = (
	variant: VariantElement[number],
	attributeId: string,
	valueId: string
) =>
	variant.attributes.some(
		(attr) => attr.attribute.id === attributeId && attr.values.some((value) => value.id === valueId)
	);

const variantMatchesSelections = (
	variant: VariantElement[number],
	values: FormAttributes,
	excludedAttributeId?: string
) =>
	Object.entries(values).every(([attributeId, selectedValue]) => {
		if (!selectedValue || attributeId === excludedAttributeId) return true;
		return variantHasAttributeValue(variant, attributeId, selectedValue);
	});

const VariantElement = ({ variants, slug, channel, selectedVariantID, onVariantChange }: VariantElementProps) => {
	const lastSyncedVariantIdRef = useRef<string | undefined>(selectedVariantID);
	const selectedVariant = useMemo(
		() => variants?.find((variant) => variant.id === selectedVariantID),
		[selectedVariantID, variants]
	);
	const defaultValues = useMemo(() => getVariantAttributeValues(selectedVariant), [selectedVariant]);
	const attributes = variants ? variants[0].attributes : [];
	const methods = useForm<FormAttributes>({
		defaultValues,
		mode: "onChange"
	});
	const currentValues = useWatch({ control: methods.control }) as FormAttributes | undefined;
	const selectionValues = currentValues ?? defaultValues;

	const findMatchedVariant = (variants: VariantElement, values: FormAttributes) => {
		return variants?.find((variant) => {
			return variant.attributes.every((attr) => {
				const selectedValue = values[attr.attribute.id];

				// Case 1: If the attribute has no available values (`attr.values.length === 0`),
				// and no selection was made, it's considered valid
				if (attr.values.length === 0) {
					return !selectedValue; // If no value is selected, it's valid
				}

				// Case 2: If a value is selected, check if it matches one of the attribute's values
				if (selectedValue) {
					return attr.values.some((val) => val.id === selectedValue);
				}

				// Case 3: If no value is selected, and the attribute has available values,
				// it's considered an invalid match (we return false here)
				return false;
			});
		});
	};

	useEffect(() => {
		methods.reset(defaultValues);
		lastSyncedVariantIdRef.current = selectedVariantID;
	}, [channel, defaultValues, methods, selectedVariantID, slug]);

	const syncVariantSelection = (variantId: string) => {
		if (variantId === lastSyncedVariantIdRef.current) return;

		lastSyncedVariantIdRef.current = variantId;
		onVariantChange?.(variantId);

		if (typeof window !== "undefined") {
			const newPath = getHrefForVariant({ slug, variantId, channel });
			window.history.replaceState(window.history.state, "", newPath);
		}
	};

	const handleAttributeValueChange = (attributeId: string, valueId: string) => {
		const nextValues = {
			...methods.getValues(),
			[attributeId]: valueId || undefined
		} satisfies FormAttributes;

		const matchedVariant =
			findMatchedVariant(variants, nextValues) ??
			variants.find(
				(variant) =>
					variantHasAttributeValue(variant, attributeId, valueId) &&
					variantMatchesSelections(variant, nextValues, attributeId)
			);

		if (!matchedVariant?.id) return;

		methods.reset(getVariantAttributeValues(matchedVariant));
		syncVariantSelection(matchedVariant.id);
	};

	return (
		<FormProvider methods={methods}>
			<div className="flex flex-col gap-4">
				{variants &&
					attributes.map((item, index) => {
						return (
							<div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6" key={index}>
								<div className="text-sm font-medium mt-3 shrink-0 sm:w-16 text-foreground/80">{item.attribute.name}</div>
								<RadioList
									className="grid grid-cols-4 gap-2 sm:gap-3"
									name={item.attribute.id}
									onValueChange={(value) => handleAttributeValueChange(item.attribute.id, value)}
									options={item.attribute.choices?.edges
										.map((choice) => {
											const matchingVariant = variants.find(
												(variant) =>
													variantHasAttributeValue(variant, item.attribute.id, choice.node.id) &&
													variantMatchesSelections(variant, selectionValues, item.attribute.id)
											);
											const existsInVariants = variants.some((variant) =>
												variantHasAttributeValue(variant, item.attribute.id, choice.node.id)
											);

											if (!existsInVariants) return null;

											return {
												label: (
													<div className="pointer-events-none flex grow flex-col justify-center">
														{choice.node.name}
														{choice.node.value && (
															<span
																style={{ backgroundColor: choice.node.value }}
																className="absolute right-0 bottom-0 h-[10px] w-[20px] rounded-tl-[39px] rounded-br-[25px]"
															></span>
														)}
													</div>
												),
												value: choice.node.id,
												disabled: !matchingVariant
											};
										})
										.filter((choice): choice is NonNullable<typeof choice> => Boolean(choice))}
									radioItemProps={{
										divProps: { className: "!px-3 !py-2 !gap-2 w-full justify-center !rounded-[14px]" },
										labelProps: {
											className: ""
										},
										variant: "border"
									}}
								/>
							</div>
						);
					})}
			</div>
		</FormProvider>
	);
};

export { VariantElement };
