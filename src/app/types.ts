import type { NamespaceKeys, NestedKeyOf, useTranslations } from "next-intl";
// import type { getTranslations } from "next-intl/server";

export type TranslationNamespace = NamespaceKeys<IntlMessages, NestedKeyOf<IntlMessages>>;
export type GetTranslations<Namespace extends TranslationNamespace = never> = Awaited<
	ReturnType<typeof useTranslations<Namespace>>
>;

export type TranslationMessage<Namespace extends TranslationNamespace = never> = Parameters<
	GetTranslations<Namespace>
>[0];

export type ServerError = { code: string };
