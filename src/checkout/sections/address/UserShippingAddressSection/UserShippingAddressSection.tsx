import React, { Suspense, useState } from "react";
import { ChevronRight, Navigation } from "lucide-react";
import { useTranslations } from "next-intl";
import { useWatch } from "react-hook-form";
import { Address } from "@/checkout/components/Address";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { useAvailableShippingCountries } from "@/checkout/hooks/useAvailableShippingCountries";
import { useCheckoutFormValidationTrigger } from "@/checkout/hooks/useCheckoutFormValidationTrigger";
import { getById } from "@/checkout/lib/utils/common";
import { AddressCreateForm } from "@/checkout/sections/address/AddressCreateForm";
import { Button, Typography } from "@/components/ui";
import { AddressSelectModal } from "./AddressSelectModal";
import { useUserShippingAddressForm } from "./useUserShippingAddressForm";

export const UserShippingAddressSection: React.FC = () => {
	const t = useTranslations("checkout");
	const { availableShippingCountries } = useAvailableShippingCountries();
	const { form, userAddressActions } = useUserShippingAddressForm();

	const addressList = useWatch({ control: form.control, name: "addressList" }) ?? [];
	const selectedAddressId = useWatch({ control: form.control, name: "selectedAddressId" });
	const selectedAddress = addressList.find(getById(selectedAddressId));

	const [showSelectModal, setShowSelectModal] = useState(false);

	useCheckoutFormValidationTrigger({ scope: "shippingAddress", form });

	// No addresses yet — show create form directly (no modal)
	if (addressList.length === 0) {
		return (
			<Suspense fallback={<AddressSectionSkeleton />}>
				<AddressCreateForm
					availableCountries={availableShippingCountries}
					onClose={() => {}}
					onSuccess={(address) => {
						void userAddressActions.onAddressCreateSuccess(address);
					}}
				/>
			</Suspense>
		);
	}

	return (
		<Suspense fallback={<AddressSectionSkeleton />}>
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-2.5">
					<div className="bg-icon-bg flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius)">
						<Navigation className="text-info h-5 w-5" strokeWidth={1.5} />
					</div>
					<Typography variant="section-label" className="mb-0!">
						{t("shippingAddress")}
					</Typography>
				</div>

				{selectedAddress && (
					<div className="border-info bg-info/5 relative rounded-xl border p-4 pr-12">
						<Address address={selectedAddress} />
						<Button
							variant="ghost"
							size="icon"
							type="button"
							onClick={() => setShowSelectModal(true)}
							className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 h-8 w-8 -translate-y-1/2"
						>
							<ChevronRight className="h-5 w-5" />
						</Button>
					</div>
				)}

				{/* Select modal — all address management: select, edit, add new */}
				<AddressSelectModal
					open={showSelectModal}
					onOpenChange={setShowSelectModal}
					addressList={addressList}
					selectedAddressId={selectedAddressId}
					availableCountries={availableShippingCountries}
					onSelectAddress={(id) => {
						form.setValue("selectedAddressId", id, { shouldDirty: true });
						setShowSelectModal(false);
					}}
					onAddressUpdate={(addr) => {
						void userAddressActions.onAddressUpdateSuccess(addr);
					}}
					onAddressDelete={(id) => {
						void userAddressActions.onAddressDeleteSuccess(id);
					}}
					onAddressCreate={(addr) => {
						void userAddressActions.onAddressCreateSuccess(addr);
					}}
				/>
			</div>
		</Suspense>
	);
};
