import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";

interface AddressFormActionsProps {
	onDelete?: () => void;
	onCancel: () => void;
	onSubmit: () => void;
	loading: boolean;
}

export const AddressFormActions: React.FC<AddressFormActionsProps> = ({
	onSubmit,
	onDelete,
	onCancel,
	loading
}) => {
	const t = useTranslations("checkout");
	return (
		<div className="flex flex-row items-center justify-end gap-3">
			{onDelete && (
				<div className="mr-auto flex">
					<Button
						variant="outline"
						className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
						onClick={onDelete}
					>
						<Trash2 className="mr-2 h-4 w-4" aria-hidden /> {t("deleteAddress")}
					</Button>
				</div>
			)}

			<Button
				variant="outline"
				className="rounded-lg px-6 font-medium"
				onClick={onCancel}
			>
				{t("cancel")}
			</Button>
			{loading ? (
				<Button disabled variant="info" className="px-6" loading>
					{t("processing")}
				</Button>
			) : (
				<Button variant="info" className="px-6" onClick={onSubmit}>
					{t("saveAddress")}
				</Button>
			)}
		</div>
	);
};
