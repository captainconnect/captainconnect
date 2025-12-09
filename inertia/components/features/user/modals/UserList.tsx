import type { User } from "#types/user";
import UserCard from "./UserCard";

type UserListProps = {
	users: User[];
};

export default function UserList({ users }: UserListProps) {
	return (
		<ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			{users.map((user) => (
				<UserCard key={`${user.id}-${user.username}`} user={user} />
			))}
		</ul>
	);
}
