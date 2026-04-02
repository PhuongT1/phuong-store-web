import { type Metadata } from "next";
import { ProductDetailsDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";
import { generatePageMetadata } from "@/lib/metadata";
import { type Channel } from "@/types";
import { MainProductLayout } from "@components/layouts";
import { RatingDetail } from "./RatingDetail";

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata("rating");

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
