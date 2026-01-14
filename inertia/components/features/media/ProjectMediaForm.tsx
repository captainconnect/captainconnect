import { useForm } from "@inertiajs/react";

import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import type { ProjectMediaFormData } from "#types/media";
import Button from "~/components/ui/buttons/Button";
import Input from "~/components/ui/inputs/Input";

type ProjectMediaFormProps = {
	boatId: number;
	interventionId?: number;
	taskId?: number;
	onClose: () => void;
};

const ProjectMediaForm = forwardRef<
	{ resetForm: () => void },
	ProjectMediaFormProps
>(function ProjectMediaForm({ boatId, interventionId, taskId, onClose }, ref) {
	const [preview, setPreview] = useState<string | null>(null);

	const { data, setData, post, processing, errors, reset, clearErrors } =
		useForm<ProjectMediaFormData>({
			file: null,
			caption: "",
			boatId,
			interventionId,
			taskId,
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
		setData("file", file);

		if (preview) URL.revokeObjectURL(preview);

		if (file?.type.startsWith("image/")) {
			setPreview(URL.createObjectURL(file));
		} else {
			setPreview(null);
		}
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		post("/media/projectMedia", {
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

	return (
		<form onSubmit={handleSubmit} className="max-w-md">
			<div className="space-y-3">
				<label htmlFor="file" className="text-primary">
					Fichier
				</label>

				<input
					id="file"
					name="file"
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

				{errors.file && (
					<span className="text-red-500 text-center">
						Ce fichier existe déjà (erreur de duplication)
					</span>
				)}

				<Input
					type="text"
					label="Légende"
					placeholder="(Optionnel)"
					value={data.caption}
					onChange={(e) => setData("caption", e.target.value)}
				/>

				{errors.caption && (
					<p className="text-sm text-red-500">{errors.caption}</p>
				)}

				{preview && (
					<div className="mt-3 overflow-hidden rounded-lg">
						<img
							src={preview}
							alt="Preview"
							className="max-h-64 w-full object-contain bg-zinc-950"
						/>
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

export default ProjectMediaForm;
