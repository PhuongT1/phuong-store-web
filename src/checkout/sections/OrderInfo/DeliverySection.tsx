import { Section } from "./Section";
import { type Order, type ShippingMethod } from "@/gql/graphql";
import { type ShippingFragment } from "@/checkout/graphql";

const isShipping = (deliveryMethod: Order["deliveryMethod"]) =>
	deliveryMethod?.__typename === "ShippingMethod";

export const DeliverySection = ({ deliveryMethod }: { deliveryMethod: Order["deliveryMethod"] }) => {
	const getDeliveryEstimateText = () => {
		const { minimumDeliveryDays: min, maximumDeliveryDays: max } = deliveryMethod as ShippingMethod;

		if (!min || !max) {
			return undefined;
		}

		return `${min}-${max} business days`;
	};

	return (
		<Section title="Hình thức nhận hàng" className="mb-0">
			{!isShipping(deliveryMethod) ? (
				<p color="secondary">Không thể giao hàng </p>
			) : (
				<>
					<p>{deliveryMethod?.name}</p>
					<p>{getDeliveryEstimateText()}</p>
				</>
			)}
		</Section>
	);
};
