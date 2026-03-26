import React, { Suspense } from "react";
import { useCheckout } from "@hooks/checkout";
import { useWatch } from "react-hook-form";
import { useCheckoutFormValidationTrigger } from "@/checkout/hooks/useCheckoutFormValidationTrigger";
import { getById } from "@/checkout/lib/utils/common";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { UserAddressSectionContainer } from "@/checkout/sections/UserAddressSectionContainer";
import { useUserBillingAddressForm } from "@/checkout/sections/UserBillingAddressSection/useUserBillingAddressForm";
import { AddressCreateForm } from "@/checkout/sections/AddressCreateForm/AddressCreateForm";
import { AddressEditForm } from "@/checkout/sections/AddressEditForm/AddressEditForm";
import { AddressList } from "@/checkout/sections/AddressList/AddressList";
import { type OptionalAddress } from "@/checkout/components/AddressForm/types";
import { getByMatchingAddress } from "@/checkout/components/AddressForm/utils";
import { type AddressFragment } from "@/checkout/graphql";
import { useBillingSameAsShippingForm } from "@/checkout/sections/GuestBillingAddressSection/useBillingSameAsShippingForm";

interface UserBillingAddressSectionProps {}

export const UserBillingAddressSection: React.FC<UserBillingAddressSectionProps> = ({}) => {
	useCheckout();

	const { form, userAddressActions } = useUserBillingAddressForm();
	const addressList = useWatch({ control: form.control, name: "addressList" }) ?? [];

	const handleSetBillingSameAsShipping = (address: OptionalAddress) => {
		const matchingAddress = addressList.find(getByMatchingAddress(address));

		if (!address || !matchingAddress) {
			return;
		}

		form.reset({ selectedAddressId: matchingAddress.id, addressList });
	};

	const billingSameAsShippingForm = useBillingSameAsShippingForm({
		autoSave: false,
		onSetBillingSameAsShipping: handleSetBillingSameAsShipping
	});

	useCheckoutFormValidationTrigger({
		 
		scope: "billingAddress" as any,
		form: billingSameAsShippingForm
	});

	const {
		values: { billingSameAsShipping }
	} = billingSameAsShippingForm;

	return (
		<Suspense fallback={<AddressSectionSkeleton />}>
			{/* {isShippingRequired && (
				<div className="mb-4">
					<FormProvider form={billingSameAsShippingForm}>
						<Checkbox
							name="billingSameAsShipping"
							label="Use shipping address as billing address"
							data-testid={"useShippingAsBillingCheckbox"}
						/>
					</FormProvider>
				</div>
			)} */}
			{!billingSameAsShipping && (
				<div className="pb-2">
					<UserAddressSectionContainer>
						{({
							displayAddressCreate,
							displayAddressEdit,
							displayAddressList,
							setDisplayAddressCreate,
							setDisplayAddressEdit,
							editedAddressId
						}) => (
							<>
								{displayAddressCreate && (
									<AddressCreateForm
										onClose={() => setDisplayAddressCreate(false)}
										onSuccess={(address) => {
											setDisplayAddressCreate(false);
											void userAddressActions.onAddressCreateSuccess(address);
										}}
									/>
								)}

								{displayAddressEdit && (
									<AddressEditForm
										title="Billing address"
										onClose={() => setDisplayAddressEdit()}
										address={addressList.find(getById(editedAddressId)) as AddressFragment}
										onUpdate={(address) => {
											setDisplayAddressEdit(undefined);
											void userAddressActions.onAddressUpdateSuccess(address);
										}}
										onDelete={(id) => {
											setDisplayAddressEdit(undefined);
											void userAddressActions.onAddressDeleteSuccess(id);
										}}
									/>
								)}

								{displayAddressList && (
									<AddressList
										onEditChange={setDisplayAddressEdit}
										onAddAddressClick={() => setDisplayAddressCreate(true)}
										title="Billing address"
										form={form}
									/>
								)}
							</>
						)}
					</UserAddressSectionContainer>
				</div>
			)}
		</Suspense>
	);
};
