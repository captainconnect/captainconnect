import type { SimplePaginatorMetaKeys } from "@adonisjs/lucid/types/querybuilder";
import { router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, FileUp, Trash } from "lucide-react";
import React from "react";
import type { InterventionsFilterData } from "#types/media";
import AdminChecker from "~/components/features/AdminChecker";
import AddMultipleProjectMediaModal from "~/components/features/media/AddMultipleMediaModal";
import Button from "~/components/ui/buttons/Button";
import ConfirmModal from "~/components/ui/modals/Confirm";

type ToolbarProps = {
	selected: Set<string>;
	selectedCount: number;
	setSelected: (selected: Set<string>) => void;
	boatId: number;
	meta: SimplePaginatorMetaKeys;
	interventions?: InterventionsFilterData[];
	resetFilters: () => void;
};

export default function Toolbar({
	selected,
	selectedCount,
	setSelected,
	boatId,
	meta,
	interventions,
	resetFilters,
}: ToolbarProps) {
	const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
	const [addMediaModalOpen, setAddMediaModalOpen] = React.useState(false);

	const deleteMedias = () => {
		router.delete("/media/projectMedia/mass", {
			data: {
				projectMediaIds: Array.from(selected),
			},
			preserveScroll: true,
			preserveState: true,
			onSuccess: () => {
				router.reload({ only: ["medias"] });
				setSelected(new Set());
			},
		});
	};

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
				only: ["medias", "meta"],
			},
		);
	};

	const { currentPage, lastPage } = meta;

	// ---- query params (source de vérité) ----
	const url =
		typeof window !== "undefined" ? new URL(window.location.href) : null;
	const selectedInterventionId = url?.searchParams.get("intervention_id") ?? "";
	const selectedTaskId = url?.searchParams.get("task_id") ?? "";

	const interventionOptions = interventions?.map((intervention) => ({
		id: intervention.id,
		label: intervention.title,
	}));

	const selectedIntervention = interventions?.find(
		(i) => String(i.id) === String(selectedInterventionId),
	);

	const taskOptions = selectedIntervention
		? selectedIntervention.tasks.map((task) => ({
				id: task.id,
				label: task.name,
			}))
		: [];

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
				only: ["medias", "meta"], // si ton backend renvoie aussi interventions filtrées, ajoute "interventions"
			},
		);
	};

	const onInterventionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const interventionId = e.target.value;

		// Quand on change d’intervention: set intervention_id et reset task_id
		navigateWithParams({
			intervention_id: interventionId || null,
			task_id: null,
		});
	};

	const onTaskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const taskId = e.target.value;

		navigateWithParams({
			task_id: taskId || null,
		});
	};

	return (
		<>
			<div className="flex flex-col md:flex-row gap-4 items-center w-full bg-white border border-gray-200 rounded-xl p-4 min-h-12">
				<button
					className="flex gap-2 text-sm items-center bg-primary text-white p-2 rounded-xl disabled:opacity-50 cursor-pointer"
					type="button"
					onClick={() => setAddMediaModalOpen(true)}
				>
					<FileUp size="20" />
					Ajouter des fichiers
				</button>
				<AdminChecker mustBeAdmin={true}>
					<button
						className="flex gap-2 text-sm items-center bg-red-600 text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-default cursor-pointer"
						disabled={selectedCount === 0}
						type="button"
						onClick={() => setConfirmModalOpen(true)}
					>
						<Trash size="20" />
						{selectedCount > 1
							? `Supprimer la selection (${selectedCount})`
							: "Supprimer"}
					</button>
				</AdminChecker>

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

				<div className="flex flex-col md:flex-row gap-4 items-center">
					<select
						className="p-3 bg-white border border-gray-200 rounded-xl"
						value={selectedInterventionId}
						onChange={onInterventionChange}
					>
						<option value="">Intervention</option>
						{interventionOptions?.map((option) => (
							<option key={option.id} value={option.id}>
								{option.label}
							</option>
						))}
					</select>

					<select
						className="p-3 bg-white border border-gray-200 rounded-xl"
						value={selectedTaskId}
						onChange={onTaskChange}
						disabled={!selectedInterventionId}
					>
						<option value="">Tâche</option>
						{taskOptions.map((option) => (
							<option key={option.id} value={option.id}>
								{option.label}
							</option>
						))}
					</select>
					<Button
						type="button"
						className="p-3 bg-gray-50 border border-gray-200 rounded-xl"
						onClick={resetFilters}
					>
						Réinitialiser les filtres
					</Button>
				</div>
			</div>

			<AddMultipleProjectMediaModal
				boatId={boatId}
				open={addMediaModalOpen}
				onClose={() => setAddMediaModalOpen(false)}
			/>

			<ConfirmModal
				confirmationText={`Supprimer ${selectedCount} élément${
					selectedCount > 1 ? "s" : ""
				} ?`}
				label="Confirmer"
				title="Supprimer les fichiers"
				onConfirm={deleteMedias}
				onClose={() => setConfirmModalOpen(false)}
				open={confirmModalOpen}
			/>
		</>
	);
}
