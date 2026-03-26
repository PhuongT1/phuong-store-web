import clsx from "clsx";

import React, { type FC } from "react";
import { useCheckout } from "@hooks/checkout";
import { notify } from "@components/ui";
import { Button } from "@/checkout/components/Button";
import { CheckoutAddPromoCodeDocument } from "@/gql/graphql";
import { type Classes } from "@/checkout/lib/globalTypes";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
import { useForm } from "@/checkout/hooks/useForm";
import { executeGraphQL } from "@/lib/api";

interface PromoCodeFormData {
	promoCode: string;
}

export const PromoCodeAdd: FC<Classes> = ({ className }) => {
	const { mutate } = useCheckout();

	const onSubmit = useFormSubmit<PromoCodeFormData, any>({
		scope: "checkoutAddPromoCode",
		 
		onSubmit: (vars) => executeGraphQL(CheckoutAddPromoCodeDocument, { variables: vars as any }),
		parse: ({ promoCode, checkoutId }) => ({
			promoCode,
			checkoutId
		}),
		onSuccess: ({ formHelpers: { resetForm } }) => {
			notify.success("Mã giảm giá đã được áp dụng thành công");
			void mutate();
			return resetForm();
		},
		onError: ({ errors }) => {
			const firstError = errors?.[0];
			notify.error(firstError?.message || "Mã giảm giá không hợp lệ");
		}
	});

	const form = useForm<PromoCodeFormData>({
		onSubmit,
		initialValues: { promoCode: "" }
	});
	const {
		values: { promoCode },
		errors,
		touched,
		handleBlur,
		handleChange
	} = form;

	const promoCodeError = touched.promoCode ? errors.promoCode : undefined;

	return (
		<FormProvider form={form}>
			<div className={clsx("my-4 flex flex-col gap-2", className)}>
				<div className="flex w-full items-center gap-2">
					<div className="flex-1">
						<input
							onChange={handleChange}
							onBlur={handleBlur}
							value={promoCode}
							placeholder="Nhập mã giảm giá"
							required={false}
							name="promoCode"
							className={clsx(
								"border-input bg-background placeholder:text-muted-foreground focus-visible:border-focus-ring focus-visible:ring-focus-ring/40 flex h-10 w-full rounded-lg border px-4 py-2 text-sm transition-all duration-200 hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
								promoCodeError && "border-red-500 hover:border-red-500 focus-visible:ring-red-500"
							)}
						/>
					</div>
					<Button
						className="h-10 rounded-lg border-none bg-blue-600! px-6 text-sm font-medium text-white! shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700! hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
						variant="primary"
						ariaLabel="Apply"
						label="Áp dụng"
						type="submit"
						disabled={!promoCode || !promoCode.trim()}
					/>
				</div>
				{promoCodeError && <p className="ml-1 text-xs text-red-500">{promoCodeError}</p>}
			</div>
		</FormProvider>
	);
};
