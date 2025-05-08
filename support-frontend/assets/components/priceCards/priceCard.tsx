import { ChoiceCard } from '@guardian/source/react-components';

export type PriceCardProps = {
	amount: number | 'other';
	isSelected: boolean;
	onClick: (amount: string) => void;
	label: string;
};

export function PriceCard({
	amount,
	isSelected,
	onClick,
	label,
}: PriceCardProps): JSX.Element {
	return (
		<ChoiceCard
			id={`amount-${amount}`}
			key={`amount-${amount}`}
			name="amount"
			onChange={() => onClick(amount.toString())}
			checked={isSelected}
			value={amount.toString()}
			label={label}
		/>
	);
}
