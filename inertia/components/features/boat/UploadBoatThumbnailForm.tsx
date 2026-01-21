import { router, useForm } from "@inertiajs/react";
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { type Crop, type PixelCrop, ReactCrop } from "react-image-crop";
import Button from "~/components/ui/buttons/Button";
import { getCenteredAspectCrop, pixelCropToFile } from "../Cropper";

type UploadBoatThumbnailFormProps = {
	onClose: () => void;
	boatId: number;
	hasThumbnail: boolean;
};

type BoatThumbnailFormData = {
	thumbnail: File | null;
};

const UploadBoatThumbnailForm = forwardRef<
	{ resetForm: () => void },
	UploadBoatThumbnailFormProps
>(function UploadBoatThumbnailForm({ onClose, boatId, hasThumbnail }, ref) {
	const [preview, setPreview] = useState<string | null>(null);

	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
	const [isImage, setIsImage] = useState(false);

	const imgRef = useRef<HTMLImageElement | null>(null);

	const { data, setData, processing, errors, reset, clearErrors } =
		useForm<BoatThumbnailFormData>({
			thumbnail: null,
		});

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		return () => {
			if (preview) URL.revokeObjectURL(preview);
		};
	}, [preview]);

	function resetFormCompletely() {
		reset();
		clearErrors();

		if (preview) URL.revokeObjectURL(preview);
		setPreview(null);

		setCrop(undefined);
		setCompletedCrop(null);
		setIsImage(false);
		imgRef.current = null;

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	useImperativeHandle(ref, () => ({
		resetForm: resetFormCompletely,
	}));

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0] ?? null;
		clearErrors();
		setData("thumbnail", file);

		if (preview) URL.revokeObjectURL(preview);

		const imageOk = !!file && file.type.startsWith("image/");
		setIsImage(imageOk);

		if (imageOk) {
			const url = URL.createObjectURL(file);
			setPreview(url);
		} else {
			setPreview(null);
			setCrop(undefined);
			setCompletedCrop(null);
		}
	}

	function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
		const img = e.currentTarget;
		imgRef.current = img;

		const next = getCenteredAspectCrop(img.width, img.height, 1);
		setCrop(next);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		let thumbnailToSend = data.thumbnail;

		if (
			isImage &&
			data.thumbnail &&
			imgRef.current &&
			completedCrop?.width &&
			completedCrop?.height
		) {
			thumbnailToSend = await pixelCropToFile(
				imgRef.current,
				completedCrop,
				data.thumbnail.name,
			);
		}

		const fd = new FormData();
		if (thumbnailToSend) fd.append("thumbnail", thumbnailToSend);

		router.patch(`/bateaux/${boatId}/thumbnail`, fd, {
			forceFormData: true,
			onSuccess: () => {
				resetFormCompletely();
				onClose();
			},
		});
	}

	function handleCancel() {
		resetFormCompletely();
		onClose();
	}

	function handleDeleteThumbnail() {
		const confirmation = confirm("Supprimer la miniature actuelle ?");
		if (!confirmation) return;
		router.delete(`/bateaux/${boatId}/thumbnail`, {
			onSuccess: () => {
				resetFormCompletely();
				onClose();
			},
		});
	}

	return (
		<form onSubmit={handleSubmit} className="max-w-md">
			<div className="space-y-3">
				<label htmlFor="file" className="text-primary">
					Image
				</label>
				<input
					id="file"
					name="thumbnail"
					type="file"
					accept="image/*,application/pdf"
					required
					onChange={handleFileChange}
					ref={fileInputRef}
					className="block mt-1 w-full cursor-pointer rounded-lg 
                file:mr-4 file:rounded-md file:border-0
                file:bg-primary file:px-4 file:py-2
                file:text-sm file:font-medium file:text-white
                hover:file:bg-primary/90"
				/>

				{errors.thumbnail && (
					<span className="text-red-500 text-center">
						Ce fichier existe déjà (erreur de duplication)
					</span>
				)}

				{preview && isImage && (
					<div className="mt-3 overflow-hidden rounded-lg bg-zinc-950 p-2">
						<ReactCrop
							crop={crop}
							onChange={(_, percentCrop) => setCrop(percentCrop)}
							onComplete={(c) => setCompletedCrop(c)}
							aspect={1}
							keepSelection
							className="max-h-96"
						>
							<img
								src={preview}
								alt="Preview"
								onLoad={onImageLoad}
								className="max-h-96 w-full object-contain"
							/>
						</ReactCrop>
					</div>
				)}

				{data.thumbnail && !isImage && (
					<div className="mt-3 rounded-lg border border-zinc-700 p-3 text-sm text-zinc-200">
						Fichier sélectionné :{" "}
						<span className="font-medium">{data.thumbnail.name}</span>
					</div>
				)}
			</div>
			<div className="flex gap-4 mt-4">
				<Button processing={processing} type="submit" disabled={processing}>
					Confirmer
				</Button>

				<Button variant="secondary" type="button" onClick={handleCancel}>
					Annuler
				</Button>
				{hasThumbnail && (
					<Button variant="danger" onClick={handleDeleteThumbnail}>
						Supprimer la miniature
					</Button>
				)}
			</div>
		</form>
	);
});
export default UploadBoatThumbnailForm;
