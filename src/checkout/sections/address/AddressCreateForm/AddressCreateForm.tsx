import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import { type z } from "zod";
import { AddressForm, type AddressFormProps } from "@/checkout/components/AddressForm";
import { type AddressFormData } from "@/checkout/components/AddressForm/types";
import { useAddressFormSchema } from "@/checkout/components/AddressForm/useAddressFormSchema";
import { getEmptyAddressFormData, getAddressInputData } from "@/checkout/components/AddressForm/utils";
import { AddressFormActions } from "@/checkout/components/ManualSaveAddressForm";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import {
	type AddressFragment,
	type CountryCode,
	AddressTypeEnum,
	UserAddressCreateDocument
} from "@/gql/graphql";
import { fetchGraphQL } from "@/lib/api/secureGraphQL";

export interface AddressCreateFormProps extends Pick<AddressFormProps, "availableCountries"> {
	onSuccess: (address: AddressFragment) => void;
	onClose: () => void;
	hideTitle?: boolean;
}

export const AddressCreateForm: React.FC<AddressCreateFormProps> = ({
	onSuccess,
	onClose,
	availableCountries,
	hideTitle
}) => {
	const t = useTranslations("checkout");
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const { data: session } = useSession();
	const { mutate } = useSWRConfig();
	const { validationSchema, setCountryCode } = useAddressFormSchema("VN" as CountryCode);

	const form = useForm<AddressFormData>({
		resolver: zodResolver(validationSchema as z.ZodType<AddressFormData>),
		defaultValues: getEmptyAddressFormData()
	});

	const { handleSubmit, watch } = form;
	const { showErrors } = useAlerts("userAddressCreate");

	// Keep validation schema in sync when user changes country
	const watchedCountryCode = watch("countryCode");
	useEffect(() => {
		setCountryCode(watchedCountryCode);
	}, [watchedCountryCode, setCountryCode]);

	const onFormSubmit = handleSubmit(async (values) => {
		setIsSubmitting(true);
		try {
			const { accountAddressCreate } = await fetchGraphQL(UserAddressCreateDocument, {
				variables: { input: getAddressInputData(values), type: AddressTypeEnum.Shipping },
				shouldSendToken: true
				// saleorAppToken omitted — fetchGraphQL calls getSession() internally,
				// which triggers JWT callback → always gets a fresh token
			});
			if (accountAddressCreate?.errors?.length) {
				showErrors(
					accountAddressCreate.errors.map((e) => ({
						field: e.field ?? "",
						code: e.code,
						message: e.message ?? ""
					}))
				);
			} else if (accountAddressCreate?.address) {
				// Revalidate SWR "CurrentUser" cache so useUser() picks up the new address
				void mutate("CurrentUser");
				onSuccess(accountAddressCreate.address as AddressFragment);
				onClose();
			}
		} catch (e: unknown) {
			const err = e instanceof Error ? e : null;
			console.error("Address creation failed", e);
			showErrors([{ message: err?.message ?? "Failed to create address", field: "graphql", code: "error" }]);
		} finally {
			setIsSubmitting(false);
		}
	});

	return (
		<FormProvider {...form}>
			<AddressForm title={hideTitle ? undefined : t("addShippingAddress")} availableCountries={availableCountries}>
				<AddressFormActions onSubmit={onFormSubmit} loading={isSubmitting} onCancel={onClose} />
			</AddressForm>
		</FormProvider>
	);
};
