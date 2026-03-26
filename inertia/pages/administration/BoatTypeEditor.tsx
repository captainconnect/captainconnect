import { Head, router, useForm } from "@inertiajs/react";
import { Pencil, Plus, Sailboat, Save, Trash2, X } from "lucide-react";
import { useState } from "react";

import type { BoatType } from "#types/boat";
import AppLayout from "~/components/layout/AppLayout";
import Button from "~/components/ui/buttons/Button";
import Input from "~/components/ui/inputs/Input";
import ConfirmModal from "~/components/ui/modals/Confirm";
import Modal from "~/components/ui/modals/Modal";

type Props = {
	types: BoatType[];
};

function AddTypeModal({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const { data, setData, post, processing, errors, reset } = useForm({
		label: "",
	});

	const handleClose = () => {
		reset();
		onClose();
	};

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		post("/administration/bateaux/types", {
			onSuccess: () => {
				reset();
				onClose();
			},
		});
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			title="Nouveau type de bateau"
			icon={<Sailboat size={28} />}
		>
			<form className="flex flex-col gap-4" onSubmit={submit}>
				<Input
					required
					label="Libellé"
					placeholder="Ex : Voilier, Catamaran…"
					value={data.label}
					error={errors.label}
					onChange={(e) => setData("label", e.target.value)}
					autoFocus
				/>
				<div className="flex justify-end gap-3 mt-2">
					<Button variant="secondary" icon={<X />} onClick={handleClose}>
						Annuler
					</Button>
					<Button type="submit" icon={<Save />} processing={processing}>
						Créer
					</Button>
				</div>
			</form>
		</Modal>
	);
}

function EditableRow({
	type,
	onDeleteRequest,
}: {
	type: BoatType;
	onDeleteRequest: (type: BoatType) => void;
}) {
	const [editing, setEditing] = useState(false);
	const { data, setData, patch, processing, errors, reset } = useForm({
		label: type.label,
	});

	const handleCancel = () => {
		reset();
		setEditing(false);
	};

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		patch(`/administration/bateaux/types/${type.id}`, {
			onSuccess: () => setEditing(false),
		});
	};

	if (editing) {
		return (
			<li className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
				<form className="flex items-start gap-3 w-full" onSubmit={submit}>
					<div className="flex-1">
						<Input
							required
							placeholder="Libellé"
							value={data.label}
							error={errors.label}
							onChange={(e) => setData("label", e.target.value)}
							autoFocus
						/>
					</div>
					<div className="flex gap-2 shrink-0 mt-1">
						<Button
							type="submit"
							size="sm"
							icon={<Save size={14} />}
							processing={processing}
						>
							Sauvegarder
						</Button>
						<Button
							size="sm"
							variant="secondary"
							icon={<X size={14} />}
							onClick={handleCancel}
						>
							Annuler
						</Button>
					</div>
				</form>
			</li>
		);
	}

	return (
		<li className="flex items-center justify-between gap-3 p-3 px-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
			<span className="font-medium text-gray-800">{type.label}</span>
			<div className="flex gap-2 shrink-0">
				<button
					type="button"
					onClick={() => setEditing(true)}
					className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
					aria-label="Modifier"
				>
					<Pencil size={16} />
				</button>
				<button
					type="button"
					onClick={() => onDeleteRequest(type)}
					className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
					aria-label="Supprimer"
				>
					<Trash2 size={16} />
				</button>
			</div>
		</li>
	);
}

const BoatTypeEditor = ({ types }: Props) => {
	const [addOpen, setAddOpen] = useState(false);
	const [typeToDelete, setTypeToDelete] = useState<BoatType | null>(null);

	const handleDelete = () => {
		if (!typeToDelete) return;
		router.delete(`/administration/bateaux/types/${typeToDelete.id}`, {
			onSuccess: () => setTypeToDelete(null),
		});
	};

	return (
		<div className="p-4 sm:p-0 max-w-2xl mx-auto space-y-4">
			<Head title="Types de bateaux" />

			<div className="flex justify-end">
				<Button icon={<Plus />} onClick={() => setAddOpen(true)}>
					Ajouter un type
				</Button>
			</div>

			{types.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
					<Sailboat size={40} strokeWidth={1.5} />
					<p className="text-sm">Aucun type de bateau enregistré</p>
				</div>
			) : (
				<ul className="flex flex-col gap-2">
					{types.map((type) => (
						<EditableRow
							key={type.id}
							type={type}
							onDeleteRequest={setTypeToDelete}
						/>
					))}
				</ul>
			)}

			<AddTypeModal open={addOpen} onClose={() => setAddOpen(false)} />

			<ConfirmModal
				open={typeToDelete !== null}
				onClose={() => setTypeToDelete(null)}
				title="Supprimer le type"
				confirmationText={`Êtes-vous sûr de vouloir supprimer le type "${typeToDelete?.label}" ?`}
				label="Supprimer"
				icon={<Trash2 size={16} />}
				onConfirm={handleDelete}
			/>
		</div>
	);
};

BoatTypeEditor.layout = (page: React.ReactNode) => (
	<AppLayout title="Types de bateaux">{page}</AppLayout>
);

export default BoatTypeEditor;
