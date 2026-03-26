import { camelCase } from "lodash-es";
import { FormProvider, useWatch, type UseFormReturn } from "react-hook-form";
import { Pencil } from "lucide-react";
import { type AddressFragment } from "@/checkout/graphql";
import { useAddressAvailability } from "@/checkout/hooks/useAddressAvailability";
import { type AddressListFormData } from "@/checkout/sections/AddressList/useAddressListForm";
import { Typography, RadioList, RadioItem, Button } from "@/components/ui";
import { Address } from "@/checkout/components/Address";
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
					<Typography variant="title" className="!mb-0">
						{title}
					</Typography>
					{validAddresses.length > 0 && (
						<Button
							variant="ghost"
							onClick={onAddAddressClick}
							className="rounded-lg px-4 py-2 font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
						>
							+ Thêm địa chỉ mới
						</Button>
					)}
				</div>

				{validAddresses.length < 1 ? (
					<div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-10 text-center">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
							<svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</div>
						<p className="mb-4 font-medium text-gray-500">Bạn chưa có địa chỉ lưu sẵn nào.</p>
						<Button
							variant="default"
							onClick={onAddAddressClick}
							className="rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700"
						>
							Thêm địa chỉ giao hàng
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
									optionProps={{
										value: id,
										label: (
											<div className="flex w-full flex-col justify-between pe-8">
												<Address address={{ ...rest } as AddressFragment}>
													{unavailable && (
														<p className="my-1 mt-2 inline-block rounded bg-red-50 p-2 text-xs font-medium text-red-500">
															Không thể giao hàng đến địa chỉ này
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
													className="pointer-events-auto absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border-gray-200 bg-white text-gray-400 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-700 hover:shadow"
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
