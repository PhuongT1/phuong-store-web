import React, { type FC, type PropsWithChildren, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { type AddressFormData } from "@/checkout/components/AddressForm/types";
import { FormCombobox } from "@/components/ui/combobox/FormCombobox";
import { type CountryCode } from "@/gql/graphql";
import { type Option } from "@/types";
import { Typography } from "@components/ui";
import { FormInput } from "@components/ui/input/FormInput";
import { useDistricts, useProvinces } from "@hooks/customer";
import {
	countryCodeList,
	useAddressFieldConfigs,
	useLocalOptions,
	type AddressFieldConfig
} from "./addressFieldConfig";
import { renderIcons } from "./fieldIcons";

export interface AddressFormProps {
	title?: string;
	availableCountries?: CountryCode[];
}

export const AddressForm: FC<PropsWithChildren<AddressFormProps>> = ({ title, children }) => {
	const {
		watch,
		control,
		setValue,
		trigger,
		formState: { dirtyFields }
	} = useFormContext<AddressFormData>();
	const values = watch();
	const countryArea = useProvinces();

	const getProvinceId = useMemo(() => {
		const provinces = countryArea.data;
		if (!provinces || !values.countryArea) return undefined;

		return provinces.find(
			(province) =>
				province.province_name.toLowerCase() === values.countryArea.toLowerCase() ||
				province.province_id === values.countryArea
		)?.province_id;
	}, [values.countryArea, countryArea.data]);

	const fieldHooks = {
		countryArea,
		city: useDistricts({ countryArea: getProvinceId }),
		countryCode: useLocalOptions(countryCodeList)
	};

	useEffect(() => {
		if (values.countryArea && dirtyFields.countryArea) {
			void setValue("city", "");
			void trigger("city");
		}
	}, [values.countryArea, dirtyFields.countryArea, setValue, trigger]);

	const renderField = ({
		field,
		prefix,
		suffix,
		type,
		isRequired,
		placeholder,
		fieldNames
	}: AddressFieldConfig) => {
		const prefixIcon = renderIcons(prefix);
		const suffixIcon = renderIcons(suffix);
		const icon = { prefix: prefixIcon, suffix: suffixIcon };
		const hook = fieldHooks[field as keyof typeof fieldHooks];

		const formControl = {
			control,
			name: field
		};

		switch (type) {
			case "input":
				return (
					<FormInput
						key={field}
						{...formControl}
						type="text"
						inputProps={{
							placeholder,
							required: isRequired
						}}
						affixWrapperProps={{
							allowClear: true,
							...icon
						}}
					/>
				);

			case "inputNumber":
				return (
					<FormInput
						key={field}
						{...formControl}
						type="number"
						inputProps={{
							placeholder,
							required: isRequired
						}}
						affixWrapperProps={{
							allowClear: true,
							...icon
						}}
					/>
				);

			case "select":
				return (
					<FormCombobox
						key={field}
						allowClear
						{...formControl}
						placeholder={placeholder}
						fieldNames={fieldNames}
						options={(hook?.data || []) as Option[]}
						isLoading={hook?.isValidating}
					/>
				);

			case "checkbox":
				return null;
			case "ignore":
				return null;
			default:
				return null;
		}
	};

	const fieldConfigs = useAddressFieldConfigs(values.countryCode);

	const fieldSkeleton = (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className="bg-muted min-h-11 h-11 w-full animate-pulse rounded-xl" />
			))}
		</div>
	);

	return (
		<div className="flex flex-col gap-4">
			{title && <Typography variant="title">{title}</Typography>}
			{fieldConfigs.isLoading ? (
				fieldSkeleton
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{fieldConfigs.fields.map((field) => renderField(field))}
				</div>
			)}
			{children && <div className="border-border mt-2 border-t pt-4">{children}</div>}
		</div>
	);
};
