import { Head } from "@inertiajs/react";
import AppLayout from "~/components/layout/AppLayout";

const title = "Tableau de bord";

const HomePage = () => {
	return (
		<>
			<Head title={title} />
			<h1>Ici retrouvez les dernières actualités</h1>
		</>
	);
};

HomePage.layout = (page: React.ReactNode) => (
	<AppLayout title={title}>{page}</AppLayout>
);

export default HomePage;
