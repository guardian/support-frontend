import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { getContributionType } from './productType';

export function getUserSelectedAmount(state: ContributionsState): number {
	const contributionType = getContributionType(state);
	const { selectedAmounts, otherAmounts } = state.page.checkoutForm.product;
	const priceCardAmountSelected = selectedAmounts[contributionType];

	if (priceCardAmountSelected === 'other') {
		const customAmount = otherAmounts[contributionType];
		// TODO: what do we do when this is NaN? Do we handle elsewhere?
		return Number.parseFloat(customAmount.amount ?? '');
	}

	return priceCardAmountSelected;
}

export function getUserSelectedAmountBeforeAmendment(
	state: ContributionsState,
): number|string {
	const contributionType = getContributionType(state);
	const { selectedAmountsBeforeAmendment } =
		state.page.checkoutForm.product;
	const priceCardAmountSelected =
		selectedAmountsBeforeAmendment[contributionType];

	if (priceCardAmountSelected === 'other') {
    return 'other';
	}

	return priceCardAmountSelected;
}
