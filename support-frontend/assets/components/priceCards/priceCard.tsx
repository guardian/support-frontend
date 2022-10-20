import { ChoiceCard } from '@guardian/source-react-components';

export type PriceCardPaymentInterval = 'month' | 'year';

export type PriceCardProps = {
	amount: string;
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
			onChange={() => onClick(amount)}
			checked={isSelected}
			value={amount}
			label={labelText}
		/>
	);
}
