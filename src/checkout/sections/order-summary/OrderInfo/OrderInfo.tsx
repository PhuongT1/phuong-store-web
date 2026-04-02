import { useTranslations } from "next-intl";
import { Address } from "@checkout/components/Address";
import { useOrder } from "@checkout/hooks/useOrder";
import { DeliverySection } from "./DeliverySection";
import { PaymentSection } from "./PaymentSection";
import { Section } from "./Section";

export const OrderInfo = () => {
	const t = useTranslations("checkout");
	const { order } = useOrder();

	if (!order) return <></>;

	const { deliveryMethod, shippingAddress, userEmail } = order;

	return (
		<section className="flex flex-col divide-y divide-border [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
			<PaymentSection />
			<DeliverySection deliveryMethod={deliveryMethod} />
			<Section title={t("contactInfo")} className="mb-0">
				<p>{userEmail}</p>
			</Section>
			{shippingAddress && (
				<Section title={t("shippingAddress")} className="mb-0">
					<Address address={shippingAddress} />
				</Section>
			)}
		</section>
	);
};
