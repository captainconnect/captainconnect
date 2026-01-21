import { Ship } from "lucide-react";
import { getBoatTypeIcon } from "~/app/utils";
import IconBadge from "./IconBadge";

type BoatBadgeProps = {
	type?: string | null;
};

export default function BoatBadge({ type }: BoatBadgeProps) {
	const icon = getBoatTypeIcon(type);

	return <IconBadge icon={icon ?? <Ship />} />;
}
