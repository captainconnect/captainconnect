import vine from "@vinejs/vine";

export const pushSubscribeSchema = vine.object({
	endpoint: vine.string().trim().url(),
	keys: vine.object({
		p256dh: vine.string().trim().minLength(10),
		auth: vine.string().trim().minLength(10),
	}),
});

export const pushSubscribeValidator = vine.compile(pushSubscribeSchema);

export const pushUnsubscribeSchema = vine.object({
	endpoint: vine.string().trim().url(),
});

export const pushUnsubscribeValidator = vine.compile(pushUnsubscribeSchema);
