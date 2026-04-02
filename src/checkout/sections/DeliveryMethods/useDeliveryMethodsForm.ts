import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm, useWatch, type UseFormReturn } from "react-hook-form";
import { useSubmit } from "@/checkout/hooks/useSubmit/useSubmit";
import { type MightNotExist } from "@/checkout/lib/globalTypes";
import { useMutation } from "@/checkout/lib/useMutation";
import { getById } from "@/checkout/lib/utils/common";
import {
	type CountryCode,
	type CheckoutDeliveryMethodUpdateMutation,
	type CheckoutDeliveryMethodUpdateMutationVariables,
	CheckoutDeliveryMethodUpdateDocument
} from "@/gql/graphql";
import { useCheckout } from "@hooks/checkout";

interface DeliveryMethodsFormData {
	selectedMethodId: string | undefined;
}

export const useDeliveryMethodsForm = (): UseFormReturn<DeliveryMethodsFormData> => {
	const { checkout, mutate } = useCheckout();
	const { shippingMethods, shippingAddress, deliveryMethod } = checkout;
	const [, updateDeliveryMethod] = useMutation<
		CheckoutDeliveryMethodUpdateMutation,
		CheckoutDeliveryMethodUpdateMutationVariables
	>(CheckoutDeliveryMethodUpdateDocument);

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
					const result = data as Record<string, unknown>;
					const updatedCheckout = result?.checkout;
					if (updatedCheckout) {
						void mutate({ checkout: updatedCheckout } as Parameters<typeof mutate>[0], { revalidate: false });
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

	// Fire immediately — radio selection is a single deliberate action, no debounce needed.
	useEffect(() => {
		if (!selectedMethodId) return;
		void onSubmit({ selectedMethodId });
	}, [selectedMethodId, onSubmit]);

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
