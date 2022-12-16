import { getAmount } from 'helpers/contributions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { getThresholdPrice } from 'helpers/supporterPlus/benefitsThreshold';
import { isOneOff } from 'helpers/supporterPlus/isContributionRecurring';

export function isSupporterPlusPurchase(state: ContributionsState): boolean {
	const contributionType = getContributionType(state);

	if (isOneOff(contributionType)) {
		return false;
	}

	const thresholdPrice = getThresholdPrice(
		state.common.internationalisation.countryGroupId,
		contributionType,
	);
	const amount = getAmount(
		state.page.checkoutForm.product.selectedAmounts,
		state.page.checkoutForm.product.otherAmounts,
		contributionType,
	);

	const amountIsHighEnough = !!(thresholdPrice && amount >= thresholdPrice);

	return amountIsHighEnough;
}
