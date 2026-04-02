import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Address } from "@/checkout/components/Address";
import { AddressCreateForm } from "@/checkout/sections/address/AddressCreateForm";
import { AddressEditForm } from "@/checkout/sections/address/AddressEditForm";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { type AddressFragment, type CountryCode } from "@/gql/graphql";
import { cn } from "@/lib/utils";

interface AddressSelectModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	addressList: AddressFragment[];
	selectedAddressId: string | undefined;
	availableCountries: CountryCode[];
	onSelectAddress: (id: string) => void;
	onAddressUpdate: (address: AddressFragment) => void;
	onAddressDelete: (id: string) => void;
	onAddressCreate: (address: AddressFragment) => void;
}

export const AddressSelectModal = ({
	open,
	onOpenChange,
	addressList,
	selectedAddressId,
	availableCountries,
	onSelectAddress,
	onAddressUpdate,
	onAddressDelete,
	onAddressCreate
}: AddressSelectModalProps) => {
	const t = useTranslations("checkout");
	const [editAddressId, setEditAddressId] = useState<string | undefined>();
	const [showCreateForm, setShowCreateForm] = useState(false);

	const editAddress = editAddressId ? addressList.find((a) => a.id === editAddressId) : undefined;
	const isListView = !editAddress && !showCreateForm;

	const handleOpenChange = (val: boolean) => {
		if (!val) {
			setEditAddressId(undefined);
			setShowCreateForm(false);
		}
		onOpenChange(val);
	};

	const getTitle = () => {
		if (editAddress) return t("editAddress");
		if (showCreateForm) return t("addNewAddress");
		return t("selectShippingAddress");
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="flex max-h-[80vh] flex-col gap-0 overflow-hidden rounded-(--radius) p-0 sm:max-w-lg">
				{/* Sticky header */}
				<DialogHeader className="border-border shrink-0 border-b px-6 py-4 pr-14 text-left">
					<DialogTitle>{getTitle()}</DialogTitle>
				</DialogHeader>

				{/* Scrollable body */}
				<div className="flex-1 overflow-y-auto">
					{showCreateForm ? (
						<div className="px-6 py-4">
							<AddressCreateForm
								availableCountries={availableCountries}
								onClose={() => setShowCreateForm(false)}
								onSuccess={(addr) => {
									onAddressCreate(addr);
									setShowCreateForm(false);
								}}
							/>
						</div>
					) : editAddress ? (
						<div className="px-6 py-4">
							<AddressEditForm
								address={editAddress}
								availableCountries={availableCountries}
								onUpdate={(addr) => {
									onAddressUpdate(addr);
									setEditAddressId(undefined);
								}}
								onDelete={(id) => {
									onAddressDelete(id);
									setEditAddressId(undefined);
								}}
								onClose={() => setEditAddressId(undefined)}
							/>
						</div>
					) : (
						<div className="flex min-h-[120px] flex-col gap-3 px-6 py-4">
							{addressList
								.filter((addr) => {
									const hasName = !!(addr.firstName || addr.lastName)?.trim();
									const hasStreet = !!addr.streetAddress1?.trim();
									return hasName || hasStreet;
								})
								.map((address) => {
									const isSelected = address.id === selectedAddressId;
									return (
										<div
											key={address.id}
											role="button"
											tabIndex={0}
											onClick={() => onSelectAddress(address.id)}
											onKeyDown={(e) => e.key === "Enter" && onSelectAddress(address.id)}
											className={cn(
												"relative cursor-pointer rounded-(--radius) border p-4 pr-12 text-left transition-colors",
												isSelected
													? "border-info bg-info/5"
													: "border-border hover:border-muted-foreground/50"
											)}
										>
											<Address address={address} />
											<Button
												variant="ghost"
												size="icon"
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													setEditAddressId(address.id);
												}}
												className="text-muted-foreground hover:bg-muted absolute top-1/2 right-3 h-8 w-8 -translate-y-1/2"
											>
												<Pencil className="h-4 w-4" />
											</Button>
										</div>
									);
								})}
						</div>
					)}
				</div>

				{/* Sticky footer — only in list view */}
				{isListView && (
					<div className="border-border shrink-0 border-t px-6 py-4">
						<Button
							variant="info"
							type="button"
							className="w-full gap-2"
							onClick={() => setShowCreateForm(true)}
						>
							<Plus className="h-4 w-4" />
							{t("addNewAddress")}
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};
