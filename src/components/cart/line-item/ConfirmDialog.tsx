import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, ConfirmDialog } from "@components/ui";

type ConfirmDeleteDialogProps = React.ComponentPropsWithoutRef<typeof ConfirmDialog>;
const ConfirmDeleteDialog = ({ confirmButtonProps, ...rest }: ConfirmDeleteDialogProps) => {
	const t = useTranslations("cart");
	return (
		<ConfirmDialog
			{...rest}
			dialogDescriptionContent={t("confirmDelete")}
			showConfirmButton
			dialogTriggerProps={{
				children: (
					<Button variant="icon" size="icon">
						<Trash2 size={20} strokeWidth={1} />
					</Button>
				)
			}}
			confirmButtonProps={{
				children: t("delete"),
				...confirmButtonProps
			}}
			cancelButtonProps={{
				children: t("cancelDelete")
			}}
		/>
	);
};
ConfirmDeleteDialog.displayName = "ConfirmDeleteDialog";
export { ConfirmDeleteDialog };
