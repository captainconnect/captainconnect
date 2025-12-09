import { Form, Head } from "@inertiajs/react";
import { version } from "~/app/version";
import Button from "~/components/ui/buttons/Button";
import Card from "~/components/ui/Card";
import Input from "~/components/ui/inputs/Input";
import Loader from "~/components/ui/Loader";
import Logo from "~/components/ui/Logo";

export default function LoginPage() {
	return (
		<>
			<Head title="Connexion" />
			<div className="min-h-screen w-full font-sans flex flex-col items-center justify-center gap-4 p-4">
				<Logo className="size-54" />
				<Card className="w-1/4 flex flex-col items-center gap-2">
					<h2 className="text-primary font-semibold text-2xl">
						Ravi de vous retrouver !
					</h2>
					<p className="text-gray-500 text-sm text-center">
						Connectez-vous à votre compte pour continuer
					</p>
					<Form
						className="w-full mt-6 flex flex-col gap-8"
						action="/authenticate"
						method="POST"
					>
						{({ errors, processing }) => (
							<>
								<Input
									required
									error={errors.username}
									label="Nom d'utilisateur"
									type="text"
									name="username"
									placeholder="Nom d'utilisateur"
									autoCapitalize="off"
									autoComplete="username"
									autoCorrect="false"
									spellCheck="false"
								/>
								<Input
									required
									label="Mot de passe"
									type="password"
									name="password"
									error={errors.password}
									placeholder="Mot de passe"
									autoCapitalize="off"
									autoComplete="current-password"
								/>

								<Button type="submit" disabled={processing}>
									{processing ? <Loader /> : "Connexion"}
								</Button>
								{errors.E_INVALID_CREDENTIALS && (
									<span className="text-red-500 text-center">
										Nom d'utilisateur ou mot de passe incorrect
									</span>
								)}
								{errors.E_USER_DISABLED && (
									<span className="text-red-500 text-center">
										Votre compte est désactivé. Contactez votre administrateur
									</span>
								)}
							</>
						)}
					</Form>
				</Card>
				<p className="text-sm text-gray-500">
					&copy; 2025 Cap'tain Connect. Tous droits réservés.
				</p>
				<p className="text-sm text-gray-500">v{version}</p>
			</div>
		</>
	);
}
