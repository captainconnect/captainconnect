import type { User } from "#types/user";
import type { FormattedWorkDone } from "#types/workdone";
import type { BaseModalProps } from "~/components/ui/modals/Modal";
import Modal from "~/components/ui/modals/Modal";
import EditWorkDoneForm from "./EditWorkdoneForm";

type UpdateWorkdoneModal = BaseModalProps & {
	workdone: FormattedWorkDone | null;
	users: User[];
};

export default function UpdateWorkdoneModal({
	open,
	onClose,
	workdone,
	users,
}: UpdateWorkdoneModal) {
	if (!workdone) return;
	return (
		<Modal open={open} onClose={onClose} title="Modifier un travail effectué">
			<div>Modifier travail</div>
			<EditWorkDoneForm onClose={onClose} users={users} workDone={workdone} />
		</Modal>
	);
}
