import { AlertTriangle, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useOrder } from "@/checkout/hooks/useOrder";
import { usePaymentStatus } from "@/checkout/sections/payment/PaymentSection/utils";
import { type OrderChargeStatusEnum, type OrderAuthorizeStatusEnum } from "@/gql/graphql";
import { Section } from "./Section";

const ErrorMessage = ({ message }: { message: string }) => {
	return (
		<>
			<p className="mr-1 text-destructive">{message}</p>
			<AlertTriangle className="h-4 w-4 text-destructive" />
		</>
	);
};

const SuccessMessage = ({ message }: { message: string }) => {
	return (
		<>
			<p className="mr-1 text-success">{message}</p>
			<CheckCircle className="h-4 w-4 text-success" />
		</>
	);
};

const PaymentSection = () => {
	const t = useTranslations("checkout");
	const { order } = useOrder();
	const paymentStatus = usePaymentStatus(
		order ?? {
			chargeStatus: "NONE" as OrderChargeStatusEnum,
			authorizeStatus: "NONE" as OrderAuthorizeStatusEnum
		}
	);

	const messagePayment = () => {
		switch (paymentStatus) {
			case "authorized":
				return <SuccessMessage message={t("paymentAuthorized")} />;
			case "paidInFull":
				return <SuccessMessage message={t("paymentReceived")} />;
			case "overpaid":
				return <ErrorMessage message={t("paymentOverpaid")} />;
			default:
				return <SuccessMessage message={t("cod")} />;
		}
	};

	return (
		<Section title={t("paymentMethod")} className="mb-0">
			<div data-testid="paymentStatus">
				<div className="flex flex-row items-center">{messagePayment()}</div>
			</div>
		</Section>
	);
};
PaymentSection.displayName = "PaymentSection";

export { PaymentSection };
