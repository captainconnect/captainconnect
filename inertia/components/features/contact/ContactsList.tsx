import type { Contact } from "#types/contact";
import ContactCard from "./ContactCard";

type ContactsListProps = {
	contacts: Contact[];
	onContactClick: (contact: Contact) => void;
};

export default function ContactsList({
	contacts,
	onContactClick,
}: ContactsListProps) {
	return (
		<ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			{contacts.map((contact) => (
				<ContactCard
					onContactClick={() => onContactClick(contact)}
					key={`${contact.id}-${contact.fullName}`}
					contact={contact}
				/>
			))}
		</ul>
	);
}
