import { type ReactNode, useState } from "react";
import Button from "../buttons/Button";
import Input from "../inputs/Input";
import Modal, { type BaseModalProps } from "./Modal";

export type ConfirmationType = {
	placeholder: string;
	value: string;
};

type ConfirmModalProps = BaseModalProps & {
	title: string;
	label: string;
	icon?: ReactNode;
	confirmationText: string;
	onConfirm: () => void;
	confirmationType?: ConfirmationType;
};

export default function ConfirmModal({
	open,
	onClose,
	title,
	label,
	icon,
	confirmationText,
	confirmationType,
	onConfirm,
}: ConfirmModalProps) {
	const [confirmationTypeSample, setConfirmationTypeSample] = useState("");

	const handleOnClose = () => {
		onClose();
		setTimeout(() => {
			setConfirmationTypeSample("");
		}, 150);
	};

	return (
		<Modal open={open} onClose={onClose} title={title}>
			<div className="flex flex-col gap-4">
				<p className="text-left">{confirmationText}</p>
				{confirmationType && (
					<Input
						placeholder={confirmationType.placeholder}
						value={confirmationTypeSample}
						onChange={(e) => setConfirmationTypeSample(e.target.value)}
					/>
				)}
				<div className="flex justify-end gap-4">
					<Button
						className="disabled:bg-red-300 disabled:active:scale-100"
						variant="danger"
						icon={icon && icon}
						onClick={() => {
							onConfirm();
							handleOnClose();
						}}
						disabled={
							confirmationType
								? confirmationTypeSample !== confirmationType.value
								: false
						}
					>
						{label}
					</Button>
					<Button
						className="disabled:bg-red-300 disabled:active:scale-100"
						variant="secondary"
						onClick={handleOnClose}
					>
						Annuler
					</Button>
				</div>
			</div>
		</Modal>
	);
}
