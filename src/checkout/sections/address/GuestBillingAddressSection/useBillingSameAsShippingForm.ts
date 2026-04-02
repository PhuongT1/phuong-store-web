 
import { useCallback, useEffect, useRef, useState } from "react";
import { type OptionalAddress } from "@/checkout/components/AddressForm/types";
import {
	getAddressInputDataFromAddress,
	getAddressValidationRulesVariables
	// isMatchingAddress
} from "@/checkout/components/AddressForm/utils";
import { useForm } from "@/checkout/hooks/useForm";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import { type MightNotExist } from "@/checkout/lib/globalTypes";
import { useMutation } from "@/checkout/lib/useMutation";
import { useCheckoutUpdateStateActions } from "@/checkout/state/updateStateStore";
import { type AddressFragment, type CheckoutBillingAddressUpdateMutation, type CheckoutBillingAddressUpdateMutationVariables, CheckoutBillingAddressUpdateDocument } from "@/gql/graphql";
import { useCheckout } from "@hooks/checkout";

interface BillingSameAsShippingFormData {
	billingSameAsShipping: boolean;
	billingAddress: OptionalAddress;
}

interface BillingSameAsShippingFormProps {
	autoSave: boolean;
	onSetBillingSameAsShipping?: (address: OptionalAddress) => void;
}

export const useBillingSameAsShippingForm = (
	{ autoSave, onSetBillingSameAsShipping }: BillingSameAsShippingFormProps = { autoSave: false }
) => {
	const { checkout } = useCheckout();
	const { billingAddress, shippingAddress, isShippingRequired } = checkout;
	const previousShippingAddress = useRef<OptionalAddress>(shippingAddress);
	const previousIsShippingRequired = useRef(isShippingRequired);
	const { setChangingBillingCountry } = useCheckoutUpdateStateActions();
	const [formBillingAddress, setFormBillingAddress] =
		useState<MightNotExist<AddressFragment>>(billingAddress);

	const [, checkoutBillingAddressUpdate] = useMutation<CheckoutBillingAddressUpdateMutation, CheckoutBillingAddressUpdateMutationVariables>(CheckoutBillingAddressUpdateDocument);

	const onSubmit = useFormSubmit<BillingSameAsShippingFormData, typeof checkoutBillingAddressUpdate>({
		scope: "checkoutBillingUpdate",
		onSubmit: checkoutBillingAddressUpdate,
		parse: ({ languageCode, checkoutId }) => ({
			languageCode,
			checkoutId,
			billingAddress: getAddressInputDataFromAddress(shippingAddress),
			validationRules: getAddressValidationRulesVariables({ autoSave })
		}),
		onSuccess: ({ data }) => {
			setFormBillingAddress(data.checkout?.billingAddress);
		},
		onFinished: () => {
			setChangingBillingCountry(false);
		}
	});

	const getInitialShippingAsBillingValue = useCallback(() => {
		if (!checkout.isShippingRequired) {
			return false;
		}

		// return !billingAddress || isMatchingAddress(shippingAddress, billingAddress);
		return !billingAddress;
	}, [shippingAddress, billingAddress, checkout.isShippingRequired]);

	const initialValues = {
		billingSameAsShipping: getInitialShippingAsBillingValue(),
		billingAddress: billingAddress
	};

	const previousBillingSameAsShipping = useRef(initialValues.billingSameAsShipping);

	const form = useForm<BillingSameAsShippingFormData>({
		onSubmit,
		initialValues,
		initialDirty: true
	});

	const {
		values: { billingSameAsShipping },
		setFieldValue,
		handleSubmit,
		handleChange
	} = form;

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.name === "billingSameAsShipping") {
			previousBillingSameAsShipping.current = billingSameAsShipping;
		}
		handleChange(event);
	};

	// once billing address in api and form don't match, submit
	useEffect(() => {
		// TODO: re-enable billing address sync when needed
		void formBillingAddress;
	}, [formBillingAddress]);

	useEffect(() => {
		if (!isShippingRequired && previousIsShippingRequired) {
			void setFieldValue("billingSameAsShipping", false);
		}
	}, [isShippingRequired, setFieldValue]);

	return {
		...form,
		handleChange: onChange
	};
};
