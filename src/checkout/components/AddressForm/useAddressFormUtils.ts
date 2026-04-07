"use client";

import { useCallback, useMemo } from "react";
import camelCase from "lodash-es/camelCase";
import useSWR from "swr";
import { type OptionalAddress, type AddressField } from "@/checkout/components/AddressForm/types";
import { getOrderedAddressFields } from "@/checkout/components/AddressForm/utils";
import { defaultCountry } from "@/checkout/lib/consts/countries";
import {
	type CountryCode,
	AddressValidationRulesDocument,
	type AddressValidationRulesQuery,
	type ValidationRulesFragment
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api";
import { getDistricts, getProvinces } from "@services/address.service";

export type AddressFieldLabel = Exclude<AddressField, "countryCode"> | "country";
export const addressFieldMessages: Record<AddressFieldLabel, string> = {
	city: "Quận/Huyện",
	firstName: "Họ",
	countryArea: "Tỉnh/Thành phố",
	lastName: "Tên",
	country: "Quốc gia",
	cityArea: "Phường/Xã",
	postalCode: "Mã bưu điện",
	companyName: "Công ty",
	streetAddress1: "Số nhà, tên đường, phường",
	streetAddress2: "Địa chỉ bổ sung",
	phone: "Số điện thoại"
};

export type LocalizedAddressFieldLabel =
	| "province"
	| "district"
	| "state"
	| "zip"
	| "postal"
	| "postTown"
	| "prefecture";
export const localizedAddressFieldMessages: Record<LocalizedAddressFieldLabel, string> = {
	province: "Tỉnh/Thành phố",
	district: "Quận/Huyện",
	state: "State",
	zip: "Zip code",
	postal: "Mã bưu điện",
	postTown: "Post town",
	prefecture: "Prefecture"
};

export const useAddressFormUtils = (countryCode: CountryCode) => {
	const { data, isLoading } = useSWR(countryCode ? ["addressValidationRules", countryCode] : null, async () =>
		executeGraphQL(AddressValidationRulesDocument, { variables: { countryCode } })
	);

	const requiredFields = data?.addressValidationRules?.requiredFields ?? [];
	const allowedFields = data?.addressValidationRules?.allowedFields ?? [];
	const addField = ["firstName", "lastName", "phone", "countryCode"];

	const validationRules = {
		...data?.addressValidationRules,
		requiredFields: [...requiredFields, ...addField],
		allowedFields: [...allowedFields, ...addField]
	} as ValidationRulesFragment;

	const { countryAreaType, postalCodeType, cityType } = validationRules || {};

	const localizedFields = useMemo(
		() => ({
			countryArea: countryAreaType,
			city: cityType,
			postalCode: postalCodeType
		}),
		[cityType, countryAreaType, postalCodeType]
	);

	const isRequiredField = useCallback(
		(field: AddressField) => validationRules?.requiredFields.includes(field),
		[validationRules?.requiredFields]
	);

	const getMissingFieldsFromAddress = useCallback(
		(address: OptionalAddress) => {
			if (!address) {
				return [];
			}

			return Object.entries(address).reduce((result, [fieldName, fieldValue]) => {
				if (!isRequiredField(fieldName as AddressField)) {
					return result;
				}

				return !!fieldValue ? result : ([...result, fieldName] as AddressField[]);
			}, [] as AddressField[]);
		},
		[isRequiredField]
	);

	const getLocalizedFieldLabel = useCallback((field: AddressField, localizedField?: string) => {
		try {
			const translatedLabel =
				localizedAddressFieldMessages[camelCase(localizedField) as LocalizedAddressFieldLabel];
			return translatedLabel;
		} catch (e) {
			console.warn(`Missing translation: ${localizedField}`);
			return addressFieldMessages[camelCase(field) as AddressFieldLabel];
		}
	}, []);

	const getFieldLabel = useCallback(
		(field: AddressField) => {
			const localizedField = localizedFields[field as keyof typeof localizedFields];

			const isLocalizedField = !!localizedField && localizedField !== field;

			if (isLocalizedField) {
				return getLocalizedFieldLabel(
					field,
					localizedFields[field as keyof typeof localizedFields] as LocalizedAddressFieldLabel
				);
			}

			return addressFieldMessages[field as AddressFieldLabel];
		},
		[getLocalizedFieldLabel, localizedFields]
	);

	const orderedAddressFields = getOrderedAddressFields(validationRules?.allowedFields as AddressField[]);

	return {
		orderedAddressFields,
		isLoading,
		getFieldLabel,
		isRequiredField,
		getMissingFieldsFromAddress,
		getProvinces,
		getDistricts,
		...validationRules,
		allowedFields: validationRules?.allowedFields as AddressField[] | undefined
	};
};
