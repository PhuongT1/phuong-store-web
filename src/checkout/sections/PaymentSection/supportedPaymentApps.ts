import { AdyenDropIn } from "./AdyenDropIn/AdyenDropIn";
import { adyenGatewayId } from "./AdyenDropIn/types";
import { StripeComponent } from "./StripeElements/stripeComponent";
import { stripeGatewayId } from "./StripeElements/types";
import { VNPayComponent } from "./VNPay/VNPayComponent";
import { vnpayGatewayId } from "./VNPay/types";
import { DummyPaymentComponent } from "./DummyPayment/DummyPaymentComponent";
import { dummyPaymentGatewayId } from "./DummyPayment/types";

export const paymentMethodToComponent = {
	[adyenGatewayId]: AdyenDropIn,
	[stripeGatewayId]: StripeComponent,
	[vnpayGatewayId]: VNPayComponent,
	[dummyPaymentGatewayId]: DummyPaymentComponent,
};
