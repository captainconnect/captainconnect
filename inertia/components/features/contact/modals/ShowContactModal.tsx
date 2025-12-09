import { router, useForm } from "@inertiajs/react";
import {
	Building,
	Edit,
	Mail,
	Phone,
	Save,
	Trash,
	User,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Contact } from "#types/contact";
import Button from "~/components/ui/buttons/Button";
import EditableField from "~/components/ui/EditableField";
import Input from "~/components/ui/inputs/Input";
import type { BaseModalProps } from "~/components/ui/modals/Modal";
import Modal from "~/components/ui/modals/Modal";

type ShowContactModalProps = BaseModalProps & {
	contact?: Contact | null;
};

export default function ShowContactModal({
	open,
	onClose,
	contact,
}: ShowContactModalProps) {
	const [editing, setEditing] = useState(false);

	const { data, setData, put, processing, errors } = useForm({
		company: "",
		fullName: "",
		email: "",
		phone: "",
	});

	useEffect(() => {
		if (contact) {
			setData({
				company: contact.company || "",
				fullName: contact.fullName || "",
				email: contact.email || "",
				phone: contact.phone || "",
			});
		}
	}, [contact, setData]);

	const handleOnClose = () => {
		setEditing(false);
		onClose();
	};

	const handleSave = () => {
		put(`contacts/update/${contact?.id}`, {
			onSuccess: () => setEditing(false),
		});
	};

	const handleCancel = () => {
		setData({
			company: contact?.company,
			fullName: contact?.fullName,
			email: contact?.email,
			phone: contact?.phone,
		});
		setEditing(false);
	};

	const handleDelete = () => {
		const confirm_deletion = confirm(
			`Confirmer la suppression de ${contact?.fullName}`,
		);
		if (confirm_deletion) {
			router.delete(`/contacts/destroy/${contact?.id}`);
			onClose();
		}
	};

	return (
		<Modal
			title={contact?.fullName}
			subtitle={contact?.company}
			open={open}
			onClose={handleOnClose}
		>
			<div className="space-y-1 mt-6">
				{editing && (
					<>
						<div className="flex gap-2 items-center">
							<Building className="text-slate-400" />
							<Input
								name="company"
								onChange={(e) => setData("company", e.target.value)}
								value={data.company}
								type="text"
								placeholder="Ajouter l'entreprise"
								error={errors.company}
							/>
						</div>
						<div className="flex gap-2 items-center">
							<User className="text-slate-400" />
							<Input
								name="fullName"
								onChange={(e) => setData("fullName", e.target.value)}
								value={data.fullName}
								type="text"
								placeholder="Nom complet"
								required
								error={errors.fullName}
							/>
						</div>
					</>
				)}

				<div className="flex gap-2 items-center">
					<Phone className="text-slate-400" />
					<EditableField
						name="phone"
						onChange={(e) => setData("phone", e.target.value)}
						editing={editing}
						value={data.phone}
						type="tel"
						autoComplete="tel"
						placeholder="Ajouter un numéro de téléphone"
						error={errors.phone}
					/>
				</div>

				<div className="flex gap-2 items-center">
					<Mail className="text-slate-400" />
					<EditableField
						name="email"
						onChange={(e) => setData("email", e.target.value)}
						editing={editing}
						value={data.email}
						placeholder="Ajouter une adresse email"
						type="email"
						autoComplete="email"
						autoCapitalize="off"
						error={errors.email}
					/>
				</div>
			</div>
			<div className="mt-5 flex items-center gap-2 justify-end">
				<Button
					disabled={processing}
					onClick={() => (editing ? handleSave() : setEditing(true))}
					variant="primary"
					type="button"
					icon={editing ? <Save size="18" /> : <Edit size="18" />}
					size="sm"
				>
					{editing ? "Enregistrer" : "Modifier"}
				</Button>
				{editing && (
					<Button
						onClick={handleCancel}
						variant="secondary"
						type="button"
						icon={<X size="18" />}
						size="sm"
					>
						Annuler
					</Button>
				)}
				{!editing && (
					<Button
						variant="danger"
						type="button"
						icon={<Trash size="18" />}
						onClick={handleDelete}
						size="sm"
					/>
				)}
			</div>
		</Modal>
	);
}
