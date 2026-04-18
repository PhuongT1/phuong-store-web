import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button, ConfirmDialog } from "@components/ui";

type ConfirmDeleteDialogProps = React.ComponentPropsWithoutRef<typeof ConfirmDialog> & {
	triggerButtonClassName?: string;
	triggerIconClassName?: string;
};

const ConfirmDeleteDialog = ({
	confirmButtonProps,
	triggerButtonClassName,
	triggerIconClassName,
	...rest
}: ConfirmDeleteDialogProps) => {
	const t = useTranslations("cart");
	return (
		<ConfirmDialog
			{...rest}
			dialogDescriptionContent={t("confirmDelete")}
			showConfirmButton
			dialogTriggerProps={{
				children: (
					<Button variant="icon" size="icon" className={triggerButtonClassName}>
						<Trash2 size={20} strokeWidth={1} className={cn(triggerIconClassName)} />
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
