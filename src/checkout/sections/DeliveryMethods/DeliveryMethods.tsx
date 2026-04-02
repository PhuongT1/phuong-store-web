import React from "react";
import { useDeliveryMethodsForm } from "@sections/DeliveryMethods/useDeliveryMethodsForm";
import { RadioItem, RadioList, Typography, getFormattedMoney } from "@ui";
import { Package } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormProvider } from "react-hook-form";
import { useUser } from "@checkout/hooks/useUser";
import { type CommonSectionProps } from "@checkout/lib/globalTypes";
import { Separator } from "@components/ui";
import { useCheckout } from "@hooks/checkout";
import { DeliveryMethodsSkeleton } from "./DeliveryMethodsSkeleton";

export const DeliveryMethods: React.FC<CommonSectionProps> = ({ collapsed }) => {
	const t = useTranslations("checkout");
	const { checkout } = useCheckout();

	const { authenticated } = useUser();
	const { shippingMethods, shippingAddress } = checkout;
	const form = useDeliveryMethodsForm();

	const getSubtitle = ({ min, max }: { min?: number | null; max?: number | null }) => {
		if (!min || !max) {
			return undefined;
		}

		return `${min}-${max} business days`;
	};

	// Checkout chưa load xong → hiện skeleton thay vì null
	if (!checkout?.id) return <DeliveryMethodsSkeleton />;

	if (!checkout.isShippingRequired || collapsed) {
		return null;
	}

	return (
		<FormProvider {...form}>
			<Separator className="mt-2" />
			<div className="py-4" data-testid="deliveryMethods">
				<div className="mb-3 flex items-center gap-2.5">
					<div className="bg-icon-bg flex h-7 w-7 shrink-0 items-center justify-center rounded-(--radius)">
						<Package className="text-info h-3.5 w-3.5" strokeWidth={1.5} />
					</div>
					<Typography variant="section-label" className="mb-0!">
						{t("shippingMethod")}
					</Typography>
				</div>
				{authenticated && (!shippingAddress || !shippingAddress.country) ? (
					<p className="text-muted-foreground py-2 text-center text-sm">{t("shippingSelectAddress")}</p>
				) : !shippingMethods || shippingMethods.length === 0 ? (
					<div className="py-3">
						<p className="text-muted-foreground text-center text-sm">{t("noShippingMethods")}</p>
						<p className="text-muted-foreground mt-1 text-center text-xs">{t("fillAddress")}</p>
					</div>
				) : (
					<RadioList name="selectedMethodId">
						{shippingMethods.map(
							({ id, name, price, minimumDeliveryDays: min, maximumDeliveryDays: max }) => (
								<RadioItem
									key={id}
									variant={"border"}
									labelProps={{ className: "flex-1" }}
									optionProps={{
										label: (
											<div className="flex grow flex-col justify-center">
												<div className="flex flex-row items-center justify-between self-stretch">
													<p className="text-foreground/80">{name}</p>
													<p className="text-muted-foreground font-medium">{getFormattedMoney(price)}</p>
												</div>
												<p className="text-muted-foreground/60 text-xs">
													{getSubtitle({ min, max })}
												</p>
											</div>
										),
										value: id
									}}
								/>
							)
						)}
					</RadioList>
				)}
			</div>
		</FormProvider>
	);
};
