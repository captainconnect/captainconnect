import type { SharedProps } from "@adonisjs/inertia/types";
import { usePage } from "@inertiajs/react";

export default function AvatarSection() {
	const { authenticatedUser } = usePage<SharedProps>().props;
	return (
		<div className="flex items-center justify-center md:justify-start">
			{authenticatedUser?.avatar ? (
				<img
					className="size-32 rounded-full"
					src={authenticatedUser.avatar}
					alt="Avatar"
				/>
			) : (
				<span className="size-20 text-3xl items-center justify-center flex bg-primary text-white rounded-full">
					{authenticatedUser?.initials}
				</span>
			)}
		</div>
	);
}
