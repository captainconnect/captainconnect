import { Search, Table2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import * as XLSX from "xlsx";
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
	const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
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

	// Toutes les dates (colonnes)
	const allDates = useMemo(() => {
		return Array.from(
			new Set(hours.flatMap((b) => b.hours.map((h) => h.date))),
		).sort();
	}, [hours]);

	// Helper: valeur (bateau, date)
	const getCount = useCallback((boat: BoatHours, date: string) => {
		const found = boat.hours.find((h) => h.date === date);
		return found ? Number(found.count) : 0;
	}, []);

	// Totaux colonnes (par jour)
	const totalsByDate = useMemo(() => {
		const totals: Record<string, number> = {};
		for (const date of allDates) totals[date] = 0;

		for (const boat of hours) {
			for (const date of allDates) {
				totals[date] += getCount(boat, date);
			}
		}
		return totals;
	}, [hours, allDates, getCount]);

	// Total général
	const grandTotal = useMemo(() => {
		return Object.values(totalsByDate).reduce((sum, v) => sum + v, 0);
	}, [totalsByDate]);

	const exportToExcel = () => {
		if (hours.length === 0) return;

		// En-têtes
		const header = ["Bateau", ...allDates, "Total Bateau"];

		// Lignes bateaux
		const rows = hours.map((boat) => {
			const rowTotal = allDates.reduce(
				(sum, date) =>
					sum + (boat.hours.find((h) => h.date === date)?.count ?? 0),
				0,
			);

			return [
				boat.boat,
				...allDates.map(
					(date) => boat.hours.find((h) => h.date === date)?.count ?? 0,
				),
				rowTotal,
			];
		});

		// Ligne "Total jour"
		const totalRow = [
			"Total jour",
			...allDates.map((date) =>
				hours.reduce(
					(sum, boat) =>
						sum + (boat.hours.find((h) => h.date === date)?.count ?? 0),
					0,
				),
			),
			rows.reduce((sum, r) => sum + Number(r.at(-1)), 0),
		];

		const sheetData = [header, ...rows, totalRow];

		// Création du workbook
		const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Heures");

		// Téléchargement
		XLSX.writeFile(workbook, `heures_${user.firstname}_${user.lastname}.xlsx`);
	};

	return (
		<>
			<div className="mb-4 flex flex-col md:flex-row gap-4 items-center md:items-end">
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
					<Button
						disabled={hours.length === 0}
						icon={<Table2 size="20" />}
						onClick={exportToExcel}
					>
						Exporter
					</Button>
				</div>
			</div>

			<div className="overflow-x-auto max-h-96 rounded-lg border border-gray-300">
				<table className="table-auto w-full border-collapse rounded-lg overflow-hidden">
					<thead className="bg-gray-100 sticky top-0 z-10">
						<tr>
							<th className="border border-gray-300 px-4 py-2 text-left">
								Bateau
							</th>

							{allDates.map((date) => (
								<th
									key={date}
									className="border border-gray-300 px-4 py-2 text-center"
								>
									{date}
								</th>
							))}

							<th className="border border-gray-300 px-4 py-2 text-center">
								Total Bateau
							</th>
						</tr>
					</thead>

					<tbody>
						{hours.map((boat) => {
							const rowTotal = allDates.reduce(
								(sum, date) => sum + getCount(boat, date),
								0,
							);

							return (
								<tr key={boat.boat}>
									<td className="border border-gray-300 px-4 py-2 font-semibold">
										{boat.boat}
									</td>

									{allDates.map((date) => (
										<td
											key={date}
											className="border border-gray-300 px-4 py-2 text-center"
										>
											{getCount(boat, date)}
										</td>
									))}

									<td className="border border-gray-300 px-4 py-2 text-center font-semibold">
										{rowTotal}
									</td>
								</tr>
							);
						})}

						{/* Ligne Total jour */}
						<tr className="bg-gray-100 sticky bottom-0 z-10">
							<td className="border border-gray-300 px-4 py-2 font-semibold">
								Total jour
							</td>

							{allDates.map((date) => (
								<td
									key={date}
									className="border border-gray-300 px-4 py-2 text-center font-semibold"
								>
									{`${totalsByDate[date] ?? 0}h`}
								</td>
							))}

							<td className="border border-gray-300 px-4 py-2 text-center font-bold">
								{`Total période : ${grandTotal}h`}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
}
