import { LinkWithChannel } from "../navigation/LinkWithChannel";
import { RenderRichText } from "../product";
import { cn } from "@/lib/utils";
import { type PageGetBySlugQuery } from "@/gql/graphql";

type PageElementProps = {
	loading: "eager" | "lazy";
	priority?: boolean;
	className?: string;
} & PageGetBySlugQuery;

const PageElement = ({ page, className }: PageElementProps) => {
	if (!page) return <></>;

	const { slug, id, title, attributes } = page;
	return (
		<li data-testid="PageElement" className={cn(" group overflow-hidden rounded-lg bg-white", className)}>
			<LinkWithChannel href={`/pages/${slug}`} key={id} className="flex flex-col gap-2">
				{attributes.map((attribute) => {
					return attribute.values.map((value) => <RenderRichText key={value.id} item={value?.richText} />);
				})}
				<div>
					<span className="text-nature-900 my-0.5 text-sm font-medium">{title}</span>
				</div>
			</LinkWithChannel>
		</li>
	);
};

export { PageElement };
