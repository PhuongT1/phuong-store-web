import { Trash2 } from "lucide-react";
import { Button, ConfirmDialog } from "@components/ui";

type ConfirmDeleteDialogProps = React.ComponentPropsWithoutRef<typeof ConfirmDialog>;
const ConfirmDeleteDialog = ({ confirmButtonProps, ...rest }: ConfirmDeleteDialogProps) => {
	return (
		<ConfirmDialog
			{...rest}
			dialogDescriptionContent="Bạn chắc chắn muốn xóa sản phẩm này?"
			showConfirmButton
			dialogTriggerProps={{
				children: (
					<Button variant="icon" size="icon">
						<Trash2 size={20} strokeWidth={1} />
					</Button>
				)
			}}
			confirmButtonProps={{
				children: "Xoá",
				...confirmButtonProps
			}}
			cancelButtonProps={{
				children: "Không xoá"
			}}
		/>
	);
};
ConfirmDeleteDialog.displayName = "ConfirmDeleteDialog";
export { ConfirmDeleteDialog };
