import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';

export function getOtherAmountErrors(
	state: ContributionsState,
): string[] | undefined {
	const constributionType = getContributionType(state);
	const { errors, selectedAmounts } = state.page.checkoutForm.product;

	if (selectedAmounts[constributionType] !== 'other') {
		return [];
	}

	if (errors.otherAmount?.length) {
		return errors.otherAmount;
	}
}
