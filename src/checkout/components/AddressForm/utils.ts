import { parsePhoneNumberWithError, ParseError } from "libphonenumber-js";
import { isEqual, omit, pick, reduce, uniq } from "lodash-es";
import { getCountryName } from "@/checkout/lib/utils/locale";
import { COUNTRY_CODE_DEFAULT } from "@/constants";
import {
	type AddressFragment,
	type AddressInput,
	type CheckoutAddressValidationRules,
	type CountryCode,
	type CountryDisplay
} from "@/gql/graphql";
import {
	type OptionalAddress,
	type AddressField,
	type AddressFormData,
	type ApiAddressField
} from "../../components/AddressForm/types";

export const getEmptyAddressFormData = (): AddressFormData => ({
	firstName: "",
	lastName: "",
	streetAddress1: "",
	streetAddress2: "",
	companyName: "",
	city: "",
	cityArea: "",
	countryArea: "",
	postalCode: "",
	phone: "",
	// countryCode: "US",
	countryCode: COUNTRY_CODE_DEFAULT
});

export const getEmptyAddress = (): AddressFragment => {
	const { countryCode, ...emptyAddressRest } = getEmptyAddressFormData();

	return {
		...emptyAddressRest,
		id: "",
		country: {
			code: countryCode,
			country: getCountryName(countryCode)
		}
	};
};

export const ADDRESS_FIELD_KEYS = [
	"city",
	"firstName",
	"lastName",
	"countryArea",
	"cityArea",
	"postalCode",
	"companyName",
	"streetAddress1",
	"streetAddress2",
	"phone",
	"countryCode"
] as const;

export const getAllAddressFieldKeys = () => ADDRESS_FIELD_KEYS as unknown as string[];

/**
 * Normalize a phone number to E.164 format using the given country code.
 * Returns undefined when the number is empty or cannot be parsed — callers
 * should omit the field rather than send an invalid value to Saleor.
 */
const normalizePhone = (phone: string | undefined | null, countryCode: string): string | undefined => {
	if (!phone?.trim()) return undefined;
	try {
		return parsePhoneNumberWithError(phone, countryCode as import("libphonenumber-js").CountryCode).format(
			"E.164"
		);
	} catch (e) {
		if (e instanceof ParseError) return undefined;
		throw e;
	}
};

export const getAddressInputData = (
	values: Partial<
		AddressFormData & {
			countryCode?: CountryCode;
			country: CountryDisplay;
		}
	>
): AddressInput => {
	const { countryCode, country, ...rest } = values;

	const input: AddressInput = {};
	const inputRecord = input as Record<string, string | undefined>;
	const restRecord = rest as Record<string, string | undefined>;

	for (const key of ADDRESS_FIELD_KEYS) {
		if (key === "phone") continue;
		if (key in rest) {
			inputRecord[key] = restRecord[key] || "";
		}
	}

	input.country = countryCode || (country?.code as CountryCode);
	const normalizedPhone = normalizePhone(restRecord["phone"], input.country ?? "VN");
	if (normalizedPhone) input.phone = normalizedPhone;

	return input;
};

export const getAddressInputDataFromAddress = (
	address: OptionalAddress | Partial<AddressFragment>
): AddressInput => {
	if (!address) {
		return {};
	}

	const { country, ...rest } = address;

	const input: AddressInput = {};
	const inputRecord = input as Record<string, string | undefined>;
	const restRecord = rest as Record<string, string | undefined>;

	for (const key of ADDRESS_FIELD_KEYS) {
		if (key === "phone") continue;
		if (key in rest) {
			inputRecord[key] = restRecord[key] || "";
		}
	}

	input.country = country?.code as CountryCode;
	const normalizedPhone = normalizePhone(restRecord["phone"], input.country ?? "VN");
	if (normalizedPhone) input.phone = normalizedPhone;

	return input;
};

export const getAddressFormDataFromAddress = (address: OptionalAddress): AddressFormData => {
	if (!address) {
		return {
			...getEmptyAddressFormData(),
			countryCode: COUNTRY_CODE_DEFAULT
		};
	}

	const { country, ...rest } = address;

	const parsedAddressBase = reduce(rest, (result, val, key) => ({ ...result, [key]: val || "" }), {}) as Omit<
		AddressFormData,
		"countryCode"
	>;

	return pick(
		{
			...parsedAddressBase,
			countryCode: country.code as CountryCode
		},
		getAllAddressFieldKeys()
	) as AddressFormData;
};

// checks only for address related data
export const isMatchingAddressData = (
	address?: Partial<AddressFragment> | null,
	addressToMatch?: Partial<AddressFragment> | null
) => {
	if (!address || !addressToMatch) {
		return address === addressToMatch;
	}

	const addressKeys = getAllAddressFieldKeys();
	const matchesFields = isEqual(pick(address, addressKeys), pick(addressToMatch, addressKeys));

	const addressWithCode = address as Partial<AddressFragment> & { countryCode?: CountryCode };
	const matchWithCode = addressToMatch as Partial<AddressFragment> & { countryCode?: CountryCode };
	const countryCode = addressWithCode.country?.code || addressWithCode.countryCode;
	const countryCodeToMatch = matchWithCode.country?.code || matchWithCode.countryCode;

	return matchesFields && countryCode === countryCodeToMatch;
};

export const isMatchingAddressFormData = (
	address?: Partial<AddressFormData> | null,
	addressToMatch?: Partial<AddressFormData> | null
) => {
	const propsToOmit = ["id", "autoSave", "__typename"];

	return isEqual(omit(address, propsToOmit), omit(addressToMatch, propsToOmit));
};

export const getAddressValidationRulesVariables = (
	{ autoSave }: { autoSave: boolean } = { autoSave: false }
): CheckoutAddressValidationRules =>
	autoSave
		? {
				checkRequiredFields: false,
				// Skip validate format fields
				checkFieldsFormat: false
			}
		: {};

export const addressFieldsOrder: AddressField[] = [
	"firstName",
	"lastName",
	"phone",
	"countryCode",
	"companyName",
	"countryArea",
	"cityArea",
	"city",
	"postalCode",
	"streetAddress1",
	"streetAddress2"
];

// api doesn't order the fields but we want to
export const getOrderedAddressFields = (addressFields: AddressField[] = []): AddressField[] => {
	const filteredAddressFields = getFilteredAddressFields(addressFields);

	return addressFieldsOrder.filter((item) => filteredAddressFields.includes(item));
};

export const getFilteredAddressFields = (addressFields: ApiAddressField[]): AddressField[] => {
	const filteredAddressFields = addressFields.filter(
		(addressField: ApiAddressField) => addressField !== "name"
	);

	return uniq([...filteredAddressFields]);
};

// Checks if two address fragments match by their field values (ignores id, __typename)
export const isMatchingAddress = (
	address?: Partial<AddressFragment> | null,
	addressToMatch?: Partial<AddressFragment> | null
): boolean => isMatchingAddressData(address, addressToMatch);

// Returns a predicate for Array.find() to find an address matching the given one
export const getByMatchingAddress =
	(addressToMatch?: Partial<AddressFragment> | null) =>
	(address: Partial<AddressFragment>): boolean =>
		isMatchingAddressData(address, addressToMatch);
