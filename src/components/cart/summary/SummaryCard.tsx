import { type FC } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@components/ui";

type SummaryCardProps = React.ComponentProps<typeof Card>;

export const SummaryCard: FC<SummaryCardProps> = ({ className, ...rest }) => {
	return (
		<Card
				{...rest}
				className={cn(
					"bg-transparent flex max-w-full flex-col gap-3 overflow-hidden border-0 p-0 shadow-none backdrop-blur-sm min-[1025px]:rounded-2xl min-[1025px]:border min-[1025px]:border-card-elevated-border min-[1025px]:bg-card-elevated min-[1025px]:p-8 min-[1025px]:shadow-card-elevated",
					className
				)}
			/>
	);
};
