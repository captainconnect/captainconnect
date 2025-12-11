import { useForm } from "@inertiajs/react";
import { Save, User as UserIcon, X } from "lucide-react";
import type { User } from "#types/user";
import Button from "~/components/ui/buttons/Button";
import Input from "~/components/ui/inputs/Input";
import type { BaseModalProps } from "~/components/ui/modals/Modal";
import Modal from "~/components/ui/modals/Modal";

type UpdateProfileModalProps = BaseModalProps & {
	user: User;
};

type EditProfileFormData = {
	email?: string;
	phone?: string;
};

export default function UpdateProfileModal({
	open,
	onClose,
	user,
}: UpdateProfileModalProps) {
	const getInitialData = (): EditProfileFormData => ({
		email: user.email || "",
		phone: user.phone || "",
	});

	const { data, setData, patch, processing, errors, reset } =
		useForm<EditProfileFormData>(getInitialData());

	const handleCancel = () => {
		onClose();
		reset();
	};

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		patch("/profile/", {
			onSuccess: () => {
				reset();
				onClose();
			},
		});
	};

	return (
		<Modal
			title="Informations"
			subtitle="Informations de compte"
			icon={<UserIcon size="30" />}
			open={open}
			onClose={onClose}
		>
			<form className="flex flex-col gap-4" onSubmit={submit}>
				<Input
					type="email"
					onChange={(e) => setData("email", e.target.value)}
					placeholder="Adresse email"
					value={data.email}
					error={errors.email}
					label="Adresse email"
				/>
				<Input
					type="tel"
					onChange={(e) => setData("phone", e.target.value)}
					placeholder="Numéro de téléphone"
					value={data.phone}
					error={errors.phone}
					label="Numéro de téléphone"
				/>
				<Button processing={processing} type="submit" icon={<Save />}>
					Enregistrer
				</Button>
				<Button onClick={handleCancel} variant="secondary" icon={<X />}>
					Annuler
				</Button>
			</form>
		</Modal>
	);
}
