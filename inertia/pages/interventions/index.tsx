import type { SimplePaginatorMetaKeys } from "@adonisjs/lucid/types/querybuilder";
import { Head, router, usePage } from "@inertiajs/react";
import { Wrench } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Intervention } from "#types/intervention";
import InterventionList from "~/components/features/intervention/InterventionList";
import AppLayout from "~/components/layout/AppLayout";
import InterventionIndexHeader from "~/components/layout/intervention/InterventionIndexHeader";
import EmptyList from "~/components/ui/EmptyList";

type InterventionIndexPageProps = {
	interventions: Intervention[];
	meta: SimplePaginatorMetaKeys;
};

const title = "Interventions";

const InterventionsIndexPage = ({
	interventions,
	meta,
}: InterventionIndexPageProps) => {
	const [items, setItems] = useState<Intervention[]>(interventions ?? []);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const { url } = usePage(); // ex: "/interventions?state=DONE&page=2"
	const stateFilter = useMemo(() => {
		const u = new URL(url, "http://dummy.local"); // base obligatoire
		return u.searchParams.get("state") ?? "";
	}, [url]);

	useEffect(() => {
		setItems([]);
	}, []);

	const currentPage = Number(meta.currentPage || 1);

	useEffect(() => {
		if (currentPage <= 1) {
			// nouvelle recherche/filtre => remplace
			setItems(interventions ?? []);
			return;
		}

		setItems((prev) => {
			const map = new Map<string, Intervention>();
			for (const it of prev) map.set(it.slug, it);
			for (const it of interventions ?? []) map.set(it.slug, it);
			return Array.from(map.values());
		});
	}, [currentPage, interventions]);

	const hasMore = Boolean(meta.nextPageUrl);

	const loadMore = useCallback(() => {
		if (!hasMore || isLoadingMore) return;

		const nextPage = currentPage + 1;
		setIsLoadingMore(true);

		router.get(
			"/interventions",
			{
				page: nextPage,
				state: stateFilter || undefined,
			},
			{
				preserveState: true,
				preserveScroll: true,
				replace: true,
				only: ["interventions", "meta"],
				onFinish: () => setIsLoadingMore(false),
			},
		);
	}, [hasMore, isLoadingMore, currentPage, stateFilter]);

	const sentinelRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const el = sentinelRef.current;
		if (!el) return;

		const obs = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) loadMore();
			},
			{ root: null, rootMargin: "800px", threshold: 0 },
		);

		obs.observe(el);
		return () => obs.disconnect();
	}, [loadMore]);

	return (
		<>
			<Head title={title} />
			<InterventionIndexHeader />

			{items.length === 0 ? (
				<EmptyList
					icon={<Wrench size="48" />}
					text="Pas encore d'intervention. Créez votre première intervention sur la page d'un bateau."
				/>
			) : (
				<>
					<InterventionList interventions={items} />
					<div ref={sentinelRef} />
					<div className="mt-6 flex justify-center">
						{isLoadingMore ? (
							<p className="text-slate-500">Chargement…</p>
						) : hasMore ? (
							<p className="text-slate-500">Scroll pour charger la suite</p>
						) : (
							<p className="text-slate-500">Fin de liste</p>
						)}
					</div>
				</>
			)}
		</>
	);
};

InterventionsIndexPage.layout = (page: React.ReactNode) => (
	<AppLayout title={title}>{page}</AppLayout>
);

export default InterventionsIndexPage;
