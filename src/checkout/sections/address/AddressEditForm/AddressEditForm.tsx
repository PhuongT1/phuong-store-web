import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { type z } from "zod";
import { AddressForm, type AddressFormProps } from "@/checkout/components/AddressForm";
import { type AddressFormData } from "@/checkout/components/AddressForm/types";
import { useAddressFormSchema } from "@/checkout/components/AddressForm/useAddressFormSchema";
import { getAddressFormDataFromAddress, getAddressInputData } from "@/checkout/components/AddressForm/utils";
import { AddressFormActions } from "@/checkout/components/ManualSaveAddressForm";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import {
	type AddressFragment,
	type CountryCode,
	UserAddressUpdateDocument,
	UserAddressDeleteDocument
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";

export interface AddressEditFormProps extends Pick<AddressFormProps, "title" | "availableCountries"> {
	address: AddressFragment;
	onUpdate: (address: AddressFragment) => void;
	onDelete: (id: string) => void;
	onClose: () => void;
}

export const AddressEditForm: React.FC<AddressEditFormProps> = ({
	onUpdate,
	onClose,
	onDelete,
	address,
	availableCountries,
	title
}) => {
	const [updating, setUpdating] = React.useState(false);
	const [deleting, setDeleting] = React.useState(false);
	const { validationSchema, setCountryCode } = useAddressFormSchema(address.country.code as CountryCode);
	const { showErrors } = useAlerts("userAddressUpdate");

	const form = useForm<AddressFormData>({
		resolver: zodResolver(validationSchema as z.ZodType<AddressFormData>),
		defaultValues: getAddressFormDataFromAddress(address)
	});
	const { handleSubmit, watch } = form;

	// Keep validation schema in sync when user changes country
	const watchedCountryCode = watch("countryCode");
	useEffect(() => {
		setCountryCode(watchedCountryCode);
	}, [watchedCountryCode, setCountryCode]);

	const onFormUpdate = handleSubmit(async (values) => {
		setUpdating(true);
		try {
			const { accountAddressUpdate } = await executeGraphQL(UserAddressUpdateDocument, {
				variables: { id: address.id, input: getAddressInputData(values) },
				withAuth: true
			});
			if (accountAddressUpdate?.errors?.length) {
				showErrors(
					accountAddressUpdate.errors.map((e) => ({
						field: e.field ?? "",
						code: e.code,
						message: e.message ?? ""
					}))
				);
			} else if (accountAddressUpdate?.address) {
				onUpdate(accountAddressUpdate.address as AddressFragment);
				onClose();
			}
		} catch (e: unknown) {
			const err = e instanceof Error ? e : null;
			showErrors([{ message: err?.message || "Failed to update address", field: "graphql", code: "error" }]);
		} finally {
			setUpdating(false);
		}
	});

	const handleDelete = async () => {
		setDeleting(true);
		try {
			const { accountAddressDelete } = await executeGraphQL(UserAddressDeleteDocument, {
				variables: { id: address.id },
				withAuth: true
			});
			if (accountAddressDelete?.errors?.length) {
				showErrors(
					accountAddressDelete.errors.map((e) => ({
						field: e.field ?? "",
						code: e.code,
						message: e.message ?? ""
					}))
				);
			} else {
				onDelete(address.id);
				onClose();
			}
		} catch (e: unknown) {
			const err = e instanceof Error ? e : null;
			showErrors([{ message: err?.message || "Failed to delete address", field: "graphql", code: "error" }]);
		} finally {
			setDeleting(false);
		}
	};

	return (
		<FormProvider {...form}>
			<AddressForm title={title} availableCountries={availableCountries}>
				<AddressFormActions
					onSubmit={onFormUpdate}
					loading={updating || deleting}
					onCancel={onClose}
					onDelete={handleDelete}
				/>
			</AddressForm>
		</FormProvider>
	);
};
