import { MainProductLayout } from "@components/layouts";
import { RatingDetail } from "./RatingDetail";
import { ProductDetailsDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { type Channel } from "@/types";

export type SlugPageProps = {
	params: { slug: string } & Channel;
};

export default async function Page({ params }: SlugPageProps) {
	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
			channel: params.channel
		}
	});

	return (
		<MainProductLayout isBg={false}>
			<div className="detail-grid">
				<div className="detail-content">
					<RatingDetail product={product} />
				</div>
			</div>
		</MainProductLayout>
	);
}
