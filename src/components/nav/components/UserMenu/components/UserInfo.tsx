import { type UserDetailsFragment } from "@/gql/graphql";

type Props = {
	user: UserDetailsFragment;
};

export const UserInfo = ({ user }: Props) => {
	const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null;

	return (
		<div className="px-1">
			{userName && (
				<p className="text-foreground mb-0.5 truncate text-sm font-semibold">{userName}</p>
			)}
			<p className="text-muted-foreground truncate text-sm">{user.email}</p>
		</div>
	);
};
