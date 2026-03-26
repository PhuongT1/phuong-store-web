import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

type LoaderIconProps = React.ComponentProps<typeof Loader2Icon>;

const LoadingIcon = ({ className, size = 40, ...rest }: LoaderIconProps) => (
	<Loader2Icon
		{...rest}
		role="status"
		aria-label="Loading"
		color="var(--primary)"
		size={size}
		strokeWidth={1.5}
		className={cn("animate-spin", className)}
	/>
);

export { LoadingIcon };
