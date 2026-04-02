import { useTranslations } from "next-intl";
import { FormProvider } from "react-hook-form";
import { useGuestUserForm } from "@/checkout/sections/auth/GuestUser/useGuestUserForm";
import { FormCheckbox } from "@/components/ui/checkbox/FormCheckbox";
import { FormInput } from "@components/ui";

interface GuestUserProps {
	email: string;
}

export const GuestUser: React.FC<GuestUserProps> = ({ email: initialEmail }) => {
	const t = useTranslations("checkout");
	const { form } = useGuestUserForm({ initialEmail });
	const { control } = form;

	return (
		<FormProvider {...form}>
			<div className="grid grid-cols-1 gap-3 pt-3 pb-4">
				<FormInput
					control={control}
					name="email"
					type="text"
					inputProps={{ placeholder: "Email *" }}
					affixWrapperProps={{ allowClear: true }}
				/>
				<FormCheckbox
					control={control}
					label={t("createAccountFaster")}
					name="createAccount"
					data-testid="createAccountCheckbox"
				/>
			</div>
		</FormProvider>
	);
};
