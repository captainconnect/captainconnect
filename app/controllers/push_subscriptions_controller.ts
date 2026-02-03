import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import PushSubscription from "#models/push_subscription";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { PushService } from "#services/push_service";
import env from "#start/env";
import {
	pushSubscribeValidator,
	pushUnsubscribeValidator,
} from "#validators/push_subscription";

type PublicKeyResponse = { key: string };

@inject()
export default class PushSubscriptionsController {
	constructor(protected pushService: PushService) {}

	async testing({ auth, response }: HttpContext) {
		const user = auth.getUserOrFail();
		await this.pushService.notifyUser(user.id, {
			title: "Test Cap'tain Connect",
			body: "Si tu lis ça c'est ok",
			data: { url: "/profile" },
		});
		return response.ok({ ok: true });
	}

	async getPublicKey({ response }: HttpContext) {
		const key = env.get("VAPID_PUBLIC_KEY");
		const payload: PublicKeyResponse = { key };

		return response.ok(payload);
	}

	async subscribe({ auth, request, response }: HttpContext) {
		const user = auth.getUserOrFail();
		const payload = await request.validateUsing(pushSubscribeValidator);

		const userAgent = request.header("user-agent") || null;

		await PushSubscription.updateOrCreate(
			{ userId: user.id, endpoint: payload.endpoint },
			{
				p256dh: payload.keys.p256dh,
				auth: payload.keys.auth,
				userAgent,
			},
		);

		return response.ok({ ok: true });
	}

	async unsubscribe({ auth, request, response }: HttpContext) {
		const user = auth.getUserOrFail();
		const payload = await request.validateUsing(pushUnsubscribeValidator);

		await PushSubscription.query()
			.where("user_id", user.id)
			.where("endpoint", payload.endpoint)
			.delete();

		return response.ok({ ok: true });
	}

	async unsubscribeAll({ auth, response }: HttpContext) {
		const user = auth.getUserOrFail();
		await PushSubscription.query().where("user_id", user.id).delete();
		return response.ok({ ok: true });
	}
}
