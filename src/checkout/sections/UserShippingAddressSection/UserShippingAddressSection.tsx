import React, { Suspense } from "react";
import { useWatch } from "react-hook-form";
import { getById } from "@/checkout/lib/utils/common";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { UserAddressSectionContainer } from "@/checkout/sections/UserAddressSectionContainer";
import { useUserShippingAddressForm } from "@/checkout/sections/UserShippingAddressSection/useUserShippingAddressForm";
import { AddressCreateForm } from "@/checkout/sections/AddressCreateForm";
import { AddressEditForm } from "@/checkout/sections/AddressEditForm";
import { AddressList } from "@/checkout/sections/AddressList/AddressList";
import { type AddressFragment } from "@/checkout/graphql";
import { useCheckoutFormValidationTrigger } from "@/checkout/hooks/useCheckoutFormValidationTrigger";
import { useAvailableShippingCountries } from "@/checkout/hooks/useAvailableShippingCountries";

interface UserShippingAddressSectionProps {}

export const UserShippingAddressSection: React.FC<UserShippingAddressSectionProps> = ({}) => {
	const { availableShippingCountries } = useAvailableShippingCountries();
	const { form, userAddressActions } = useUserShippingAddressForm();
	const addressList = useWatch({ control: form.control, name: "addressList" }) ?? [];

	useCheckoutFormValidationTrigger({
		scope: "shippingAddress",
		form: form
	});

	return (
		<Suspense fallback={<AddressSectionSkeleton />}>
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
								availableCountries={availableShippingCountries}
								onClose={() => setDisplayAddressCreate(false)}
								onSuccess={(address) => {
									setDisplayAddressCreate(false);
									void userAddressActions.onAddressCreateSuccess(address);
								}}
							/>
						)}

						{displayAddressEdit && (
							<AddressEditForm
								availableCountries={availableShippingCountries}
								title="Địa chỉ nhận hàng"
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
								title="Địa chỉ nhận hàng"
								checkAddressAvailability={true}
								form={form}
							/>
						)}
					</>
				)}
			</UserAddressSectionContainer>
		</Suspense>
	);
};
