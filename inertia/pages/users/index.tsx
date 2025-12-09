import { Head } from "@inertiajs/react";
import { Plus, Users } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import type { Role } from "#types/role";
import type { User } from "#types/user";
import CreateUserModal from "~/components/features/user/modals/CreateUserModal";
import UsersList from "~/components/features/user/modals/UserList";
import AppLayout from "~/components/layout/AppLayout";
import PageHeader from "~/components/layout/PageHeader";
import EmptyList from "~/components/ui/EmptyList";

type UserIndexPageProps = {
	users: User[];
	roles: Role[];
};

const title = "Utilisateurs";

const UserIndexPage = ({ users, roles }: UserIndexPageProps) => {
	const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

	useEffect(() => {
		setFilteredUsers(users);
	}, [users]);

	const handleSearch = (value: string) => {
		setSearch(value);
		const query = value.toLowerCase().trim();
		setFilteredUsers(
			users.filter(
				(u) =>
					u.username.toLowerCase().includes(query) ||
					u.firstname.toLowerCase().includes(query) ||
					u.lastname.toLowerCase().includes(query) ||
					u.email?.toLowerCase().includes(query) ||
					u.phone?.toLowerCase().includes(query) ||
					u.role?.name.toLowerCase().includes(query),
			),
		);
	};

	return (
		<>
			<Head title={title} />
			<PageHeader
				title="Liste des utilisateurs"
				subtitle="Gérer les utilisateurs de l'application"
				search={{
					disabled: users.length === 0,
					onChange: (value) => handleSearch(value),
					placeholder: "Rechercher un utilisateur",
					value: search,
				}}
				buttons={[
					{
						label: "Créer un utilisateur",
						icon: <Plus />,
						onClick: () => setCreateUserModalOpen(true),
					},
				]}
			/>
			{users.length === 0 ? (
				<EmptyList
					icon={<Users size="48" />}
					text="Aucun utilisateur. Pour modifier vos paramètres, accédez à votre profile."
				/>
			) : (
				<UsersList users={filteredUsers} />
			)}
			<CreateUserModal
				open={createUserModalOpen}
				onClose={() => setCreateUserModalOpen(false)}
				roles={roles}
			/>
		</>
	);
};

UserIndexPage.layout = (page: React.ReactNode) => (
	<AppLayout title={title}>{page}</AppLayout>
);

export default UserIndexPage;
