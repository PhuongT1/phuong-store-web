 
import { useCallback } from "react";
import { camelCase } from "lodash-es";
import { type ExternalToast } from "sonner";
import { useGetParsedErrors } from "@/checkout/hooks/useGetParsedErrors";
import { type ApiErrors } from "@/checkout/hooks/useGetParsedErrors/types";
import { type ErrorCode } from "@/checkout/lib/globalTypes";
import { apiErrorMessages } from "@/checkout/sections/payment/PaymentSection/errorMessages";
import { notify } from "@/components/ui";
import {
	type Alert,
	type AlertType,
	type AlertErrorData,
	type CheckoutScope,
	type CustomError
} from "./types";

function useAlerts(scope: CheckoutScope): {
	showErrors: (errors: ApiErrors<any>) => void;
	showCustomErrors: (errors: CustomError[]) => void;
	showSuccess: (message: string) => void;
};

function useAlerts(): {
	showErrors: (errors: ApiErrors<any>, scope: CheckoutScope) => void;
	showCustomErrors: (errors: CustomError[], scope?: CheckoutScope) => void;
	showSuccess: (message: string) => void;
};

function useAlerts(globalScope?: CheckoutScope) {
	const { getParsedApiErrors } = useGetParsedErrors<Record<string, string>>();

	const getMessageKey = ({ scope, field, code }: AlertErrorData, { error } = { error: false }) => {
		const keyBase = `${scope}-${field}-${code}`;
		return camelCase(error ? `${keyBase}-error` : keyBase);
	};

	const getErrorMessage = useCallback(({ code, field, scope }: AlertErrorData): string => {
		const messageKey = getMessageKey(
			{ code, field, scope },
			{ error: true }
		) as keyof typeof apiErrorMessages;

		try {
			const fullMessage = apiErrorMessages[messageKey];

			return fullMessage;
		} catch (e) {
			console.warn(`Missing translation: ${messageKey}`);
			return apiErrorMessages.somethingWentWrong;
		}
	}, []);

	const getParsedAlert = useCallback(
		(data: AlertErrorData, type: AlertType): Alert => {
			const { scope, field, code } = data;

			return {
				id: camelCase(`${scope}-${field}-${code}`),
				message: getErrorMessage({ scope, code, field }),
				type
			};
		},
		[getErrorMessage]
	);

	const showAlert = useCallback(
		({ message, type = "error", ...rest }: Pick<Alert, "message"> & { type?: AlertType; id?: string }) => {
			const toastOptions: ExternalToast = { ...rest };
			if (type === "error") {
				notify.error(message, toastOptions);
			} else if (type === "success") {
				notify.success(message, toastOptions);
			} else {
				notify.info(message, toastOptions);
			}
		},
		[]
	);

	const showDefaultAlert = useCallback(
		(alertErrorData: AlertErrorData, { type }: { type: AlertType } = { type: "error" }) => {
			const parsedAlert = getParsedAlert(alertErrorData, type);
			showAlert(parsedAlert);
		},
		[showAlert, getParsedAlert]
	);

	const showErrors = useCallback(
		(errors: ApiErrors<Record<string, string>>, scope: CheckoutScope = globalScope!) =>
			getParsedApiErrors(errors).forEach((error) => showDefaultAlert({ ...error, scope } as AlertErrorData)),
		[getParsedApiErrors, showDefaultAlert, globalScope]
	);

	const showCustomErrors = useCallback(
		(errors: CustomError[], scope: CheckoutScope = globalScope!) => {
			const parsedErrors = errors.map((error) => ({ field: "", message: "", code: "", ...error }));

			parsedErrors.forEach(({ field, message, code }) => {
				if (message) {
					showAlert({ message });
				} else if (field && code) {
					showDefaultAlert({ scope, field, code: code as ErrorCode });
				} else {
					showAlert({ message: apiErrorMessages.somethingWentWrong });
				}
			});
		},
		[globalScope, showAlert, showDefaultAlert]
	);

	const showSuccess = useCallback(
		(message: string) => {
			showAlert({ message, type: "success" });
		},
		[showAlert]
	);

	return { showErrors, showCustomErrors, showSuccess };
}

export { useAlerts };
