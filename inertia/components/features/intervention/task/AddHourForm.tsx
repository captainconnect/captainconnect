import { Form } from "@inertiajs/react";
import { Plus } from "lucide-react";
import Button from "~/components/ui/buttons/Button";
import Input from "~/components/ui/inputs/Input";
import Select from "~/components/ui/inputs/Select";
import Loader from "~/components/ui/Loader";

type AddHourFormProps = {
	taskId: number;
	users: {
		id: number;
		firstname: string;
		lastname: string;
	}[];
};

export default function AddHourForm({ users, taskId }: AddHourFormProps) {
	const today = new Date();
	const formatLocalDate = (d: Date) =>
		`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
			d.getDate(),
		).padStart(2, "0")}`;

	const defaultDate = formatLocalDate(today);
	return (
		<Form method="POST" action={`/tasks/${taskId}/hour`} className="space-y-4">
			{({ errors, processing }) => (
				<>
					<Select
						label="Utilisateur"
						name="userId"
						allowNull={false}
						options={users.map((u) => {
							return {
								id: u.id,
								label: `${u.firstname} ${u.lastname}`,
							};
						})}
					/>
					<Input
						name="date"
						error={errors.date}
						label="Date"
						type="date"
						defaultValue={defaultDate}
					/>
					<Input
						label="Nombre d'heures passées"
						type="number"
						placeholder="Ex: 2,5"
						step="0.25"
						name="count"
						error={errors.hour}
					/>
					<Button disabled={processing} type="submit" icon={<Plus />}>
						{processing ? <Loader /> : "Ajouter"}
					</Button>
				</>
			)}
		</Form>
	);
}
