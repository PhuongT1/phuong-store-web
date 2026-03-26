import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm, useWatch, type UseFormReturn } from "react-hook-form";
import { useCheckout } from "@hooks/checkout";
import { type CountryCode, useCheckoutDeliveryMethodUpdateMutation } from "@/checkout/graphql";
import { useDebouncedSubmit } from "@/checkout/hooks/useDebouncedSubmit";
import { useSubmit } from "@/checkout/hooks/useSubmit/useSubmit";
import { type MightNotExist } from "@/checkout/lib/globalTypes";
import { getById } from "@/checkout/lib/utils/common";

interface DeliveryMethodsFormData {
	selectedMethodId: string | undefined;
}

export const useDeliveryMethodsForm = (): UseFormReturn<DeliveryMethodsFormData> => {
	const { checkout, mutate } = useCheckout();
	const { shippingMethods, shippingAddress, deliveryMethod } = checkout;
	const [, updateDeliveryMethod] = useCheckoutDeliveryMethodUpdateMutation();

	const previousShippingCountry = useRef<MightNotExist<CountryCode>>(
		shippingAddress?.country?.code as CountryCode | undefined
	);

	const getAutoSetMethod = useCallback(() => {
		if (!shippingMethods?.length) {
			return;
		}

		const cheapestMethod = shippingMethods.reduce(
			(resultMethod, currentMethod) =>
				currentMethod.price.amount < resultMethod.price.amount ? currentMethod : resultMethod,
			shippingMethods[0]
		);

		return cheapestMethod;
	}, [shippingMethods]);

	const defaultFormData: DeliveryMethodsFormData = {
		selectedMethodId: deliveryMethod?.id || getAutoSetMethod()?.id
	};

	const form = useForm<DeliveryMethodsFormData>({
		defaultValues: defaultFormData,
		mode: "onTouched"
	});
	const { control, setValue } = form;

	const selectedMethodId = useWatch({ control, name: "selectedMethodId" });

	const onSubmit = useSubmit<DeliveryMethodsFormData, typeof updateDeliveryMethod>(
		useMemo(
			() => ({
				scope: "checkoutDeliveryMethodUpdate",
				onSubmit: updateDeliveryMethod,
				shouldAbort: ({ formData: { selectedMethodId } }) =>
					!selectedMethodId || selectedMethodId === checkout.deliveryMethod?.id,
				parse: ({ selectedMethodId, languageCode, checkoutId }) => ({
					deliveryMethodId: selectedMethodId as string,
					languageCode,
					checkoutId
				}),
				onSuccess: ({ data }) => {
					// Update SWR cache immediately so checkout.deliveryMethod reflects
					// the selection before user clicks "Đặt hàng".
					const updatedCheckout = (data as any)?.checkout;
					if (updatedCheckout) {
						void mutate({ checkout: updatedCheckout }, { revalidate: false });
					} else {
						void mutate();
					}
				},
				onError: ({ formData: { selectedMethodId } }) => {
					setValue("selectedMethodId", selectedMethodId, { shouldDirty: true });
				}
			}),
			[checkout.deliveryMethod?.id, updateDeliveryMethod, setValue, mutate]
		)
	);

	const debouncedSubmit = useDebouncedSubmit(onSubmit);

	useEffect(() => {
		void debouncedSubmit({ selectedMethodId });
	}, [debouncedSubmit, selectedMethodId]);

	useEffect(() => {
		const hasShippingCountryChanged = shippingAddress?.country?.code !== previousShippingCountry.current;

		const hasValidMethodSelected = selectedMethodId && shippingMethods?.some(getById(selectedMethodId));

		if (hasValidMethodSelected) {
			return;
		}

		setValue("selectedMethodId", getAutoSetMethod()?.id, { shouldDirty: true });

		if (hasShippingCountryChanged) {
			previousShippingCountry.current = shippingAddress?.country?.code as CountryCode;
		}
	}, [shippingAddress, shippingMethods, getAutoSetMethod, selectedMethodId, setValue]);

	return form;
};
