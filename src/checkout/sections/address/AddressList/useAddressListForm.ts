import { useCallback, useEffect, useRef } from "react";
import { compact } from "lodash-es";
import { useForm, useWatch } from "react-hook-form";
import { type OptionalAddress } from "@/checkout/components/AddressForm/types";
import { getByMatchingAddress, isMatchingAddress } from "@/checkout/components/AddressForm/utils";
import { useAddressAvailability } from "@/checkout/hooks/useAddressAvailability";
import { useDebouncedSubmit } from "@/checkout/hooks/useDebouncedSubmit";
import { useUser } from "@/checkout/hooks/useUser";
import { getById, getByUnmatchingId } from "@/checkout/lib/utils/common";
import { type AddressFragment } from "@/gql/graphql";

export interface AddressListFormData {
	selectedAddressId: string | undefined;
	addressList: AddressFragment[];
}

type AddressListSubmitFn = (formData: AddressListFormData) => Promise<void> | void;

interface UseAddressListProps {
	onSubmit: AddressListSubmitFn;
	checkoutAddress: OptionalAddress;
	defaultAddress: OptionalAddress;
	checkAddressAvailability?: boolean;
}

export const useAddressListForm = ({
	onSubmit,
	checkoutAddress,
	defaultAddress,
	checkAddressAvailability = false
}: UseAddressListProps) => {
	const { user } = useUser();

	const { isAvailable } = useAddressAvailability(!checkAddressAvailability);

	// sdk has outdated types
	const addresses = (user?.addresses || []) as AddressFragment[];

	const previousCheckoutAddress = useRef<OptionalAddress>(null);

	const form = useForm<AddressListFormData>({
		defaultValues: {
			addressList: addresses,
			selectedAddressId: addresses.find(getByMatchingAddress(checkoutAddress))?.id
		}
	});

	const { control, getValues, handleSubmit, reset, setValue } = form;

	const addressList = useWatch({ control, name: "addressList" }) ?? [];
	const selectedAddressId = useWatch({ control, name: "selectedAddressId" });

	// Sync form when SWR resolves user addresses after initial empty state
	const prevAddressCountRef = useRef(addresses.length);
	useEffect(() => {
		const currentFormList = getValues("addressList") ?? [];
		const hadNoAddresses = currentFormList.length === 0 && prevAddressCountRef.current === 0;
		const nowHasAddresses = addresses.length > 0;

		if (hadNoAddresses && nowHasAddresses) {
			const matchingAddress =
				addresses.find(getByMatchingAddress(checkoutAddress)) ??
				addresses.find(getByMatchingAddress(defaultAddress)) ??
				addresses[0];

			reset({
				addressList: addresses,
				selectedAddressId: matchingAddress?.id
			});
		}

		prevAddressCountRef.current = addresses.length;
	}, [addresses, checkoutAddress, defaultAddress, getValues, reset]);

	const submit = useCallback(() => {
		return handleSubmit((data) => onSubmit(data))();
	}, [handleSubmit, onSubmit]);

	const debouncedSubmit = useDebouncedSubmit(submit);

	const selectedAddress = addressList.find(getById(selectedAddressId));

	useEffect(() => {
		debouncedSubmit();
	}, [debouncedSubmit, selectedAddressId]);

	const addressListUpdate = async (selectedAddress: OptionalAddress, addressList: AddressFragment[]) => {
		if (!selectedAddress) {
			return;
		}

		reset({
			addressList,
			selectedAddressId: selectedAddress.id
		});

		void submit();
	};

	const onAddressCreateSuccess = async (address: OptionalAddress) => {
		const currentAddressList = getValues("addressList") ?? [];
		return addressListUpdate(address, compact([...currentAddressList, address]));
	};

	const onAddressUpdateSuccess = async (address: OptionalAddress) => {
		const currentAddressList = getValues("addressList") ?? [];
		return addressListUpdate(
			address,
			currentAddressList.map((existingAddress) =>
				existingAddress.id === address?.id ? address : existingAddress
			)
		);
	};

	const onAddressDeleteSuccess = (id: string) => {
		const currentAddressList = getValues("addressList") ?? [];
		return addressListUpdate(currentAddressList[0], currentAddressList.filter(getByUnmatchingId(id)));
	};

	const handleDefaultAddressSet = useCallback(() => {
		const isSelectedAddressSameAsCheckout =
			!!selectedAddress && isMatchingAddress(checkoutAddress, selectedAddress);

		const hasCheckoutAddressChanged = !isMatchingAddress(checkoutAddress, previousCheckoutAddress.current);

		// currently selected address is the same as checkout or
		// address hasn't changed at all -> do nothing
		if (isSelectedAddressSameAsCheckout || (checkoutAddress && !hasCheckoutAddressChanged)) {
			return;
		}

		const matchingDefaultAddressInAddresses = addressList.find(getByMatchingAddress(defaultAddress));
		// if not, prefer user default address
		if (defaultAddress && matchingDefaultAddressInAddresses) {
			previousCheckoutAddress.current = defaultAddress;
			setValue("selectedAddressId", matchingDefaultAddressInAddresses.id, { shouldDirty: true });
			return;
		}

		const firstAvailableAddress = addressList.find(isAvailable);

		// otherwise just choose any available
		if (firstAvailableAddress) {
			previousCheckoutAddress.current = firstAvailableAddress;
			setValue("selectedAddressId", firstAvailableAddress.id, { shouldDirty: true });
		}
	}, [addressList, checkoutAddress, defaultAddress, isAvailable, selectedAddress, setValue]);

	useEffect(() => {
		void handleDefaultAddressSet();
	}, [handleDefaultAddressSet]);

	return {
		form,
		userAddressActions: {
			onAddressCreateSuccess,
			onAddressUpdateSuccess,
			onAddressDeleteSuccess
		}
	};
};
