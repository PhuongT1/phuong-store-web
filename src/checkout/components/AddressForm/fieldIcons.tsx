import { type FieldIconConfig } from "./addressFieldConfig";

const renderIcons = (icons: FieldIconConfig[]) => {
	if (!icons || icons.length === 0) return null;
	return (
		<div className="flex gap-1">
			{icons.map(({ icon: Icon, ...rest }, idx) => (
				<Icon key={idx} {...rest} />
			))}
		</div>
	);
};

export { renderIcons };
