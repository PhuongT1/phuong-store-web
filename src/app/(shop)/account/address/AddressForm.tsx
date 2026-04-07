"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { type z } from "zod";
import { AddressForm as CheckoutAddressForm } from "@/checkout/components/AddressForm";
import { type AddressFormData } from "@/checkout/components/AddressForm/types";
import { useAddressFormSchema } from "@/checkout/components/AddressForm/useAddressFormSchema";
import { getAddressFormDataFromAddress, getAddressInputData } from "@/checkout/components/AddressForm/utils";
import { AddressFormActions } from "@/checkout/components/ManualSaveAddressForm";
import { type AddressFragment, type AddressInput, type CountryCode } from "@/gql/graphql";

type Props = {
	address?: AddressFragment;
	onSubmit: (input: AddressInput) => Promise<void>;
	onCancel: () => void;
	isSubmitting: boolean;
};

export function AddressForm({ address, onSubmit, onCancel, isSubmitting }: Props) {
	const { validationSchema, setCountryCode } = useAddressFormSchema("VN" as CountryCode);

	const form = useForm<AddressFormData>({
		mode: "onTouched",
		resolver: zodResolver(validationSchema as z.ZodType<AddressFormData>),
		defaultValues: getAddressFormDataFromAddress(address ?? null)
	});

	const { handleSubmit, watch } = form;

	// Keep validation schema in sync when user changes country
	const watchedCountryCode = watch("countryCode");
	useEffect(() => {
		setCountryCode(watchedCountryCode);
	}, [watchedCountryCode, setCountryCode]);

	const onFormSubmit = handleSubmit(async (values) => {
		await onSubmit(getAddressInputData(values));
	});

	return (
		<FormProvider {...form}>
			<CheckoutAddressForm>
				<AddressFormActions onSubmit={onFormSubmit} onCancel={onCancel} loading={isSubmitting} />
			</CheckoutAddressForm>
		</FormProvider>
	);
}
