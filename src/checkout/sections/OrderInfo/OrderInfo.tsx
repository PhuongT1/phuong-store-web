import { Divider } from "@checkout/components";
import { Address } from "@checkout/components/Address";
import { useOrder } from "@checkout/hooks/useOrder";
import { DeliverySection } from "./DeliverySection";
import { PaymentSection } from "./PaymentSection";
import { Section } from "./Section";

export const OrderInfo = () => {
	const { order } = useOrder();

	if (!order) return <></>;

	const { deliveryMethod, shippingAddress, userEmail } = order;

	return (
		<section className="mt-8 flex flex-col gap-6">
			<Divider />
			<PaymentSection />
			<Divider />
			<DeliverySection deliveryMethod={deliveryMethod} />
			<Divider />
			<Section title="Thông tin liên hệ" className="mb-0">
				<p>{userEmail}</p>
			</Section>
			<Divider />
			{shippingAddress && (
				<>
					<Section title="Địa chỉ giao hàng" className="mb-0">
						<Address address={shippingAddress} />
					</Section>
				</>
			)}
		</section>
	);
};
