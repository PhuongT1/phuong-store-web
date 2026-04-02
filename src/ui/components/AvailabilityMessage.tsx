import { XIcon } from "lucide-react";

type Props = {
	isAvailable: boolean;
};

const pClasses = "ml-1 text-sm font-semibold text-muted-foreground";

export const AvailabilityMessage = ({ isAvailable }: Props) => {
	if (!isAvailable) {
		return (
			<div className="mt-6 flex items-center">
				<XIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
				<p className={pClasses}>Sản phẩm tạm thời hết hàng</p>
			</div>
		);
	}
	return <></>;
};
