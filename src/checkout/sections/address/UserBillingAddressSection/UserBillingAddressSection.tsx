import React, { Suspense } from "react";
import { useWatch } from "react-hook-form";
import { type OptionalAddress } from "@/checkout/components/AddressForm/types";
import { getByMatchingAddress } from "@/checkout/components/AddressForm/utils";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { useCheckoutFormValidationTrigger } from "@/checkout/hooks/useCheckoutFormValidationTrigger";
import { getById } from "@/checkout/lib/utils/common";
import { AddressCreateForm } from "@/checkout/sections/address/AddressCreateForm/AddressCreateForm";
import { AddressEditForm } from "@/checkout/sections/address/AddressEditForm/AddressEditForm";
import { AddressList } from "@/checkout/sections/address/AddressList/AddressList";
import { useBillingSameAsShippingForm } from "@/checkout/sections/address/GuestBillingAddressSection/useBillingSameAsShippingForm";
import { UserAddressSectionContainer } from "@/checkout/sections/address/UserAddressSectionContainer";
import { useUserBillingAddressForm } from "@/checkout/sections/address/UserBillingAddressSection/useUserBillingAddressForm";
import { type AddressFragment } from "@/gql/graphql";
import { useCheckout } from "@hooks/checkout";

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
		 
		scope: "billingAddress",
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

							{displayAddressList && addressList.length === 0 && (
								<AddressCreateForm
									onClose={() => undefined}
									onSuccess={(address) => {
										void userAddressActions.onAddressCreateSuccess(address);
									}}
								/>
							)}

							{displayAddressList && addressList.length > 0 && (
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
