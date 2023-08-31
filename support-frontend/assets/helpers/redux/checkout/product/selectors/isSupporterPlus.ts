import type { Participations } from 'helpers/abTests/abtest';
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

function isInHideBenefitsTest(abParticipations: Participations): boolean {
	const regionalSuffixList: string[] = [
		'UK',
		'US',
		'CA',
		'EU',
		'AU',
		'NZ',
		'ROW',
	];

	const result = regionalSuffixList.reduce((hideBenefits, suffix): boolean => {
		const testName = `2023-08-08_BENEFITS_GONE__${suffix}`;

		if (
			abParticipations[testName] === 'V1' ||
			abParticipations[testName] === 'V3'
		) {
			return true;
		}

		return hideBenefits;
	}, false);

	return result;
}

export function shouldHideBenefitsList(state: ContributionsState): boolean {
	const contributionType = getContributionType(state);

	if (isOneOff(contributionType)) {
		return true;
	}

	/**
	 * Hide benefits if participating in RRCP
	 * configured amounts test 2023-08-08_BENEFITS_GONE
	 */
	const { abParticipations } = state.common;

	if (isInHideBenefitsTest(abParticipations)) {
		return true;
	}

	const thresholdPrice = getThresholdPrice(
		state.common.internationalisation.countryGroupId,
		contributionType,
	);
	const displayedAmounts = state.common.amounts[contributionType];
	const customAmountIsHidden = displayedAmounts.hideChooseYourAmount ?? false;

	const thresholdPriceIsNotOffered =
		Math.max(...displayedAmounts.amounts) < thresholdPrice;

	return thresholdPriceIsNotOffered && customAmountIsHidden;
}

// Exports to test
export const _ = {
	isInHideBenefitsTest,
};
