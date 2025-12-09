import { Search } from "lucide-react";
import { useState } from "react";
import type { BoatHours } from "#types/hour";
import type { User } from "#types/user";
import Button from "~/components/ui/buttons/Button";
import Input from "~/components/ui/inputs/Input";

type HoursTableProps = {
	user: User;
};

const formatLocalDate = (date: Date) => {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
};

export default function UserHourTable({ user }: HoursTableProps) {
	const [hours, setHours] = useState<BoatHours[]>([]);

	const today = new Date();

	// Premier jour du mois
	const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

	// Dernier jour du mois
	const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

	const defaultStartAt = formatLocalDate(firstDay);
	const defaultEndAt = formatLocalDate(lastDay);

	const [startAt, setStartAt] = useState(defaultStartAt);
	const [endAt, setEndAt] = useState(defaultEndAt);

	const handleReset = () => {
		setStartAt(defaultStartAt);
		setEndAt(defaultEndAt);
		setHours([]);
	};

	const handleLoad = () => {
		const url = new URL(`/hours/user/${user.id}`, window.location.origin);

		if (startAt) url.searchParams.set("start_at", startAt);
		if (endAt) url.searchParams.set("end_at", endAt);

		fetch(url.toString())
			.then((res) => res.json())
			.then((data) => {
				setHours(data);
			});
	};

	const allDates = Array.from(
		new Set(hours.flatMap((b) => b.hours.map((h) => h.date))),
	).sort();

	return (
		<>
			<div className="mb-4 md:w-1/2 flex flex-col md:flex-row gap-4 items-center md:items-end">
				<Input
					value={startAt}
					onChange={(e) => setStartAt(e.target.value)}
					type="date"
					label="À partir du"
				/>
				<Input
					value={endAt}
					onChange={(e) => setEndAt(e.target.value)}
					type="date"
					label="Jusqu'au"
				/>
				<div className="flex gap-2 h-full p-1">
					<Button onClick={handleLoad} icon={<Search size="18" />}>
						Rechercher
					</Button>
					<Button onClick={handleReset} variant="secondary">
						Réinitialiser
					</Button>
				</div>
			</div>

			<div className="overflow-x-auto max-h-96 rounded-lg border border-gray-300">
				<table className="table-auto w-full border-collapse rounded-lg overflow-hidden">
					<thead className="bg-gray-100">
						<tr>
							<th className="border border-gray-300 px-4 py-2">Bateau</th>
							{allDates.map((date) => (
								<th
									key={date}
									className="border border-gray-300 px-4 py-2 text-center"
								>
									{date}
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{hours.map((boat) => (
							<tr key={boat.boat}>
								<td className="border border-gray-300 px-4 py-2 font-semibold">
									{boat.boat}
								</td>

								{allDates.map((date) => {
									const found = boat.hours.find((h) => h.date === date);
									return (
										<td
											key={date}
											className="border border-gray-300 px-4 py-2 text-center"
										>
											{found ? found.count : 0}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}
