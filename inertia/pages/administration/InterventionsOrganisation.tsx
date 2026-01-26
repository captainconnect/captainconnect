import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Head, router } from "@inertiajs/react";
import { useMemo, useRef, useState } from "react";

import type { Intervention } from "#types/intervention";
import AppLayout from "~/components/layout/AppLayout";
import Button from "~/components/ui/buttons/Button";

const title = "Organiser les interventions";

type InterventionsOrganisationPageProps = {
	interventions: Intervention[];
};

function SortableInterventionItem({
	intervention,
	editing,
}: {
	intervention: Intervention;
	editing: boolean;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: intervention.id,
		disabled: !editing,
	});

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.6 : 1,
		cursor: editing ? (isDragging ? "grabbing" : "grab") : "default",
		userSelect: "none",
		padding: "10px 12px",
		marginBottom: 8,
	};

	const isSuspended = intervention.status === "SUSPENDED";

	const borderColor = isSuspended
		? "border-gray-300"
		: intervention.priority === "EXTREME"
			? "border-red-600"
			: intervention.priority === "HIGH"
				? "border-orange-300"
				: intervention.priority === "LOW"
					? "border-blue-200"
					: "border-yellow-200";

	const bgColor = isSuspended
		? "bg-gray-200/10"
		: intervention.priority === "EXTREME"
			? "bg-red-600/10"
			: intervention.priority === "HIGH"
				? "bg-orange-300/10"
				: intervention.priority === "LOW"
					? "bg-blue-200/10"
					: "bg-yellow-200/10";

	const createdAt = new Date(intervention.createdAt).toLocaleDateString(
		"fr-FR",
	);

	const status =
		intervention.status === "DONE"
			? "Facturée"
			: intervention.status === "IN_PROGRESS"
				? "En cours"
				: intervention.status === "SUSPENDED"
					? "Suspendue"
					: "";

	return (
		<li
			className={`flex justify-between items-center p-4 ${bgColor} border-2 ${borderColor} rounded-xl space-y-1`}
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		>
			<div>
				<p>{`${intervention.title} - ${intervention.boat.name}`}</p>
				<p className="text-slate-500 text-sm">Créée le {createdAt}</p>
			</div>
			<p className={`p-1 px-3 rounded-full font-semibold text-sm text-center`}>
				{status}
			</p>
		</li>
	);
}

const InterventionsOrganisationPage = ({
	interventions,
}: InterventionsOrganisationPageProps) => {
	const [editing, setEditing] = useState(false);
	const [items, setItems] = useState<Intervention[]>(interventions);

	// Garde l'ordre initial pour "dirty" + "annuler"
	const initialIdsRef = useRef(interventions.map((i) => i.id));

	const ids = useMemo(() => items.map((i) => i.id), [items]);

	const isDirty = useMemo(() => {
		const a = initialIdsRef.current;
		if (a.length !== ids.length) return true;
		for (let i = 0; i < a.length; i++) if (a[i] !== ids[i]) return true;
		return false;
	}, [ids]);

	const handleDragEnd = (event: DragEndEvent) => {
		if (!editing) return; // double sécurité
		const { active, over } = event;
		if (!over) return;
		if (active.id === over.id) return;

		setItems((prev) => {
			const oldIndex = prev.findIndex((i) => i.id === active.id);
			const newIndex = prev.findIndex((i) => i.id === over.id);
			const moved = arrayMove(prev, oldIndex, newIndex);

			// order 1..n (adapte si tu veux 0..n-1)
			return moved.map((it, idx) => ({
				...it,
				order: idx + 1,
			}));
		});
	};

	function cancelEditing() {
		setItems(interventions);
		setEditing(false);
	}

	function saveOrdering() {
		const payload = {
			interventions: items.map((it, index) => ({
				id: it.id,
				index,
			})),
		};

		router.patch("/administration/interventions/ordering", payload, {
			preserveScroll: true,
			onSuccess: () => {
				initialIdsRef.current = items.map((i) => i.id);
				setEditing(false);
			},
		});
	}

	return (
		<>
			<Head title={title} />

			<div className="space-y-4">
				<div className="flex gap-2">
					{editing ? (
						<>
							<Button onClick={saveOrdering} disabled={!isDirty}>
								Sauvegarder
							</Button>
							<Button onClick={cancelEditing} variant="secondary">
								Annuler
							</Button>
						</>
					) : (
						<Button onClick={() => setEditing(true)}>
							Modifier l&apos;ordre
						</Button>
					)}
				</div>

				<ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
					<DndContext
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext items={ids} strategy={verticalListSortingStrategy}>
							{items.map((intervention) => (
								<SortableInterventionItem
									editing={editing}
									key={intervention.id}
									intervention={intervention}
								/>
							))}
						</SortableContext>
					</DndContext>
				</ul>
			</div>
		</>
	);
};

InterventionsOrganisationPage.layout = (page: React.ReactNode) => (
	<AppLayout title={title}>{page}</AppLayout>
);

export default InterventionsOrganisationPage;
