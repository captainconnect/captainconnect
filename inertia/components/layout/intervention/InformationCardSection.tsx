type InterventionCardSectionProps = {
	children: React.ReactNode;
	className?: string;
};

const InterventionCardSection = ({
	children,
	className,
}: InterventionCardSectionProps) => (
	<div className={`flex items-center gap-4 mb-5 ${className}`}>{children}</div>
);

export default InterventionCardSection;
