import type { Media } from "#types/media";
import Button from "~/components/ui/buttons/Button";
import type { TabProps } from "~/components/ui/Tab";
import Tab from "~/components/ui/Tab";

type MediaTabProps = TabProps & {
	medias: Media[];
	// intervention: Intervention;
	// openModal: (open: boolean) => void;
};

export default function MediaTab({ selected, medias }: MediaTabProps) {
	return (
		<Tab selected={selected}>
			{medias.map((media) => (
				<div key={media.projectMediaId}>
					{media.type === "image" ? (
						<img
							className="size-32 rounded-2xl"
							key={media.mediaId}
							src={media.url}
							alt="Toto"
						/>
					) : (
						<Button
							key={media.mediaId}
							onClick={() =>
								window.open(media.url, "_blank", "noopener,noreferrer")
							}
						>
							PDF
						</Button>
					)}
					<span>{media.caption}</span>
				</div>
			))}
		</Tab>
	);
}
