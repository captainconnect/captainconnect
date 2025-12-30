import { Head } from "@inertiajs/react";
import { Building2, Plus } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import type { Contact } from "#types/contact";
import ContactsList from "~/components/features/contact/ContactsList";
import CreateContactModal from "~/components/features/contact/modals/CreateContactModal";
import ShowContactModal from "~/components/features/contact/modals/ShowContactModal";
import AppLayout from "~/components/layout/AppLayout";
import PageHeader from "~/components/layout/PageHeader";
import EmptyList from "~/components/ui/EmptyList";

enum Modals {
	None,
	Create,
	Show,
}

const title = "Contacts";

type ContactIndexPageProps = {
	contacts: Contact[];
};

const ContactIndexPage = ({ contacts }: ContactIndexPageProps) => {
	const [showModal, setShowModal] = useState<Modals>(Modals.None);
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

	const [search, setSearch] = useState("");
	const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);

	useEffect(() => {
		setFilteredContacts(contacts);
	}, [contacts]);

	const handleOpenContact = (contact: Contact) => {
		setShowModal(Modals.Show);
		setSelectedContact(contact);
	};

	const handleCloseContact = () => {
		setShowModal(Modals.None);
		setTimeout(() => {
			setSelectedContact(null);
		}, 150);
	};

	const handleSearch = (value: string) => {
		setSearch(value);
		const query = value.toLowerCase().trim();
		setFilteredContacts(
			contacts.filter(
				(c) =>
					c.fullName.toLowerCase().includes(query) ||
					c.email?.toLowerCase().includes(query) ||
					c.phone?.toLowerCase().includes(query) ||
					c.company?.toLowerCase().includes(query),
			),
		);
	};

	return (
		<>
			<Head title={title} />
			<PageHeader
				title="Liste des contacts"
				subtitle="Gérer les contacts clients"
				search={{
					disabled: contacts.length === 0,
					onChange: (value) => handleSearch(value),
					placeholder: "Rechercher un contact",
					value: search,
				}}
				buttons={[
					{
						mustBeAdmin: true,
						label: "Nouveau contact",
						icon: <Plus />,
						onClick: () => setShowModal(Modals.Create),
					},
				]}
			/>
			{contacts.length === 0 ? (
				<EmptyList
					icon={<Building2 size="48" />}
					text="Pas de contacts existants. Créez votre premier contact pour commencer."
				/>
			) : (
				<ContactsList
					contacts={filteredContacts}
					onContactClick={handleOpenContact}
				/>
			)}

			<CreateContactModal
				open={showModal === Modals.Create}
				onClose={() => setShowModal(Modals.None)}
			/>
			<ShowContactModal
				open={showModal === Modals.Show}
				onClose={handleCloseContact}
				contact={selectedContact}
			/>
		</>
	);
};

ContactIndexPage.layout = (page: React.ReactNode) => (
	<AppLayout title={title}>{page}</AppLayout>
);

export default ContactIndexPage;
