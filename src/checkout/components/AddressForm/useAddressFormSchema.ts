import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import { type AddressField } from "@/checkout/components/AddressForm/types";
import {
	addressFieldMessages,
	useAddressFormUtils
} from "@/checkout/components/AddressForm/useAddressFormUtils";
import { type CountryCode } from "@/checkout/graphql";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";

/** Fields that must be filled for VN addresses */
const VN_REQUIRED_FIELDS: AddressField[] = ["countryArea", "city"];

export const useAddressFormSchema = (initialCountryCode?: CountryCode) => {
	const { errorMessages } = useErrorMessages();
	const [countryCode, setCountryCode] = useState(initialCountryCode);
	const { allowedFields, requiredFields } = useAddressFormUtils(countryCode!);

	const isFieldRequired = useCallback(
		(field: AddressField) => {
			if (requiredFields.includes(field)) return true;
			if (countryCode === "VN" && VN_REQUIRED_FIELDS.includes(field)) return true;
			return false;
		},
		[requiredFields, countryCode]
	);

	const getFieldValidator = useCallback(
		(field: AddressField) => {
			if (field === "countryCode") {
				return z.string().min(1, errorMessages.required);
			}

			if (!isFieldRequired(field)) {
				return z.string().optional();
			}

			// Select fields use "Vui lòng chọn", text fields use "Vui lòng nhập"
			const isSelectField = field === "countryArea" || field === "city";
			const prefix = isSelectField ? errorMessages.requiredSelect : errorMessages.required;
			return z.string().min(1, `${prefix} ${addressFieldMessages[field]}`);
		},
		[errorMessages.required, errorMessages.requiredSelect, isFieldRequired]
	);

	const validationSchema = useMemo(() => {
		const shape = {} as Record<AddressField, z.ZodTypeAny>;

		for (const field of allowedFields ?? []) {
			shape[field] = getFieldValidator(field);
		}

		return z.object(shape);
	}, [allowedFields, getFieldValidator]);

	return { validationSchema, setCountryCode };
};
