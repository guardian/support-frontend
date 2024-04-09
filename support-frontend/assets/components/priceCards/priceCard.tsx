import { ChoiceCard } from '@guardian/source-react-components';

export type PriceCardPaymentInterval = 'month' | 'year';

export type PriceCardProps = {
	amount: number | 'other';
	amountWithCurrency: string;
	isSelected: boolean;
	onClick: (amount: string) => void;
	paymentInterval?: PriceCardPaymentInterval;
	alternateLabel?: string;
};

function getPriceCardLabel(
	amountWithCurrency: string,
	paymentInterval?: PriceCardPaymentInterval,
	alternateLabel?: string,
) {
	if (alternateLabel) {
		return alternateLabel;
	}
	if (paymentInterval) {
		return `${amountWithCurrency} per ${paymentInterval}`;
	}

	return amountWithCurrency;
}

export function PriceCard({
	amount,
	amountWithCurrency,
	isSelected,
	onClick,
	paymentInterval,
	alternateLabel,
}: PriceCardProps): JSX.Element {
	const labelText = getPriceCardLabel(
		amountWithCurrency,
		paymentInterval,
		alternateLabel,
	);

	return (
		<ChoiceCard
			id={`amount-${amount}`}
			key={`amount-${amount}`}
			name="amount"
			onChange={() => onClick(amount.toString())}
			checked={isSelected}
			value={amount.toString()}
			label={labelText}
		/>
	);
}
