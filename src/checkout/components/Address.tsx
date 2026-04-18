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
	const country = address.country?.country ?? "Việt Nam";

	const addressLine1 = compact([streetAddress1, streetAddress2]).join(", ");
	const addressLine2 = compact([cityArea, city, countryArea, country]).join(", ");

	return (
		<div className="pointer-events-none flex flex-col gap-y-1">
			{/* Line 1: Name */}
			{!!name && (
				<p {...textProps} className="text-foreground text-[15px] font-semibold leading-snug min-[1025px]:text-base">
					{name}
				</p>
			)}
			{/* Line 2: Phone */}
			{!!phone && (
				<div className="text-muted-foreground flex items-center gap-1.5 text-[13px] min-[1025px]:text-sm">
					<svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
						/>
					</svg>
					<span>{phone}</span>
				</div>
			)}
			{/* Line 3: Street address */}
			{!!addressLine1 && (
				<div className="text-muted-foreground flex items-start gap-1.5 text-[13px] leading-5 min-[1025px]:text-sm">
					<svg className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					<span>{addressLine1}</span>
				</div>
			)}
			{/* Line 4: City / Province / Country — indented to align with street icon */}
			{!!addressLine2 && (
				<div className="text-muted-foreground/80 flex items-center pl-5 text-[12px] leading-5 min-[1025px]:text-[13px]">
					<span>{addressLine2}</span>
				</div>
			)}
			{children}
		</div>
	);
};
