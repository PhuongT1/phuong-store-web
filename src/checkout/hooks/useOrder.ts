import { useEffect, useState } from "react";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { LANGUAGE_CODE_DEFAULT } from "@/constants";
import { type Order, OrderDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api/fetchGraphQL";

const useOrder = () => {
	const { orderId } = getQueryParams();
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOrder = async () => {
			if (!orderId) {
				setLoading(false);
				return;
			}
			setLoading(true);
			try {
				const { order: data } = await executeGraphQL(OrderDocument, {
					variables: {
						id: orderId,
						languageCode: LANGUAGE_CODE_DEFAULT
					},
					withAuth: true
				});
				setOrder(data as Order);
			} catch (error) {
				console.error("Error fetching order:", error);
			} finally {
				setLoading(false);
			}
		};

		void fetchOrder();
	}, [orderId]);

	return { order, loading };
};

export { useOrder };
