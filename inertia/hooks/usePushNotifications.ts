import { useCallback, useEffect, useState } from "react";

type PublicKeyResponse = { key: string };

function urlBase64ToUint8Array(base64String: string) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
	const raw = window.atob(base64);
	return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

async function getPublicKey(): Promise<string> {
	const res = await fetch("/push/public-key", { credentials: "same-origin" });

	if (!res.ok) throw new Error("Failed to fetch VAPID public key");
	const data: PublicKeyResponse = await res.json();

	if (!data?.key || typeof data.key !== "string") {
		throw new Error("Invalid VAPID public key payload");
	}

	return data.key.trim();
}

function isSecureContextForPush() {
	// Push requires HTTPS, except localhost.
	return (
		window.isSecureContext &&
		(location.protocol === "https:" ||
			location.hostname === "localhost" ||
			location.hostname === "127.0.0.1")
	);
}

function isPushSupported() {
	return (
		"serviceWorker" in navigator &&
		"PushManager" in window &&
		"Notification" in window &&
		isSecureContextForPush()
	);
}

export function usePushNotifications() {
	const [loading, setLoading] = useState(false);
	const [supported, setSupported] = useState<boolean>(false);
	const [permission, setPermission] =
		useState<NotificationPermission>("default");
	const [subscribed, setSubscribed] = useState<boolean>(false);
	const [lastError, setLastError] = useState<string | null>(null);

	const refreshStatus = useCallback(async () => {
		const ok = isPushSupported();
		setSupported(ok);

		try {
			setPermission(Notification.permission);
		} catch {
			// Some environments can throw (privacy modes)
			setPermission("default");
		}

		if (!ok) {
			setSubscribed(false);
			return;
		}

		try {
			const reg = await navigator.serviceWorker.ready;
			const sub = await reg.pushManager.getSubscription();
			setSubscribed(Boolean(sub));
		} catch {
			setSubscribed(false);
		}
	}, []);

	useEffect(() => {
		void refreshStatus();
	}, [refreshStatus]);

	const subscribe = useCallback(async () => {
		setLastError(null);

		if (!isPushSupported()) {
			setSupported(false);
			setLastError(
				!isSecureContextForPush()
					? "Push requires HTTPS (or localhost)."
					: "Push is not supported on this browser.",
			);
			return;
		}

		setLoading(true);
		try {
			const perm = await Notification.requestPermission();
			setPermission(perm);
			if (perm !== "granted") return;

			// Ensure SW is ready/active
			const reg = await navigator.serviceWorker.ready;

			// Avoid duplicate subscriptions
			const existing = await reg.pushManager.getSubscription();
			if (existing) {
				setSubscribed(true);
				return;
			}

			const key = await getPublicKey();

			let sub: PushSubscription;
			try {
				sub = await reg.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: urlBase64ToUint8Array(key),
				});
				// biome-ignore lint/suspicious/noExplicitAny: Any
			} catch (e: any) {
				// This is your current error zone (AbortError / push service error)
				const msg =
					e?.name === "AbortError"
						? "Push subscription failed (push service error). Check HTTPS + valid VAPID key + SW scope + browser privacy."
						: e?.message || "Push subscription failed.";
				setLastError(msg);
				throw e;
			}

			const res = await fetch("/push/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "same-origin",
				body: JSON.stringify(sub),
			});

			if (!res.ok) {
				setLastError("Server refused subscription (/push/subscribe).");
				// rollback local sub if server failed
				try {
					await sub.unsubscribe();
				} catch {}
				throw new Error("Failed to subscribe on server");
			}

			await refreshStatus();
		} finally {
			setLoading(false);
		}
	}, [refreshStatus]);

	const unsubscribe = useCallback(async () => {
		setLastError(null);

		if (!isPushSupported()) {
			setSupported(false);
			setSubscribed(false);
			return;
		}

		setLoading(true);
		try {
			const reg = await navigator.serviceWorker.ready;
			const sub = await reg.pushManager.getSubscription();
			if (!sub) {
				setSubscribed(false);
				return;
			}

			const res = await fetch("/push/unsubscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "same-origin",
				body: JSON.stringify({ endpoint: sub.endpoint }),
			});

			if (!res.ok) {
				setLastError("Server refused unsubscribe (/push/unsubscribe).");
				throw new Error("Failed to unsubscribe on server");
			}

			await sub.unsubscribe();
			await refreshStatus();
		} finally {
			setLoading(false);
		}
	}, [refreshStatus]);

	const unsubscribeAll = useCallback(async () => {
		setLastError(null);

		setLoading(true);
		try {
			// server-side cleanup
			const res = await fetch("/push/unsubscribe-all", {
				method: "POST",
				credentials: "same-origin",
			});
			if (!res.ok) {
				setLastError("Server refused unsubscribe-all (/push/unsubscribe-all).");
				throw new Error("Failed to unsubscribe-all");
			}

			// also remove local subscription if any
			if (isPushSupported()) {
				try {
					const reg = await navigator.serviceWorker.ready;
					const sub = await reg.pushManager.getSubscription();
					if (sub) await sub.unsubscribe();
				} catch {}
			}

			await refreshStatus();
		} finally {
			setLoading(false);
		}
	}, [refreshStatus]);

	return {
		subscribe,
		unsubscribe,
		unsubscribeAll,
		refreshStatus,
		loading,
		supported,
		permission,
		subscribed,
		lastError,
	};
}
