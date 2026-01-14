import type { SimplePaginatorMetaKeys } from "@adonisjs/lucid/types/querybuilder";
import { Head } from "@inertiajs/react";
import type { Boat } from "#types/boat";
import type { FileMedia, InterventionsFilterData } from "#types/media";
import AppLayout from "~/components/layout/AppLayout";
import FileGallery from "~/components/layout/medias/FileGallery";

const title = "Fichiers";

type MediaPageProps = {
	medias: FileMedia[];
	boat: Boat;
	meta: SimplePaginatorMetaKeys;
	interventions?: InterventionsFilterData[];
};

const MediaPage = ({ medias, boat, meta, interventions }: MediaPageProps) => {
	return (
		<>
			<Head title={title} />
			<FileGallery
				interventions={interventions}
				boat={boat}
				medias={medias}
				meta={meta}
			/>
		</>
	);
};

MediaPage.layout = (page: React.ReactNode & { props: MediaPageProps }) => {
	const { boat } = page.props;
	return <AppLayout title={`${title} - ${boat.name}`}>{page}</AppLayout>;
};

export default MediaPage;
