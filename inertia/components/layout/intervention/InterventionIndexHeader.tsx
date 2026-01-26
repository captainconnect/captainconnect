import { router } from "@inertiajs/react";
import AdminChecker from "~/components/features/AdminChecker";
import Select from "~/components/ui/inputs/Select";

export default function InterventionIndexHeader() {
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

	const url =
		typeof window !== "undefined" ? new URL(window.location.href) : null;
	const selectedStateQuery = url?.searchParams.get("state") ?? "";

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

	const onStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		navigateWithParams({
			state: e.target.value,
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
					<AdminChecker mustBeAdmin={true}>
						<Select
							value={selectedStateQuery}
							onChange={onStateChange}
							label="État"
							options={interventionStatesOptions}
						/>
					</AdminChecker>
				</div>
			</div>
			<hr className="text-gray-200 m-5 " />
		</>
	);
}
