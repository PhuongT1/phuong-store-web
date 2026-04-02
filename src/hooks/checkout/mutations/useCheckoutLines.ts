"use client";

import { CheckoutLinesAddForm, CheckoutLinesDeleteForm, CheckoutLinesUpdateForm } from "@services";
import useSWRMutation from "swr/mutation";
import { revalidateCart } from "@/action";
import { CONFIG } from "@/constants";
import {
	type CheckoutLinesUpdateMutationVariables,
	type CheckoutDeleteLinesMutationVariables,
	type CheckoutLinesAddMutationVariables
} from "@/gql/graphql";
import { useCheckout } from "@/hooks/checkout/queries/useCheckout";
import { notify } from "@components/ui";

const useCheckoutLines = () => {
	const {
		mutate,
		checkout: { id: checkoutId }
	} = useCheckout();

	const {
		trigger: triggerAdd,
		isMutating: isCreating,
		...restAdd
	} = useSWRMutation(CONFIG.CHECKOUT_KEY.addKey, CheckoutLinesAddForm, {
		onError() {
			notify.error("Không thể thêm sản phẩm vào giỏ hàng");
		}
	});

	const {
		trigger,
		isMutating: isUpdating,
		...restUpdate
	} = useSWRMutation(CONFIG.CHECKOUT_KEY.updateKey, CheckoutLinesUpdateForm, {
		onSuccess() {
			notify.success("Cập nhật sản phẩm thành công");
			handleSuccess();
		},
		onError() {
			notify.error("Không thể cập nhật số lượng");
		}
	});

	const {
		trigger: triggerDelete,
		isMutating: isDeleting,
		...restDelete
	} = useSWRMutation(CONFIG.CHECKOUT_KEY.deleteKey, CheckoutLinesDeleteForm, {
		onSuccess() {
			handleSuccess();
		},
		onError() {
			notify.error("Không thể xóa sản phẩm");
		}
	});

	const handleSuccess = () => {
		void revalidateCart(checkoutId);
		void mutate();
	};

	const checkoutAdd = (lines: CheckoutLinesAddMutationVariables["lines"]) => {
		void triggerAdd({ id: checkoutId, lines });
	};

	const checkoutUpdate = (lines: CheckoutLinesUpdateMutationVariables["lines"]) => {
		void trigger({ checkoutId, lines });
	};

	const checkoutDelete = (lineIds: CheckoutDeleteLinesMutationVariables["lineIds"]) => {
		void triggerDelete({ checkoutId, lineIds });
	};

	return {
		checkoutId,
		updateCart: { checkoutUpdate, isUpdating, ...restUpdate },
		deleteCart: { checkoutDelete, isDeleting, ...restDelete },
		addCart: { checkoutAdd, isCreating, ...restAdd }
	};
};

export { useCheckoutLines };
