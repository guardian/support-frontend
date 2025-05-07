import { ChoiceCard } from '@guardian/source/react-components';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { billingPeriodNoun } from 'helpers/productPrice/billingPeriods';

export type PriceCardProps = {
	amount: number | 'other';
	amountWithCurrency: string;
	isSelected: boolean;
	onClick: (amount: string) => void;
	billingPeriod?: BillingPeriod;
	alternateLabel?: string;
};

function getPriceCardLabel(
	amountWithCurrency: string,
	billingPeriod?: BillingPeriod,
	alternateLabel?: string,
) {
	if (alternateLabel) {
		return alternateLabel;
	}
	if (billingPeriod) {
		return `${amountWithCurrency} per ${billingPeriodNoun(billingPeriod)}`;
	}

	return amountWithCurrency;
}

export function PriceCard({
	amount,
	amountWithCurrency,
	isSelected,
	onClick,
	billingPeriod,
	alternateLabel,
}: PriceCardProps): JSX.Element {
	const labelText = getPriceCardLabel(
		amountWithCurrency,
		billingPeriod,
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
