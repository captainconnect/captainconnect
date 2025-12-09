import { Building2, Mail, Phone } from "lucide-react";
import type { Contact } from "#types/contact";

type ContactCardProps = {
	contact: Contact;
	key: string;
	onContactClick: () => void;
};

export default function ContactCard({
	contact,
	onContactClick,
}: ContactCardProps) {
	return (
		<li
			onClick={onContactClick}
			onKeyDown={(e) => {
				if (e.key === "Escape") confirm(contact.fullName);
			}}
			className="flex flex-col gap-6 bg-white rounded-xl border border-gray-300 p-6 cursor-pointer hover:shadow-sm transition active:scale-[99%]"
		>
			<div className="space-y-1">
				<p className="text-lg font-semibold">{contact.fullName}</p>
				{contact.company && (
					<div className="flex gap-2 text-slate-400">
						<Building2 size="18" />
						<p className="text-sm">{contact.company}</p>
					</div>
				)}
			</div>
			<div className="text-sm space-y-1">
				{contact.phone && (
					<div className="flex items-center gap-2">
						<Phone size="18" className="text-slate-400" />
						<p>{contact.phone}</p>
					</div>
				)}
				{contact.email && (
					<div className="flex items-center gap-2">
						<Mail size="18" className="text-slate-400" />
						<p>{contact.email}</p>
					</div>
				)}
			</div>
		</li>
	);
}
