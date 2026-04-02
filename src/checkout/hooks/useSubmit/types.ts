import { type FormDataBase } from "@/checkout/hooks/useForm";
import { type ExtractedMutationErrors } from "@/checkout/hooks/useSubmit/utils";
import { type LanguageCodeEnum } from "@/gql/graphql";

/** Shape returned by useMutation execute fn — replaces urql OperationResult */
export interface MutationOperationResult<TData = any> {
	data: TData | null;
	error?: unknown;
}

export type MutationVars<MutationFn> = MutationFn extends (vars: infer Vars) => any ? Vars : never;
export type MutationData<MutationFn> = MutationFn extends (vars: any) => Promise<infer Data> ? Data : never;

const commonVars = ["languageCode", "channel", "checkoutId"] as const;
export type CommonVar = (typeof commonVars)[number];

export type CommonVars = Record<CommonVar, string> & { languageCode: LanguageCodeEnum };

export type SubmitReturnWithErrors<TData extends FormDataBase, TErrorCodes extends string = string> = Promise<
	ExtractedMutationErrors<TData, TErrorCodes>
>;

export type MutationBaseFn = (vars: any) => Promise<MutationOperationResult>;

export type ParserProps<TData> = TData & CommonVars;

export type ParserFunction<TData extends FormDataBase, TMutationFn extends MutationBaseFn> = (
	data: ParserProps<TData>,
) => MutationVars<TMutationFn>;

export type SimpleSubmitFn<
	TData extends FormDataBase | {},
	TErrorCodes extends string = string,
> = keyof TData extends never
	? () => SubmitReturnWithErrors<TData, TErrorCodes>
	: (formData: TData) => SubmitReturnWithErrors<TData, TErrorCodes>;

type ResultOf<TMutationFn extends MutationBaseFn> = MutationData<TMutationFn> extends MutationOperationResult<
	infer TData
>
	? TData
	: never;

export type OperationName<TMutationFn extends MutationBaseFn> = Exclude<
	keyof ResultOf<TMutationFn>,
	"__typename"
>;

export type MutationReturn<TMutationFn extends MutationBaseFn> = TMutationFn extends (
	vars: any,
) => Promise<MutationOperationResult<infer TData>>
	? TData
	: never;

export type MutationResultData<TMutationFn extends MutationBaseFn> =
	OperationName<TMutationFn> extends keyof MutationReturn<TMutationFn>
		? MutationReturn<TMutationFn>[OperationName<TMutationFn>]
		: never;

export type MutationSuccessData<TMutationFn extends MutationBaseFn> = Exclude<
	MutationResultData<TMutationFn>,
	null | undefined
>;
