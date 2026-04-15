import { useEffect, useState } from "react";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useEvent } from "@/checkout/hooks/useEvent";
import { useUser } from "@/checkout/hooks/useUser";
import { clearQueryParams, getQueryParams, type ParamBasicValue } from "@/checkout/lib/utils/url";
import {
	anyFormsValidating,
	areAllFormsValid,
	useCheckoutValidationActions,
	useCheckoutValidationState
} from "@/checkout/state/checkoutValidationStateStore";
import {
	areAnyRequestsInProgress,
	hasFinishedApiChangesWithNoError,
	useCheckoutUpdateState,
	useCheckoutUpdateStateActions
} from "@/checkout/state/updateStateStore";
import { useCheckout } from "@hooks/checkout";
import { type ParsedAdyenGateway } from "../types";
import { getUrlForTransactionInitialize } from "../utils";
import {
	type AdyenCheckoutInstanceOnAdditionalDetails,
	type AdyenCheckoutInstanceOnSubmit,
	type AdyenCheckoutInstanceState
} from "./types";
import { useAdyenTransactions } from "./useAdyenTransactions";
// @ts-expect-error Adyen types not installed
import type DropinElement from "@adyen/adyen-web/dist/types/components/Dropin";

export interface AdyenDropinProps {
	config: ParsedAdyenGateway;
}

export const useAdyenDropin = (props: AdyenDropinProps) => {
	const { id } = props.config;
	const {
		checkout: { id: checkoutId, totalPrice }
	} = useCheckout();
	const { authenticated } = useUser();
	const { validateAllForms } = useCheckoutValidationActions();
	const { validationState } = useCheckoutValidationState();
	const { updateState, loadingCheckout, ...rest } = useCheckoutUpdateState();
	const { showCustomErrors } = useAlerts();
	const { submitInProgress } = useCheckoutUpdateState();
	const { setSubmitInProgress, setShouldRegisterUser } = useCheckoutUpdateStateActions();

	const [currentTransactionId, setCurrentTransactionId] = useState<ParamBasicValue>(undefined);
	const [adyenCheckoutSubmitParams, setAdyenCheckoutSubmitParams] = useState<{
		state: AdyenCheckoutInstanceState;
		component: DropinElement;
	} | null>(null);

	const { onTransactionInitialize, onTransactionProcess } = useAdyenTransactions({
		adyenCheckoutSubmitParams,
		showCustomErrors,
		setCurrentTransactionId
	});

	const anyRequestsInProgress = areAnyRequestsInProgress({ updateState, loadingCheckout, ...rest });
	const finishedApiChangesWithNoError = hasFinishedApiChangesWithNoError({
		updateState,
		loadingCheckout,
		...rest
	});

	const onSubmitInitialize: AdyenCheckoutInstanceOnSubmit = useEvent(async (state, component) => {
		component.setStatus("loading");
		setAdyenCheckoutSubmitParams({ state, component });
		validateAllForms(authenticated);
		setShouldRegisterUser(true);
		setSubmitInProgress(true);
	});

	// awaits for all other requests to finish and forms to validate,
	// then either does transaction initialize or process
	useEffect(() => {
		const validating = anyFormsValidating(validationState);
		const allFormsValid = areAllFormsValid(validationState);

		if (!submitInProgress || validating || anyRequestsInProgress || !adyenCheckoutSubmitParams) {
			return;
		}

		setSubmitInProgress(false);

		if (!finishedApiChangesWithNoError || !allFormsValid) {
			adyenCheckoutSubmitParams?.component.setStatus("ready");
			return;
		}

		adyenCheckoutSubmitParams.component.setStatus("loading");

		if (currentTransactionId) {
			void onTransactionProcess({
				data: adyenCheckoutSubmitParams?.state.data,
				id: currentTransactionId
			});
			return;
		}

		void onTransactionInitialize({
			checkoutId,
			amount: totalPrice.gross.amount,
			paymentGateway: {
				id,
				data: {
					...adyenCheckoutSubmitParams.state.data,
					returnUrl: getUrlForTransactionInitialize()?.newUrl
				}
			}
		});
	}, [
		adyenCheckoutSubmitParams,
		anyRequestsInProgress,
		checkoutId,
		currentTransactionId,
		finishedApiChangesWithNoError,
		onTransactionInitialize,
		onTransactionProcess,
		submitInProgress,
		totalPrice.gross.amount,
		validationState,
		id,
		setSubmitInProgress
	]);

	const onAdditionalDetails: AdyenCheckoutInstanceOnAdditionalDetails = useEvent(async (state, component) => {
		setAdyenCheckoutSubmitParams({ state, component });
		if (currentTransactionId) {
			adyenCheckoutSubmitParams?.component?.setStatus("loading");
			setSubmitInProgress(true);
		}
	});

	// handle when page is opened from previously redirected payment
	useEffect(() => {
		const { transaction } = getQueryParams();
		if (transaction) {
			setCurrentTransactionId(transaction);
		}
	}, []);

	// handle when page is opened from previously redirected payment
	useEffect(() => {
		const { redirectResult, transaction, processingPayment } = getQueryParams();
		if (!redirectResult || !transaction || !processingPayment) return;

		const decodedRedirectData = decodeURI(redirectResult);
		setCurrentTransactionId(transaction);
		clearQueryParams("redirectResult", "resultCode");

		void onTransactionProcess({
			id: transaction,
			data: { details: { redirectResult: decodedRedirectData } }
		});
	}, [onTransactionProcess]);

	return { onSubmit: onSubmitInitialize, onAdditionalDetails };
};
