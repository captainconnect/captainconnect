import { router, useForm } from "@inertiajs/react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import Button from "~/components/ui/buttons/Button";
import { getCenteredAspectCrop, pixelCropToFile } from "../Cropper";

type UploadAvatarFormProps = {
	onClose: () => void;
};

type AvatarFormData = {
	avatar: File | null;
};

const UploadAvatarForm = forwardRef<
	{ resetForm: () => void },
	UploadAvatarFormProps
>(function UploadAvatarForm({ onClose }, ref) {
	const [preview, setPreview] = useState<string | null>(null);

	// état cropper
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
	const [isImage, setIsImage] = useState(false);

	const imgRef = useRef<HTMLImageElement | null>(null);

	const { data, setData, processing, errors, reset, clearErrors } =
		useForm<AvatarFormData>({
			avatar: null,
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
		setData("avatar", file);

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

		// Crop carré centré par défaut (avatar)
		const next = getCenteredAspectCrop(img.width, img.height, 1);
		setCrop(next);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		let avatarToSend = data.avatar;

		if (
			isImage &&
			data.avatar &&
			imgRef.current &&
			completedCrop?.width &&
			completedCrop?.height
		) {
			avatarToSend = await pixelCropToFile(
				imgRef.current,
				completedCrop,
				data.avatar.name,
			);
		}

		const fd = new FormData();
		if (avatarToSend) fd.append("avatar", avatarToSend);

		router.patch("/profile/avatar", fd, {
			forceFormData: true, // (optionnel, mais ok)
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

	return (
		<form onSubmit={handleSubmit} className="max-w-md">
			<div className="space-y-3">
				<label htmlFor="file" className="text-primary">
					Image
				</label>

				<input
					id="file"
					name="avatar"
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

				{errors.avatar && (
					<span className="text-red-500 text-center">
						Ce fichier existe déjà (erreur de duplication)
					</span>
				)}

				{/* IMAGE -> CROP */}
				{preview && isImage && (
					<div className="mt-3 overflow-hidden rounded-lg bg-zinc-950 p-2 flex items-center justify-center">
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

				{/* PDF -> simple info (pas de crop) */}
				{data.avatar && !isImage && (
					<div className="mt-3 rounded-lg border border-zinc-700 p-3 text-sm text-zinc-200">
						Fichier sélectionné :{" "}
						<span className="font-medium">{data.avatar.name}</span>
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
			</div>
		</form>
	);
});

export default UploadAvatarForm;
