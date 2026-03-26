import { type FC } from "react";
import { Card } from "@components/ui";
import { cn } from "@/lib/utils";

type SummaryCardProps = React.ComponentProps<typeof Card>;

export const SummaryCard: FC<SummaryCardProps> = ({ className, ...rest }) => {
	return (
		<Card
			{...rest}
			className={cn(
				"flex max-w-full flex-col gap-4 overflow-hidden border-none bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8 md:rounded-2xl lg:shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
				className
			)}
		/>
	);
};
