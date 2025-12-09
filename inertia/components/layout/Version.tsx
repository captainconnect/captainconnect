import { Link } from "@inertiajs/react";
import { version } from "~/app/version";

type VersionProps = {
	onClick: () => void;
};

export default function Version({ onClick }: VersionProps) {
	return (
		<Link
			className="text-center text-xs font-bold"
			href="/version"
			onClick={onClick}
		>
			v{version}
		</Link>
	);
}
