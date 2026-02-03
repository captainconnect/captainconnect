// sw.js
// Minimal SW: pas de cache, pas d'interception -> juste PWA + push.

self.addEventListener("install", () => {
	// Active rapidement
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim());
});

// ⚠️ IMPORTANT: on ne touche pas au réseau (Inertia/auth safe)
// Pas de fetch handler => le navigateur gère tout normalement.

self.addEventListener("push", (event) => {
	let data = {};
	try {
		data = event.data ? event.data.json() : {};
	} catch {}

	const title = data.title || "CaptainConnect";
	const options = {
		body: data.body || "Nouvelle notification",
		icon: "/icons/icon-192.png",
		badge: "/icons/icon-192.png",
		data: data.data || {},
	};

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	const url = event.notification.data?.url || "/";

	event.waitUntil(
		self.clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then((clients) => {
				for (const client of clients) {
					if ("focus" in client) {
						client.navigate(url);
						return client.focus();
					}
				}
				return self.clients.openWindow(url);
			}),
	);
});
