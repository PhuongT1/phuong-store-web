type Props = { label: string };

const SuggestionLabel = ({ label }: Props) => (
	<p className="text-muted-foreground mb-2 text-xs font-semibold tracking-[0.15em] uppercase">{label}</p>
);

export { SuggestionLabel };
