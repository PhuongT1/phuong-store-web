import React from "react";
import { useCheckout } from "@hooks/checkout";
import { Divider } from "@checkout/components/Divider";
import { type CommonSectionProps } from "@checkout/lib/globalTypes";
import { useDeliveryMethodsForm } from "@sections/DeliveryMethods/useDeliveryMethodsForm";
import { useUser } from "@checkout/hooks/useUser";
import { FormProvider } from "react-hook-form";

import { RadioItem, RadioList, Typography, getFormattedMoney } from "@ui";

export const DeliveryMethods: React.FC<CommonSectionProps> = ({ collapsed }) => {
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

	if (!checkout || !checkout?.isShippingRequired || collapsed) {
		return null;
	}

	return (
		<FormProvider {...form}>
			<Divider />
			<div className="py-4" data-testid="deliveryMethods">
				<Typography variant="title">Hình thức nhận hàng</Typography>
				{authenticated && (!shippingAddress || !shippingAddress.country) ? (
					<p className="text-muted-foreground py-2 text-center text-sm">
						Vui lòng chọn hoặc thêm địa chỉ giao hàng để xem các phương thức vận chuyển.
					</p>
				) : !shippingMethods || shippingMethods.length === 0 ? (
					<div className="py-3">
						<p className="text-muted-foreground text-center text-sm">
							Không tìm thấy phương thức vận chuyển.
						</p>
						<p className="text-muted-foreground mt-1 text-center text-xs">
							Vui lòng điền đầy đủ địa chỉ giao hàng bên trên.
						</p>
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
											<div className="pointer-events-none flex grow flex-col justify-center">
												<div className="flex flex-row items-center justify-between self-stretch">
													<p>{name}</p>
													<p className="text-destructive">{getFormattedMoney(price)}</p>
												</div>
												<p className="font-xs" color="secondary">
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
