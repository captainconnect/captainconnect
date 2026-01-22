import { Head } from "@inertiajs/react";
import {
	CalendarClock,
	ShieldBan,
	ShieldCheck,
	UserCircle,
} from "lucide-react";
import { useState } from "react";
import type { User } from "#types/user";
import UserHourTable from "~/components/features/user/UserHourTable";
import AppLayout from "~/components/layout/AppLayout";
import PageHeader from "~/components/layout/PageHeader";
import ConfirmModal from "~/components/ui/modals/Confirm";
import Section from "~/components/ui/Section";
import ActionSection from "~/components/ui/sections/ActionSection";
import useUserActions, { UserActionsModals } from "~/hooks/useUserActions";

type UserPageProps = {
	user: User;
};

const UserPage = ({ user }: UserPageProps) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [currentModal, setCurrentModal] = useState<UserActionsModals>(
		UserActionsModals.ResetPassword,
	);

	const { dangerZoneButtons, modals } = useUserActions(
		user,
		setCurrentModal,
		setModalOpen,
	);

	return (
		<>
			<Head title={`${user.firstname} ${user.lastname}`} />
			<PageHeader
				title={`${user.firstname} ${user.lastname}`}
				subtitle={user.role.name}
				backButton={{ route: "/utilisateurs" }}
				tag={
					user.activated
						? {
								className: "bg-primary",
								icon: <ShieldCheck size="20" />,
								label: "Activé",
							}
						: {
								className: "bg-yellow-600",
								icon: <ShieldBan size="20" />,
								label: "Désactivé",
							}
				}
			/>
			<div className="w-full flex flex-col md:flex-row gap-4 mb-4">
				<Section
					title="Informations"
					subtitle="Coordonnées et informations générales"
					icon={<UserCircle />}
					className="md:w-2/3"
				>
					<div className="flex items-center justify-center md:justify-start">
						{user.avatarUrl ? (
							<img
								className="size-32 rounded-full"
								src={user.avatarUrl}
								alt="Avatar"
							/>
						) : (
							<span className="size-20 text-3xl items-center justify-center flex bg-primary text-white rounded-full">
								{user.firstname.charAt(0)}
								{user.lastname.charAt(0)}
							</span>
						)}
					</div>
					<p>
						{user.firstname} {user.lastname}
					</p>
					<p>{user.role.name}</p>
					<p>
						Depuis le {new Date(user.createdAt).toLocaleDateString("fr-FR")}
					</p>
					<p>Email : {user.email ? user.email : "Non renseigné"}</p>
					<p>
						Numéro de téléphone : {user.phone ? user.phone : "Non renseigné"}
					</p>
					{!user.activated && <p>L'utilisateur est désactivé</p>}
				</Section>

				<ActionSection
					mustBeAdmin={true}
					title="Danger zone"
					className="md:w-1/3"
					buttons={dangerZoneButtons}
				/>

				<ConfirmModal
					title={modals[currentModal].title}
					open={modalOpen}
					label={modals[currentModal].label}
					confirmationText={modals[currentModal].confirmationText}
					confirmationType={modals[currentModal].confirmationType}
					onClose={() => setModalOpen(false)}
					onConfirm={() => {
						modals[currentModal].action();
						setModalOpen(false);
					}}
				/>
			</div>
			<Section
				title="Heures"
				subtitle="Historique des heures"
				icon={<CalendarClock />}
			>
				<UserHourTable user={user} />
			</Section>
		</>
	);
};

UserPage.layout = (page: React.ReactNode) => (
	<AppLayout title="Utilisateur">{page}</AppLayout>
);

export default UserPage;
