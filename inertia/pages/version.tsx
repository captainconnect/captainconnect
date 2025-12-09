import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import AppLayout from "~/components/layout/AppLayout";

const title = "Notes de version";

const VersionPage = () => {
	const [content, setContent] = useState("");

	useEffect(() => {
		fetch("/CHANGELOG.md")
			.then((res) => res.text())
			.then((md) => {
				setContent(md);
			});
	}, []);
	return (
		<>
			<Head title={title} />
			<div className="p-6 max-w-3xl mx-auto prose">
				<ReactMarkdown>{content}</ReactMarkdown>
			</div>
		</>
	);
};

VersionPage.layout = (page: React.ReactNode) => (
	<AppLayout title={title}>{page}</AppLayout>
);

export default VersionPage;
