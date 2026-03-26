import { Button } from "@/components/ui";
import { TrashIcon } from "@/checkout/ui-kit/icons";

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
	return (
		<div className="flex flex-row items-center justify-end gap-3">
			{onDelete && (
				<div className="mr-auto flex">
					<Button
						variant="outline"
						className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
						onClick={onDelete}
					>
						<TrashIcon className="mr-2 h-4 w-4" aria-hidden /> Xóa địa chỉ
					</Button>
				</div>
			)}

			<Button
				variant="outline"
				className="rounded-lg border-gray-200 px-6 font-medium text-gray-600 hover:bg-gray-50"
				onClick={onCancel}
			>
				Hủy
			</Button>
			{loading ? (
				<Button disabled className="rounded-lg bg-blue-600 px-6 font-medium text-white opacity-70">
					Đang xử lý…
				</Button>
			) : (
				<Button
					className="rounded-lg bg-blue-600 px-6 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
					onClick={onSubmit}
				>
					Lưu địa chỉ
				</Button>
			)}
		</div>
	);
};
