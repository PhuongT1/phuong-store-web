import { useTranslations } from "next-intl";
import { type ShippingFragment , type Order, type ShippingMethod } from "@/gql/graphql";
import { Section } from "./Section";

const isShipping = (deliveryMethod: Order["deliveryMethod"]) =>
	deliveryMethod?.__typename === "ShippingMethod";

export const DeliverySection = ({ deliveryMethod }: { deliveryMethod: Order["deliveryMethod"] }) => {
	const t = useTranslations("checkout");
	const getDeliveryEstimateText = () => {
		const { minimumDeliveryDays: min, maximumDeliveryDays: max } = deliveryMethod as ShippingMethod;

		if (!min || !max) {
			return undefined;
		}

		return `${min}-${max} business days`;
	};

	return (
		<Section title={t("shippingMethod")} className="mb-0">
			{!isShipping(deliveryMethod) ? (
				<p color="secondary">{t("cannotDeliverShort")}</p>
			) : (
				<>
					<p>{deliveryMethod?.name}</p>
					<p>{getDeliveryEstimateText()}</p>
				</>
			)}
		</Section>
	);
};
