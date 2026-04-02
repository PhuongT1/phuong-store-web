import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { PasswordChangeForm } from "./PasswordChangeForm";

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata("account");

export default async function SettingsPage() {
	const t = await getTranslations("account");

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">{t("settingsTitle")}</h1>
			<PasswordChangeForm />
		</div>
	);
}
