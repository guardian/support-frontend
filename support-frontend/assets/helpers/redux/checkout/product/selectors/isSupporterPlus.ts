import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { getThresholdPrice } from 'helpers/supporterPlus/benefitsThreshold';
import { isOneOff } from 'helpers/supporterPlus/isContributionRecurring';

export function isSupporterPlus(
	contributionType: ContributionType,
	selectedAmounts: SelectedAmounts,
	otherAmounts: OtherAmounts,
	countryGroupId: CountryGroupId,
): boolean {
	if (isOneOff(contributionType)) {
		return false;
	}

	const benefitsThreshold = getThresholdPrice(countryGroupId, contributionType);
	const selectedAmount = selectedAmounts[contributionType];

	if (selectedAmount === 'other') {
		const otherAmount = otherAmounts[contributionType].amount;
		return otherAmount ? parseInt(otherAmount) >= benefitsThreshold : false;
	}

	return selectedAmount >= benefitsThreshold;
}

export function isSupporterPlusFromState(state: ContributionsState): boolean {
	const contributionType = getContributionType(state);
	return isSupporterPlus(
		contributionType,
		state.page.checkoutForm.product.selectedAmounts,
		state.page.checkoutForm.product.otherAmounts,
		state.common.internationalisation.countryGroupId,
	);
}

export function hideBenefitsListFromState(state: ContributionsState): boolean {
	const contributionType = getContributionType(state);

	if (isOneOff(contributionType)) {
		return true;
	}

	const thresholdPrice = getThresholdPrice(
		state.common.internationalisation.countryGroupId,
		contributionType,
	);
	const displayedAmounts =
		state.common.amounts.amountsCardData[contributionType];
	const customAmountIsHidden = displayedAmounts.hideChooseYourAmount;

	const thresholdPriceIsNotOffered =
		Math.max(...displayedAmounts.amounts) < thresholdPrice;

	return thresholdPriceIsNotOffered && customAmountIsHidden;
}
