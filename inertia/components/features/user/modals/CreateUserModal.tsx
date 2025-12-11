import { useForm } from "@inertiajs/react";
import { Save, UserPlus, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { Role } from "#types/role";
import { slugify } from "~/app/utils";
import Button from "~/components/ui/buttons/Button";
import Input from "~/components/ui/inputs/Input";
import Select from "~/components/ui/inputs/Select";
import type { BaseModalProps } from "~/components/ui/modals/Modal";
import Modal from "~/components/ui/modals/Modal";

type CreateUserModalProps = BaseModalProps & {
	roles: Role[];
};

export default function CreateUserModal({
	open,
	onClose,
	roles,
}: CreateUserModalProps) {
	const { data, setData, post, processing, errors, reset } = useForm({
		firstname: "",
		lastname: "",
		username: "",
		role_id: "1",
	});

	// true dès que l'utilisateur modifie le champ username à la main
	const [isUsernameDirty, setIsUsernameDirty] = useState(false);

	const buildUsername = (firstname: string, lastname: string) => {
		if (!firstname && !lastname) return "";
		return slugify(`${firstname}.${lastname}`);
	};

	const handleCancel = () => {
		onClose();
		reset();
		setIsUsernameDirty(false);
	};

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		post("/utilisateurs/store", {
			onSuccess: () => {
				reset();
				setIsUsernameDirty(false);
				onClose();
			},
		});
	};

	return (
		<Modal
			title="Créer un utilisateur"
			subtitle="Ajouter un nouvel utilisateur"
			icon={<UserPlus size="30" />}
			open={open}
			onClose={onClose}
		>
			<form className="flex flex-col gap-4" onSubmit={submit}>
				<Input
					required
					label="Prénom"
					placeholder="Prénom"
					type="text"
					name="firstname"
					error={errors.firstname}
					value={data.firstname}
					onChange={(e) => {
						const value = e.target.value;
						setData("firstname", value);

						if (!isUsernameDirty) {
							setData("username", buildUsername(value, data.lastname));
						}
					}}
				/>
				<Input
					required
					label="Nom de famille"
					placeholder="Nom de famille"
					type="text"
					name="lastname"
					error={errors.lastname}
					value={data.lastname}
					onChange={(e) => {
						const value = e.target.value;
						setData("lastname", value);

						if (!isUsernameDirty) {
							setData("username", buildUsername(data.firstname, value));
						}
					}}
				/>
				<Input
					required
					label="Nom d'utilisateur"
					placeholder="Nom d'utilisateur"
					autoComplete="none"
					type="text"
					name="username"
					error={errors.username}
					value={data.username}
					onChange={(e) => {
						setIsUsernameDirty(true);
						setData("username", e.target.value);
					}}
				/>
				<Select
					value={data.role_id}
					onChange={(e) => setData("role_id", e.target.value)}
					required
					label="Rôle"
					allowNull={false}
					options={roles.map((r) => ({
						id: r.id,
						label: r.name,
					}))}
				/>
				<div className="mt-4 flex items-center gap-4 justify-end">
					<Button onClick={handleCancel} variant="secondary" icon={<X />}>
						Annuler
					</Button>
					<Button processing={processing} type="submit" icon={<Save />}>
						Créer l'utilisateur
					</Button>
				</div>
			</form>
		</Modal>
	);
}
