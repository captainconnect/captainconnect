import { Head, usePage } from "@inertiajs/react";
import type { User } from "#types/user";
import AppLayout from "~/components/layout/AppLayout";

const title = "Tableau de bord";

const HomePage = () => {
	const { props } = usePage<{ authenticatedUser: User }>();
	const currentUser = props.authenticatedUser;

	return (
		<>
			<Head title={title} />
			<h1>Ici retrouvez les dernières actualités</h1>
			<p>{currentUser.isAdmin ? "Admin" : "Utilisateur"}</p>
		</>
	);
};

HomePage.layout = (page: React.ReactNode) => (
	<AppLayout title={title}>{page}</AppLayout>
);

export default HomePage;
