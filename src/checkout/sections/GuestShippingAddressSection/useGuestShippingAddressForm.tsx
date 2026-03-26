import { useForm, type Resolver } from "react-hook-form";
import { useCallback, useEffect, useRef } from "react";
import { omit } from "lodash-es";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckout } from "@hooks/checkout";
import {
	type AddressInput,
	CheckoutBillingAddressUpdateDocument,
	CheckoutShippingAddressUpdateDocument
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import {
	getAddressFormDataFromAddress,
	getAddressInputData,
	getAddressValidationRulesVariables
} from "@/checkout/components/AddressForm/utils";
import { useSetCheckoutFormValidationState } from "@/checkout/hooks/useSetCheckoutFormValidationState";
import { useAddressFormSchema } from "@/checkout/components/AddressForm/useAddressFormSchema";
import { COUNTRY_CODE_DEFAULT } from "@/constants";
import { type AddressFormData } from "@/checkout/components/AddressForm/types";

/** Minimal result shape returned by every onSubmit call */
interface AddressUpdateResult {
	hasErrors: boolean;
	apiErrors: Array<{ field?: string | null; message?: string | null }>;
	graphqlErrors: never[];
	customErrors: Array<{ message: string }>;
}

export const useGuestShippingAddressForm = () => {
	const {
		checkout: { shippingAddress, shippingMethods, id: checkoutId },
		mutate
	} = useCheckout();

	const initialCountry = (shippingAddress?.country?.code ??
		COUNTRY_CODE_DEFAULT) as import("@/checkout/graphql").CountryCode;
	const { validationSchema, setCountryCode } = useAddressFormSchema(initialCountry);
	const { setCheckoutFormValidationState } = useSetCheckoutFormValidationState("shippingAddress");

	const onSubmit = useCallback(
		async (formData: Partial<AddressFormData>): Promise<AddressUpdateResult> => {
			// Guard: checkoutId may be undefined while SWR is still loading
			if (!checkoutId) {
				return { hasErrors: false, apiErrors: [], graphqlErrors: [], customErrors: [] };
			}
			// Cast is safe: both generated AddressInput types are structurally identical
			const addressInput = getAddressInputData(omit(formData, "channel")) as AddressInput;
			try {
				const response = await executeGraphQL(CheckoutShippingAddressUpdateDocument, {
					variables: {
						checkoutId,
						shippingAddress: addressInput,
						validationRules: getAddressValidationRulesVariables({ autoSave: true })
					},
					withAuth: false
				});

				const errors = response?.checkoutShippingAddressUpdate?.errors ?? [];

				if (!errors.length) {
					// Mirror to billing address so COD orders work without a separate billing step
					await executeGraphQL(CheckoutBillingAddressUpdateDocument, {
						variables: {
							checkoutId,
							billingAddress: addressInput,
							validationRules: getAddressValidationRulesVariables({ autoSave: true })
						},
						withAuth: false
					});

					void setCheckoutFormValidationState({
						values: getAddressFormDataFromAddress(
							response?.checkoutShippingAddressUpdate?.checkout?.shippingAddress
						)
						 
					} as any);

					const updatedCheckout = response?.checkoutShippingAddressUpdate?.checkout;
					void (updatedCheckout ? mutate({ checkout: updatedCheckout }, { revalidate: false }) : mutate());
				}

				return { hasErrors: errors.length > 0, apiErrors: errors, graphqlErrors: [], customErrors: [] };
			} catch (err) {
				console.warn("[shipping address update error]", err);
				return {
					hasErrors: true,
					apiErrors: [],
					graphqlErrors: [],
					customErrors: [{ message: "Network Error" }]
				};
			}
		},
		[checkoutId, mutate, setCheckoutFormValidationState]
	);

	const resolver = validationSchema
		? (zodResolver(validationSchema) as Resolver<AddressFormData>)
		: undefined;

	const form = useForm({
		defaultValues: getAddressFormDataFromAddress(shippingAddress),
		resolver,
		mode: "onTouched"
	});

	const { handleSubmit, getValues, reset } = form;

	// Keep the form in sync with server state (SWR may deliver checkout data
	// after component mounts, or the address may be updated by the resync effect).
	// `keepDirtyValues: true` preserves any field the user is actively editing.
	const prevShippingAddressRef = useRef<typeof shippingAddress>(undefined);
	useEffect(() => {
		if (!shippingAddress) return;
		// Use a stable JSON comparison to avoid infinite loops.
		const prevJson = JSON.stringify(prevShippingAddressRef.current);
		const nextJson = JSON.stringify(shippingAddress);
		if (prevJson === nextJson) return;
		prevShippingAddressRef.current = shippingAddress;
		reset(getAddressFormDataFromAddress(shippingAddress), { keepDirtyValues: true });
	}, [shippingAddress]); // eslint-disable-line react-hooks/exhaustive-deps

	// Resync: when SWR delivers a checkout but shippingMethods are empty,
	// re-POST the address so Saleor recalculates available methods.
	// Falls back to the form's current countryCode when Saleor has no saved address yet
	// (e.g. user navigated straight from product detail without ever submitting).
	const lastResynedKeyRef = useRef("");
	useEffect(() => {
		if (!checkoutId) return;
		if (shippingMethods && shippingMethods.length > 0) return;
		// Prefer saved address country; fall back to whatever the form has selected.
		const countryCode = shippingAddress?.country?.code ?? (getValues("countryCode") as string | undefined);
		if (!countryCode) return;
		const key = `${checkoutId}:${countryCode}`;
		if (key === lastResynedKeyRef.current) return;
		lastResynedKeyRef.current = key;
		// Use full saved address when available; otherwise submit current form values
		// (countryCode is enough for Saleor to compute shipping rates with autoSave rules).
		void onSubmit(shippingAddress ? getAddressFormDataFromAddress(shippingAddress) : getValues());
	}, [shippingMethods, shippingAddress, checkoutId]); // eslint-disable-line react-hooks/exhaustive-deps

	const onSubmitData = handleSubmit(() => {
		void onSubmit(getValues());
	});

	return { form, onSubmit, onSubmitData, setSchemaCountryCode: setCountryCode };
};
