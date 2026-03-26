import { type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const NextIntlProvider = async ({ children }: { children: ReactNode }) => {
	const messages = await getMessages();

	return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
};

export { NextIntlProvider };
