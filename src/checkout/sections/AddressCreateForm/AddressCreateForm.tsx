 
 
 
 
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type AddressFormData } from "@/checkout/components/AddressForm/types";
import { getEmptyAddressFormData, getAddressInputData } from "@/checkout/components/AddressForm/utils";
import { AddressFormActions } from "@/checkout/components/ManualSaveAddressForm";
import { useAddressFormSchema } from "@/checkout/components/AddressForm/useAddressFormSchema";
import { AddressForm, type AddressFormProps } from "@/checkout/components/AddressForm";
import { type AddressFragment, type CountryCode } from "@/checkout/graphql";
import { UserAddressCreateDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { useAlerts } from "@/checkout/hooks/useAlerts";

export interface AddressCreateFormProps extends Pick<AddressFormProps, "availableCountries"> {
	onSuccess: (address: AddressFragment) => void;
	onClose: () => void;
}

export const AddressCreateForm: React.FC<AddressCreateFormProps> = ({
	onSuccess,
	onClose,
	availableCountries
}) => {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const { validationSchema } = useAddressFormSchema("VN" as CountryCode);
	const { showErrors } = useAlerts("userAddressCreate");

	const form = useForm<AddressFormData>({
		resolver: zodResolver(validationSchema as any),
		defaultValues: getEmptyAddressFormData()
	});

	const { handleSubmit } = form;

	const onFormSubmit = handleSubmit(async (values) => {
		setIsSubmitting(true);
		try {
			const { accountAddressCreate } = await executeGraphQL(UserAddressCreateDocument, {
				variables: { address: getAddressInputData(values) as any, type: "SHIPPING" as any },
				withAuth: true
			});
			if (accountAddressCreate?.errors?.length) {
				showErrors(accountAddressCreate.errors as any);
			} else if (accountAddressCreate?.address) {
				onSuccess(accountAddressCreate.address as AddressFragment);
				onClose();
			}
		} catch (e: any) {
			console.error("Address creation failed", e);
			const errorMessage = e?.errors?.[0]?.message || e?.message || "Failed to create address";
			showErrors([{ message: errorMessage, field: "graphql", code: "error" }] as any);
		} finally {
			setIsSubmitting(false);
		}
	});

	return (
		<FormProvider {...form}>
			<AddressForm title="Create address" availableCountries={availableCountries}>
				<AddressFormActions onSubmit={onFormSubmit} loading={isSubmitting} onCancel={onClose} />
			</AddressForm>
		</FormProvider>
	);
};
