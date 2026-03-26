import { type UserDetailsFragment } from "@/gql/graphql";

type Props = {
	user: UserDetailsFragment;
};

export const UserInfo = ({ user }: Props) => {
	const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null;

	return (
		<p className="text-md truncate px-1">
			{userName && <span className="mb-0.5 block truncate">{userName}</span>}
			{user.email}
		</p>
	);
};
