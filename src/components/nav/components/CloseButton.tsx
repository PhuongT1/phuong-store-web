import { Cross2Icon } from "@radix-ui/react-icons";

import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = {
	onClick: () => void;
} & Pick<HTMLAttributes<HTMLButtonElement>, "aria-controls">;

export const CloseButton = (props: Props) => {
	return (
		<button
			className={cn(
				"top-0 ml-auto flex h-8 w-8 flex-col items-center justify-center gap-1.5 self-end self-center md:hidden"
			)}
			aria-controls={props["aria-controls"]}
			aria-expanded={true}
			aria-label="Close menu"
			onClick={props.onClick}
		>
			<Cross2Icon className="h-5 w-5" />
			<span className="sr-only">Close</span>
		</button>
	);
};
