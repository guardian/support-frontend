import type { ContributionType } from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';

const FREQUENCY_LABELS = {
	ONE_OFF: '',
	MONTHLY: ' per month',
	ANNUAL: ' per year',
};

export function formatAmountLabel(
	amount: number,
	contributionType: ContributionType,
	currency: IsoCurrency,
): string {
	const formattedAmount = formatAmount(
		currencies[currency],
		spokenCurrencies[currency],
		amount,
		false,
	);
	const frequencyLabel = FREQUENCY_LABELS[contributionType];

	return `${formattedAmount}${frequencyLabel}`;
}
