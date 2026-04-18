import { camelCase } from "lodash-es";
import { MapPin, Pencil, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormProvider, useWatch, type UseFormReturn } from "react-hook-form";
import { Address } from "@/checkout/components/Address";
import { useAddressAvailability } from "@/checkout/hooks/useAddressAvailability";
import { type AddressListFormData } from "@/checkout/sections/address/AddressList/useAddressListForm";
import { Typography, RadioList, RadioItem, Button } from "@/components/ui";
import { type AddressFragment } from "@/gql/graphql";
import { useProvinces } from "@/hooks/customer";

export interface AddressListProps {
	onEditChange: (id: string) => void;
	onAddAddressClick: () => void;
	checkAddressAvailability?: boolean;
	title: string;
	form: UseFormReturn<AddressListFormData>;
}

export const AddressList: React.FC<AddressListProps> = ({
	onEditChange,
	checkAddressAvailability = false,
	title,
	onAddAddressClick,
	form
}) => {
	const t = useTranslations("checkout");
	const addressList = useWatch({ control: form.control, name: "addressList" }) ?? [];

	const { isAvailable } = useAddressAvailability(!checkAddressAvailability);

	// Prefetch provinces so that opening the Address Create Form takes 0s
	useProvinces();

	const validAddresses = addressList.filter((addr) => {
		const hasName = !!(addr.firstName || addr.lastName)?.trim();
		const hasStreet = !!addr.streetAddress1?.trim();
		return hasName || hasStreet;
	});

	return (
		<FormProvider {...form}>
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<Typography variant="title" className="mb-0!">
						{title}
					</Typography>
					{validAddresses.length > 0 && (
						<Button
							variant="ghost"
							onClick={onAddAddressClick}
							className="text-info hover:bg-info/10 hover:text-info rounded-lg px-4 py-2 font-medium transition-colors"
						>
							{t("addNewAddress")}
						</Button>
					)}
				</div>

				{validAddresses.length < 1 ? (
					<div className="flex flex-col items-center justify-center rounded-2xl border-0 bg-secondary/26 px-4 py-8 text-center min-[1025px]:border-2 min-[1025px]:border-dashed min-[1025px]:border-border min-[1025px]:bg-transparent min-[1025px]:py-10">
						<div className="bg-icon-bg mb-4 flex h-12 w-12 items-center justify-center rounded-full">
							<MapPin className="text-muted-foreground h-6 w-6" strokeWidth={1.5} />
						</div>
						<p className="text-muted-foreground mb-4 font-medium">{t("noSavedAddresses")}</p>
						<Button variant="default" onClick={onAddAddressClick} className="gap-2 rounded-xl px-6">
							<Plus className="h-4 w-4" strokeWidth={2} />
							{t("addShippingAddress")}
						</Button>
					</div>
				) : (
					<RadioList name="selectedAddressId">
						{validAddresses.map(({ id, ...rest }: AddressFragment) => {
							const identifier = `${camelCase(title)}-${id}}`;
							const unavailable = !isAvailable(rest);

							return (
								<RadioItem
									key={identifier}
									variant="border"
									disabled={unavailable}
									divProps={{
										className:
											"rounded-xl border border-border/40 bg-card/72 p-3 shadow-none backdrop-blur-[2px] [&_button]:mt-0 [&_button]:h-[18px] [&_button]:w-[18px] min-[1025px]:rounded-2xl min-[1025px]:border-border/55 min-[1025px]:bg-card/96 min-[1025px]:p-4 min-[1025px]:shadow-sm"
									}}
									optionProps={{
										value: id,
										label: (
											<div className="flex w-full flex-col justify-between pe-8">
												<Address address={{ ...rest } as AddressFragment}>
													{unavailable && (
														<p className="bg-destructive/10 text-destructive my-1 mt-2 inline-block rounded p-2 text-xs font-medium">
															{t("cannotDeliver")}
														</p>
													)}
												</Address>
												<Button
													variant="outline"
													size="icon"
													onClick={(event) => {
														event.preventDefault();
														event.stopPropagation();
														onEditChange(id);
													}}
													className="border-border/60 bg-background/72 text-muted-foreground hover:bg-background hover:text-foreground pointer-events-auto absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full shadow-none transition-colors"
												>
													<Pencil className="h-4 w-4" />
												</Button>
											</div>
										)
									}}
								/>
							);
						})}
					</RadioList>
				)}
			</div>
		</FormProvider>
	);
};
