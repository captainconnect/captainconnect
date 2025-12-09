import { Link } from "@inertiajs/react";
import { UserCircle } from "lucide-react";
import type { User } from "#types/user";
import IconBadge from "~/components/ui/IconBadge";

type UserCardProps = {
	user: User;
};

export default function UserCard({ user }: UserCardProps) {
	return (
		<li>
			<Link
				href={`/utilisateurs/${user.id}`}
				className="flex flex-col gap-6 bg-white rounded-xl border border-gray-300 p-6 cursor-pointer hover:shadow-sm transition active:scale-[99%]"
			>
				<div className="flex items-center gap-4">
					<IconBadge icon={<UserCircle />} />
					<div>
						<p className="font-semibold text-lg">
							{user.firstname} {user.lastname}
						</p>
						<p className="text-subtitle">{user.role.name}</p>
					</div>
				</div>
			</Link>
		</li>
	);
}
