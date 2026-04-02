import React, { useEffect, useRef } from "react";
import { FormProvider, useWatch } from "react-hook-form";
import { AddressForm } from "@/checkout/components/AddressForm";
import { useAvailableShippingCountries } from "@/checkout/hooks/useAvailableShippingCountries";
import { useGuestShippingAddressForm } from "@/checkout/sections/address/GuestShippingAddressSection/useGuestShippingAddressForm";
import {
	useCheckoutValidationActions,
	useCheckoutValidationState
} from "@/checkout/state/checkoutValidationStateStore";

export const GuestShippingAddressSection = () => {
	const { availableShippingCountries } = useAvailableShippingCountries();
	const { form, onSubmit, onSubmitData, setSchemaCountryCode } = useGuestShippingAddressForm();
	const {
		formState: { isValid },
		control,
		trigger,
		getValues
	} = form;
	const values = useWatch({ control });
	const countryCode = useWatch({ control, name: "countryCode" });

	const { validationState } = useCheckoutValidationState();
	const { setValidationState } = useCheckoutValidationActions();

	const lastSubmittedJsonRef = useRef("");
	// Start as undefined so on first mount the effect always fires for the default country,
	// ensuring Saleor calculates shippingMethods even when the address is not yet saved.
	const prevCountryRef = useRef<string | undefined>(undefined);

	// Bridge: when PayButton sets validationState to "validating", trigger RHF validation
	useEffect(() => {
		if (validationState.shippingAddress !== "validating") return;
		void trigger().then((valid) => {
			setValidationState("shippingAddress", valid ? "valid" : "invalid");
		});
	}, [validationState.shippingAddress]);  

	// 1. Country change (or first mount) → submit partial address so Saleor
	//    recalculates shippingMethods. checkRequiredFields:false accepts partial data.
	//    Also sync the validation schema to the new country's required fields.
	useEffect(() => {
		if (!countryCode) return;
		if (countryCode === prevCountryRef.current) return;
		prevCountryRef.current = countryCode as string;
		setSchemaCountryCode(countryCode);
		void onSubmit(getValues());
	}, [countryCode]);  

	// 2. Debounced full-form submit when RHF considers the form valid.
	//    Deduplicates via JSON snapshot so unchanged re-renders don't re-fire.
	useEffect(() => {
		if (!isValid) return;
		const json = JSON.stringify(values);
		if (json === lastSubmittedJsonRef.current) return;
		const timeout = setTimeout(() => {
			lastSubmittedJsonRef.current = json;
			void onSubmitData();
		}, 600);
		return () => clearTimeout(timeout);
	}, [isValid, values]);  

	return (
		<FormProvider {...form}>
			<AddressForm availableCountries={availableShippingCountries} />
		</FormProvider>
	);
};
