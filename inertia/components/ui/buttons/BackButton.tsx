import { ArrowLeft } from "lucide-react";
import Button from "./Button";

type BackButtonProps = {
	route: string;
};

export default function BackButton({ route }: BackButtonProps) {
	return <Button href={route} variant="secondary" icon={<ArrowLeft />} />;
}
