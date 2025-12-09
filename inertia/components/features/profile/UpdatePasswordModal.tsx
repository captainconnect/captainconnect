import { useForm } from "@inertiajs/react";
import { Lock, Save, X } from "lucide-react";
import Button from "~/components/ui/buttons/Button";
import Input from "~/components/ui/inputs/Input";
import Loader from "~/components/ui/Loader";
import type { BaseModalProps } from "~/components/ui/modals/Modal";
import Modal from "~/components/ui/modals/Modal";

type UpdatePasswordModalProps = BaseModalProps;

export default function UpdatePasswordModal({
	open,
	onClose,
}: UpdatePasswordModalProps) {
	const { data, setData, patch, processing, errors, reset } = useForm({
		password: "",
		password_confirmation: "",
	});

	const handleCancel = () => {
		onClose();
		reset();
	};

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		patch("/profile/password", {
			onSuccess: () => {
				reset();
				onClose();
			},
		});
	};

	return (
		<Modal
			title="Mot de passe"
			subtitle="Modifier le mot de passe"
			icon={<Lock size="30" />}
			open={open}
			onClose={onClose}
		>
			<form className="flex flex-col gap-4" onSubmit={submit}>
				<Input
					type="password"
					onChange={(e) => setData("password", e.target.value)}
					placeholder="Nouveau mot de passe"
					value={data.password}
					error={errors.password}
					label="Nouveau mot de passe"
				/>
				<Input
					type="password"
					onChange={(e) => setData("password_confirmation", e.target.value)}
					placeholder="Confirmer le nouveau mot de passe"
					value={data.password_confirmation}
					error={errors.password_confirmation}
					label="Confirmer"
				/>
				<Button type="submit" icon={<Save />}>
					{processing ? <Loader /> : "Confirmer"}
				</Button>
				<Button onClick={handleCancel} variant="secondary" icon={<X />}>
					Annuler
				</Button>
			</form>
		</Modal>
	);
}
