import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import { getAmount as getSelectedAmount } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { getPromotionOrUndefined } from 'helpers/productPrice/promotions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
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

	const billingPeriod = (contributionType[0] +
		contributionType.slice(1).toLowerCase()) as BillingPeriod;
	const promotion = useContributionsSelector((state) =>
		getPromotionOrUndefined(
			state.page.checkoutForm.product.productPrices,
			state.common.internationalisation.countryId,
			billingPeriod,
		),
	);
	const benefitsThreshold = getThresholdPrice(
		countryGroupId,
		contributionType,
		promotion,
	);
	const selectedAmount = getSelectedAmount(
		selectedAmounts,
		otherAmounts,
		contributionType,
	);
	return selectedAmount >= benefitsThreshold;
}

export function isSupporterPlusFromState(state: ContributionsState): boolean {
	const contributionType = getContributionType(state);
	if (isOneOff(contributionType)) {
		return false;
	}

	const promotion = getPromotionOrUndefined(
		state.page.checkoutForm.product.productPrices,
		state.common.internationalisation.countryId,
		state.page.checkoutForm.product.billingPeriod,
	);
	const benefitsThreshold = getThresholdPrice(
		state.common.internationalisation.countryGroupId,
		contributionType,
		promotion,
	);
	const selectedAmount = getSelectedAmount(
		state.page.checkoutForm.product.selectedAmounts,
		state.page.checkoutForm.product.otherAmounts,
		contributionType,
	);
	return selectedAmount >= benefitsThreshold;
}

export function hideBenefitsListFromState(state: ContributionsState): boolean {
	const contributionType = getContributionType(state);

	if (isOneOff(contributionType)) {
		return true;
	}

	const promotion = getPromotionOrUndefined(
		state.page.checkoutForm.product.productPrices,
		state.common.internationalisation.countryId,
		state.page.checkoutForm.product.billingPeriod,
	);
	const benefitsThreshold = getThresholdPrice(
		state.common.internationalisation.countryGroupId,
		contributionType,
		promotion,
	);
	const displayedAmounts =
		state.common.amounts.amountsCardData[contributionType];
	const customAmountIsHidden = displayedAmounts.hideChooseYourAmount;

	const thresholdPriceIsNotOffered =
		Math.max(...displayedAmounts.amounts) < benefitsThreshold;

	return thresholdPriceIsNotOffered && customAmountIsHidden;
}
