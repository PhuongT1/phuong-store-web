import React, { type PropsWithChildren } from "react";
import compact from "lodash-es/compact";
import { type AddressFragment } from "@/gql/graphql";

interface AddressProps {
	address: AddressFragment;
}

const normalizeAddressPart = (value?: string | null) => value?.trim() ?? "";

export const Address: React.FC<PropsWithChildren<AddressProps>> = ({ address, children, ...textProps }) => {
	const name = `${address.firstName} ${address.lastName}`.trim();
	const phone = address.phone?.trim() ?? "";
	
	const streetAddress1 = normalizeAddressPart(address.streetAddress1);
	const streetAddress2 = normalizeAddressPart(address.streetAddress2);
	const cityArea = normalizeAddressPart(address.cityArea);
	const city = normalizeAddressPart(address.city);
	const countryArea = normalizeAddressPart(address.countryArea);
	// Fallback to Việt Nam if empty or absent
	const country = address.country?.country ?? "Việt Nam";

	const addressLine1 = compact([streetAddress1, streetAddress2]).join(", ");
	const addressLine2 = compact([cityArea, city, countryArea, country]).join(", ");

	const nameValid = name.length > 0;

	return (
		<div className="pointer-events-none flex flex-col gap-y-1">
			{nameValid && (
				<p {...textProps} className="text-foreground mb-1 text-[15px] font-semibold flex items-center gap-2 min-[1025px]:text-base">
					<span>{name}</span>
					{!!phone && (
						<>
							<span className="text-muted-foreground/60 font-normal">|</span>
							<span className="text-muted-foreground font-normal">{phone}</span>
						</>
					)}
				</p>
			)}
			{!!addressLine1 && (
				<div className="text-muted-foreground flex items-center gap-2 text-[13px] leading-5 min-[1025px]:text-sm">
					<svg
						className="text-muted-foreground h-4 w-4 shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
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
					<span>{addressLine1}</span>
				</div>
			)}
			{!!addressLine2 && (
				<div className="text-muted-foreground flex items-center gap-2 text-[13px] leading-5 min-[1025px]:text-sm">
					<div className="w-4 h-4 shrink-0" />
					<span>{addressLine2}</span>
				</div>
			)}
			{children}
		</div>
	);
};
