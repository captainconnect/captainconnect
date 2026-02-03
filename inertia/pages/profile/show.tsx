import type { SharedProps } from "@adonisjs/inertia/types";
import { Head, router, usePage } from "@inertiajs/react";
import {
	Bell,
	BellOff,
	CalendarClock,
	Edit,
	ImageMinus,
	ImageUp,
	Lock,
	User2,
} from "lucide-react";
import { useState } from "react";
import type { User } from "#types/user";

import UpdatePasswordModal from "~/components/features/profile/UpdatePasswordModal";
import UpdateProfileModal from "~/components/features/profile/UpdateProfileModal";
import UploadAvatarModal from "~/components/features/profile/UploadAvatarModal";
import UserHourTable from "~/components/features/user/UserHourTable";
import AppLayout from "~/components/layout/AppLayout";
import PageHeader from "~/components/layout/PageHeader";
import AvatarSection from "~/components/layout/profile/AvatarSection";
import type { ButtonVariant } from "~/components/ui/buttons/Button";
import ConfirmModal from "~/components/ui/modals/Confirm";
import Section from "~/components/ui/Section";
import { usePushNotifications } from "~/hooks/usePushNotifications";

enum ProfilePageModals {
	None,
	UpdatePassword,
	UpdateProfile,
	UploadAvatar,
	ConfirmAvatarDelete,
}

type ProfilePageProps = {
	user: User;
};

const ProfilePage = ({ user }: ProfilePageProps) => {
	const [modal, setModal] = useState<ProfilePageModals>(ProfilePageModals.None);
	const { authenticatedUser } = usePage<SharedProps>().props;

	const handleAvatarDelete = () => {
		router.delete("/profile/avatar");
	};

	const { subscribe, unsubscribe, loading, supported, permission, subscribed } =
		usePushNotifications();

	const pushButtons = !supported
		? []
		: [
				!subscribed
					? {
							label:
								permission === "denied"
									? "Notifications bloquées (Chrome)"
									: "Activer les notifications",
							icon: <Bell size="18" />,
							variant: "secondary" as ButtonVariant,
							onClick: subscribe,
							disabled: loading || permission === "denied",
						}
					: {
							label: "Désactiver cet appareil",
							icon: <BellOff size="18" />,
							variant: "secondary" as ButtonVariant,
							onClick: unsubscribe,
							disabled: loading,
						},
			].filter(Boolean);

	return (
		<>
			<Head title={user.firstname} />
			<PageHeader
				title={`${user.firstname} ${user.lastname}`}
				buttons={[
					{
						label: "Modifier",
						icon: <Edit size="18" />,
						onClick: () => setModal(ProfilePageModals.UpdateProfile),
					},
					{
						label: "Changer de mot de passe",
						icon: <Lock size="18" />,
						variant: "secondary",
						onClick: () => setModal(ProfilePageModals.UpdatePassword),
					},
					...pushButtons,
					{
						label: "Ajouter/Changer l'avatar",
						icon: <ImageUp size="18" />,
						variant: "secondary",
						onClick: () => setModal(ProfilePageModals.UploadAvatar),
					},
					...(authenticatedUser?.avatar
						? [
								{
									label: "Supprimer l'avatar",
									icon: <ImageMinus size="18" />,
									variant: "danger" as const,
									onClick: () =>
										setModal(ProfilePageModals.ConfirmAvatarDelete),
								},
							]
						: []),
				]}
			/>
			<div className="space-y-4">
				<Section title="Informations du profile" icon={<User2 />}>
					<div className="flex flex-col items-center md:block">
						<AvatarSection />
						<p>
							Nom d'utilisateur :{" "}
							<span className="font-semibold">{user.username}</span>
						</p>
						<p>
							Email :{" "}
							<span className="font-semibold">
								{user.email ?? "Non défini"}
							</span>
						</p>
						<p>
							Numéro de téléphone :{" "}
							<span className="font-semibold">
								{user.phone ?? "Non défini"}
							</span>
						</p>
						<p>
							Compte créé le{" "}
							<span className="font-semibold">
								{new Date(user.createdAt).toLocaleDateString("fr-FR")}
							</span>
						</p>
					</div>
				</Section>

				<Section
					title="Heures"
					subtitle="Historique des heures"
					icon={<CalendarClock />}
				>
					<UserHourTable user={user} />
				</Section>
			</div>
			<UpdatePasswordModal
				open={modal === ProfilePageModals.UpdatePassword}
				onClose={() => setModal(ProfilePageModals.None)}
			/>
			<UpdateProfileModal
				user={user}
				open={modal === ProfilePageModals.UpdateProfile}
				onClose={() => setModal(ProfilePageModals.None)}
			/>
			<UploadAvatarModal
				open={modal === ProfilePageModals.UploadAvatar}
				onClose={() => setModal(ProfilePageModals.None)}
			/>
			<ConfirmModal
				confirmationText="Confirmer la suppression de l'avatar ?"
				label="Confirmer"
				title="Supprimer l'avatar"
				icon={<ImageMinus />}
				onConfirm={handleAvatarDelete}
				open={modal === ProfilePageModals.ConfirmAvatarDelete}
				onClose={() => setModal(ProfilePageModals.None)}
			/>
		</>
	);
};

ProfilePage.layout = (page: React.ReactNode) => (
	<AppLayout title="Profile">{page}</AppLayout>
);

export default ProfilePage;
