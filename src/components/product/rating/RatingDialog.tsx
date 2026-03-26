import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button
} from "@ui";

type RatingDialogProps = {
	onCancelClick?: () => void;
	onSubmit?: () => void;
	children?: React.ReactNode;
	isOpen?: boolean;
	alertDialogProps?: React.ComponentPropsWithoutRef<typeof AlertDialog>;
};

const RatingDialog = ({ onSubmit, onCancelClick, children, alertDialogProps }: RatingDialogProps) => {
	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<AlertDialog {...alertDialogProps}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="mb-3 flex justify-center text-2xl">
							Đánh giá sản phẩm
						</AlertDialogTitle>
						<AlertDialogDescription />
						{children && children}
					</AlertDialogHeader>
					<AlertDialogFooter>
						<div className="flex justify-end gap-3">
							<Button variant={"outline"} size={"base"} onClick={() => onCancelClick?.()}>
								Huỷ
							</Button>
							<Button variant={"default"} size={"base"} type="submit" onClick={() => onSubmit?.()}>
								Gửi đánh giá
							</Button>
						</div>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export { RatingDialog };
