import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api";
import { MainProductLayout } from "@components/layouts";
import { ProductList } from "@components/product";

const ProductListSale = async ({ params }: { params: { channel: string } }) => {
	const data = await executeGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "sale-products",
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
ProductListSale.displayName = "ProductListSale";

export { ProductListSale };
