import webpush from "web-push";
import PushSubscription from "#models/push_subscription";
import env from "#start/env";

webpush.setVapidDetails(
	env.get("VAPID_SUBJECT"),
	env.get("VAPID_PUBLIC_KEY"),
	env.get("VAPID_PRIVATE_KEY"),
);

type PushPayload = {
	title: string;
	body?: string;
	icon?: string;
	badge?: string;
	data?: Record<string, unknown>;
};

type WebPushError = {
	statusCode?: number;
	status?: number;
	body?: string;
};

function isGoneError(err: unknown) {
	if (typeof err !== "object" || err === null) return false;
	const e = err as WebPushError;
	const code = e?.statusCode ?? e?.status;
	return code === 404 || code === 410;
}

export class PushService {
	async notifyUser(userId: number, payload: PushPayload) {
		const subs = await PushSubscription.query().where("user_id", userId);

		if (subs.length === 0) return { sent: 0, removed: 0 };

		let sent = 0;
		let removed = 0;

		await Promise.all(
			subs.map(async (sub) => {
				try {
					await webpush.sendNotification(
						{
							endpoint: sub.endpoint,
							keys: { p256dh: sub.p256dh, auth: sub.auth },
						},
						JSON.stringify({
							title: payload.title,
							body: payload.body,
							icon: payload.icon ?? "/icons/icon-192.png",
							badge: payload.badge ?? "/icons/icon-192.png",
							data: payload.data ?? {},
						}),
					);
					sent += 1;
				} catch (err: unknown) {
					if (isGoneError(err)) {
						await sub.delete();
						removed += 1;
						return;
					}

					if (typeof err === "object" && err !== null) {
						const e = err as {
							statusCode?: number;
							status?: number;
							body?: unknown;
						};
						console.error("Push error", e.statusCode ?? e.status, e.body ?? e);
					} else {
						console.error("Push error", err);
					}
				}
			}),
		);

		return { sent, removed };
	}

	async notifyAll(payload: PushPayload) {
		const subs = await PushSubscription.query().select([
			"id",
			"endpoint",
			"p256dh",
			"auth",
		]);

		await Promise.allSettled(
			subs.map(async (s) => {
				try {
					await webpush.sendNotification(
						{
							endpoint: s.endpoint,
							keys: { p256dh: s.p256dh, auth: s.auth },
						},
						JSON.stringify(payload),
					);
				} catch (err: unknown) {
					// Si subscription morte -> on la vire (410 Gone / 404)
					const e = err as WebPushError;
					const status = e?.statusCode;
					if (status === 410 || status === 404) {
						await PushSubscription.query().where("id", s.id).delete();
					}
				}
			}),
		);
	}
}
