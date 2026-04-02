import { type FC } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@components/ui";

type SummaryCardProps = React.ComponentProps<typeof Card>;

export const SummaryCard: FC<SummaryCardProps> = ({ className, ...rest }) => {
	return (
		<Card
			{...rest}
			className={cn(
				"bg-card-elevated border-card-elevated-border shadow-card-elevated flex max-w-full flex-col gap-4 overflow-hidden border p-6 backdrop-blur-sm sm:p-8 md:rounded-2xl",
				className
			)}
		/>
	);
};
