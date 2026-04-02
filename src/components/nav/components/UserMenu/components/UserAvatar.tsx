import Image from "next/image";
import { User } from "lucide-react";
import { type UserDetailsFragment } from "@/gql/graphql";

type Props = {
	user: UserDetailsFragment;
};

export const UserAvatar = ({ user }: Props) => {
	if (user.avatar) {
		return (
			<Image
				className="h-7 w-7 rounded-full shadow-sm"
				aria-hidden="true"
				src={user.avatar.url}
				width={28}
				height={28}
				alt=""
			/>
		);
	}

	// Show initials only when both first and last name are set — otherwise use icon.
	// Showing an email initial ("P") is ambiguous and looks like a bug.
	const hasFullName = Boolean(user.firstName && user.lastName);
	if (hasFullName) {
		const initials = `${user.firstName.slice(0, 1)}${user.lastName.slice(0, 1)}`.toUpperCase();
		return (
			<div className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-extrabold">
				{initials}
			</div>
		);
	}

	return (
		<div className="bg-muted text-muted-foreground flex h-7 w-7 items-center justify-center rounded-full">
			<User className="h-5 w-5" strokeWidth={1.5} />
		</div>
	);
};
