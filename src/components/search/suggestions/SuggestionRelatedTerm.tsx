import Link from "next/link";
import { SearchIcon } from "lucide-react";

type Props = {
	label: string;
	href: string;
	onClose: () => void;
};

const SuggestionRelatedTerm = ({ label, href, onClose }: Props) => (
	<Link
		href={href}
		onClick={onClose}
		className="text-foreground/80 group hover:text-foreground flex items-center gap-2.5 py-1.5 text-sm transition-colors"
	>
		<SearchIcon className="text-muted-foreground group-hover:text-foreground h-3.5 w-3.5 shrink-0 transition-colors" />
		<span>{label}</span>
	</Link>
);

export { SuggestionRelatedTerm };
