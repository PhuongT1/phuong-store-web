import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
 
import { type AddressFormData } from "@/checkout/components/AddressForm/types";
import { AddressForm, type AddressFormProps } from "@/checkout/components/AddressForm";
import { type AddressFragment, type CountryCode } from "@/checkout/graphql";
import { UserAddressUpdateDocument, UserAddressDeleteDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { getAddressFormDataFromAddress, getAddressInputData } from "@/checkout/components/AddressForm/utils";
import { AddressFormActions } from "@/checkout/components/ManualSaveAddressForm";
import { useAddressFormSchema } from "@/checkout/components/AddressForm/useAddressFormSchema";
import { useSubmit } from "@/checkout/hooks/useSubmit/useSubmit";

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
	availableCountries
}) => {
	const [updating, setUpdating] = React.useState(false);
	const [deleting, setDeleting] = React.useState(false);
	const { validationSchema } = useAddressFormSchema(address.country.code as CountryCode);
	const { showErrors } = useAlerts("userAddressUpdate");

	const form = useForm<AddressFormData>({
		resolver: zodResolver(validationSchema as any),
		defaultValues: getAddressFormDataFromAddress(address)
	});
	const { handleSubmit } = form;

	const onFormUpdate = handleSubmit(async (values) => {
		setUpdating(true);
		try {
			const { accountAddressUpdate } = await executeGraphQL(UserAddressUpdateDocument, {
				variables: { id: address.id, address: { ...getAddressInputData(values) } as any },
				withAuth: true
			});
			if (accountAddressUpdate?.errors?.length) {
				showErrors(accountAddressUpdate.errors as any);
			} else if (accountAddressUpdate?.address) {
				onUpdate(accountAddressUpdate.address as AddressFragment);
				onClose();
			}
		} catch (e: any) {
			showErrors([
				{ message: e.message || "Failed to update address", field: "graphql", code: "error" }
			] as any);
		} finally {
			setUpdating(false);
		}
	});

	const handleDelete = async () => {
		setDeleting(true);
		try {
			const { accountAddressDelete } = await executeGraphQL(UserAddressDeleteDocument, {
				variables: { id: address.id }
			});
			if (accountAddressDelete?.errors?.length) {
				showErrors(accountAddressDelete.errors as any);
			} else {
				onDelete(address.id);
				onClose();
			}
		} catch (e: any) {
			showErrors([
				{ message: e.message || "Failed to delete address", field: "graphql", code: "error" }
			] as any);
		} finally {
			setDeleting(false);
		}
	};

	return (
		<FormProvider {...form}>
			<AddressForm title="Edit address" availableCountries={availableCountries}>
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
