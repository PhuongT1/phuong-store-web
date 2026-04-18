import React, { Suspense, useState } from "react";
import { ChevronRight, Mail, Navigation } from "lucide-react";
import { useTranslations } from "next-intl";
import { useWatch } from "react-hook-form";
import { Address } from "@/checkout/components/Address";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { useAvailableShippingCountries } from "@/checkout/hooks/useAvailableShippingCountries";
import { useCheckoutFormValidationTrigger } from "@/checkout/hooks/useCheckoutFormValidationTrigger";
import { useUser } from "@/checkout/hooks/useUser";
import { getById } from "@/checkout/lib/utils/common";
import { AddressCreateForm } from "@/checkout/sections/address/AddressCreateForm";
import { Button, Typography } from "@/components/ui";
import { AddressSelectModal } from "./AddressSelectModal";
import { useUserShippingAddressForm } from "./useUserShippingAddressForm";

export const UserShippingAddressSection: React.FC = () => {
	const t = useTranslations("checkout");
	const { availableShippingCountries } = useAvailableShippingCountries();
	const { form, userAddressActions } = useUserShippingAddressForm();
	const { user } = useUser();

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
			<div className="flex flex-col gap-4 min-[1025px]:gap-4">
				<div className="flex items-center gap-3">
					<div className="bg-secondary/42 flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius)">
						<Navigation className="text-info h-5 w-5" strokeWidth={1.5} />
					</div>
					<Typography
						variant="section-label"
						className="mb-0! normal-case text-[15px] font-semibold tracking-tight sm:text-base"
					>
						{t("shippingAddress")}
					</Typography>
				</div>

				{selectedAddress && (
					<div className="bg-secondary/38 relative rounded-xl px-3 py-3 pr-11 min-[1025px]:rounded-2xl min-[1025px]:border min-[1025px]:border-border/55 min-[1025px]:bg-card/96 min-[1025px]:p-4 min-[1025px]:pr-12">
						<Address address={selectedAddress}>
							{user?.email && (
								<div className="text-muted-foreground mt-1.5 flex items-center gap-2 text-[12px] min-[1025px]:text-[13px]">
									<Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
									<span>{user.email}</span>
								</div>
							)}
						</Address>
						<Button
							variant="ghost"
							size="icon"
							type="button"
							onClick={() => setShowSelectModal(true)}
							className="bg-background/55 text-muted-foreground hover:bg-background/75 hover:text-foreground absolute top-1/2 right-3 h-8 w-8 -translate-y-1/2 rounded-full"
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
						void userAddressActions.applyAddressById(id);
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
