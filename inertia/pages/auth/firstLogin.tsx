import { Form, Head, Link } from "@inertiajs/react";
import Button from "~/components/ui/buttons/Button";
import Card from "~/components/ui/Card";
import Input from "~/components/ui/inputs/Input";
import Loader from "~/components/ui/Loader";
import Logo from "~/components/ui/Logo";

export default function FirstLoginPage() {
	return (
		<>
			<Head title="Connexion" />
			<div className="min-h-screen w-full font-sans flex flex-col items-center justify-center gap-4 p-4">
				<Logo className="size-54" />
				<Card className="w-1/4 flex flex-col items-center gap-2">
					<h1 className="text-primary font-semibold text-2xl">
						Première connexion
					</h1>
					<p className="text-subtitle">
						Veuillez choisir un nouveau mot de passe
					</p>
					<Form
						className="w-full mt-6 flex flex-col gap-8"
						action="/update-password"
						method="PATCH"
					>
						{({ errors, processing }) => (
							<>
								<Input
									label="Mot de passe"
									type="password"
									name="password"
									error={errors.password}
									placeholder="Mot de passe"
									autoCapitalize="off"
									autoComplete="current-password"
									required
								/>
								<Input
									label="Confirmer le mot de passe"
									type="password"
									name="password_confirmation"
									error={errors.password_confirmation}
									placeholder="Confirmer le mot de passe"
									autoCapitalize="off"
									autoComplete="current-password"
									required
								/>
								<Button type="submit" disabled={processing}>
									{processing ? <Loader /> : "Enregistrer"}
								</Button>
								<Link className="text-center" href="/">
									Me le rappeler plus tard
								</Link>
							</>
						)}
					</Form>
				</Card>
			</div>
		</>
	);
}
