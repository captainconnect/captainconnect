import { router, useForm } from "@inertiajs/react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import type { MultipleProjectMediaFormData } from "#types/media";
import Button from "~/components/ui/buttons/Button";

type MultipleProjectMediaFormProps = {
	boatId: number;
	onClose: () => void;
};

const MultipleProjectMediaForm = forwardRef<
	{ resetForm: () => void },
	MultipleProjectMediaFormProps
>(function ProjectMediaForm({ boatId, onClose }, ref) {
	const { setData, post, processing, errors, reset, clearErrors } =
		useForm<MultipleProjectMediaFormData>({
			files: null,
			boatId,
		});

	const fileInputRef = useRef<HTMLInputElement | null>(null);
	function resetFormCompletely() {
		reset();
		clearErrors();

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	useImperativeHandle(ref, () => ({
		resetForm: resetFormCompletely,
	}));

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		post("/media/projectMedia/mass", {
			forceFormData: true,
			onSuccess: () => {
				router.reload({ only: ["medias"] });
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
				<label htmlFor="files" className="text-primary">
					Fichiers
				</label>

				<input
					id="files"
					name="files"
					type="file"
					accept="image/*,application/pdf"
					required
					ref={fileInputRef}
					multiple
					onChange={(e) => {
						const files = e.currentTarget.files;
						setData("files", files ? Array.from(files) : null);
					}}
					className="block mt-1 w-full cursor-pointer rounded-lg 
              file:mr-4 file:rounded-md file:border-0
              file:bg-primary file:px-4 file:py-2
              file:text-sm file:font-medium file:text-white
              hover:file:bg-primary/90"
				/>

				{errors.files && (
					<span className="text-red-500 text-center">{errors.files}</span>
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

export default MultipleProjectMediaForm;
