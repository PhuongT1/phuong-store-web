import Image from "next/image";
import { type UserDetailsFragment } from "@/gql/graphql";

/** Fallback avatar shown when the user has no Saleor avatar set */
const DEFAULT_AVATAR = "/images/avatar-default.webp";

type Props = {
	user: UserDetailsFragment;
};

export const UserAvatar = ({ user }: Props) => {
	if (user.avatar) {
		return (
			<Image
				className="ring-border/40 h-8 w-8 rounded-full object-cover shadow-sm ring-2"
				aria-hidden="true"
				src={user.avatar.url}
				width={32}
				height={32}
				alt=""
			/>
		);
	}

	// Show initials only when both first and last name are set.
	const hasFullName = Boolean(user.firstName && user.lastName);
	if (hasFullName) {
		const initials = `${user.firstName.slice(0, 1)}${user.lastName.slice(0, 1)}`.toUpperCase();
		return (
			<div className="bg-primary/10 text-primary ring-border/40 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ring-2">
				{initials}
			</div>
		);
	}

	// Default: local avatar asset bundled in /public/images
	return (
		<Image
			className="ring-border/40 h-8 w-8 rounded-full object-cover shadow-sm ring-2"
			aria-hidden="true"
			src={DEFAULT_AVATAR}
			width={32}
			height={32}
			alt=""
		/>
	);
};
