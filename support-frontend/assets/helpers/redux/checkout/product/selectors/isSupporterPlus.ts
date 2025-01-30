import { getAmount, isContributionsOnlyCountry } from 'helpers/contributions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { getThresholdPrice } from 'helpers/supporterPlus/benefitsThreshold';
import { isOneOff } from 'helpers/supporterPlus/isContributionRecurring';

export function isSupporterPlusFromState(state: ContributionsState): boolean {
	const contributionType = getContributionType(state);
	const countryIsAffectedByVATStatus = isContributionsOnlyCountry(
		state.common.amounts,
	);

	if (isOneOff(contributionType) || countryIsAffectedByVATStatus) {
		return false;
	}
	const thresholdPrice = getThresholdPrice(contributionType, state);
	const selectedAmount = getAmount(
		state.page.checkoutForm.product.selectedAmounts,
		state.page.checkoutForm.product.otherAmounts,
		contributionType,
	);

	return selectedAmount >= thresholdPrice;
}
