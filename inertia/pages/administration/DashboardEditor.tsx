import { Head, router, useForm } from "@inertiajs/react";
import ReactQuill from "react-quill-new";
import AppLayout from "~/components/layout/AppLayout";
import "react-quill-new/dist/quill.snow.css";
import Button from "~/components/ui/buttons/Button";

interface Version {
	id: number;
	name: string;
	content: string;
	isActive: boolean; // Ajouté pour savoir laquelle est publiée
	createdAt: string;
}

const DashboardEditor = ({
	versions,
	currentVersion,
}: {
	versions: Version[];
	currentVersion: Version;
}) => {
	const { data, setData, post, processing, reset } = useForm({
		name: "",
		content: currentVersion?.content || "",
	});

	// 1. Changer de version (Chargement)
	const handleVersionChange = (id: string) => {
		router.get(
			"/administration/tableau-de-bord",
			{ version_id: id },
			{ preserveState: false },
		);
	};

	// 2. Créer une nouvelle version
	const submitNewVersion = (e: React.FormEvent) => {
		e.preventDefault();
		post("/administration/dashboard", {
			onSuccess: () => {
				alert("Nouvelle version créée !");
				reset("name");
			},
		});
	};

	// 3. Publier la version chargée
	const handlePublish = () => {
		if (!currentVersion) return;
		if (confirm(`Rendre la version "${currentVersion.name}" publique ?`)) {
			router.post(`/administration/dashboard/${currentVersion.id}/publish`);
		}
	};

	// 4. Supprimer la version chargée
	const handleDelete = () => {
		if (!currentVersion) return;
		if (confirm("Supprimer définitivement cette version ?")) {
			router.delete(`/administration/dashboard/${currentVersion.id}`, {
				onSuccess: () => alert("Version supprimée"),
			});
		}
	};

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<Head title="Éditeur de Roadmap" />

			<div className="flex justify-between items-end mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">
						Gestion de la Roadmap
					</h1>
					{currentVersion && (
						<p className="text-sm text-gray-500">
							Visualisation de :{" "}
							<span className="font-semibold text-indigo-600">
								{currentVersion.name}
							</span>
							{currentVersion.isActive && (
								<span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs uppercase font-bold">
									En ligne
								</span>
							)}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<label
						htmlFor="version-select"
						className="text-xs font-semibold uppercase text-gray-400"
					>
						Historique des versions
					</label>
					<select
						id="version-select"
						className="border-gray-200 rounded-lg text-sm min-w-[200px]"
						onChange={(e) => handleVersionChange(e.target.value)}
						value={currentVersion?.id || ""}
					>
						{versions.map((v) => (
							<option key={v.id} value={v.id}>
								{v.isActive ? "🟢 " : ""}
								{v.name} ({new Date(v.createdAt).toLocaleDateString()})
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
				{/* Section Sauvegarde (Nouvelle Version) */}
				<form
					onSubmit={submitNewVersion}
					className="space-y-4 pb-6 border-b border-gray-100"
				>
					<div className="flex items-end gap-4">
						<div className="flex-1">
							<label
								htmlFor="version"
								className="block text-sm font-medium mb-1 text-gray-700"
							>
								Créer une nouvelle version à partir de ce contenu
							</label>
							<input
								id="version"
								type="text"
								placeholder="Nom de la nouvelle version (ex: v2.4 stable)"
								className="w-full border-gray-200 rounded-lg"
								value={data.name}
								onChange={(e) => setData("name", e.target.value)}
								required
							/>
						</div>
						<Button type="submit" disabled={processing || !data.name}>
							{processing ? "Enregistrement..." : "Sauvegarder Nouveau"}
						</Button>
					</div>

					<div className="h-[400px] pb-12">
						<ReactQuill
							theme="snow"
							className="h-full"
							value={data.content}
							onChange={(val) => setData("content", val)}
						/>
					</div>
				</form>

				{/* Section Actions sur la version chargée */}
				<div className="flex justify-between items-center pt-2">
					<div className="text-sm text-gray-500 italic">
						Actions sur la version sélectionnée dans l'historique
					</div>
					<div className="flex gap-4">
						<Button
							variant="danger"
							type="button"
							onClick={handleDelete}
							disabled={versions.length <= 1} // Évite de supprimer la dernière version existante
						>
							Supprimer cette version
						</Button>
						<Button
							variant="secondary"
							type="button"
							onClick={handlePublish}
							disabled={currentVersion?.isActive} // Désactivé si déjà en ligne
						>
							{currentVersion?.isActive
								? "Déjà Publiée"
								: "Publier cette version"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

DashboardEditor.layout = (page: React.ReactNode) => (
	<AppLayout title="Éditeur">{page}</AppLayout>
);

export default DashboardEditor;
