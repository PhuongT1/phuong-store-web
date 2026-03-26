"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { FormProvider, RadioList } from "@ui";
import { type ProductDetailsQuery } from "@/gql/graphql";
import { getHrefForVariant } from "@/lib/utils";
import { type Pages } from "@/types";

type VariantElement = NonNullable<ProductDetailsQuery["product"]>["variants"];
type VariantElementProps = {
	variants: VariantElement;
} & Pages;

type FormAttributes = Record<string, string>;

const VariantElement = ({ variants, slug, channel }: VariantElementProps) => {
	const router = useRouter();
	const [previousPath, setPreviousPath] = useState<string>("");
	const attributes = variants ? variants[0].attributes : [];
	const methods = useForm<FormAttributes>({
		defaultValues: {} as FormAttributes,
		mode: "onChange"
	});
	const values = (useWatch({ control: methods.control }) ?? {}) as FormAttributes;
	const dirty = methods.formState.isDirty;

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
		if (!dirty) return;
		const matchedVariant = findMatchedVariant(variants, values);
		const newPath = getHrefForVariant({ slug, variantId: matchedVariant?.id, channel });
		if (newPath !== previousPath) {
			setPreviousPath(newPath);
			router.push(newPath, { scroll: false });
		}
	}, [values, variants, previousPath, dirty, channel, router, slug]);

	return (
		<FormProvider methods={methods}>
			<div className="flex flex-col gap-4">
				{variants &&
					attributes.map((item, index) => {
						return (
							<div className="flex items-center gap-2" key={index}>
								<div>{item.attribute.name}</div>
								<RadioList
									className="flex flex-wrap"
									name={item.attribute.id}
									options={item.attribute.choices?.edges.map((choice) => ({
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
										value: choice.node.id
									}))}
									radioItemProps={{
										labelProps: {
											className: "sm:grid-col-1"
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
