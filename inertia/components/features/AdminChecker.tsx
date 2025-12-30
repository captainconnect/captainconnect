import { usePage } from "@inertiajs/react";
import type { PropsWithChildren } from "react";
import type { User } from "#types/user";

type AdminCheckerProps = PropsWithChildren & {
	mustBeAdmin?: boolean;
};

export default function AdminChecker({
	mustBeAdmin = false,
	children,
}: AdminCheckerProps) {
	const { props } = usePage<{ authenticatedUser: User }>();
	const currentUser = props.authenticatedUser;
	let can: boolean = true;

	if (mustBeAdmin === true && !currentUser.isAdmin) can = false;

	if (!can) {
		return null;
	}
	return children;
}
