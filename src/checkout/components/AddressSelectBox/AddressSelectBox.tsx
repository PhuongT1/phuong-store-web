import React from "react";
import { SelectBox, type SelectBoxProps } from "@/checkout/components/SelectBox";
import { Button } from "@/checkout/components/Button";
import { Address } from "@/checkout/components/Address";
import { type AddressFragment } from "@/checkout/graphql";
import { type AddressField } from "@/checkout/components/AddressForm/types";
import { EditIcon } from "@/checkout/assets/icons";

interface AddressSelectBoxProps<TFieldName extends string> extends Omit<
	SelectBoxProps<TFieldName>,
	"children"
> {
	 
	address: Partial<Record<AddressField, any>>;
	onEdit: () => void;
	unavailable: boolean;
}

export const AddressSelectBox = <TFieldName extends string>({
	address,
	onEdit,
	unavailable,
	...rest
}: AddressSelectBoxProps<TFieldName>) => {
	return (
		<SelectBox {...rest} disabled={unavailable}>
			<div className="flex w-full flex-col justify-between pe-8">
				<Address address={address as AddressFragment}>
					{unavailable && (
						<p className="my-1 mt-2 inline-block rounded bg-red-50 p-2 text-xs font-medium text-red-500">
							Không thể giao hàng đến địa chỉ này
						</p>
					)}
				</Address>
				<Button
					variant="tertiary"
					onClick={(event) => {
						event.stopPropagation();
						onEdit();
					}}
					ariaLabel="edit"
					className="pointer-events-auto absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-transparent !p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
					label={<EditIcon />}
				/>
			</div>
		</SelectBox>
	);
};
