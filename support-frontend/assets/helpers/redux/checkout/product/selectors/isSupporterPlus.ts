import { getAmount } from 'helpers/contributions';
import { getPromotionOrUndefined } from 'helpers/productPrice/promotions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { getThresholdPrice } from 'helpers/supporterPlus/benefitsThreshold';
import { isOneOff } from 'helpers/supporterPlus/isContributionRecurring';

export function isSupporterPlusPurchase(state: ContributionsState): boolean {
	const contributionType = getContributionType(state);

	if (isOneOff(contributionType)) {
		return false;
	}

	const promotion = getPromotionOrUndefined(
		state.page.checkoutForm.product.productPrices,
		state.common.internationalisation.countryId,
		state.page.checkoutForm.product.billingPeriod,
	);
	const thresholdPrice = getThresholdPrice(
		state.common.internationalisation.countryGroupId,
		contributionType,
		promotion,
	);
	const amount = getAmount(
		state.page.checkoutForm.product.selectedAmounts,
		state.page.checkoutForm.product.otherAmounts,
		contributionType,
	);

	const amountIsHighEnough = !!(thresholdPrice && amount >= thresholdPrice);

	return amountIsHighEnough;
}

export function shouldHideBenefitsList(state: ContributionsState): boolean {
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
