import { useCallback } from "react";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { type FormDataBase } from "@/checkout/hooks/useForm";
import { type ApiErrors } from "@/checkout/hooks/useGetParsedErrors/types";
import {
	type CommonVars,
	type MutationBaseFn,
	type MutationData,
	type MutationSuccessData,
	type MutationVars,
	type ParserFunction,
	type SimpleSubmitFn
} from "@/checkout/hooks/useSubmit/types";
import { extractMutationData, extractMutationErrors } from "@/checkout/hooks/useSubmit/utils";
import {
	type CheckoutUpdateStateScope,
	useCheckoutUpdateStateChange
} from "@/checkout/state/updateStateStore";
import { LANGUAGE_CODE_DEFAULT } from "@/constants";
import { useCheckout } from "@hooks/checkout";

interface CallbackProps<TData> {
	formData: TData;
	formHelpers?: any;
}

export interface UseSubmitProps<
	TData extends FormDataBase,
	TMutationFn extends MutationBaseFn,
	TErrorCodes extends string = string
> {
	hideAlerts?: boolean;
	scope?: CheckoutUpdateStateScope;
	onSubmit: (vars: MutationVars<TMutationFn>) => Promise<MutationData<TMutationFn>>;
	parse?: ParserFunction<TData, TMutationFn>;
	onAbort?: (props: CallbackProps<TData>) => void;
	onSuccess?: (props: CallbackProps<TData> & { data: MutationSuccessData<TMutationFn> }) => void;
	onFinished?: () => void;
	onError?: (
		props: CallbackProps<TData> & {
			errors: ApiErrors<TData, TErrorCodes>;
			customErrors: any[];
			graphqlErrors: unknown[];
		}
	) => void;
	extractCustomErrors?: (data: MutationData<TMutationFn>) => any[];
	onStart?: (props: CallbackProps<TData>) => void;
	shouldAbort?:
		| ((props: CallbackProps<TData>) => Promise<boolean>)
		| ((props: CallbackProps<TData>) => boolean);
}

export const useSubmit = <
	TData extends FormDataBase,
	TMutationFn extends MutationBaseFn,
	TErrorCodes extends string = string
>({
	onSuccess,
	onError,
	onStart,
	onSubmit,
	onAbort,
	scope,
	shouldAbort,
	parse,
	onFinished,
	extractCustomErrors,
	hideAlerts = false
}: UseSubmitProps<TData, TMutationFn, TErrorCodes>): SimpleSubmitFn<TData, TErrorCodes> => {
	const { setCheckoutUpdateState } = useCheckoutUpdateStateChange(
		// @ts-expect-error -- something is fishy
		scope
	);
	const { showErrors } = useAlerts();
	const { checkout } = useCheckout();

	const handleSubmit = useCallback(
		async (formData: TData = {} as TData, formHelpers?: any) => {
			const callbackProps: CallbackProps<TData> = { formData, formHelpers };

			onStart?.(callbackProps);

			const shouldAbortSubmit = typeof shouldAbort === "function" ? await shouldAbort(callbackProps) : false;

			if (shouldAbortSubmit) {
				setCheckoutUpdateState("success");
				if (typeof onAbort === "function") {
					onAbort(callbackProps);
				}
				return { hasErrors: false, apiErrors: [], customErrors: [], graphqlErrors: [] };
			}

			setCheckoutUpdateState("loading");

			const commonData: CommonVars = {
				languageCode: LANGUAGE_CODE_DEFAULT,
				channel: checkout?.channel.slug,
				checkoutId: checkout.id
			};

			const unparsedMutationVars = { ...formData, ...commonData };

			const result = await onSubmit(
				typeof parse === "function"
					? parse(unparsedMutationVars)
					: (unparsedMutationVars as MutationVars<TMutationFn>)
			);

			const { hasErrors, apiErrors, ...errorsRest } = extractMutationErrors<TData, TMutationFn, TErrorCodes>(
				result,
				extractCustomErrors
			);

			const { success, data } = extractMutationData(result);

			if (!hasErrors && success) {
				onSuccess?.({ ...callbackProps, data });
				setCheckoutUpdateState("success");

				onFinished?.();
				return { hasErrors, apiErrors, ...errorsRest };
			}

			onError?.({ ...callbackProps, errors: apiErrors, ...errorsRest });

			setCheckoutUpdateState("error");

			if (!hideAlerts && scope) {
				showErrors(apiErrors, scope);
			}

			onFinished?.();
			return { hasErrors, apiErrors, ...errorsRest };
		},
		[
			onStart,
			shouldAbort,
			setCheckoutUpdateState,
			checkout?.channel?.slug,
			checkout?.id,
			onSubmit,
			parse,
			extractCustomErrors,
			onError,
			hideAlerts,
			scope,
			onFinished,
			onAbort,
			onSuccess,
			showErrors
		]
	);

	return handleSubmit;
};
