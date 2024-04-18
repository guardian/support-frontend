import {
	getAmount,
	isSubjectToContributionsOnlyAmounts,
} from 'helpers/contributions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { getThresholdPrice } from 'helpers/supporterPlus/benefitsThreshold';
import { isOneOff } from 'helpers/supporterPlus/isContributionRecurring';

export function isSupporterPlusFromState(state: ContributionsState): boolean {
	const contributionType = getContributionType(state);
	const countryIsAffectedByVATStatus = isSubjectToContributionsOnlyAmounts(
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

export function hideBenefitsListFromState(state: ContributionsState): boolean {
	const contributionType = getContributionType(state);
	const countryIsAffectedByVATStatus = isSubjectToContributionsOnlyAmounts(
		state.common.amounts,
	);

	if (isOneOff(contributionType) || countryIsAffectedByVATStatus) {
		return true;
	}

	/**
	 * If amounts config has no options at or above the benefits
	 * threshold then hide then hide the benefits container.
	 */
	const thresholdPrice = getThresholdPrice(contributionType, state);
	const displayedAmounts =
		state.common.amounts.amountsCardData[contributionType];
	const customAmountIsHidden = displayedAmounts.hideChooseYourAmount;

	const thresholdPriceIsNotOffered =
		Math.max(...displayedAmounts.amounts) < thresholdPrice;

	return thresholdPriceIsNotOffered && customAmountIsHidden;
}
