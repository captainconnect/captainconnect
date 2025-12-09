import { router } from "@inertiajs/react";
import { X } from "lucide-react";
import type { Hour } from "#types/intervention";
import Button from "~/components/ui/buttons/Button";

type HourListProps = {
	hours: Hour[];
};

const HourList = ({ hours }: HourListProps) => (
	<ul className="space-y-2">
		{hours.map((h) => (
			<HourListItem key={`${h.id}-${h.taskId}-${h.user.id}`} hour={h} />
		))}
	</ul>
);

type HourListItemProps = {
	hour: Hour;
};
function HourListItem({ hour }: HourListItemProps) {
	return (
		<li className="flex items-center justify-between p-2 rounded bg-background">
			<p>
				<span className="font-semibold">
					{`${hour.user.firstname} ${hour.user.lastname}`}
				</span>
				{` a fait `}
				<span className="font-semibold">{`${hour.count}h`}</span>
				{` le ${new Date(hour.date).toLocaleDateString("fr-FR")}`}
			</p>
			<Button
				icon={<X />}
				size="icon"
				onClick={() => router.delete(`/tasks/hour/${hour.id}`)}
			/>
		</li>
	);
}

export default HourList;
