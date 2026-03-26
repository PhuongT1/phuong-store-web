import { FormProvider } from "react-hook-form";
import { FormInput } from "@components/ui";
import { useGuestUserForm } from "@/checkout/sections/GuestUser/useGuestUserForm";
import { FormCheckbox } from "@/components/ui/checkbox/FormCheckbox";

interface GuestUserProps {
	email: string;
}

export const GuestUser: React.FC<GuestUserProps> = ({ email: initialEmail }) => {
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
					label="Tạo tài khoản để thanh toán nhanh hơn"
					name="createAccount"
					data-testid="createAccountCheckbox"
				/>
			</div>
		</FormProvider>
	);
};
