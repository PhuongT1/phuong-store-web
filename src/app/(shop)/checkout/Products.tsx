import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api";

async function Products() {
	const data = await executeGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "sale-products",
			channel: "hcm"
		}
	});

	return <div>{data.collection?.name}</div>;
}
export { Products };
