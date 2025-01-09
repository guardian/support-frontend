import { getAmount } from 'helpers/contributions';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { getContributionType } from './productType';

export function getUserSelectedAmount(state: ContributionsState): number {
	const contributionType = getContributionType(state);
	const { coverTransactionCost, selectedAmounts, otherAmounts } =
		state.page.checkoutForm.product;

	return getAmount(
		selectedAmounts,
		otherAmounts,
		contributionType,
		coverTransactionCost,
	);
}
