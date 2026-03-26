import { type RequestConfig, getRequestConfig } from "next-intl/server";
import { getUserLocale } from "../action/locale";

export default getRequestConfig(async ({ requestLocale }) => {
	const locale = await getUserLocale();
	return {
		locale,
		messages: ((await import(`../../messages/${locale}/${locale}.json`)) as { default: Messages }).default,
		onError: (error) => {
			console.log({ error });
		}
	} as RequestConfig;
});
