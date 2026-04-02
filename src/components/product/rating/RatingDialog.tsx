import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button
} from "@ui";
import { useTranslations } from "next-intl";

type RatingDialogProps = {
	onCancelClick?: () => void;
	onSubmit?: () => void;
	children?: React.ReactNode;
	isOpen?: boolean;
	alertDialogProps?: React.ComponentPropsWithoutRef<typeof AlertDialog>;
};

const RatingDialog = ({ onSubmit, onCancelClick, children, alertDialogProps }: RatingDialogProps) => {
	const t = useTranslations("rating");
	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<AlertDialog {...alertDialogProps}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="mb-3 flex justify-center text-2xl">{t("title")}</AlertDialogTitle>
						<AlertDialogDescription />
						{children && children}
					</AlertDialogHeader>
					<AlertDialogFooter>
						<div className="flex justify-end gap-3">
							<Button variant={"outline"} size={"base"} onClick={() => onCancelClick?.()}>
								{t("cancel")}
							</Button>
							<Button variant={"default"} size={"base"} type="submit" onClick={() => onSubmit?.()}>
								{t("submit")}
							</Button>
						</div>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export { RatingDialog };
