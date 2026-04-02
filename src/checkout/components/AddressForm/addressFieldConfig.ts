import { type LucideIcon, Phone, User, MapPin, Building, Mail, Home, type LucideProps } from "lucide-react";
import { type CountryCode } from "@/gql/graphql";
import { useAddressFormUtils } from "./useAddressFormUtils";

type AddressFieldType = keyof typeof addressFieldTypes;
type AddressFieldConfig = ReturnType<typeof useAddressFieldConfigs>[number];
type IconPosition = "prefix" | "suffix";
type FieldIconConfig = {
	icon: LucideIcon;
	position: IconPosition;
} & LucideProps;
type FieldIconMap = Record<string, FieldIconConfig[]>;

const addressFieldTypes = {
	input: [],
	inputNumber: ["phone"],
	select: ["countryArea", "city", "countryCode"],
	checkbox: [],
	ignore: ["companyName", "streetAddress2", "postalCode"]
};

const fieldIconMap: FieldIconMap = {
	firstName: [{ icon: User, position: "prefix", size: 14 }],
	lastName: [{ icon: User, position: "prefix", size: 14 }],
	phone: [{ icon: Phone, position: "prefix", size: 14 }],
	streetAddress1: [{ icon: MapPin, position: "prefix", size: 14 }],
	streetAddress2: [{ icon: Home, position: "prefix", size: 14 }],
	city: [{ icon: Building, position: "prefix", size: 14 }],
	postalCode: [{ icon: Mail, position: "prefix", size: 14 }],
	companyName: [{ icon: Building, position: "prefix", size: 14 }]
};

type FieldNamesConfig = {
	[K in string]?: { label: string; value: string };
};

const fieldNameskey: FieldNamesConfig = {
	countryArea: {
		label: "province_name",
		value: "province_name"
	},
	city: {
		label: "district_name",
		value: "district_name"
	}
};
const countryCodeList = [
	{ label: "Việt Nam", value: "VN" },
	{ label: "Singapore", value: "SG" }
];

// lookup map for typeField
const fieldTypeMap = Object.entries(addressFieldTypes).reduce(
	(acc, [type, fields]) => {
		(fields as readonly string[]).forEach((f) => {
			acc[f] = type as AddressFieldType;
		});
		return acc;
	},
	{} as Record<string, AddressFieldType>
);

const useAddressFieldConfigs = (countryCode: CountryCode) => {
	const { orderedAddressFields, getFieldLabel, isRequiredField } = useAddressFormUtils(countryCode);

	return orderedAddressFields?.map((field) => {
		const icons = fieldIconMap[field] || [];
		const prefix = icons.filter((i) => i.position === "prefix");
		const suffix = icons.filter((i) => i.position === "suffix");
		const type = fieldTypeMap[field] || "input";

		return {
			field,
			isRequired: isRequiredField(field),
			placeholder: getFieldLabel(field),
			type,
			prefix,
			suffix,
			fieldNames: type === "select" ? fieldNameskey[field] : undefined
		};
	});
};

const useLocalOptions = <T>(options: T[]) => {
	return {
		data: options,
		isValidating: false
	};
};

export {
	countryCodeList,
	useAddressFieldConfigs,
	useLocalOptions,
	type AddressFieldConfig,
	type FieldIconConfig
};
