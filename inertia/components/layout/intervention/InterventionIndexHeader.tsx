import type { SimplePaginatorMetaKeys } from "@adonisjs/lucid/types/querybuilder";
import { router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Select from "~/components/ui/inputs/Select";

type InterventionIndexHeaderProps = {
	setShowPriority: (v: boolean) => void;
	showPriority: boolean;
	meta: SimplePaginatorMetaKeys;
};

export default function InterventionIndexHeader({
	setShowPriority,
	showPriority,
	meta,
}: InterventionIndexHeaderProps) {
	const interventionStatesOptions = [
		{
			id: "IN_PROGRESS",
			label: "En cours",
		},
		{
			id: "SUSPENDED",
			label: "Suspendues",
		},
		{
			id: "DONE",
			label: "Facturées",
		},
	];

	const sortOptions = [
		{
			id: "createdAt",
			label: "Date de création",
		},
		{
			id: "priority",
			label: "Priorité",
		},
	];

	const url =
		typeof window !== "undefined" ? new URL(window.location.href) : null;
	const selectedStateQuery = url?.searchParams.get("state") ?? "";
	const selectedSortQuery = url?.searchParams.get("sort") ?? "priority";

	const navigateWithParams = (
		params: Record<string, string | number | null>,
	) => {
		const u = new URL(window.location.href);

		// chaque changement de filtre reset la page
		u.searchParams.delete("page");

		for (const [key, value] of Object.entries(params)) {
			if (value === null || value === "") u.searchParams.delete(key);
			else u.searchParams.set(key, String(value));
		}

		router.get(
			window.location.pathname,
			Object.fromEntries(u.searchParams.entries()),
			{
				preserveScroll: true,
				preserveState: true,
				replace: true,
				only: ["interventions", "meta"],
			},
		);
	};

	const { currentPage, lastPage } = meta;

	const goToPage = (page: number) => {
		const url = new URL(window.location.href);
		url.searchParams.set("page", String(page));

		router.get(
			window.location.pathname,
			Object.fromEntries(url.searchParams.entries()),
			{
				preserveScroll: true,
				preserveState: true,
				replace: true,
				only: ["interventions", "meta"],
			},
		);
	};

	const onStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		navigateWithParams({
			state: e.target.value,
		});
	};
	const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		navigateWithParams({
			sort: e.target.value,
		});
	};

	return (
		<>
			<div className="flex flex-col gap-6 justify-between md:flex-row md:items-center mb-4">
				<div className="space-y-2">
					<h2 className="text-3xl font-bold">Liste des interventions</h2>
					<p className="text-md text-gray-500">
						Rechercher et filtrer les interventions
					</p>
				</div>
				<div className="flex flex-col md:flex-row items-center md:gap-4 md:w-3/4">
					<div className="min-w-48 flex flex-col gap-2 items-center">
						<div className="flex items-center gap-2">
							<label className="cursor-pointer" htmlFor="priorityShow">
								Afficher priorité
							</label>
							<input
								className="size-4 cursor-pointer"
								type="checkbox"
								id="priorityShow"
								onChange={() => setShowPriority(!showPriority)}
							/>
						</div>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => goToPage(Number(currentPage) - 1)}
								disabled={Number(currentPage) <= 1}
								className="cursor-pointer disabled:opacity-50 disabled:cursor-default"
							>
								<ChevronLeft size="20" />
							</button>

							<p>Page {currentPage}</p>

							<button
								type="button"
								onClick={() => goToPage(Number(currentPage) + 1)}
								disabled={Number(currentPage) >= Number(lastPage)}
								className="cursor-pointer disabled:opacity-50 disabled:cursor-default"
							>
								<ChevronRight size="20" />
							</button>
						</div>
					</div>
					<Select
						value={selectedStateQuery}
						onChange={onStateChange}
						label="État"
						options={interventionStatesOptions}
					/>
					<Select
						value={selectedSortQuery}
						onChange={onSortChange}
						allowNull={false}
						label="Trier par"
						options={sortOptions}
					/>
				</div>
			</div>
			<hr className="text-gray-200 m-5 " />
		</>
	);
}
