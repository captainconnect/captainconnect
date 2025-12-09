export type Contact = {
	id: number;
	company?: string;
	fullName: string;
	email?: string;
	phone?: string;
};

export interface ContactPayload {
	company?: string;
	fullName: string;
	phone?: string;
	email?: string;
}
