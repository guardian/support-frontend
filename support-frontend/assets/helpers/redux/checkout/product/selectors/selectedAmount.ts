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

export function getUserSelectedOtherAmount(
	state: ContributionsState,
): number | string {
	const contributionType = getContributionType(state);
	const { selectedAmounts } = state.page.checkoutForm.product;
	const priceCardAmountSelected = selectedAmounts[contributionType];

	return priceCardAmountSelected;
}

export function getUserSelectedAmountBeforeAmendment(
	state: ContributionsState,
): number {
	const contributionType = getContributionType(state);
	const { selectedAmountsBeforeAmendment, otherAmountsBeforeAmendment } =
		state.page.checkoutForm.product;
	const priceCardAmountSelected =
		selectedAmountsBeforeAmendment[contributionType];

	if (priceCardAmountSelected === 'other') {
		const customAmount = otherAmountsBeforeAmendment[contributionType];
		const amount = parseFloat(customAmount.amount ?? '');
		if (!isNaN(amount)) {
			return amount;
		} else {
			return 0;
		}
	}

	return priceCardAmountSelected;
}
