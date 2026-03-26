import Image from "next/image";
import { type UserDetailsFragment } from "@/gql/graphql";

type Props = {
	user: UserDetailsFragment;
};

export const UserAvatar = ({ user }: Props) => {
	const label =
		user.firstName && user.lastName
			? `${user.firstName.slice(0, 1)}${user.lastName.slice(0, 1)}`
			: user.email.slice(0, 2);

	if (user.avatar) {
		return (
			<Image
				className="ring-border h-7 w-7 rounded-full shadow-sm ring-2"
				aria-hidden="true"
				src={user.avatar.url}
				width={28}
				height={28}
				alt=""
			/>
		);
	}

	return (
		<div className="bg-accent text-foreground ring-border flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-extrabold ring-2">
			{label}
		</div>
	);
};
