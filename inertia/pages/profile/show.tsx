import { Head } from "@inertiajs/react";
import { CalendarClock, Edit, Lock, User2 } from "lucide-react";
import { useState } from "react";
import type { User } from "#types/user";
import UpdatePasswordModal from "~/components/features/profile/UpdatePasswordModal";
import UpdateProfileModal from "~/components/features/profile/UpdateProfileModal";
import UserHourTable from "~/components/features/user/UserHourTable";
import AppLayout from "~/components/layout/AppLayout";
import PageHeader from "~/components/layout/PageHeader";
import Section from "~/components/ui/Section";

enum ProfilePageModals {
	None,
	UpdatePassword,
	UpdateProfile,
}

type ProfilePageProps = {
	user: User;
};

const ProfilePage = ({ user }: ProfilePageProps) => {
	const [modal, setModal] = useState<ProfilePageModals>(ProfilePageModals.None);

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
				]}
			/>
			<div className="space-y-4">
				<Section title="Informations du profile" icon={<User2 />}>
					<p>
						Nom d'utilisateur :{" "}
						<span className="font-semibold">{user.username}</span>
					</p>
					<p>
						Email :{" "}
						<span className="font-semibold">{user.email ?? "Non défini"}</span>
					</p>
					<p>
						Numéro de téléphone :{" "}
						<span className="font-semibold">{user.phone ?? "Non défini"}</span>
					</p>
					<p>
						Compte créé le{" "}
						<span className="font-semibold">
							{new Date(user.createdAt).toLocaleDateString("fr-FR")}
						</span>
					</p>
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
		</>
	);
};

ProfilePage.layout = (page: React.ReactNode) => (
	<AppLayout title="Profile">{page}</AppLayout>
);

export default ProfilePage;
