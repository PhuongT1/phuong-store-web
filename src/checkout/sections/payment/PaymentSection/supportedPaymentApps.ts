import { AdyenDropIn } from "./AdyenDropIn/AdyenDropIn";
import { adyenGatewayId } from "./AdyenDropIn/types";
import { DummyPaymentComponent } from "./DummyPayment/DummyPaymentComponent";
import { dummyPaymentGatewayId } from "./DummyPayment/types";
import { StripeComponent } from "./StripeElements/stripeComponent";
import { stripeGatewayId } from "./StripeElements/types";
import { vnpayGatewayId } from "./VNPay/types";
import { VNPayComponent } from "./VNPay/VNPayComponent";

export const paymentMethodToComponent = {
	[adyenGatewayId]: AdyenDropIn,
	[stripeGatewayId]: StripeComponent,
	[vnpayGatewayId]: VNPayComponent,
	[dummyPaymentGatewayId]: DummyPaymentComponent,
};
