import { Head, router, useForm } from "@inertiajs/react";
import ReactQuill from "react-quill-new";
import AppLayout from "~/components/layout/AppLayout";
import "react-quill-new/dist/quill.snow.css";
import Button from "~/components/ui/buttons/Button";

interface Version {
	id: number;
	name: string;
	content: string;
	isActive: boolean;
	createdAt: string;
}

const DashboardEditor = ({
	versions,
	currentVersion,
}: {
	versions: Version[];
	currentVersion: Version;
}) => {
	const { data, setData, post, patch, processing } = useForm({
		// On génère le nom automatiquement : "Le 27/01/2026 à 20:06"
		name: `Version du ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
		content: currentVersion?.content || "",
	});

	const handleVersionChange = (id: string) => {
		router.get(
			"/administration/tableau-de-bord",
			{ version_id: id },
			{ preserveState: false },
		);
	};

	// 1. SAUVEGARDE (Nouvelle version)
	const submitNewVersion = (e: React.FormEvent) => {
		e.preventDefault();
		post("/administration/dashboard", {
			onSuccess: () => alert("Nouvelle version créée !"),
		});
	};

	// 2. MISE À JOUR (Écraser la version actuelle)
	const handleUpdate = () => {
		if (!currentVersion) return;
		patch(`/administration/dashboard/${currentVersion.id}`, {
			onSuccess: () => alert("Version mise à jour !"),
		});
	};

	const handlePublish = () => {
		if (!currentVersion) return;
		if (confirm(`Rendre la version "${currentVersion.name}" publique ?`)) {
			router.post(`/administration/dashboard/${currentVersion.id}/publish`);
		}
	};

	const handleDelete = () => {
		if (!currentVersion) return;
		if (confirm("Supprimer définitivement cette version ?")) {
			router.delete(`/administration/dashboard/${currentVersion.id}`);
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
							Édition de :{" "}
							<span className="font-semibold text-indigo-600">
								{currentVersion.name}
							</span>
						</p>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<label
						htmlFor="history"
						className="text-xs font-semibold uppercase text-gray-400"
					>
						Historique
					</label>
					<select
						id="history"
						className="border-gray-200 rounded-lg text-sm min-w-[200px]"
						onChange={(e) => handleVersionChange(e.target.value)}
						value={currentVersion?.id || ""}
					>
						{versions.map((v) => (
							<option key={v.id} value={v.id}>
								{v.isActive ? "🟢 " : ""}
								{v.name}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
				<div className="h-[400px] pb-12">
					<ReactQuill
						theme="snow"
						className="h-full"
						value={data.content}
						onChange={(val) => setData("content", val)}
					/>
				</div>

				<div className="flex justify-between items-center pt-8 border-t border-gray-100">
					<div className="flex gap-3">
						{/* BOUTON ÉCRASER */}
						<Button
							variant="secondary"
							onClick={handleUpdate}
							disabled={processing || !currentVersion}
						>
							Mettre à jour (Écraser)
						</Button>

						{/* BOUTON CRÉER NOUVELLE */}
						<Button onClick={submitNewVersion} disabled={processing}>
							Sauvegarder comme Nouvelle Version
						</Button>
					</div>

					<div className="flex gap-3">
						<Button
							variant="danger"
							onClick={handleDelete}
							disabled={versions.length <= 1}
						>
							Supprimer
						</Button>
						<Button onClick={handlePublish} disabled={currentVersion?.isActive}>
							{currentVersion?.isActive ? "En ligne" : "Publier"}
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
