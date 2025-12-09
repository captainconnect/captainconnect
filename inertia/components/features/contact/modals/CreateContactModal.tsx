import { useForm } from "@inertiajs/react";
import { Contact2, Save, X } from "lucide-react";
import type React from "react";
import Button from "~/components/ui/buttons/Button";
import Input from "~/components/ui/inputs/Input";
import Loader from "~/components/ui/Loader";
import Modal, { type BaseModalProps } from "~/components/ui/modals/Modal";

export default function CreateContactModal({ open, onClose }: BaseModalProps) {
	const { data, setData, post, processing, errors, reset } = useForm({
		company: "",
		fullName: "",
		phone: "",
		email: "",
	});

	const handleCancel = () => {
		onClose();
		reset();
	};

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		post("/contacts/store", {
			onSuccess: () => {
				reset();
				onClose();
			},
		});
	};

	return (
		<Modal
			title="Créer un contact"
			subtitle="Ajouter un nouveau contact à votre liste. Au moins une méthode de contact est nécessaire"
			icon={<Contact2 size="30" />}
			open={open}
			onClose={onClose}
		>
			<form className="flex flex-col gap-4" onSubmit={submit}>
				<Input
					label="Entreprise"
					placeholder="Ex: Sail Marine (optionnel)"
					type="text"
					name="company"
					error={errors.company}
					value={data.company}
					onChange={(e) => setData("company", e.target.value)}
				/>
				<Input
					label="Nom complet *"
					placeholder="Ex: John Doe"
					name="fullName"
					type="text"
					required
					error={errors.fullName}
					value={data.fullName}
					onChange={(e) => setData("fullName", e.target.value)}
				/>
				<Input
					label="Numéro de téléphone"
					placeholder="Ex: 0612345678 (optionnel si email)"
					name="phone"
					type="tel"
					error={errors.phone}
					value={data.phone}
					onChange={(e) => setData("phone", e.target.value)}
				/>
				<Input
					label="Adresse email"
					name="email"
					placeholder="Ex: john.doe@gmail.com (optionnel si téléphone)"
					type="email"
					error={errors.email}
					value={data.email}
					onChange={(e) => setData("email", e.target.value)}
				/>
				<div className="mt-4 flex items-center gap-4 justify-end">
					<Button onClick={handleCancel} variant="secondary" icon={<X />}>
						Annuler
					</Button>
					<Button type="submit" icon={<Save />}>
						{processing ? <Loader /> : "Créer le contact"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
