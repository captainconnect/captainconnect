import { router } from "@inertiajs/react";
import {
	RotateCcw,
	ShieldBan,
	ShieldCheck,
	ShieldMinus,
	ShieldPlus,
	Trash,
} from "lucide-react";
import type { ActionButton } from "#types/ui/section";

import type { User } from "#types/user";

export enum UserActionsModals {
	ResetPassword,
	DeactivateUser,
	ActivateUser,
	DeleteUser,
	PromoteUser,
	DemoteUser,
}

export default function useUserActions(
	user: User,
	setCurrentModal: (m: UserActionsModals) => void,
	setModalOpen: (open: boolean) => void,
) {
	const modals = {
		[UserActionsModals.ResetPassword]: {
			title: "Réinitialiser le mot de passe",
			label: "Confirmer",
			icon: <RotateCcw />,
			action: () => router.patch(`/utilisateurs/${user.id}/reset-password`),
			confirmationText: "Réinitialiser le mot de passe de l'utilisateur ?",
		},
		[UserActionsModals.PromoteUser]: {
			title: "Promouvoir en tant qu'administrateur",
			label: "Confirmer",
			icon: <ShieldPlus />,
			action: () => router.patch(`/utilisateurs/${user.id}/promote`),
			confirmationText: "L'utilisateur aura les droits administrateur",
		},
		[UserActionsModals.DemoteUser]: {
			title: "Rétrograder en tant qu'utilisateur",
			label: "Confirmer",
			icon: <ShieldMinus />,
			action: () => router.patch(`/utilisateurs/${user.id}/demote`),
			confirmationText: "L'utilisateur perdra les droits administrateur",
		},
		[UserActionsModals.DeactivateUser]: {
			title: "Désactiver l'utilisateur",
			label: "Confirmer",
			icon: <ShieldBan />,
			action: () => router.patch(`/utilisateurs/${user.id}/deactivate`),
			confirmationText:
				"Désactiver l'utilisateur ? Il ne pourra plus se connecter.",
		},
		[UserActionsModals.ActivateUser]: {
			title: "Activer l'utilisateur",
			label: "Confirmer",
			icon: <ShieldCheck />,
			action: () => router.patch(`/utilisateurs/${user.id}/activate`),
			confirmationText:
				"Activer l'utilisateur ? Il pourra se connecter à nouveau.",
		},
		[UserActionsModals.DeleteUser]: {
			title: "Supprimer l'utilisateur",
			label: "Confirmer",
			icon: <Trash />,
			action: () => router.delete(`/utilisateurs/${user.id}`),
			confirmationText:
				"Supprimer définitivement l'utilisateur ? Cette action est irréversible.",
		},
	};

	// -------------------------
	// Buttons list
	// -------------------------
	const openModal = (modal: UserActionsModals) => {
		setCurrentModal(modal);
		setModalOpen(true);
	};

	const dangerZoneButtons: ActionButton[] = [
		{
			text: "Réinitialiser le mot de passe",
			icon: <RotateCcw size="18" />,
			onClick: () => openModal(UserActionsModals.ResetPassword),
		},
		user.role.id === 2
			? {
					text: "Rétrograder en utilisateur",
					icon: <ShieldMinus size="18" />,
					onClick: () => openModal(UserActionsModals.DemoteUser),
				}
			: {
					text: "Promouvoir administrateur",
					icon: <ShieldPlus size="18" />,
					onClick: () => openModal(UserActionsModals.PromoteUser),
				},
		user.activated
			? {
					text: "Désactiver l'utilisateur",
					variant: "warning",
					icon: <ShieldBan size="18" />,
					onClick: () => openModal(UserActionsModals.DeactivateUser),
				}
			: {
					text: "Activer l'utilisateur",
					variant: "accent",
					icon: <ShieldCheck size="18" />,
					onClick: () => openModal(UserActionsModals.ActivateUser),
				},
		{
			text: "Supprimer l'utilisateur",
			variant: "danger",
			icon: <Trash size="18" />,
			onClick: () => openModal(UserActionsModals.DeleteUser),
		},
	];

	return {
		modals,
		dangerZoneButtons,
	};
}
