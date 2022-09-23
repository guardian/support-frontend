import { ChoiceCard } from '@guardian/source-react-components';

export type PriceCardPaymentInterval = 'month' | 'year';

export type PriceCardProps = {
	amount: string;
	amountWithCurrency: string;
	isSelected: boolean;
	onClick: (amount: string) => void;
	paymentInterval?: PriceCardPaymentInterval;
};

export function PriceCard({
	amount,
	amountWithCurrency,
	isSelected,
	onClick,
	paymentInterval,
}: PriceCardProps): JSX.Element {
	const labelText = paymentInterval
		? `${amountWithCurrency} per ${paymentInterval}`
		: amountWithCurrency;

	return (
		<ChoiceCard
			id={`amount-${amount}`}
			key={`amount-${amount}`}
			name="amount"
			onChange={() => onClick(amount)}
			checked={isSelected}
			value={amount}
			label={labelText}
		/>
	);
}
