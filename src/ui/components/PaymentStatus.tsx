"use client";

import { AlertCircleIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { PaymentChargeStatusEnum } from "@/gql/graphql";

type Props = {
	status: PaymentChargeStatusEnum;
};

export const PaymentStatus = ({ status }: Props) => {
	const t = useTranslations("orders.paymentStatus");

	switch (status) {
		case PaymentChargeStatusEnum.NotCharged:
			return (
				<p className="text-destructive flex items-center gap-1">
					<XCircleIcon className="h-4 w-4" aria-hidden />
					{t("NOT_CHARGED")}
				</p>
			);
		case PaymentChargeStatusEnum.Cancelled:
			return (
				<p className="text-destructive flex items-center gap-1">
					<XCircleIcon className="h-4 w-4" aria-hidden />
					{t("CANCELLED")}
				</p>
			);
		case PaymentChargeStatusEnum.Refused:
			return (
				<p className="text-destructive flex items-center gap-1">
					<XCircleIcon className="h-4 w-4" aria-hidden />
					{t("REFUSED")}
				</p>
			);
		case PaymentChargeStatusEnum.FullyCharged:
			return (
				<p className="text-success flex items-center gap-1">
					<CheckCircleIcon className="h-4 w-4" aria-hidden />
					{t("FULLY_CHARGED")}
				</p>
			);
		case PaymentChargeStatusEnum.FullyRefunded:
			return (
				<p className="text-success flex items-center gap-1">
					<CheckCircleIcon className="h-4 w-4" aria-hidden />
					{t("FULLY_REFUNDED")}
				</p>
			);
		case PaymentChargeStatusEnum.PartiallyCharged:
			return (
				<p className="text-warning flex items-center gap-1">
					<AlertCircleIcon className="h-4 w-4" aria-hidden />
					{t("PARTIALLY_CHARGED")}
				</p>
			);
		case PaymentChargeStatusEnum.PartiallyRefunded:
			return (
				<p className="text-warning flex items-center gap-1">
					<AlertCircleIcon className="h-4 w-4" aria-hidden />
					{t("PARTIALLY_REFUNDED")}
				</p>
			);
		case PaymentChargeStatusEnum.Pending:
			return (
				<p className="text-warning flex items-center gap-1">
					<ClockIcon className="h-4 w-4" aria-hidden />
					{t("PENDING")}
				</p>
			);
		default:
			return null;
	}
};
