import { MainProductLayout } from "@components/layouts";
import { ProductList } from "@components/product";
import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api";

const ProductListFeature = async ({ params }: { params: { channel: string } }) => {
	const data = await executeGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "featured-products",
			channel: params.channel
		}
	});

	if (!data.collection?.products) {
		return null;
	}

	const products = data.collection?.products.edges.map(({ node: product }) => product);

	return (
		<MainProductLayout title={data.collection.name}>
			<ProductList products={products} />
		</MainProductLayout>
	);
};
ProductListFeature.displayName = "ProductListFeature";

export { ProductListFeature };
