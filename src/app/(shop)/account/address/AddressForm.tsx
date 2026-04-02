"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "@/components/ui/Button";
import { FormProvider } from "@/components/ui/FormProvider";
import { FormInput } from "@/components/ui/input";
import { type AddressInput, type AddressFragment } from "@/gql/graphql";

type FormValues = {
	firstName: string;
	lastName: string;
	streetAddress1: string;
	streetAddress2: string;
	city: string;
	postalCode: string;
	countryCode: string;
	phone: string;
};

const toAddressInput = (values: FormValues): AddressInput => ({
	firstName: values.firstName,
	lastName: values.lastName,
	streetAddress1: values.streetAddress1,
	streetAddress2: values.streetAddress2,
	city: values.city,
	postalCode: values.postalCode,
	country: values.countryCode as AddressInput["country"],
	phone: values.phone
});

const useSchema = (t: ReturnType<typeof useTranslations<"account">>) =>
	yup.object({
		firstName: yup.string().required(t("required")),
		lastName: yup.string().required(t("required")),
		streetAddress1: yup.string().required(t("required")),
		streetAddress2: yup.string().default(""),
		city: yup.string().required(t("required")),
		postalCode: yup.string().default(""),
		countryCode: yup.string().required(t("required")),
		phone: yup.string().default("")
	});

type Props = {
	address?: AddressFragment;
	onSubmit: (input: AddressInput) => Promise<void>;
	onCancel: () => void;
	isSubmitting: boolean;
};

export function AddressForm({ address, onSubmit, onCancel, isSubmitting }: Props) {
	const t = useTranslations("account");

	const method = useForm<FormValues>({
		mode: "onTouched",
		resolver: yupResolver(useSchema(t)),
		defaultValues: {
			firstName: address?.firstName ?? "",
			lastName: address?.lastName ?? "",
			streetAddress1: address?.streetAddress1 ?? "",
			streetAddress2: address?.streetAddress2 ?? "",
			city: address?.city ?? "",
			postalCode: address?.postalCode ?? "",
			countryCode: address?.country.code ?? "",
			phone: address?.phone ?? ""
		}
	});

	const handleSubmit = async (values: FormValues) => {
		await onSubmit(toAddressInput(values));
	};

	return (
		<FormProvider methods={method} formProps={{ onSubmit: method.handleSubmit(handleSubmit) }}>
			<div className="flex flex-col gap-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<FormInput name="firstName" wrapFieldProps={{ label: t("firstName"), required: true }} />
					<FormInput name="lastName" wrapFieldProps={{ label: t("lastName"), required: true }} />
				</div>
				<FormInput name="streetAddress1" wrapFieldProps={{ label: t("streetAddress1"), required: true }} />
				<FormInput name="streetAddress2" wrapFieldProps={{ label: t("streetAddress2") }} />
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<FormInput name="city" wrapFieldProps={{ label: t("city"), required: true }} />
					<FormInput name="postalCode" wrapFieldProps={{ label: t("postalCode") }} />
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<FormInput name="countryCode" wrapFieldProps={{ label: t("countryCode"), required: true }} />
					<FormInput name="phone" wrapFieldProps={{ label: t("addressPhone") }} />
				</div>
				<div className="flex gap-3 pt-2">
					<Button type="submit" size="sm" disabled={isSubmitting}>
						{t("save")}
					</Button>
					<Button type="button" variant="outline" size="sm" onClick={onCancel}>
						{t("cancel")}
					</Button>
				</div>
			</div>
		</FormProvider>
	);
}
