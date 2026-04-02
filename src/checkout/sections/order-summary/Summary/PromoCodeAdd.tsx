"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { type Classes } from "@/checkout/lib/globalTypes";
import { Button, notify } from "@/components/ui";
import { FormInput } from "@/components/ui/input/FormInput";
import { CheckoutAddPromoCodeDocument } from "@/gql/graphql";
import { clientFetchGraphQL } from "@/lib/api/clientGraphQLWithRetry";
import { cn } from "@/lib/utils";
import { useCheckout } from "@hooks/checkout";

interface PromoCodeFormData {
	promoCode: string;
}

export const PromoCodeAdd: FC<Classes> = ({ className }) => {
	const t = useTranslations("checkout");
	const { checkout, mutate } = useCheckout();

	const form = useForm<PromoCodeFormData>({ defaultValues: { promoCode: "" } });
	const { control, handleSubmit, reset, watch } = form;
	const promoCode = watch("promoCode");

	const onSubmit = handleSubmit(async ({ promoCode: code }) => {
		const data = await clientFetchGraphQL(CheckoutAddPromoCodeDocument, {
			variables: { promoCode: code, checkoutId: checkout.id }
		});
		const apiErrors = data.checkoutAddPromoCode?.errors;
		if (apiErrors?.length) {
			notify.error(apiErrors[0]?.message ?? t("promoInvalid"));
			return;
		}
		notify.success(t("promoSuccess"));
		void mutate();
		reset();
	});

	return (
		<FormProvider {...form}>
			<form onSubmit={onSubmit} className={cn("my-4 flex flex-col gap-2", className)}>
				<div className="flex w-full items-center gap-2">
					<div className="flex-1">
						<FormInput control={control} name="promoCode" inputProps={{ placeholder: t("enterPromoCode") }} />
					</div>
					<Button
						aria-label="Apply"
						variant="info"
						type="submit"
						disabled={!promoCode?.trim()}
						className="h-10 px-6 text-sm font-medium"
					>
						{t("apply")}
					</Button>
				</div>
			</form>
		</FormProvider>
	);
};
